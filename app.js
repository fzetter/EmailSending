require('dotenv').config()
require('module-alias/register')
const cors = require('cors')
const express = require('express')
const { port, env } = require('@config/config')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(process.cwd() + '/public'))
app.use(cors({'origin': true}))

/* Routes */
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
