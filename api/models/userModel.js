'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  quizzes: [{
      id: Number,
      title: String,
      description: String,
      is_public: Boolean,
      questions: [{
        question: String,
        answer1: String,
        answer2: String,
        answer3: String,
        answer4: String,
        correct_answer: String
      }],
  }],
  results: [{
    date_take: Date,
    quiz_taken_title: String,
    quiz_score: Number
  }]
});

module.exports = mongoose.model('User', UserSchema);
