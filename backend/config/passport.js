import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Function to register Google OAuth Strategy
export const registerGoogleStrategy = () => {
  // Check if already registered
  if (passport._strategies && passport._strategies.google) {
    return true;
  }

  // Only initialize if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    try {
      // Construct callback URL - must be absolute for Google OAuth
      let callbackURL = process.env.GOOGLE_CALLBACK_URL;
      
      // Determine backend URL (check Railway, then BACKEND_URL, then default to localhost)
      let backendUrl = process.env.BACKEND_URL;
      
      // Railway provides RAILWAY_PUBLIC_DOMAIN (without https://)
      if (!backendUrl && process.env.RAILWAY_PUBLIC_DOMAIN) {
        backendUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
      }
      
      // Fallback to localhost for development
      if (!backendUrl) {
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const port = process.env.PORT || 5000;
        backendUrl = port === '443' || port === '80' 
          ? `${protocol}://localhost` 
          : `${protocol}://localhost:${port}`;
      }
      
      // If GOOGLE_CALLBACK_URL is relative (starts with /), construct full URL
      if (callbackURL && callbackURL.startsWith('/')) {
        callbackURL = `${backendUrl}${callbackURL}`;
      }
      // If not set, use default
      else if (!callbackURL) {
        callbackURL = `${backendUrl}/api/auth/google/callback`;
      }
      // If already absolute (starts with http:// or https://), use as-is
      
      console.log(`🔗 Google OAuth callback URL: ${callbackURL}`);
      
      passport.use(
        'google',
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: callbackURL,
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              // Check if user already exists with this Google ID
              let user = await User.findOne({ googleId: profile.id });

              if (user) {
                // User exists, return user
                return done(null, user);
              }

              // Check if user exists with this email (from Google)
              user = await User.findOne({ email: profile.emails[0].value.toLowerCase() });

              if (user) {
                // User exists with email but no Google ID, link accounts
                user.googleId = profile.id;
                user.provider = 'google';
                user.emailVerified = true; // Google emails are verified
                // Auto-authorize on first Google login if not already authorized
                if (!user.isAuthorized) {
                  user.isAuthorized = true;
                }
                await user.save();
                return done(null, user);
              }

              // Create new user (will need email verification before login)
              user = await User.create({
                name: profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName,
                email: profile.emails[0].value.toLowerCase(),
                googleId: profile.id,
                provider: 'google',
                emailVerified: false, // Will be verified after clicking email link
                isAuthorized: true, // Auto-authorize after first sign up
              });

              return done(null, user);
            } catch (error) {
              return done(error, null);
            }
          }
        )
      );
      console.log('✅ Google OAuth strategy registered successfully');
      return true;
    } catch (error) {
      console.error('❌ Error registering Google OAuth strategy:', error.message);
      return false;
    }
  } else {
    // Google OAuth is optional - app works fine without it
    // Only shows this once on startup, not an error
    if (process.env.NODE_ENV === 'development') {
      console.log('ℹ️  Google OAuth not configured (optional). "Sign in with Google" will be disabled.');
      console.log('   To enable: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
      console.log('   See GOOGLE_OAUTH_SETUP.md for setup instructions');
    }
    return false;
  }
};

// Register strategy on module load
registerGoogleStrategy();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

