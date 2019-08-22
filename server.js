//Install express server
const express = require('express'),
compression = require('compression'),
path = require('path');

const app = express();
app.use(compression());
// Serve only the static files form the dist directory
app.use(express.static('./dist/angular-socket'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname,'/dist/angular-socket/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
