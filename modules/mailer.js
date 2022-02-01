const fs = require("fs")
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const keys = require('@config/config')
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2

// const axios = require('axios')
// const querystring = require('querystring')

// const getAccessToken = async refreshToken => {
//   try {
//     console.log('inside access token ', refreshToken)
//     const accessTokenObj = await axios.post(
//       'https://www.googleapis.com/oauth2/v4/token',
//       querystring.stringify({
//         refresh_token: refreshToken,
//         client_id: keys.googleClientID,
//         client_secret: keys.googleClientSecret,
//         grant_type: 'refresh_token'
//       })
//     )
//     console.log('inside access token ', accessTokenObj)
//     return accessTokenObj.data.access_token
//   } catch (err) { console.log(err) }
// }

module.exports.sendEmail = (emails, user, params) => {
  return new Promise(async (resolve, reject) => {

    let transporter, hbsOptions, mailOptions

    // Obtain An Access Token
    const oauth2Client = new OAuth2 (
      keys.googleClientID,
      keys.googleClientSecret,
      'https://developers.google.com/oauthplayground'
    )

    oauth2Client.setCredentials({ access_token: user.accessToken, refresh_token: user.refreshToken, expiry_date: true })
    const accessToken = oauth2Client.refreshAccessToken()

    // const accessToken = await getAccessToken(user.refreshToken)
    //
    // resolve({message: 'Email sent', sentTo: []})

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
