const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const request = require('request');
const serveIndex = require('serve-index');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
// Function to generate a random key of specified length
const generateRandomKey = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // Convert to hexadecimal format
        .slice(0, length); // Trim to desired length
};

const secretKey = generateRandomKey(32);

// Use express-session middleware
app.use(session({
    secret: 'secretKey', // Used for encrypting session data
    resave: false,
    saveUninitialized: true
}));

function getFixedCity() {
    return 'Vancouver';
}

// Function to get city information from IP
function getCityFromIp(publicIp) {
    const apiUrl = `https://ipinfo.io/${publicIp}/json`;

    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const city = data.city || 'Unknown City';

            // If the city is 'Unknown City', prompt the user for the city name
            if (city === 'Unknown City') {
                const userCity = await promptUserForCity();
                resolve(userCity);
            } else {
                resolve(city);
            }
        } catch (error) {
            reject(error);
        }
    });
}

// Example function to prompt the user for the city name
function promptUserForCity() {
    return new Promise((resolve) => {
        // Implement your logic to prompt the user for the city name here
        // You can use libraries like 'readline' or display a message to the user
        // and wait for their input. Return the entered city name.
        // For simplicity, let's assume the user is prompted via the console.
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Enter your city name: ', (cityName) => {
            readline.close();
            resolve(cityName);
        });
    });
}

// Connect to the database
const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Create users table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            ip TEXT
        )
    `);

    // Create files table
    db.run(`
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            filetype TEXT,
            filesize INTEGER,
            upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            location TEXT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const { ip } = req.query;
            console.log('ip', ip);
            const city = await getCityFromIp(ip);
            const uploadDir = path.join(__dirname, 'uploads', city);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            cb(null, uploadDir);
        } catch (error) {
            console.error('Error creating destination directory:', error);
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

// Multer middleware
const upload = multer({ storage: storage });

// Middleware to check if user is logged in
const checkLogin = (req, res, next) => {
    // Get isLoggedIn from cookies
    const isLoggedIn = req.cookies && req.cookies.isLoggedIn === 'true';

    if (isLoggedIn) {
        // User login, proceed
        console.log('User is logged in.');
        next();
    } else {
        // If not, login again
        console.log('User is not logged in. Redirecting to login page.');
        res.redirect('/');
    }
    
    console.log('checkLogin in server.js'+checkLogin==true);
};

app.use(cookieParser());
// Serve static resources
app.use(express.static(path.join(__dirname, 'index')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', serveIndex(path.join(__dirname, 'uploads')));

// Login page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'login.html'));
});

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        // Get user information
        const { username, ip } = req.body;

        // Insert data into the users table
        const insertUser = db.prepare('INSERT INTO users (username, ip) VALUES (?, ?)');
        insertUser.run(username, ip, (err) => {
            if (err) {
                console.error('Error inserting user data:', err.message);
                res.status(500).send('Error inserting user data.');
                insertUser.finalize();
            } else {
                console.log('User data inserted successfully.');
                insertUser.finalize();

                // Get file information
                const { originalname, mimetype, size } = req.file;

                // Get user ID
                const getUserId = db.prepare('SELECT id FROM users WHERE username = ?');
                getUserId.get(username, (err, row) => {
                    if (err) {
                        console.error('Error retrieving user ID:', err.message);
                        res.status(500).send('Error retrieving user ID.');
                        getUserId.finalize();
                    } else {
                        const userId = row ? row.id : null;

                        // Insert data into the files table
                        const insertFile = db.prepare(`
                            INSERT INTO files (filename, filetype, filesize, location, user_id)
                            VALUES (?, ?, ?, ?, ?)
                        `);
                        insertFile.run(originalname, mimetype, size, req.file.path, userId, (err) => {
                            if (err) {
                                console.error('Error inserting file data:', err.message);
                                res.status(500).send('Error inserting file data.');
                            } else {
                                console.log('File data inserted successfully.');
                                res.send('File uploaded successfully.');
                            }
                            insertFile.finalize();
                        });

                        getUserId.finalize();
                    }
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('File upload failed. Please try again.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
