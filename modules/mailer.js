const fs = require("fs")
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const keys = require('@config/config')

module.exports.sendEmail = (emails, params) => {
  return new Promise((resolve, reject) => {

    let transporter, hbsOptions, mailOptions

    // SMTP Transport
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: keys.googleUser,
        clientId: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        accessToken: keys.googleAccessToken,
        refreshToken: keys.googleRefreshToken
      }
    })

    // HBS Options
    hbsOptions = {
      viewEngine: {
        extname: '.html',
        layoutsDir: 'views/',
        defaultLayout: 'email',
        partialsDir: 'views/partials/'
      },
      viewPath: 'views/',
      extName: '.html'
    }

    transporter.use('compile', hbs(hbsOptions))

    // Email Setup
    mailOptions = {
      from: `"Test" <${keys.googleUser}>`,
      to: emails,
      replyTo: params.replyTo,
      subject: params.subject,
      template: 'email',
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
