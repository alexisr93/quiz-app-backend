'use strict';
let mongoose = require('mongoose');
let User = mongoose.model('User');
let Joi = require('joi');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
//Move this into a .env
const TOKEN_SECRET = 'a;lskjfijuasbnhfjlasjkdfhpuiajeighjaksljkfh9348ut89ghuesjrkldvf-8954huasdf';

exports.signup_user = function(req, res) {
  const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  });

  const result = schema.validate(req.body);

  if (result.error === undefined) {
    User.findOne({
      username: req.body.username
    }, function (err, user) {
      if (err) {
        res.send(err);
      }
      else {
        if (user) {
          res.json('User already in database');
        }
        else {
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hashedPassword) {
              if (err) {
                res.json(err);
              }
              else {
                let newUser = new User({
                  username: req.body.username,
                  password: hashedPassword,
                  email: req.body.email
                });
              }

              newUser.save(function(err, user) {
                if (err) {
                  res.json(err);
                }
                else {
                  res.json(user);
                }
              });
            });
          });
        }
      }
    });
  }
  else {
    res.json(result.error);
  }

};

exports.login_user = function(req, res) {
  User.findOne({ username: req.body.username }, function(err, user) {
    if (err) {
      res.json(err);
    }
    else {
      bcrypt.compare(req.body.password, user.password)
        .then((result) => {
          if (result) {
            const payload = {
              _id: user._id,
              username: user.username
            };

            jwt.sign(payload, TOKEN_SECRET, {
              expiresIn: '1d'
            }, (err, token) => {
              if (err) {
                res.json(err);
              }
              else {
                res.json(token);
              }
            });
          }
          else {
            res.json(result);
          }
        })
    }
  });
};


exports.get_all_users = function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.json(err);
    }else {
      let userList = users.map(function(user) {
        return {
          _id: user._id,
          username: user.username,
          email: user.email
        }
      });
      res.json(userList);
    }
  });
};

exports.update_user = function(req, res) {
  User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user) {
    if (err){
      res.send(err);
    }
    res.json(user);
  });
};

exports.delete_user = function(req, res) {
  User.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err){
      res.send(err);
    }
    else {
      res.json({ message: 'User deleted' });
    }
  });
};
