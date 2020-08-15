module.exports = (app) => {
  const quiz = require('../controllers/quizController');
  const user = require('../controllers/userController');

  app.route('/quizzes')
    .post(quiz.create_quiz);

  app.route('/quizzes/:username')
    .get(quiz.list_users_quizzes)
    .delete(quiz.delete_quiz);

  app.route('/quiz/:username/:id')
    .put(quiz.add_question_to_quiz)
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
