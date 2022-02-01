const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('@config/config')

passport.serializeUser((data, done) => done(null, data))
passport.deserializeUser((data, done) => done(null, data))

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback',
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      proxy: true
    },
    async (accessToken, refreshToken, params, profile, done) => {
      try {

        const user = {
          id: profile.id,
          email: profile._json.email,
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresIn: params.expires_in,
          displayName: profile.displayName
        }

        done(null, user)

      } catch (err) { done(err, null) }
    }
  )
)
