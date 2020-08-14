const mongoose = require('mongoose');

const Quiz = mongoose.model('Quiz');
const User = mongoose.model('User');

exports.list_all_quizzes = (req, res) => {
  Quiz.find({}, (err, quiz) => {
    if (err) {
      res.send(err);
    }
    res.json(quiz);
  });
};

exports.create_quiz = (req, res) => {
  User.findOneAndUpdate(
    { username: req.body.createdBy },
    { $push: { quizzes: req.body } },
    { new: true }, (err, quiz) => {
      if (err) {
        res.send(err);
      }
      res.json(quiz);
  });
};

exports.read_quiz = (req, res) => {
  Quiz.findById(req.params.quizId, (err, quiz) => {
    if (err) {
      res.send(err);
    }
    res.json(quiz);
  });
};

exports.update_quiz = (req, res) => {
  Quiz.findOneAndUpdate({ _id: req.params.quizId }, req.body, { new: true }, (err, quiz) => {
    if (err) {
      res.send(err);
      console.log('Tried to updated, failed');
    }
    res.json(quiz);
  });
};

exports.delete_quiz = (req, res) => {
  Quiz.remove({
    _id: req.params.quizId,
  }, (err) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Quiz deleted' });
  });
};
