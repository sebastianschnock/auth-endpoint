import express from 'express';
import jsonapify from 'jsonapify';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import config from '../config';

var router = express.Router();

router.post('/authenticate',

	function(req, res, next) {

		User.findOne({ email: req.body.email }, function(err, user) {

			if(err) return next(err);

			if(!user) sendUserNotFound(res);

			else {
				user.comparePassword(req.body.password, function(err, isMatch) {
					if(err) return next(err);
					if(!isMatch) sendWrongPassword(res);
					else sendSuccess(res, user);
				});
			}
		});
	},
	jsonapify.errorHandler()
);

function sendSuccess(res, user) {
	var token = jwt.sign(buildTokenData(user), config.tokenSecret, {
		expiresIn: 1440
	});
	res.json({
		success: true,
		message: 'Authentication succeeded.',
		token: token,
		uid: user._id
	});
}

function sendUserNotFound(res) {
	res.status(401).json({
		success: false,
		message: 'Authentication failed. User not found.'
	});
}

function sendWrongPassword(res) {
	res.status(401).json({
		success: false,
		message: 'Authentication failed. Wrong password.'
	});
}

function buildTokenData(user) {
	return {
		user: {
			id: user._id
		}
	};
}

export default router;
