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
    const quiz = user.quizzes.find((element) => element._id == req.params.quizId);
    res.json(quiz);
  });
};

exports.add_question_to_quiz = (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) =>{
    if (err) {
      res.send(err);
    }
    const quizIndex = user.quizzes.findIndex((element) => element._id == req.params.quizId);

    user.save(user.quizzes[quizIndex].questions.push({
      'question': req.body.question,
      'answer1': req.body.answer1,
      'answer2': req.body.answer2,
      'answer3': req.body.answer3,
      'answer4': req.body.answer4,
      'correct_answer': req.body.correctAnswer,
    }));

    res.json(user.quizzes[quizIndex]);
  });
};

exports.update_question = (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) =>{
    if (err) {
      res.send(err);
    }
    // This is not the way it should be done using mongodb/mongoose
    const quizIndex = user.quizzes.findIndex((element) => element._id == req.params.quizId);
    const questionList = user.quizzes[quizIndex].questions;
    const questionIndex = questionList.findIndex((element) => element._id == req.body.questionId);

    user.save(user.quizzes[quizIndex].questions[questionIndex] = {
      'question': req.body.question,
      'answer1': req.body.answer1,
      'answer2': req.body.answer2,
      'answer3': req.body.answer3,
      'answer4': req.body.answer4,
      'correct_answer': req.body.correctAnswer,
    });

    res.json(user.quizzes[quizIndex]);
  });
};

exports.delete_question = (req, res) => {
  User.update(
    { "username": req.params.username, "quizzes._id": req.params.quizId },
    { $pull: { "quizzes.$.questions": { "_id": req.body.questionId }}},
    (err) => {
      if (err) {
        res.send(err);
      }
      res.json('ok');
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
