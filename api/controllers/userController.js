const { tokenSecret } = require('../../config.js');
const joiSchema = require('./validationSchemas.js');
const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

exports.signup_user = (req, res) => {
  let validation = joiSchema.signupSchema.validate(req.body);

  if (validation.error) {
    return res.status(400).send({ error: 'Bad data' });
  }

  User.findOne({
    username: req.body.username,
  }, (err, user) => {
    if (err) {
      res.send(err);
    } else if (user) {
      res.json('User already in database');
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          res.json(err);
        } else {
          const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
          });

          newUser.save((err, user) => {
            if (err) {
              res.json(err);
            } else {
              res.json({ message: "Success" });
            }
          });
        }
      });
    }
  });
};

exports.login_user = (req, res) => {
  let validation = joiSchema.loginUserSchema.validate(req.body);

  if (validation.error) {
    return res.status(400).send({ error: 'Need username and/or password' });
  }

  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      return res.json(err);
    }
    if (user) {
      bcrypt.compare(req.body.password, user.password)
        .then((result) => {
          if (result) {
            const payload = {
              _id: user._id,
              username: user.username,
            };

            jwt.sign(payload, tokenSecret, { expiresIn: '1d' }, (err, token) => {
              if (err) {
                return res.json(err);
              }
              return res.json({ token });
            });
          } else {
            return res.status(403).send({ error: 'Username and/or password does not match' });
          }
        });
    } else {
      return res.json('Error, did not find user');
    }
  });
};

exports.get_all_users = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.json(err);
    } else {
      const userList = users.map((user) => {
        return ({
          _id: user._id,
          username: user.username,
          email: user.email,
        });
      });
      res.json(userList);
    }
  });
};

exports.update_user = (req, res) => {
  let validation = joiSchema.updateUserSchema.validate(req.body);

  if (validation.error) {
    return res.status(400).send({ error: 'Need username' });
  }

  User.findOneAndUpdate({
    username: req.body.username,
  },
  {
    username: req.body.username,
    email: req.body.email,
  }, { new: true }, (err) => {
    if (err) {
      res.send(err);
    }
    res.json('Success');
  });
};

exports.delete_user = (req, res) => {
  let validation = joiSchema.deleteUserSchema.validate(req.body);

  if (validation.error) {
    return res.status(400).send({ error: "Need username" });
  }

  User.deleteOne({
    username: req.body.username,
  }, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: `User ${req.body.username} deleted` });
    }
  });
};
