const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  quizzes: [{
    id: Number,
    title: String,
    description: String,
    createdBy: String,
    is_public: Boolean,
    questions: [{
      question: String,
      option1: String,
      option2: String,
      option3: String,
      option4: String,
      correctAnswer: String,
    }],
  }],
  results: [{
    dateQuizTaken: Date,
    quizTitle: String,
    quizScore: Number,
  }],
});

module.exports = mongoose.model('User', UserSchema);
