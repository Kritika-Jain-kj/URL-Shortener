const express = require('express')
const app = express()
const urlRoute = require('./routes/url')
const URL = require('./models/url')
const { connectToMongoDB } = require('./connect')

connectToMongoDB('mongodb://localhost:27017/url-shortener').then(() =>
  console.log('MongoDB Connected !')
)

app.use(express.json())

app.use('/url', urlRoute)

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  )
  res.redirect(entry.redirectURL)
})

app.listen(8001, () => {
  console.log('Server Started !')
})
