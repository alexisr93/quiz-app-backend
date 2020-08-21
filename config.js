const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  port: process.env.PORT,
  tokenSecret: process.env.TOKEN_SECRET,
};
