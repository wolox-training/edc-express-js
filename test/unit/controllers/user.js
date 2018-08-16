// Require the dev-dependencies
const _ = require('lodash');
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const User = require('../../../app/models');
const server = require('../../../app');

const should = chai.should();

// Our parent block
describe('Controller: Users, `src/controller/user`', () => {
  const userTest = {};
  beforeEach(() => {
    _.set(userTest, 'firstName', 'firstNameTest');
    _.set(userTest, 'lastName', 'lastNameTest');
    _.set(userTest, 'email', 'emailTest@wolox.com');
    _.set(userTest, 'password', 'passwordTest');
  });
  it('POST: it should create user. (happy path)', done => {
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Created user.');
        done();
      });
  });
  it('POST: it should don`t create user. Domain of email isn`t "wolox".', done => {
    _.set(userTest, 'email', 'emailTest@isnt_wolox.com');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.message).to.include.members(['Domain of email is not valid.']);
        done();
      });
  });
  it('POST: it should don`t create user. Password isn`t length requied.', done => {
    _.set(userTest, 'password', '');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.message).to.include.members(['Password length is not in this range.']);
        done();
      });
  });
  it('POST: it should don`t create user. Password require alphanumeric value.', done => {
    _.set(userTest, 'password', 'àsd/qwe"@wolox.com');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.message).to.include.members(['Password require alphanumeric value.']);
        done();
      });
  });
  it('POST: it should don`t create user. Email isn`t unique.', done => {
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .end(() => {
        chai
          .request(server)
          .post('/users')
          .send(userTest)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.include.members(['email must be unique']);
            done();
          });
      });
  });
  it('POST: it should don`t create user. Attribute email isn`t valid.', done => {
    _.set(userTest, 'email', 'emailTest wolox.com');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.message).to.include.members(['Validation isEmail on email failed']);
        done();
      });
  });
  it('POST: it should don`t create user. FirstName, lastName, email and password are attributes don`t passed on request.', done => {
    _.unset(userTest, 'firstName');
    _.unset(userTest, 'lastName');
    _.unset(userTest, 'email');
    _.unset(userTest, 'password');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.message).to.include.members([
          'User.firstName cannot be null',
          'User.lastName cannot be null',
          'User.email cannot be null',
          'User.password cannot be null'
        ]);
        done();
      });
  });
});
