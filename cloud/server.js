//Install express server
const express = require('express'),
  // compression = require('compression'),
  path = require('path'),
  redirect = require('parse-express-https-redirect');

const app = express();
// app.use(compression());
// Serve only the static files form the dist director
app.use(express.static('../public'));
app.use(redirect());
app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen();
