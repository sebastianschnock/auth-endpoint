'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import encrypt from '../helpers/encrypt';

var schema = mongoose.Schema({
	email: {
		type: String,
		index: { unique: true },
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

// TODO add validation for passwords

// hash passwords
schema.pre('save', function(next) {
	var user = this;

	// skip if password is not changed
	if(!user.isModified('password')) return next();

	encrypt(user.password, encrypted => {
		user.password = encrypted;
		next();
	});
});

// hash passwords
schema.pre('findOneAndUpdate', function(next) {
	if(this.getUpdate().hasOwnProperty('password')) {
		encrypt(this.getUpdate().password, encrypted => {
			// from https://github.com/Automattic/mongoose/issues/964
			this.findOneAndUpdate({}, { password: encrypted });
			next();
		});
	} else {
		next();
	}
});

schema.pre('update', function(next) {
	throw new Error('not implemented! must hash password!');
});


// validate passwords
schema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
}

export default mongoose.model('User', schema);
