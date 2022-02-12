const config = require('@config/config')

module.exports = app => {

  app.get('/form', (req, res) => {
    const template = (req.query.eg === 'true' ? 'example' : 'form')
    if (req.user) res.render(template, { recruiterEmail: req.user.email })
    else res.redirect('/')
  })

  app.post('/form', async (req, res) => {
    try {
      const body = req.body
      if (body.emailArray) body.emailArray = body.emailArray.split('\r\n')
      if (body.ccArray) body.ccArray = body.ccArray.split('\r\n')
      if (body.prosArray) body.prosArray = body.prosArray.split('\r\n')
      if (body.consArray) body.consArray = body.consArray.split('\r\n')
      if (body.scheduleArray) body.scheduleArray = body.scheduleArray.split('\r\n')
      req.user.body = body
      res.render('preview', body)

    } catch(e) {
      e.status = e.status || 500
      res.locals.message = e.message
      res.locals.error = e
      res.render('error', e)
    }
  })
}
