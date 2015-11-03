var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
    res.render('index', {});
});

app.post('/send/sms', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    sendSMS(req.body.to, req.body.message, function (err) {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        return res.redirect('/');
    });
});


var server = app.listen(7000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('smsblast app listening at http://%s:%s', host, port);

    sendSMS('9084586568', 'message to send', function (err) {
        if (err) console.error(err);
        else console.log('sent!');
    });
});

function sendSMS(to, message, cb) {
    require('child_process').exec('./smsblast -t ' + to + ' -m ' + message,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
                return cb(error);
            }
            return cb();
        });

    setTimeout(function () {
        return cb('Timeout');
    }, 5000);

}