const axios = require('axios')
const querystring = require('querystring')

const getAccessToken = async refreshToken => {
  try {

    const accessToken = await axios.post(
      'https://www.googleapis.com/oauth2/v4/token',
      querystring.stringify({
        refresh_token: refreshToken,
        client_id: keys.googleClientID,
        client_secret: keys.googleClientSecret,
        grant_type: 'refresh_token'
      })
    )

    return accessToken.data.access_token

  } catch (e) { throw new Error(e) }
}
