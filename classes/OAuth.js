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
    oauth2Client.setCredentials({ refresh_token: refreshToken })
    return oauth2Client.refreshAccessToken()
  }

}

module.exports = OAuth
