const express = require('express')
const app = express()
const path = require('path')
const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const URL = require('./models/url')
const { connectToMongoDB } = require('./connect')

connectToMongoDB('mongodb://localhost:27017/url-shortener').then(() =>
  console.log('MongoDB Connected !')
)

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/url', urlRoute)
app.use('/', staticRoute)

app.get('/url/:shortId', async (req, res) => {
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
