'use strict';

import JSONAPISerializer from 'jsonapi-serializer';
import mongoose from 'mongoose';

export function toJsonAPI(user) {
	return new JSONAPISerializer.Serializer('users', user, {
		attributes: ['email', 'password']
	});
}

export const defaultUser = {
	id: 1,
	email: 't-dog@sniggelsnag.net',
	password: 'pumpumpower'
};

export const defaultUsers = [{
	id: id('test-user-01'),
	email: 'test-user-01@sniggelsnag.net',
	password: '123'
}, {
	id: id('test-user-02'),
	email: 'test-user-02@sniggelsnag.net',
	password: '123'
}];

function id(value) {
	return new mongoose.Types.ObjectId(value);
}
