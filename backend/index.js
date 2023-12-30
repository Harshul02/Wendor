const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const db = new sqlite3.Database('./todos.db');
db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN)');

app.use(bodyParser.json());

app.use(cors());

app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/todos', (req, res) => {
  const { title, completed } = req.body;
  db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, completed], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ id: this.lastID, title, completed });
    }
  });
});

app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const { completed } = req.body;
  db.run('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ id, completed });
    }
  });
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM todos WHERE id = ?', id, function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ id });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
