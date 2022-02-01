const fs = require("fs")
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const keys = require('@config/config')
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2

module.exports.sendEmail = (emails, user, params) => {
  return new Promise((resolve, reject) => {

    let transporter, hbsOptions, mailOptions

    // Obtain An Access Token
    const oauth2Client = new OAuth2 (
      keys.googleClientID,
      keys.googleClientSecret,
      'https://developers.google.com/oauthplayground'
    )

    oauth2Client.setCredentials({ refresh_token: user.refreshToken })
    const accessToken = oauth2Client.refreshAccessToken()

    // SMTP Transport
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        clientId: keys.googleClientID,
        clientSecret: keys.googleClientSecret
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
      from: `<${keys.googleUser}>`,
      to: emails,
      cc: params.cc,
      subject: params.subject,
      template: 'email',
      context: params.context,
      auth: {
        user: user.email,
        accessToken: accessToken,
        refreshToken: user.refreshToken
      }
    }

    if (params.replyTo) mailOptions.replyTo = params.replyTo

    // Send Email
    transporter.sendMail(mailOptions, (err, res) => {
      if (err) return reject(new Error(`${err}`))
      else return resolve({message: 'Email sent', sentTo: res.accepted})
      transporter.close()
    })

  })
}
