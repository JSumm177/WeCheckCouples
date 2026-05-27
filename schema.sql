-- Create the database if it doesn't exist (handled by docker-compose, but useful for reference)
CREATE DATABASE IF NOT EXISTS wecheck_db;
USE wecheck_db;

-- Drop check_ins table if it exists to clean start
DROP TABLE IF EXISTS check_ins;

-- Table to store weekly relationship check-ins for Carter and Jurrand
CREATE TABLE check_ins (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    check_in_date VARCHAR(50) NOT NULL,
    check_in_timestamp BIGINT NOT NULL,
    mode VARCHAR(20) NOT NULL COMMENT 'together, carter, jurrand',
    
    -- 1. Connectedness
    c_scale INT DEFAULT NULL COMMENT 'Carter connectedness scale 1-10',
    j_scale INT DEFAULT NULL COMMENT 'Jurrand connectedness scale 1-10',
    c_most_connected TEXT DEFAULT NULL COMMENT 'What made Carter feel most connected',
    j_most_connected TEXT DEFAULT NULL COMMENT 'What made Jurrand feel most connected',
    c_distant TEXT DEFAULT NULL COMMENT 'What made Carter feel distant',
    j_distant TEXT DEFAULT NULL COMMENT 'What made Jurrand feel distant',
    
    -- 2. Needs
    c_more_of TEXT DEFAULT NULL COMMENT 'What Carter needs more of',
    j_more_of TEXT DEFAULT NULL COMMENT 'What Jurrand needs more of',
    c_less_of TEXT DEFAULT NULL COMMENT 'What Carter needs less of',
    j_less_of TEXT DEFAULT NULL COMMENT 'What Jurrand needs less of',
    c_bothering TEXT DEFAULT NULL COMMENT 'Anything bothering Carter',
    j_bothering TEXT DEFAULT NULL COMMENT 'Anything bothering Jurrand',
    
    -- 3. Appreciation
    c_feel_loved TEXT DEFAULT NULL COMMENT 'What made Carter feel loved this week',
    j_feel_loved TEXT DEFAULT NULL COMMENT 'What made Jurrand feel loved this week',
    c_grateful_quality TEXT DEFAULT NULL COMMENT 'Quality of Jurrand that Carter is grateful for',
    j_grateful_quality TEXT DEFAULT NULL COMMENT 'Quality of Carter that Jurrand is grateful for',
    c_appreciate_relationship TEXT DEFAULT NULL COMMENT 'What Carter appreciates about relationship',
    j_appreciate_relationship TEXT DEFAULT NULL COMMENT 'What Jurrand appreciates about relationship',
    
    -- 4. Goals / Future
    c_goals_page BOOLEAN DEFAULT NULL COMMENT 'Is Carter still on same page about goals',
    j_goals_page BOOLEAN DEFAULT NULL COMMENT 'Is Jurrand still on same page about goals',
    c_goals_notes TEXT DEFAULT NULL COMMENT 'Carter goals clarification notes',
    j_goals_notes TEXT DEFAULT NULL COMMENT 'Jurrand goals clarification notes',
    c_future_worries TEXT DEFAULT NULL COMMENT 'Anything about future worrying Carter',
    j_future_worries TEXT DEFAULT NULL COMMENT 'Anything about future worrying Jurrand',
    c_excited TEXT DEFAULT NULL COMMENT 'What Carter is excited about regarding couple',
    j_excited TEXT DEFAULT NULL COMMENT 'What Jurrand is excited about regarding couple',
    
    -- 5. Overview
    c_couple_status VARCHAR(50) DEFAULT NULL COMMENT 'Carter coupling status descriptor',
    j_couple_status VARCHAR(50) DEFAULT NULL COMMENT 'Jurrand coupling status descriptor',
    c_couple_overview_notes TEXT DEFAULT NULL COMMENT 'Carter overview reflection notes',
    j_couple_overview_notes TEXT DEFAULT NULL COMMENT 'Jurrand overview reflection notes',
    c_improve TEXT DEFAULT NULL COMMENT 'What Carter wants to focus on improving',
    j_improve TEXT DEFAULT NULL COMMENT 'What Jurrand wants to focus on improving',
    c_working_well TEXT DEFAULT NULL COMMENT 'What Carter thinks is working well',
    j_working_well TEXT DEFAULT NULL COMMENT 'What Jurrand thinks is working well',

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index on check_in_timestamp for optimal timeline querying and charting
CREATE INDEX idx_timestamp ON check_ins (check_in_timestamp);

-- Table to store standalone self-appreciation journal reflections
CREATE TABLE IF NOT EXISTS self_appreciations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    author VARCHAR(20) NOT NULL COMMENT 'carter, jurrand',
    reflection_date VARCHAR(50) NOT NULL,
    reflection_timestamp BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_shared BOOLEAN DEFAULT TRUE COMMENT 'Whether shared with the partner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index on author and reflection_timestamp for query speed
CREATE INDEX idx_author_timestamp ON self_appreciations (author, reflection_timestamp);

-- Table to store user accounts
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Abstracted username',
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    role VARCHAR(20) NOT NULL COMMENT 'partner_1, partner_2',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table to store active session tokens
CREATE TABLE IF NOT EXISTS sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
