const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json());

// DB Config
const dbConfig = {
    host: process.env.DB_HOST || 'ushasreedb.c588mswco6jw.ap-south-1.rds.amazonaws.com',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'ushasree'
};

// DB Connection
const db = mysql.createConnection(dbConfig);
db.connect((err) => {
    if (err) {
        console.error('❌ Database Connection Failed:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to RDS database!');
});

// Session Store
const sessionStore = new MySQLStore(dbConfig);
app.use(session({
    key: 'user_session',
    secret: 'your_secret_key_here',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: false, // Set to true if using HTTPS
        httpOnly: true
    }
}));

// Health Check
app.get('/', (req, res) => {
    res.send('✅ UshaSree Backend is Running');
});

// Signup Route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send('⚠️ All fields are required');
    }

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error('❌ Signup DB Error:', err.message);
            return res.status(500).send('❌ Signup failed: ' + err.message);
        }
        res.send('🎉 User Registered Successfully');
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('⚠️ Both username and password are required');
    }

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('❌ Login DB Error:', err.message);
            return res.status(500).send('❌ Login failed');
        }

        if (results.length > 0) {
            req.session.user = {
                id: results[0].id,
                username: results[0].username
            };
            console.log("✅ Login Successful:", req.session.user);
            res.send('✅ Login Successful');
        } else {
            res.status(401).send('❌ Invalid Credentials');
        }
    });
});

// Logout Route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('❌ Logout failed');
        }
        res.clearCookie('user_session');
        res.send('👋 Logged out successfully');
    });
});

// Auth Middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(401).send('❌ Please log in to access this page.');
}

// Example protected route
app.get('/protected', isAuthenticated, (req, res) => {
    res.send(`👋 Hello, ${req.session.user.username}. You're authenticated.`);
});

// Enrollment Route
app.post('/enroll', (req, res) => {
    const { course, email, password } = req.body;
    if (!course || !email || !password) {
        return res.status(400).send("⚠️ All fields are required.");
    }

    const sql = "INSERT INTO enrollments (course_name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [course, email, password], (err, result) => {
        if (err) {
            console.error("❌ Enrollment DB Error:", err.message);
            return res.status(500).send("❌ Enrollment failed.");
        }

        res.send("✅ Enrollment successful!");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});
