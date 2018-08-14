// import User from '../../app/models/User';

// Require the dev-dependencies
const _ = require('lodash');
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const User = require('../app/models');
const server = require('./../app');

// const models = require('../../unit');

const should = chai.should();

// chai.use(chaiHttp);

// Our parent block
describe('Controller: Users', () => {
  const userTest = {};
  /* it.only('it should GET all the users', done => {
    chai
      .request(server)
      .get('/users')
      .end(res => {
        console.log('... EDUARDO ----> ');
        // res.should.have.status(200);
        // res.body.should.be.a('array');
        // res.body.length.should.be.eql(0);
        done();
      });
  }); */
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
  /*
  * Test the /GET route
  */
  /*
  describe('/GET user', () => {
    it('it should GET all the users', done => {
      chai
        .request(server)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(200);
          // res.body.should.be.a('array');
          // res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  */
});
