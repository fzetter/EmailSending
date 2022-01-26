const config = require('@config/config')
const mailer = require('@modules/mailer.js')

module.exports = app => {

  app.post('/email/send', async (req, res) => {

    const emails = req.body.emails
    const params = {
      replyTo: 'fernanda.zetter@agileengine.com',
      subject: 'Simple Transactional Email',
      context: req.body
    }

    const response = await mailer.sendEmail(emails, params)
    res.status(200).send(response)
  })

}
