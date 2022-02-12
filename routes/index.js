const config = require('@config/config')
const passport = require('passport')

module.exports = app => {

  app.get('/about', (req, res) => {
    res.status(200).send({
      name: 'Candidate Email Sending',
      environment: config.env
    })
  })

  app.get('/', (req, res) => {
    // if (req.user) res.redirect('/form')
    // else res.render('login')
    if (req.user) delete req.user.body
    res.render('login', {title: 'Login'})
  })

  app.post('/', passport.authenticate('google', {
    scope: [
      'profile', 'email',
      'https://mail.google.com/'
    ],
    accessType: 'offline',
    prompt: 'consent'
  }))

  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => res.redirect('/form'))

}
