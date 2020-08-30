const Joi = require('joi');

exports.signupSchema = Joi.object({
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


// Can combine these two into one
exports.loginUserSchema = Joi.object({
  username: Joi.string()
    .required(),
  password: Joi.string()
    .required(),
});

exports.updateUserSchema = Joi.object({
  username: Joi.string()
    .required(),
  email: Joi.string()
    .required(),
});

// Can combine these three into one
exports.deleteUserSchema = Joi.object({
  username: Joi.string()
    .required(),
});

exports.listUsersQuizzesSchema = Joi.object({
  username: Joi.string()
    .required(),
});

exports.createQuizSchema = Joi.object({
  createdBy: Joi.string()
    .required(),
  title: Joi.string()
    .required(),
  description: Joi.string()
    .required(),
});

exports.readQuizSchema = Joi.object({
  username: Joi.string()
    .required(),
  quizId: Joi.string()
    .required(),
});

exports.addQuestionToQuizSchema = Joi.object({
  username: Joi.string()
    .required(),
  quizId: Joi.string()
    .required(),
  question: Joi.string()
    .required(),
  option1: Joi.string()
    .required(),
  option2: Joi.string()
    .required(),
  option3: Joi.string()
    .required(),
  option4: Joi.string()
    .required(),
  correctAnswer: Joi.string()
    .required(),
});

exports.updateQuestionSchema = Joi.object({
  username: Joi.string()
    .required(),
  quizId: Joi.string()
    .required(),
  questionId: Joi.string()
    .required(),
  question: Joi.string()
    .required(),
  option1: Joi.string()
    .required(),
  option2: Joi.string()
    .required(),
  option3: Joi.string()
    .required(),
  option4: Joi.string()
    .required(),
  correctAnswer: Joi.string()
    .required(),
});

exports.deleteQuestionSchema = Joi.object({
  username: Joi.string()
    .required(),
  quizId: Joi.string()
    .required(),
  questionId: Joi.string()
    .required()
});

exports.updateQuizDataSchema = Joi.object({
  username: Joi.string()
    .required(),
  id: Joi.string()
    .required(),
  quizTitle: Joi.string()
    .required(),
  quizDescription: Joi.string()
    .required(),
});

exports.deleteQuizSchema = Joi.object({
  username: Joi.string()
    .required(),
  id: Joi.string()
    .required(),
});
