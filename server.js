const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

// To allow express accept json
app.use(express.json())

// To store users
const users = []

// To get all users
app.get('/users', (req, res) => {
  res.json(users)
})

// To create user with hashed password
// Use async because bcrypt is asynchronous library
app.post('/users', async (req, res) => {
  try {
    // To hash password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send(user)
  } catch {
    res.status(500).send()
  }
})

// To authenticate user
// Use async because bcrypt is asynchronous library
app.post('/login', async (req, res) => {
  const user = users.find((user) => user.name === req.body.name)
  if (!user) return res.status(400).send('Cannot find user')
  try {
    // To compare using bcrypt
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not allowed')
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(3000)
