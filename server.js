import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import crypto from 'crypto'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const mongoUrl = process.env.MONGO_URL || "mongodb:localhost/auth"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const User = mongoose.model('User', {
  name: {
    type: String,
    unique: true,
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

// // Example:
// // POST Request
// const request = {name: "Karl", password: "foobar"}

// // DB Entry
// const dbEntry = {name: "Karl", password: "$2a$10$utY4e1UVnWOrPOxgWvGH8.FpIKBMxkWpQ8xHVBfmDiAaMmVdFxNfm"}
// bcrypt.compareSync(request.password. dbEntry.password)

// // One-way encryption
// const user = new User({name: "Karl", password: bcrypt.hashSync("foobar")})
// user.save()

const port = process.env.PORT || 8081
const app = express()

const authenticateUser = async (req, res, next) => {
  const user = await User.findOne({accessToken: req.header('Authorization')})
  if (user) {
      req.user = user
      next()
  } else {
    res.status(401).json({loggedOut:true})
  }
}

// this week we learn about CORS: Cross-Origin Resource Sharing
app.use(cors())
app.use(bodyParser.json())

// routes
app.get('/', (req, res) => {
  res.send('Coding along with Van!')
})

app.post('/tweets', authenticateUser)
app.post('/tweets', async (req, res) => {
  // This will only happen if the next() function is called from the middeware
  // now we can access the req.user
})


app.post('/sessions', async (req,res) => {
  const user = await User.findOne({name: req.body.name})
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    // Success
    res.json({userId: user._id, accessToken: user.accessToken})
  } else {
    // Failure
    // a. User does not exist
    // b. Encrypted password doesn't match
    res.json({notFound: true})
  }
})

// start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

// demo of random bytes function as converted to hex
// console.log(crypto.randomBytes(128).toString('hex'))
// !!! "bcrypt-nodejs" was shown in the video but has been deprecated
// console.log(bcrypt.hashSync("foobar"))