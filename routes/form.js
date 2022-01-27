const config = require('@config/config')
const mailer = require('@modules/mailer.js')

module.exports = app => {

  app.get('/form', (req, res) => {
    res.render('form', { title: 'DSP Email Sending', recruiterEmail: req.user.email })
  })

  app.post('/form', async (req, res) => {
    const body = req.body
    if (body.prosArray) body.prosArray = body.prosArray.split('\r\n')
    if (body.consArray) body.consArray = body.consArray.split('\r\n')
    if (body.scheduleArray) body.scheduleArray = body.scheduleArray.split('\r\n')

    const response = await mailer.sendEmail(body.email, req.user, {
      replyTo: body.replyTo,
      subject: 'Simple Transactional Email',
      context: body
    })

    res.render('message', {
      recruiterEmail: req.user.email,
      candidateEmail: body.email
    })
  })

}