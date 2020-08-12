let express = require('express');
//Use morgan for logging
//Use joi for validation
let app = express();
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let Quiz = require('./api/models/quizModel');
let User = require('./api/models/userModel');

let port = process.env.PORT || 4000;


// Mongoose Connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quizdb', { useNewUrlParser: true, useUnifiedTopology: true });

//Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Import and register routes
let routes = require('./api/routes/routes');
routes(app);

//Default when route not found
app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port, function() {
  console.log('RESTful API server started on port: ' + port);
});
