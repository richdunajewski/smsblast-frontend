var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var options = {
    port: 7000,
    timeout: 15000,
    credentialsFile: 'gv_credentials.json'
};

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


var server = app.listen(options.port || 7000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('smsblast app listening at http://%s:%s', host, port);
});

function sendSMS(to, message, cb) {
    var Filesystem = require('machinepack-fs');

    Filesystem.readJson({
        source: options.credentialsFile,
        schema: '*'
    }).exec({
        error: function (err) {
            return cb(err);
        },
        doesNotExist: function () {
            return cb('Credentials file ' + options.credentialsFile + ' does not exist');
        },
        couldNotParse: function () {
            return cb('Unable to parse credentials file ' + options.credentialsFile);
        },
        success: function (data) {
            var responseSent = false;

            var command = '';
            var platform = require('os').platform();
            switch (platform) {
                case 'win32':
                    command = 'python C:\\Python27\\Scripts\\gvoice -e ' + data.GVACCT + ' -p ' + data.GVPASS + ' send_sms ' + to + ' "' + message + '"';
                    break;
                case 'linux':
                case 'darwin':
                    command = 'gvoice -e ' + data.GVACCT + ' -p ' + data.GVPASS + ' send_sms ' + to + ' "' + message + '"';
                    break;
                default:
                    return cb('ERROR: Unknown OS type: ' + platform);
                    break;
            }

            require('child_process').exec(command,
                function (error, stdout, stderr) {
                    console.log(stdout);
                    console.log(stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                        responseSent = true;
                        return cb(error);
                    }
                    responseSent = true;
                    return cb();
                });

            setTimeout(function () {
                if (!responseSent) return cb('Command timeout');
            }, options.timeout);
        }
    });
}
