import request from 'supertest';
import { expect } from 'chai';
import config from '../../src/config';
import * as mongoTestHelper from '../helpers/mongodb-test-helper';
import * as authHelper from '../helpers/auth-helper';
import * as userHelper from '../helpers/user-helper';

import app from '../../src/app';
// from http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
if(!module.parent){
	app.listen(config.port.testing);
}


describe('User route', function() {

	before(mongoTestHelper.before);

	beforeEach(done => {
		mongoTestHelper.beforeEach(() => {
			mongoTestHelper.populateDefaults(done);
		});
	});

	after(mongoTestHelper.after);

	describe('GET /users', function() {

		it('should list all users', function(done) {
			request(app)
				.get('/users')
				.end((err, res) => {
					expect(res.statusCode).to.equal(200);
					expect(res.body.data.length).to.equal(2);
					done();
				});
		});

	});

	describe('GET /users/:id', function() {

		let user, userId;

		beforeEach(function(done) {
			user = { email: 'laplaya@sniggelsnag.net', password: '123' };
			sendPOSTwith(userHelper.defaultUser).end((err, res) => {
				userId = res.body.data.id;
				done();
			});
		});

		it('should list a single user', function(done) {
			request(app)
				.get('/users/' +userId)
				.expect(200, done)
		});

		it('should respond with 404 when no user exists with the given id', done => {
			request(app).
				get('/users/746573742d757365722d303')
				.expect(404, done);
		});

	});



	describe('POST /users', function() {

		it('should add a new user', function(done) {

			sendPOSTwith({
				email: 'new-bean@sniggelsnag.net',
				password: '123'
			})
				.expect(201, done);
		});

		it('should respond with 500 when user already exists', function(done) {
			// send the POST request twice
			sendPOSTwith(userHelper.defaultUser)
				.end(function(err, res) {
					sendPOSTwith(userHelper.defaultUser)
						.expect(500, done);
				});
		});

		it('should respond with 422 when email field is empty', function(done) {
			sendPOSTwith({ password: 'xyz' })
				.expect(422, done);
		});

		it('should respond with 422 when password field is empty', function(done) {
			sendPOSTwith({ email: 'xyz@sniggelsnag.net' })
				.expect(422, done);
		});

	});

	describe('PUT /users/:id', function() {

		var user, user2;

		beforeEach(function(done) {
			user = { email: 'laplaya@sniggelsnag.net', password: '123' };
			user2 = { email: 'laboom@sniggelsnag.net', password: 'abc' };
			authHelper.registerUser(app, user, function() {
				authHelper.registerUser(app, user2, done);
			});
		});

		it('should update the user', done => {

			authHelper.authenticate(app, userHelper.defaultUsers[0], () => {
				request(app)
					.put('/users/' + userHelper.defaultUsers[0].id)
					.set('Authorization', authHelper.getAuthHeaderFor(userHelper.defaultUsers[0]))
					.send({ data: { attributes: { email: 'changed@sniggelsnag.net' } } })
					.end((err, res) => {
						expect(res.statusCode).to.equal(200);
						expect(res.body.data.attributes.email).to.equal('changed@sniggelsnag.net');
						done();
					});

			});

		});

		it('should require valid authorization data', function(done) {
			user.password = 'changed';
			request(app)
				.put('/users/' + user.id)
				.send(userHelper.toJsonAPI(user))
				.expect(401, {
					success: false,
					message: 'No access token.'
				},done);
		});

		it('should respond with an error when request comes from another user', function(done) {
			authHelper.authenticate(app, user2, function() {
				user.password = 'changed';
				request(app)
					.put('/users/' + user.id)
					.set('Authorization', authHelper.getAuthHeaderFor(user2))
					.send(userHelper.toJsonAPI(user))
					.expect(403, {
						success: false,
						message: 'Wrong user id.'
					}, done);
			});
		});

	});

});

function sendPOSTwith(user) {
	return request(app)
		.post('/users')
		.send(userHelper.toJsonAPI(user));
}
