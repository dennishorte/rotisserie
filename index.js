var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var pg = require('pg');

var parseurl = require('parseurl')
var session = require('express-session')


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
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

app.get('/', function(request, response) {
    response.render('pages/index');
});

app.get('/cool', function(request, response) {
    response.send(cool());
});

app.get('/db', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM test_table', function(err, result) {
            done();
            if (err) {
                console.error(err);
                response.send("Error " + err);
            }
            else {
                response.render('pages/db', {results: result.rows} );
            }
        });
    });
});

app.get('/foo', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})

app.get('/bar', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


