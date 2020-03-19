//Install express server
express = require('express'),
  compression = require('compression'),
  // enforce = require('express-sslify'),
  path = require('path');

const app = express();
// app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(compression());
// Serve only the static files form the dist director
app.use(express.static('../public'));

app.use(function (req, res, next) {
  console.log('req.secure', req.secure, req.url);
  if (!req.secure) {
    return res.redirect(`https://angular-socket.back4app.io${req.url}`);
  }
  next();
});

app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen();
