require('dotenv').config()
require('module-alias/register')
require('@modules/passport')
const cors = require('cors')
const express = require('express')
const passport = require('passport')
const cookieSession = require('cookie-session')
const { port, env, cookieKey } = require('@config/config')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(process.cwd() + '/public'))
app.use(cors({'origin': true}))

/* Sessions */
app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [cookieKey]
}))

/* Passport */
app.use(passport.initialize())
app.use(passport.session())

/* Routes */
require('./routes/form')(app)
require('./routes/index')(app)
require('./routes/services')(app)

/* Engine Setup */
app.set('views', process.cwd() + '/views')
app.set('view engine', 'html')
app.engine('html', require('hbs').__express)

/* Error View Handling */
app.use((req, res) => {
  const err = new Error('Not Found')
  err.status = 404
  res.locals.message = err.message
  res.locals.error = env === 'local' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

app.listen(port, () => console.log(`Server started at http://localhost:${port}/`))
