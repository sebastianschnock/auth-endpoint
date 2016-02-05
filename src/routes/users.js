import express from 'express';
import User from '../models/user';
import authorize from '../helpers/authorizer';

// I'm currenlty on this branch:
// https://github.com/sescobb27/jsonapi-serializer
import JSONAPISerializer from 'jsonapi-serializer';

import { handleGet, handleGetAll } from '../base/get';
import { handlePost } from '../base/post';
import { handlePatch } from '../base/patch';


// helpers

function protectedSelf() {
	return function (req, res, next) {
		if(req.params.id !== req.user.id) {
			return res.status(403).send({
				success: false,
				message: 'Wrong user id.'
			});
		}
		next();
	}
}

function removeEmptyPasswords() {
	return (req, res, next) => {
		if(req.body.data.attributes.hasOwnProperty('password')) {
			if(typeof password !== String) {
				delete req.body.data.attributes.password;
			}
		}
		next();
	}
}


// serializers

let UserSerializer = {
	serialize(data) {
		return new JSONAPISerializer.Serializer('users', data, {
			id: '_id',
			attributes: ['email']
		})
	}
};



// configure router

var router = express.Router();

router.get('/users',
	handleGetAll(User, UserSerializer)
);

router.get('/users/:id',
	handleGet(User, UserSerializer)
);

router.post('/users',
	handlePost(User, UserSerializer)
);

router.put('/users/:id',
	authorize(),
	protectedSelf(),
	removeEmptyPasswords(),
	handlePatch(User, UserSerializer)
);

export default router;
