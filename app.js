require('dotenv').config()
require('module-alias/register')
const cors = require('cors')
const express = require('express')

const app = express()
app.use(express.json())
app.use(cors({'origin': true}))

/* Routes */
require('@routes/services')(app)

/* Engine Setup */
app.set('views', process.cwd() + '@modules/views')
app.set('view engine', 'html')

const PORT = process.env.PORT || 8081
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}/`))
