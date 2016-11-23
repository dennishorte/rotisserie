
module.exports = function (app) {
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
};
