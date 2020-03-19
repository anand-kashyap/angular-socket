
// These two lines are required to initialize Express in Cloud Code.
express = require('express');
app = express();

// Global app configuration section
// app.set('views', 'cloud/views');  // Specify the folder to find templates
// app.set('view engine', 'ejs');    // Set the template engine
// app.use(express.bodyParser());    // Middleware for reading request body

app.use(express.static('../public'));

app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname, '../public/index.html'));
});
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
// app.get('/hello', function(req, res) {
//   res.render('hello', { message: 'Congrats, you just set up your app!' });
// });

app.listen();
