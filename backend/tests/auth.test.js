const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server'); // app.js cần export app = express()

chai.use(chaiHttp);
const expect = chai.expect;

it('should register user', async function () {
  this.timeout(1000);
})

describe('Auth API', () => {
  it('should register user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'example977@example.com',
        password: '123456'
      })
      .end((err, res) => {
        try {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('accessToken');
          expect(res.body.data).to.have.property('refreshToken');
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('should login user and return token', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'example977@example.com',
        password: '123456'
      })
    .end((err, res) => {
      try {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('accessToken');
        expect(res.body.data).to.have.property('refreshToken');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  // it('should refresh token', (done) => {
  //   chai.request(app)
  //     .post('/api/v1/auth/refresh-token')
  //     .send({
  //       refreshToken: ""
  //     })
  //   .end((err, res) => {
  //     expect(res).to.have.status(401);
  //     expect(res.body).to.have.property('success', false);
  //     expect(res.body).to.have.property('message', 'Refresh token is required');
  //     done();
  //   });
  // })

  // it('should logout user', (done) => {
  //   chai.request(app)
  //     .post('/api/v1/auth/logout')
  //     .send({
  //       refreshToken: ""
  //     })
  //   .end((err, res) => {
  //     expect(res).to.have.status(401);
  //     expect(res.body).to.have.property('success', false);
  //     expect(res.body).to.have.property('message', 'Refresh token is required');
  //     done();
  //   });
  // });

});