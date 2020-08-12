'use strict';
module.exports = function(app) {
  var user = require('../controllers/userController');

  app.route('/user')
    .get(user.list_all_quizzes)
    .post(user.create_a_quiz);

  app.route('/user/:quizId')
    .get(user.read_a_quiz)
    .put(user.update_a_quiz)
    .delete(user.delete_a_quiz);
};
