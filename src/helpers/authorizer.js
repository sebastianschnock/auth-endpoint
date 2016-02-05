import jwt from 'jsonwebtoken';
import config from '../config';

function extractAccessToken(req) {

	var authHeader = req.headers.authorization;
	if(authHeader === undefined) {
		return undefined;
	}

	var authData = authHeader.split(' ');
	if(authData.length !== 2 || authData[0] !== 'Bearer') {
		return undefined;
	}

	return authData[1];
}

function handleSuccessfulVerification(decoded, req, next) {
	// save for further routes (needed?)
	req.decoded = decoded;
	req.user = decoded.user;
	next();
}

function handleNoAccessToken(res) {
	res.status(401).send({
		success: false,
		message: 'No access token.'
	});
}

function handleWrongAccessToken(res) {
	res.status(401).send({
		success: false,
		message: 'Wrong access token.'
	});
}

export default function authorize() {

	return function(req, res, next) {

		var token = extractAccessToken(req);
		if(token === undefined) return handleNoAccessToken(res);

		jwt.verify(token, config.tokenSecret, function(err, decoded) {
			if(err) return handleWrongAccessToken(res);
			handleSuccessfulVerification(decoded, req, next);
		})
	}
}
