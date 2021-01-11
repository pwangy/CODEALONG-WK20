import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import crypto from 'crypto'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/auth"
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = Promise

const User = mongoose.model('User', {
  name: {
    type: String,

  },
  email: {
    type: ,
  },
  password: {
    type: String,
  },
  accessToken: {

  },
})


const port = process.env.PORT || 8085
const app = express()


// this week we learn about CORS: Cross-Origin Resource Sharing
app.use(cors())
app.use(bodyParser.json())

// routes
app.get('/', (req, res) => {
  res.send('Coding a-long with Van!')
})

app.get('/secrets', (req, res) => {
  res.json({secret: 'Super secret message.'})
})

// start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})