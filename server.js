import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcrypt-nodejs'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/auth"
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = Promise

const User = mongoose.model('User', {
  name: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String, 
    default: () => crypto.randomBytes(128).toString('hex')
  }
})

// middleware to authenticate a user
const authenticateUser = async (req, res, next) => {
  const user = await User.findOne({accessToken: req.header('Authorization')})
  if (user) {
    req.user = user
    next()
  } else {
    res.status(401).json({loggedOut: true})
  } 
}

const port = process.env.PORT || 8085
const app = express()

// this week we learn about CORS: Cross-Origin Resource Sharing
app.use(cors())
app.use(bodyParser.json())

// routes
app.get('/', (req, res) => {
  res.send('Coding a-long with Van!')
})

app.post('/users', async (req, res) => {
  try {
    const {name, email, password} = req.body
    // DO NOT STORE PLAINTEXT PASSWORDS
    const user = new User({name, email, password: bcrypt.hashSync(password)})
    user.save()
    res.status(201).json({id: user._id, accessToken: user.accessToken})
  } catch (err) {
    res.status(400).json({message: 'Could not create user', errors: err.errors})
  }
})

app.get('/secrets', authenticateUser)
app.get('/secrets', (req, res) => {
  res.json({secret: 'Super secret message.'})
})

app.post('/sessions', async (req, res) => {
  const user = await User.findOne({email: req.body.email})
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.json({userId: user._id, accessToken: user.accessToken})
  } else {
    res.json({notFound: true})
  }
})

// start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})