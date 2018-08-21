const controller = require('./controllers/user');

exports.init = app => {
  app.get('/users', [], controller.getUsers);
  app.post('/users', [], controller.postUser);
  app.get('/user/:id', [], controller.getUser);
  app.delete('/user/:id', [], controller.deleteUser);
  app.put('/user/:id', [], controller.updateUser);
};
