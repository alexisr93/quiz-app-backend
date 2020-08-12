'use strict';

let mongoose = require('mongoose');
let Quiz = mongoose.model('Quiz');

exports.list_all_quizzes = function(req, res) {
  Quiz.find({}, function(err, quiz) {
    if (err){
      res.send(err);
      console.log("Touched quizzes endpoint with error");
    }
    res.json(quiz);
    console.log("Touched quizzes endpoint");
  });
};

exports.create_quiz = function(req, res) {
  let new_quiz = new Quiz(req.body);
  new_quiz.save(function(err, quiz) {
    if (err){
      res.send(err);
    }
    res.json(quiz);
  });
};

exports.read_quiz = function(req, res) {
  Quiz.findById(req.params.quizId, function(err, quiz) {
    if (err){
      res.send(err);
    }
    res.json(quiz);
  });
};

exports.update_quiz = function(req, res) {
  Quiz.findOneAndUpdate({_id: req.params.quizId}, req.body, {new: true}, function(err, quiz) {
    if (err){
      res.send(err);
      console.log("Tried to updated, failed")
    }
    res.json(quiz);
  });
};

exports.delete_quiz = function(req, res) {
  Quiz.remove({
    _id: req.params.quizId }, function(err, quiz) {
    if (err){
      res.send(err);
    }
    res.json({ message: 'Quiz deleted' });
  });
};
