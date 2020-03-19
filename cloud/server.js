//Install express server
express = require('express'),
  compression = require('compression'),
  enforce = require('express-sslify'),
  path = require('path');

const app = express();
app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(compression());
// Serve only the static files form the dist director
app.use(express.static('../public'));

app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen();
