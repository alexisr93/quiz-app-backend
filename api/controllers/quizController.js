const mongoose = require('mongoose');
const joiSchema = require('./validationSchemas.js');
const Joi = require('joi');

const Quiz = mongoose.model('Quiz');
const User = mongoose.model('User');

exports.list_users_quizzes = (req, res) => {
  let validation = joiSchema.listUsersQuizzesSchema.validate(req.params);

  if (validation.error) {
    return res.status(400).send({ error: 'Need username' });
  }

  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) {
      res.send(err);
    }
    res.json(user.quizzes);
  });
};

exports.create_quiz = (req, res) => {
  let validation = joiSchema.createQuizSchema.validate(req.body);

  if (validation.error) {
    return res.status(400).send({ error: 'Bad data' });
  }

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
  let validation = joiSchema.readQuizSchema.validate(req.params);

  if (validation.error) {
    return res.status(400).send({ error: 'Need username and/or quizId' });
  }

  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) {
      res.send(err);
    }
    const quiz = user.quizzes.find((element) => element._id == req.params.quizId);
    res.json(quiz);
  });
};

exports.add_question_to_quiz = (req, res) => {
  let validation = joiSchema.addQuestionToQuizSchema.validate({ ...req.params, ...req.body });

  if (validation.error) {
    return res.status(400).send(validation.error);
  }

  User.findOne({ username: req.params.username }, (err, user) =>{
    if (err) {
      res.send(err);
    }
    const quizIndex = user.quizzes.findIndex((element) => element._id == req.params.quizId);

    user.save(user.quizzes[quizIndex].questions.push({
      'question': req.body.question,
      'option1': req.body.option1,
      'option2': req.body.option2,
      'option3': req.body.option3,
      'option4': req.body.option4,
      'correctAnswer': req.body.correctAnswer,
    }));

    res.json(user.quizzes[quizIndex]);
  });
};

exports.update_question = (req, res) => {
  let validation = joiSchema.updateQuestionSchema.validate({ ...req.params, ...req.body });

  if (validation.error) {
    return res.status(400).send({ error: 'Bad data' });
  }

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
      'option1': req.body.option1,
      'option2': req.body.option2,
      'option3': req.body.option3,
      'option4': req.body.option4,
      'correctAnswer': req.body.correctAnswer,
    });

    res.json(user.quizzes[quizIndex]);
  });
};

exports.delete_question = (req, res) => {
  let validation = joiSchema.deleteQuestionSchema.validate({ ...req.params, ...req.body });

  if (validation.error) {
    return res.status(400).send({ error: 'Bad data' });
  }

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

exports.update_quiz_data = (req, res) => {
  let validation = joiSchema.updateQuizDataSchema.validate({ ...req.params, ...req.body });

  if (validation.error) {
    return res.status(400).send({ error: 'Bad data' });
  }

  User.findOneAndUpdate(
    { "username": req.params.username, "quizzes._id": req.body.id },
    { "quizzes.$.title": req.body.quizTitle, "quizzes.$.description": req.body.quizDescription },
    (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json('ok');
  });
};

exports.delete_quiz = (req, res) => {
  let validation = joiSchema.deleteQuizSchema.validate({ ...req.params, ...req.body });

  if (validation.error) {
    return res.status(400).send({ error: 'Bad data' });
  }

  User.update(
    { "username": req.params.username },
    { $pull: { "quizzes": { "_id": req.body.id }}},
    (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json('ok');
  });
};
