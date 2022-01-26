const config = require('@config/config')
const mailer = require('@modules/mailer.js')

module.exports = app => {

  app.get('/about', (req, res) => {
    res.status(200).send({
      name: 'DSP Email Sending',
      environment: config.env,
    })
  })

  app.get('/', (req, res) => {
    res.render('index', { title: 'Node Tutorial' })
  })

  app.post('/', async (req, res) => {
    const body = req.body
    body.prosArray = body.prosArray.split('\r\n')
    body.consArray = body.consArray.split('\r\n')

    const response = await mailer.sendEmail(body.email, {
      replyTo: body.replyTo,
      subject: 'Simple Transactional Email',
      context: body
    })

    res.render('message', {
      replyTo: body.replyTo,
      email: body.email
    })

  })

}
