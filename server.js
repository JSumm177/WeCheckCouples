const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8085;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure required environment variables are set
if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.error('FATAL ERROR: DB_USER and DB_PASSWORD environment variables are required.');
  process.exit(1);
}

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'wecheck_db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionLimit: 10
};

let pool;

// Connect to MySQL with retry logic (crucial for Docker startup order)
async function connectWithRetry() {
  const maxRetries = 12;
  const delay = 3000;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Connecting to database (Attempt ${i + 1}/${maxRetries})...`);
      pool = mysql.createPool(dbConfig);
      
      // Test the connection
      const connection = await pool.getConnection();
      console.log('Successfully connected to MySQL database!');
      connection.release();
      return;
    } catch (err) {
      console.error(`Database connection failed: ${err.message}. Retrying in ${delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error('Failed to connect to the database after maximum retries. Exiting.');
  process.exit(1);
}

// --------------------------------------------------------------------------
// Helper Functions for Data Mapping
// --------------------------------------------------------------------------

// Map database row to app JSON structure
function mapRowToAppModel(row) {
  return {
    id: row.id,
    date: row.check_in_date,
    timestamp: Number(row.check_in_timestamp),
    mode: row.mode,
    answers: {
      c_scale: row.c_scale !== null ? String(row.c_scale) : '',
      j_scale: row.j_scale !== null ? String(row.j_scale) : '',
      c_most_connected: row.c_most_connected || '',
      j_most_connected: row.j_most_connected || '',
      c_distant: row.c_distant || '',
      j_distant: row.j_distant || '',
      
      c_more_of: row.c_more_of || '',
      j_more_of: row.j_more_of || '',
      c_less_of: row.c_less_of || '',
      j_less_of: row.j_less_of || '',
      c_bothering: row.c_bothering || '',
      j_bothering: row.j_bothering || '',
      
      c_feel_loved: row.c_feel_loved || '',
      j_feel_loved: row.j_feel_loved || '',
      c_grateful_quality: row.c_grateful_quality || '',
      j_grateful_quality: row.j_grateful_quality || '',
      c_appreciate_relationship: row.c_appreciate_relationship || '',
      j_appreciate_relationship: row.j_appreciate_relationship || '',
      
      c_goals_page: row.c_goals_page === 1,
      j_goals_page: row.j_goals_page === 1,
      c_goals_notes: row.c_goals_notes || '',
      j_goals_notes: row.j_goals_notes || '',
      c_future_worries: row.c_future_worries || '',
      j_future_worries: row.j_future_worries || '',
      c_excited: row.c_excited || '',
      j_excited: row.j_excited || '',
      
      c_couple_status: row.c_couple_status || '',
      j_couple_status: row.j_couple_status || '',
      c_couple_overview_notes: row.c_couple_overview_notes || '',
      j_couple_overview_notes: row.j_couple_overview_notes || '',
      c_improve: row.c_improve || '',
      j_improve: row.j_improve || '',
      c_working_well: row.c_working_well || '',
      j_working_well: row.j_working_well || ''
    }
  };
}

// --------------------------------------------------------------------------
// Cryptographic Helpers & Authentication Middleware
// --------------------------------------------------------------------------

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function verifyPassword(password, salt, storedHash) {
  const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(verifyHash, 'hex'));
  } catch (e) {
    return false;
  }
}

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No session token provided.' });
  }
  
  try {
    const [sessions] = await pool.query(
      `SELECT s.user_id, u.username, u.role 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.token = ? AND s.expires_at > NOW()`,
      [token]
    );
    
    if (sessions.length === 0) {
      return res.status(401).json({ error: 'Session expired or invalid.' });
    }
    
    req.user = {
      id: sessions[0].user_id,
      username: sessions[0].username,
      role: sessions[0].role
    };
    next();
  } catch (err) {
    console.error('Authentication middleware error:', err);
    res.status(500).json({ error: 'Authentication check failed' });
  }
}

// --------------------------------------------------------------------------
// API Routes
// --------------------------------------------------------------------------

// ==========================================================================
// Authentication Endpoints
// ==========================================================================

// A. Login & Auto-Registration
app.post('/api/auth/login', async (req, res) => {
  let { username, password } = req.body;
  username = username?.trim().toLowerCase();
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length > 0) {
      // User exists, verify password
      const user = users[0];
      const isValid = verifyPassword(password, user.salt, user.password_hash);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password. Please try again.' });
      }
      
      // Password is valid, generate session token
      const token = crypto.randomBytes(32).toString('hex');
      await pool.query(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
        [user.id, token]
      );
      
      return res.json({
        success: true,
        token,
        user: {
          username: user.username,
          role: user.role
        }
      });
    } else {
      // User does not exist, let's see if we can register them (max 2 users)
      const [countResult] = await pool.query('SELECT COUNT(*) as cnt FROM users');
      const count = countResult[0].cnt;
      
      if (count >= 2) {
        return res.status(400).json({ error: 'Private space limit reached. Only two accounts are allowed to register.' });
      }
      
      // Auto-register!
      const role = count === 0 ? 'partner_1' : 'partner_2';
      const { hash, salt } = hashPassword(password);
      
      const [insertResult] = await pool.query(
        'INSERT INTO users (username, password_hash, salt, role) VALUES (?, ?, ?, ?)',
        [username, hash, salt, role]
      );
      
      const userId = insertResult.insertId;
      const token = crypto.randomBytes(32).toString('hex');
      await pool.query(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
        [userId, token]
      );
      
      console.log(`Registered new dynamic user: ${username} with role: ${role}`);
      
      return res.json({
        success: true,
        message: 'Account registered and secured successfully!',
        token,
        user: {
          username,
          role
        }
      });
    }
  } catch (err) {
    console.error('Error during auth login:', err);
    res.status(500).json({ error: 'Authentication process failed' });
  }
});

// B. Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  try {
    await pool.query('DELETE FROM sessions WHERE token = ?', [token]);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// C. Verify active session / get active user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      username: req.user.username,
      role: req.user.role
    }
  });
});

// D. Get all registered users (so client can dynamically update labels)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT username, role FROM users ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users list:', err);
    res.status(500).json({ error: 'Failed to fetch registered profiles' });
  }
});

// 1. Get entire check-in history
app.get('/api/history', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM check_ins ORDER BY check_in_timestamp DESC');
    const history = rows.map(mapRowToAppModel);
    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// 2. Add or Update a check-in
app.post('/api/check-in', authenticateToken, async (req, res) => {
  const { date, timestamp, mode, answers } = req.body;
  
  if (!date || !timestamp || !mode) {
    return res.status(400).json({ error: 'Missing required check-in parameters' });
  }
  
  const a = answers || {};
  
  // Clean values for insertion (handle scales as integers and booleans as 0/1)
  const c_scale = a.c_scale ? parseInt(a.c_scale, 10) : null;
  const j_scale = a.j_scale ? parseInt(a.j_scale, 10) : null;
  const c_goals_page = a.c_goals_page === true ? 1 : (a.c_goals_page === false ? 0 : null);
  const j_goals_page = a.j_goals_page === true ? 1 : (a.j_goals_page === false ? 0 : null);

  const fields = {
    check_in_date: date,
    check_in_timestamp: Number(timestamp),
    mode: mode,
    c_scale,
    j_scale,
    c_most_connected: a.c_most_connected || null,
    j_most_connected: a.j_most_connected || null,
    c_distant: a.c_distant || null,
    j_distant: a.j_distant || null,
    c_more_of: a.c_more_of || null,
    j_more_of: a.j_more_of || null,
    c_less_of: a.c_less_of || null,
    j_less_of: a.j_less_of || null,
    c_bothering: a.c_bothering || null,
    j_bothering: a.j_bothering || null,
    c_feel_loved: a.c_feel_loved || null,
    j_feel_loved: a.j_feel_loved || null,
    c_grateful_quality: a.c_grateful_quality || null,
    j_grateful_quality: a.j_grateful_quality || null,
    c_appreciate_relationship: a.c_appreciate_relationship || null,
    j_appreciate_relationship: a.j_appreciate_relationship || null,
    c_goals_page,
    j_goals_page,
    c_goals_notes: a.c_goals_notes || null,
    j_goals_notes: a.j_goals_notes || null,
    c_future_worries: a.c_future_worries || null,
    j_future_worries: a.j_future_worries || null,
    c_excited: a.c_excited || null,
    j_excited: a.j_excited || null,
    c_couple_status: a.c_couple_status || null,
    j_couple_status: a.j_couple_status || null,
    c_couple_overview_notes: a.c_couple_overview_notes || null,
    j_couple_overview_notes: a.j_couple_overview_notes || null,
    c_improve: a.c_improve || null,
    j_improve: a.j_improve || null,
    c_working_well: a.c_working_well || null,
    j_working_well: a.j_working_well || null
  };

  try {
    // Check if check-in with this timestamp already exists
    const [existing] = await pool.query('SELECT id FROM check_ins WHERE check_in_timestamp = ?', [Number(timestamp)]);
    
    if (existing.length > 0) {
      // Perform Update
      const id = existing[0].id;
      const updateKeys = Object.keys(fields).map(key => `${key} = ?`).join(', ');
      const updateValues = [...Object.values(fields), id];
      
      await pool.query(`UPDATE check_ins SET ${updateKeys} WHERE id = ?`, updateValues);
      console.log(`Updated check-in id: ${id}`);
      res.json({ success: true, message: 'Check-in updated successfully', id });
    } else {
      // Perform Insert
      const keys = Object.keys(fields).join(', ');
      const placeholders = Object.keys(fields).map(() => '?').join(', ');
      const values = Object.values(fields);
      
      const [result] = await pool.query(`INSERT INTO check_ins (${keys}) VALUES (${placeholders})`, values);
      const insertId = result.insertId;
      console.log(`Created new check-in id: ${insertId}`);
      res.json({ success: true, message: 'Check-in saved successfully', id: insertId });
    }
  } catch (err) {
    console.error('Error saving check-in:', err);
    res.status(500).json({ error: 'Database save operation failed' });
  }
});

// 3. Delete a check-in
app.delete('/api/check-in/:timestamp', authenticateToken, async (req, res) => {
  const timestamp = Number(req.params.timestamp);
  if (isNaN(timestamp)) {
    return res.status(400).json({ error: 'Invalid timestamp parameter' });
  }
  
  try {
    const [result] = await pool.query('DELETE FROM check_ins WHERE check_in_timestamp = ?', [timestamp]);
    if (result.affectedRows > 0) {
      console.log(`Deleted check-in with timestamp: ${timestamp}`);
      res.json({ success: true, message: 'Check-in deleted successfully' });
    } else {
      res.status(404).json({ error: 'Check-in not found' });
    }
  } catch (err) {
    console.error('Error deleting check-in:', err);
    res.status(500).json({ error: 'Database delete operation failed' });
  }
});

// ==========================================================================
// Standalone Self-Appreciation Routes
// ==========================================================================

// A. Get all self-appreciations
app.get('/api/self-appreciations', authenticateToken, async (req, res) => {
  try {
    const myAuthorVal = req.user.role === 'partner_2' ? 'jurrand' : 'carter';
    // Row-level filter: Return only logged-in user reflections OR partner shared reflections
    const [rows] = await pool.query(
      `SELECT * FROM self_appreciations 
       WHERE author = ? OR (author != ? AND is_shared = 1) 
       ORDER BY reflection_timestamp DESC`,
      [myAuthorVal, myAuthorVal]
    );
    
    const reflections = rows.map(row => ({
      id: row.id,
      author: row.author,
      date: row.reflection_date,
      timestamp: Number(row.reflection_timestamp),
      content: row.content,
      is_shared: row.is_shared === 1
    }));
    res.json(reflections);
  } catch (err) {
    console.error('Error fetching self-appreciations:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// B. Add or Update a self-appreciation
app.post('/api/self-appreciations', authenticateToken, async (req, res) => {
  const { id, author, date, timestamp, content, is_shared } = req.body;
  
  if (!author || !date || !timestamp || !content) {
    return res.status(400).json({ error: 'Missing required self-appreciation parameters' });
  }
  
  const myAuthorVal = req.user.role === 'partner_2' ? 'jurrand' : 'carter';
  // Row-level validation: verify that the logged-in user is the author!
  if (author !== myAuthorVal) {
    return res.status(403).json({ error: 'Access denied. You cannot write reflections on behalf of your partner.' });
  }
  
  const fields = {
    author,
    reflection_date: date,
    reflection_timestamp: Number(timestamp),
    content,
    is_shared: is_shared === true ? 1 : 0
  };
  
  try {
    if (id) {
      // Perform Update
      // Enforce ownership: query first to verify that the logged-in user is the author
      const [existing] = await pool.query('SELECT author FROM self_appreciations WHERE id = ?', [id]);
      if (existing.length === 0 || existing[0].author !== myAuthorVal) {
        return res.status(403).json({ error: 'Access denied. You can only modify your own reflections.' });
      }
      
      const updateKeys = Object.keys(fields).map(key => `${key} = ?`).join(', ');
      const updateValues = [...Object.values(fields), id];
      
      await pool.query(`UPDATE self_appreciations SET ${updateKeys} WHERE id = ?`, updateValues);
      console.log(`Updated self-appreciation ID: ${id}`);
      res.json({ success: true, message: 'Reflection updated successfully', id });
    } else {
      // Perform Insert
      const keys = Object.keys(fields).join(', ');
      const placeholders = Object.keys(fields).map(() => '?').join(', ');
      const values = Object.values(fields);
      
      const [result] = await pool.query(`INSERT INTO self_appreciations (${keys}) VALUES (${placeholders})`, values);
      console.log(`Created self-appreciation ID: ${result.insertId}`);
      res.json({ success: true, message: 'Reflection saved successfully', id: result.insertId });
    }
  } catch (err) {
    console.error('Error saving self-appreciation:', err);
    res.status(500).json({ error: 'Database save operation failed' });
  }
});

// C. Delete a self-appreciation
app.delete('/api/self-appreciations/:id', authenticateToken, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID parameter' });
  }
  
  try {
    // Enforce ownership: check author first
    const [existing] = await pool.query('SELECT author FROM self_appreciations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Reflection not found' });
    }
    
    const myAuthorVal = req.user.role === 'partner_2' ? 'jurrand' : 'carter';
    if (existing[0].author !== myAuthorVal) {
      return res.status(403).json({ error: 'Access denied. You can only delete your own reflections.' });
    }
    
    await pool.query('DELETE FROM self_appreciations WHERE id = ?', [id]);
    console.log(`Deleted self-appreciation with ID: ${id}`);
    res.json({ success: true, message: 'Reflection deleted successfully' });
  } catch (err) {
    console.error('Error deleting self-appreciation:', err);
    res.status(500).json({ error: 'Database delete operation failed' });
  }
});

// 4. Batch sync offline records
app.post('/api/sync', authenticateToken, async (req, res) => {
  const { checkIns } = req.body;
  if (!Array.isArray(checkIns)) {
    return res.status(400).json({ error: 'Invalid sync payload. Expected array of checkIns.' });
  }

  console.log(`Syncing ${checkIns.length} check-ins...`);
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    for (const item of checkIns) {
      const { date, timestamp, mode, answers } = item;
      if (!date || !timestamp || !mode) continue;
      
      const a = answers || {};
      const c_scale = a.c_scale ? parseInt(a.c_scale, 10) : null;
      const j_scale = a.j_scale ? parseInt(a.j_scale, 10) : null;
      const c_goals_page = a.c_goals_page === true ? 1 : (a.c_goals_page === false ? 0 : null);
      const j_goals_page = a.j_goals_page === true ? 1 : (a.j_goals_page === false ? 0 : null);

      const fields = {
        check_in_date: date,
        check_in_timestamp: Number(timestamp),
        mode: mode,
        c_scale,
        j_scale,
        c_most_connected: a.c_most_connected || null,
        j_most_connected: a.j_most_connected || null,
        c_distant: a.c_distant || null,
        j_distant: a.j_distant || null,
        c_more_of: a.c_more_of || null,
        j_more_of: a.j_more_of || null,
        c_less_of: a.c_less_of || null,
        j_less_of: a.j_less_of || null,
        c_bothering: a.c_bothering || null,
        j_bothering: a.j_bothering || null,
        c_feel_loved: a.c_feel_loved || null,
        j_feel_loved: a.j_feel_loved || null,
        c_grateful_quality: a.c_grateful_quality || null,
        j_grateful_quality: a.j_grateful_quality || null,
        c_appreciate_relationship: a.c_appreciate_relationship || null,
        j_appreciate_relationship: a.j_appreciate_relationship || null,
        c_goals_page,
        j_goals_page,
        c_goals_notes: a.c_goals_notes || null,
        j_goals_notes: a.j_goals_notes || null,
        c_future_worries: a.c_future_worries || null,
        j_future_worries: a.j_future_worries || null,
        c_excited: a.c_excited || null,
        j_excited: a.j_excited || null,
        c_couple_status: a.c_couple_status || null,
        j_couple_status: a.j_couple_status || null,
        c_couple_overview_notes: a.c_couple_overview_notes || null,
        j_couple_overview_notes: a.j_couple_overview_notes || null,
        c_improve: a.c_improve || null,
        j_improve: a.j_improve || null,
        c_working_well: a.c_working_well || null,
        j_working_well: a.j_working_well || null
      };

      // Check existence
      const [existing] = await connection.query('SELECT id FROM check_ins WHERE check_in_timestamp = ?', [Number(timestamp)]);
      
      if (existing.length > 0) {
        // Update
        const id = existing[0].id;
        const updateKeys = Object.keys(fields).map(key => `${key} = ?`).join(', ');
        const updateValues = [...Object.values(fields), id];
        await connection.query(`UPDATE check_ins SET ${updateKeys} WHERE id = ?`, updateValues);
      } else {
        // Insert
        const keys = Object.keys(fields).join(', ');
        const placeholders = Object.keys(fields).map(() => '?').join(', ');
        const values = Object.values(fields);
        await connection.query(`INSERT INTO check_ins (${keys}) VALUES (${placeholders})`, values);
      }
    }
    
    await connection.commit();
    res.json({ success: true, message: 'History synced successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Error during batch sync:', err);
    res.status(500).json({ error: 'Batch sync failed' });
  } finally {
    connection.release();
  }
});

// --------------------------------------------------------------------------
// Serve Static Frontend Files & Fallback Routing
// --------------------------------------------------------------------------
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
async function startServer() {
  await connectWithRetry();
  app.listen(PORT, () => {
    console.log(`WeCheck unified backend server running on port ${PORT}!`);
  });
}

startServer();
