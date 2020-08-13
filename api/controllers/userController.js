const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
// Move this into a .env
const TOKEN_SECRET = 'a;lskjfijuasbnhfjlasjkdfhpuiajeighjaksljkfh9348ut89ghuesjrkldvf-8954huasdf';

exports.signup_user = (req, res) => {
  const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),

    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),

    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: {
          allow: ['com', 'net'],
        },
      }),
  });

  let result;

  if (req.body.username && req.body.password && req.body.email) {
    result = schema.validate(req.body);
  } else {
    return res.json('Error: No Data');
  }

  if (result.error === undefined) {
    User.findOne({
      username: req.body.username,
    }, (err, user) => {
      if (err) {
        res.send(err);
      } else {
        if (user) {
          res.json('User already in database');
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
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
                    // TODO do not send back hashed password
                    res.json(user);
                  }
                });
              }
            });
          });
        }
      }
    });
  } else {
    res.json(result.error);
  }
  return res.json('Error');
};

exports.login_user = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({ error: 'Need username and password' });
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

            jwt.sign(payload, TOKEN_SECRET, { expiresIn: '1d' }, (err, token) => {
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
  if (req.body.username && req.body.email) {
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
  } else {
    res.json('Error: No Data');
  }
};

exports.delete_user = (req, res) => {
  if (req.body.username) {
    User.remove({
      username: req.body.username,
    }, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: `User ${req.body.username} deleted` });
      }
    });
  } else {
    res.json('Error, delete failed');
  }
};
