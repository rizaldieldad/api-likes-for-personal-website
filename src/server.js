const express = require('express')
const sqlite3 = require('sqlite3')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// create or open database
const db = new sqlite3.Database('./db/likes.db')

// create table if not exists
db.run(
  'CREATE TABLE IF NOT EXISTS likes (id INTEGER PRIMARY KEY, count INTEGER DEFAULT 0)',
  err => {
    if (err) {
      console.error(err.message)
    }
  }
)

// create a default row if doesnt exists
db.get('SELECT * FROM likes WHERE id=1', (err, row) => {
  if (!row) {
    db.run('INSERT INTO LIKES (id, count) VALUES (1, 0)')
  }
})

app.get('/likes', (req, res) => {
  db.get('SELECT * FROM likes WHERE id=1', (err, row) => {
    if (err) return res.status(500).send({ error: err.message })
    res.json({ count: row.count })
  })
})

app.post('/like', (req, res) => {
  db.run('UPDATE likes SET count = count + 1 WHERE id = 1', err => {
    if (err) return res.status(500).send({ error: err.message })
    db.get('SELECT count FROM likes WHERE id = 1', (err, row) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ count: row.count })
    })
  })
})

app.post('/unlike', (req, res) => {
  db.run('UPDATE likes SET count = count - 1 WHERE id = 1', err => {
    if (err) return res.status(500).send({ error: err.message })
    db.get('SELECT count FROM likes WHERE id = 1', (err, row) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ count: row.count })
    })
  })
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
