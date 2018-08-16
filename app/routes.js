const controller = require('./controllers/user');

exports.init = app => {
  /* Method GET */
  app.get('/users', [], controller.list);
  /* Method PUT */
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  /* Method POST */
  app.post('/users', [], controller.save);
};
