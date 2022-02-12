const config = require('@config/config')
const mailer = require('@modules/mailer.js')

module.exports = app => {

  app.post('/email/send', async (req, res) => {
    try {

      const body = req.user.body
      delete req.user.body

      const response = await mailer.sendEmail(body.emailArray, req.user, {
        subject: body.subject,
        cc: body.ccArray,
        context: body
      })

      res.render('message', {
        title: 'Sent',
        recruiterEmail: req.user.email,
        candidateEmail: body.emailArray,
        cc: body.ccArray
      })

    } catch(e) {
      e.status = e.status || 500
      e.title = 'Error'
      res.locals.message = e.message
      res.locals.error = e
      res.render('error', e)
    }
  })

}
