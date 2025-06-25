import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { Pool } = pkg;
const execAsync = util.promisify(exec);
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in .env");
}
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    
    // Ensure we have all necessary fields
    req.user = {
      userId: user.userId,
      email: user.email,
      designation: user.designation
    };
    
    next();
  });
}

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  const { employeeName, employeeEmail, password, reenterPassword, designation } = req.body;

  if (!employeeName || !employeeEmail || !password || !reenterPassword || !designation) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== reenterPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const [firstName, ...lastParts] = employeeName.trim().split(' ');
  const lastName = lastParts.join(' ') || '';

  try {
    const client = await pool.connect();

    const existing = await client.query('SELECT * FROM "4iempdet" WHERE employee_email = $1', [employeeEmail]);
    if (existing.rows.length > 0) {
      client.release();
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const insertQuery = `
      INSERT INTO "4iempdet" (employee_email, password, first_name, last_name, designation)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, employee_email, first_name, last_name, designation, created_at
    `;
    const result = await client.query(insertQuery, [
      employeeEmail,
      hashedPassword,
      firstName,
      lastName,
      designation,
    ]);

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.employee_email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.employee_email,
        firstName: user.first_name,
        lastName: user.last_name,
        designation: user.designation,
        createdAt: user.created_at,
      },
    });

    client.release();
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in
app.post('/api/auth/signin', async (req, res) => {
  const { employeeEmail, password } = req.body;

  if (!employeeEmail || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM "4iempdet" WHERE employee_email = $1', [employeeEmail]);
    const user = result.rows[0];

    if (!user) {
      client.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      client.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.employee_email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Sign in successful',
      token,
      user: {
        id: user.id,
        email: user.employee_email,
        firstName: user.first_name,
        lastName: user.last_name,
        designation: user.designation,
        createdAt: user.created_at,
      },
    });

    client.release();
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, employee_email, first_name, last_name, designation, created_at FROM "4iempdet" WHERE id = $1',
      [req.user.userId]
    );

    const user = result.rows[0];
    if (!user) {
      client.release();
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.employee_email,
        firstName: user.first_name,
        lastName: user.last_name,
        designation: user.designation,
        createdAt: user.created_at,
      },
    });

    client.release();
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/query', authenticateToken, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Get user details from database
    const client = await pool.connect();
    const userResult = await client.query(
      'SELECT employee_email, designation FROM "4iempdet" WHERE id = $1',
      [req.user.userId]
    );
    const userData = userResult.rows[0];
    client.release();

    if (!userData || !userData.designation) {
      return res.status(404).json({
        error: 'User or designation not found'
      });
    }

    const user_email = userData.employee_email;
    const designation = userData.designation;

    console.log('Processing NL-SQL query:', {
      question,
      user_email,
      designation
    });

    // Run the Python script
    const pythonScriptPath = path.join(__dirname, '../4i_aiagent/run_agent.py');

    const pythonCommand = `python "${pythonScriptPath}" "${question}" "${user_email}" "${designation}"`;

    console.log("Final Python Command:", pythonCommand);

    const { stdout, stderr } = await execAsync(pythonCommand);

    if (stderr) {
      console.error("Python stderr:", stderr);
      return res.status(500).json({
        success: false,
        error: "Error running Python script",
        details: stderr
      });
    }

    let pythonResult;
    try {
      pythonResult = JSON.parse(stdout.trim());
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        error: "Failed to parse Python response",
        rawOutput: stdout
      });
    }

    res.json(pythonResult);

  } catch (error) {
    console.error('Query processing failed:', error.message);
    res.status(500).json({
      error: "Query processing failed",
      details: error.message
    });
  }
});
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});