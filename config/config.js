module.exports = {
  env: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 8081,
  cookieKey: process.env.COOKIE_KEY,
  googleUser: process.env.GOOGLE_USER,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleAccessToken: process.env.GOOGLE_ACCESS_TOKEN,
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN
}
