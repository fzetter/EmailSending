const keys = require('@config/config')
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2 (
  keys.googleClientID,
  keys.googleClientSecret,
  'https://developers.google.com/oauthplayground'
)

class OAuth {

  static getAccessToken (refreshToken) {
    try {
      
      oauth2Client.setCredentials({ refresh_token: refreshToken })
      const token = oauth2Client.refreshAccessToken()
      return Promise.resolve(token)

    } catch (err) { return Promise.reject(err) }
  }

}

module.exports = OAuth
