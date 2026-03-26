const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fullcycle',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const names = ['Wescley', 'Luiz', 'João', 'Maria', 'Pedro', 'Ana'];

let pool;

async function initDb() {
  pool = mysql.createPool(dbConfig);
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS people (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } finally {
    conn.release();
  }
}

function getRandomName() {
  const idx = Math.floor(Math.random() * names.length);
  return names[idx];
}

app.get('/', async (req, res) => {
  try {
    const name = getRandomName();
    await pool.query('INSERT INTO people (name) VALUES (?)', [name]);

    const [rows] = await pool.query('SELECT name FROM people ORDER BY id');

    const listItems = rows
      .map((row) => `<li>${row.name}</li>`)
      .join('\n');

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Full Cycle Rocks</title>
      </head>
      <body>
        <h1>Full Cycle Rocks!</h1>
        <ul>
          ${listItems}
        </ul>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Request error:', err);
    res.status(500).send('Erro interno');
  }
});

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
