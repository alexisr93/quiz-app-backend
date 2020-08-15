const mongoose = require('mongoose');

const Quiz = mongoose.model('Quiz');
const User = mongoose.model('User');

exports.list_users_quizzes = (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) {
      res.send(err);
    }
    res.json(user.quizzes);
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
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) {
      res.send(err);
    }
    const quiz = user.quizzes.find((element) => element._id == req.params.id);
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
