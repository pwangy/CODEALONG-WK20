import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const port = process.env.PORT || 8080
const app = express()

// this week we learn about CORS: Cross-Origin Resource Sharing
app.use(cors())
app.use(bodyParser.json())

// routes
app.get('/', (req, res) => {
  res.send('coding a-long with Van!')
})

// start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
