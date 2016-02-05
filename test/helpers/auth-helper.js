'use strict';

import request from 'supertest';
import * as userHelper from './user-helper';
// holds all generated access tokens
var tokens = {};

export function registerUser(app, user, done) {
	request(app)
		.post('/users')
		.send(userHelper.toJsonAPI(user))
		.end(function(err, res) {
			if(err) throw err;
			if(res.body.data) user.id = res.body.data.id;
			if(done !== undefined) done();
		});
}

export function authenticate(app, user, done) {

	request(app)
		.post('/authenticate')
		.send({
			email: user.email,
			password: user.password
		})
		.end(function(err, res) {
			tokens[user.email] = res.body.token;
			done();
		});
}

export function authorize(app, user) {

	if(user === undefined) user = userHelper.defaultUser;

	return request(app)
		.set('Authorization', 'Bearer ' + tokens[user.email]);
}

export function getAuthHeaderFor(user) {
	return 'Bearer ' + tokens[user.email];
}
