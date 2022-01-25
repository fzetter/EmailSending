const fs = require("fs")
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

module.exports.sendEmail = (emails, params) => {
  return new Promise((resolve, reject) => {

    let transporter, hbsOptions, mailOptions
    const fromEmail = process.env.GOOGLE_EMAIL

    // SMTP Transport
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: fromEmail,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
      }
    })

    // HBS Options
    hbsOptions = {
      viewEngine: {
        extname: '.html',
        layoutsDir: 'modules/views/',
        defaultLayout: params.template,
        partialsDir: 'modules/views/partials/'
      },
      viewPath: 'modules/views/',
      extName: '.html'
    }

    transporter.use('compile', hbs(hbsOptions))

    // Email Setup
    mailOptions = {
      from: `"Test" <${fromEmail}>`,
      to: emails.join(),
      subject: params.subject,
      template: params.template,
      context: params.context
    }

    // Send Email
    transporter.sendMail(mailOptions, (err, res) => {
      if (err) return reject(new Error(`Mailer: Email could not be sent. Error: ${err}`))
      else return resolve({message: 'Email sent', sentTo: res.accepted})
      transporter.close()
    })

  })
}
