var express = require('express')
var app = express()
var passport = require('passport')

passport.use(new GoogleStrategy({  
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

passport.serializeUser(function(user, done) {  
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {  
    db.findUserById(id, function(err, user) {
        done(err, user);
    });
});

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/auth/google', passport.authenticate('google',  
    { scope: ['https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'] }),
    function(req, res){} // this never gets called
);

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});

// 1010495456237-c74fogd59ic309bqldq63vgfag8vl9ju.apps.googleusercontent.com
// HAJD0vasxZrAi4NfCpAcpAIQ
