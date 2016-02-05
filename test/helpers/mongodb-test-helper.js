'use strict';

import mongoose from 'mongoose';
import async from 'async';
import _ from 'lodash';
import config from '../../src/config';
import encrypt from '../../src/helpers/encrypt';
import User from '../../src/models/user';
import { defaultUsers } from './user-helper';


export function before() {
	mongoose.connect(config.db.testing);
}

export function beforeEach(done) {

	// clear db
	for(var i in mongoose.connection.collections) {
		mongoose.connection.collections[i].remove(function() {});
	}
	done();
}

export function after(done) {
	mongoose.disconnect(() => {
		mongoose.connection.close(done);
	});
}

export function createUser(data, done) {
	let model = new User(data);
	model.save(() => { done(model._id) });
}

export function populateDefaults(done) {

	let users = _.cloneDeep(defaultUsers);

	function convertId(model) {
		model._id = model.id;
	}

	function convertIds(models) {
		return _.forEach(models, convertId);
	}

	function encryptPasswords(users, done) {
		async.each(users, (user, callback) => {
			encrypt(user.password, encrypted => {
				user.password = encrypted;
				callback();
			});
		}, done);
	}

	// insert everything
	encryptPasswords(convertIds(users), () => {
		User.collection.insert(users, done);
	});
}
