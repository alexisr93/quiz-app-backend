'use strict';
module.exports = function(app) {
  let quiz = require('../controllers/quizController');
  let user = require('../controllers/userController');

  app.route('/quizzes')
    .get(quiz.list_all_quizzes)
    .post(quiz.create_quiz);

  app.route('/quizzes/:quizId')
    .get(quiz.read_quiz)
    .put(quiz.update_quiz)
    .delete(quiz.delete_quiz);

  app.route('/signup')
    .post(user.signup_user);

  app.route('/login')
    .post(user.login_user)

  app.route('/user')
    .get(user.get_all_users)
    .put(user.update_user)
    .delete(user.delete_user);
};
