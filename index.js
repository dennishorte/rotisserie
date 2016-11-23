var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var pg = require('pg');

var parseurl = require('parseurl')
var session = require('express-session')

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(session({
  store: new (require('connect-pg-simple')(session))(),
  secret: 'reallybadsecret9824942', //process.env.FOO_COOKIE_SECRET,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days 
}));
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true
// }))
app.use(function (req, res, next) {
  var views = req.session.views

  if (!views) {
    views = req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  views[pathname] = (views[pathname] || 0) + 1

  next()
})

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

require('./lib/routes.js')(app);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


