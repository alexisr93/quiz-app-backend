const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  title: String,
  description: String,
  createdBy: String,
  questions: [{
    question: String,
    answer1: String,
    answer2: String,
    answer3: String,
    answer4: String,
    correct_answer: String,
  }],
});

module.exports = mongoose.model('Quiz', QuizSchema);
