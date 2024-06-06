require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database(process.env.DATABASE_URL);

// Create a table for storing registration data if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    interests TEXT NOT NULL
  )
`);

// Route to handle form submission
app.post('/register', (req, res) => {
  const { name, email, phone, interests } = req.body;
  const interestsStr = interests.join(', ');

  db.run(
    `INSERT INTO registrations (name, email, phone, interests) VALUES (?, ?, ?, ?)`,
    [name, email, phone, interestsStr],
    function (err) {
      if (err) {
        return res.status(500).send('Failed to save registration');
      }
      res.status(200).send('Registration successful');
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
