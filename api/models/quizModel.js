'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let QuizSchema = new Schema({
  title: String,
  description: String,
  created_by: String,
  questions: [{
    question: String,
    answer1: String,
    answer2: String,
    answer3: String,
    answer4: String,
    correct_answer: String
  }],
});

module.exports = mongoose.model('Quiz', QuizSchema);
