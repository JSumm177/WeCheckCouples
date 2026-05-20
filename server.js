const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8085;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'wecheck_db',
  user: process.env.DB_USER || 'wecheck_user',
  password: process.env.DB_PASSWORD || 'wecheck_password',
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
// API Routes
// --------------------------------------------------------------------------

// 1. Get entire check-in history
app.get('/api/history', async (req, res) => {
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
app.post('/api/check-in', async (req, res) => {
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
app.delete('/api/check-in/:timestamp', async (req, res) => {
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

// 4. Batch sync offline records
app.post('/api/sync', async (req, res) => {
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
