const express = require('express');
// Use morgan for logging
// Use joi for validation
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./api/routes/routes');

const port = process.env.PORT || 4000;

// Mongoose Connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quizdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register routes
routes(app);

// Default when route not found
app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

app.listen(port, () => {
  console.log(`RESTful API server started on port: ${port}`);
});
