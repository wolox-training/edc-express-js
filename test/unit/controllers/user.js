// Require the dev-dependencies
const _ = require('lodash');
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const User = require('../../../app/models');
const server = require('../../../app');
const userFactory = require('../../factories/user');

const should = chai.should();

describe('Controller: Users POST, `src/controller/user`', async () => {
  let userTest = {};
  beforeEach(async () => {
    userTest = await userFactory.default();
  });
  it('POST: it should create user. (happy path)', async () => {
    const response = await chai
      .request(server)
      .post('/users')
      .send(userTest);
    expect(response).to.have.status(200);
    expect(response.body.message).to.equal('Created user.');
  });
  it('POST: it should don`t create user. Domain of email isn`t "wolox".', async () => {
    _.set(userTest, 'email', 'emailTest@isnt_wolox.com');
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Domain of email is not valid.']);
      });
  });
  it('POST: it should don`t create user. Password isn`t length requied.', async () => {
    _.set(userTest, 'password', '');
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Password length is not in this range.']);
      });
  });
  it('POST: it should don`t create user. Password require alphanumeric value.', async () => {
    _.set(userTest, 'password', 'àsd/qwe"@wolox.com');
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Password require alphanumeric value.']);
      });
  });
  it('POST: it should don`t create user. Email isn`t unique.', async () => {
    await chai
      .request(server)
      .post('/users')
      .send(userTest);
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['email must be unique']);
      });
  });
  it('POST: it should don`t create user. Attribute email isn`t valid.', async () => {
    _.set(userTest, 'email', 'emailTest wolox.com');
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Validation isEmail on email failed']);
      });
  });
  it('POST: it should don`t create user. FirstName, lastName, email and password are attributes don`t passed on request.', async () => {
    _.unset(userTest, 'firstName');
    _.unset(userTest, 'lastName');
    _.unset(userTest, 'email');
    _.unset(userTest, 'password');
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members([
          'User.firstName cannot be null',
          'User.lastName cannot be null',
          'User.email cannot be null',
          'User.password cannot be null'
        ]);
      });
  });
});

describe('Controller: Users GET, `src/controller/user`', () => {
  it('GET: it should return list of users exist in data base. (happy path)', async () => {
    const users = await userFactory.listOfUsers();
    await users.reduce(async (promise, user) => {
      await promise;
      await chai
        .request(server)
        .post('/users')
        .send(await user);
    }, Promise.resolve());
    // TODO: validate with password decrypted...
    const response = await chai.request(server).get('/users');
    const responseBody = response.body.map(item => {
      const { firstName, lastName, email } = item;
      return { firstName, lastName, email };
    });
    const responseUsers = users.map(item => {
      const { firstName, lastName, email } = item;
      return { firstName, lastName, email };
    });
    expect(response).to.have.status(200);
    expect(responseBody).to.have.deep.members(responseUsers);
  });
  it('GET: it should return a empty list of users when not exist in data base.', async () => {
    const response = await chai.request(server).get('/users');
    expect(response).to.have.status(200);
    expect(response.body).to.be.empty;
  });
});

describe('Controller: User GET by Id, `src/controller/user/:id`', () => {
  it('GET: it should return empty, user when not exist in data base.', async () => {
    const response = await chai.request(server).get('/user/1');
    expect(response).to.have.status(200);
    expect(response.body).to.be.empty;
  });
  it('GET: it should return a object user when exist in data base.', async () => {
    const user = await userFactory.default();
    await chai
      .request(server)
      .post('/users')
      .send(await user);
    const response = await chai.request(server).get('/user/1');
    const responseBody = { firstName: user.firstName, lastName: user.lastName, email: user.email };
    const { firstName, lastName, email } = user;
    expect(response).to.have.status(200);
    expect(responseBody).to.deep.equal({ firstName, lastName, email });
  });
});

describe('Controller: User DELETE by Id, `src/controller/user/:id`', () => {
  it('DELETE: it should return result of user, when exist in data base and was deleted.', async () => {
    await chai
      .request(server)
      .post('/users')
      .send(await userFactory.default());
    const response = await chai.request(server).delete('/user/1');
    expect(response).to.have.status(200);
    expect(response.body.message).to.be.equal('User was deleted');
  });
  it('DELETE: it should return empty, user when not exist in data base.', async () => {
    await chai
      .request(server)
      .delete('/user/1')
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body).to.be.empty;
      });
  });
});

describe('Controller: User UPDATE by Id, `src/controller/user/:id`', () => {
  it('UDPATE: it should return result of user, when exist in data base and was updated.', async () => {
    const user = await userFactory.default(),
      userId = 1,
      firstName = 'Crhis',
      lastName = 'Garris',
      email = 'custom@wolox.com';
    await chai
      .request(server)
      .post('/users')
      .send(user);
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    const response = await chai
      .request(server)
      .put('/user/1')
      .send(user);
    expect(response).to.have.status(200);
    expect(response.body.message).to.equal('User was updated');
    expect(response.body.user.id).to.equal(userId);
    expect(response.body.user.firstName).to.equal(firstName);
    expect(response.body.user.lastName).to.equal(lastName);
    expect(response.body.user.email).to.equal(email);
  });
  it('UDPATE: it should return a message, when not exist in data base and was not updated.', async () => {
    const user = await userFactory.default(),
      firstName = 'Crhis',
      lastName = 'Garris',
      email = 'custom@wolox.com';
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    const response = await chai
      .request(server)
      .put('/user/1')
      .send(user)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.be.empty;
      });
  });
});
