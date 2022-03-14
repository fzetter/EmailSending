const hbs =  require('hbs')
const config = require('@config/config')
const { getTokenData } = require('@modules/token')

hbs.registerHelper('select', function(selected, options) {
  const regex = `value=\"${selected}\"`
  return options.fn(this).replace(new RegExp(regex), '$& selected="selected"')
})

module.exports = app => {

  app.get('/form', async (req, res) => {
    const loggedIn = req.user ? await getTokenData(req.user.accessToken) : false;
    if (loggedIn !== false) {
      const template = (!!req.query.eg ? 'example' : 'form')
      const body = req.user.body || {}
      body.title = 'Form'
      body.recruiterEmail = req.user.email
      res.render(template, body)
    }
    else res.redirect('/')
  })

  app.post('/form', async (req, res) => {
    try {
      const body = req.body
      body.title = 'Preview'
      if (body.emailArray) body.emailArray = body.emailArray.split('\r\n')
      if (body.ccArray) body.ccArray = body.ccArray.split('\r\n')
      if (body.summary) body.summary = body.summary.split('\r\n')
      if (body.prosArray) body.prosArray = body.prosArray.split('\r\n')
      if (body.consArray) body.consArray = body.consArray.split('\r\n')
      if (body.scheduleArray) body.scheduleArray = body.scheduleArray.split('\r\n')
      req.user.body = body
      res.render('preview', body)

    } catch(e) {
      e.status = e.status || 500
      e.title = 'Error'
      res.locals.message = e.message
      res.locals.error = e
      res.render('error', e)
    }
  })
}
