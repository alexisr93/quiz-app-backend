const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./api/routes/routes');
const Quiz = require('./api/models/quizModel');
const User = require('./api/models/userModel');
const { port } = require('./config.js');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quizdb', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register routes
routes(app);

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

app.listen(port, () => {
  console.log(`RESTful API server started on port: ${port}`);
});
