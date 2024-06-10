const express = require('express')
const app = express()
const path = require('path')
const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')
const URL = require('./models/url')
const cookieParser = require('cookie-parser')
const { connectToMongoDB } = require('./connect')
const { restrictToLoggedinUserOnly, checkAuth } = require('./middleware/auth')

connectToMongoDB('mongodb://localhost:27017/url-shortener').then(() =>
  console.log('MongoDB Connected !')
)

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

app.use('/url', restrictToLoggedinUserOnly, urlRoute)
app.use('/user', userRoute)
app.use('/', checkAuth, staticRoute)

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
