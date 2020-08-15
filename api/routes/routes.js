module.exports = (app) => {
  const quiz = require('../controllers/quizController');
  const user = require('../controllers/userController');

  app.route('/quizzes')
    .post(quiz.create_quiz);

  app.route('/quizzes/:username')
    .get(quiz.list_users_quizzes)
    .put(quiz.update_quiz)
    .delete(quiz.delete_quiz);

  app.route('/quiz/:username/:id')
    .get(quiz.read_quiz);

  app.route('/signup')
    .post(user.signup_user);

  app.route('/login')
    .post(user.login_user);

  app.route('/user')
    .get(user.get_all_users)
    .put(user.update_user)
    .delete(user.delete_user);
};
