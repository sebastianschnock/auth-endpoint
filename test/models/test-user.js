'use strict';

import { expect } from 'chai';
import * as mongoTestHelper from '../helpers/mongodb-test-helper';
import userModel from '../../src/models/user';
import { defaultUser, defaultUsers } from '../helpers/user-helper';

describe('User model', function() {

	before(mongoTestHelper.before);
	beforeEach(done => {
		mongoTestHelper.beforeEach(() => {
			mongoTestHelper.populateDefaults(done);
		});
	});
	after(mongoTestHelper.after);

	it('should hash passwords before saving', function(done) {
		let oldPassword = defaultUser.password;
		let user = new userModel(defaultUser);
		user.save(function(err) {
			if(err) throw err;
			expect(user.password).to.not.equal(oldPassword);
			done();
		});
	});

	it('should hash passwords before updating', function(done) {
		userModel.findByIdAndUpdate(defaultUsers[0].id, { password: 'new'}, function(err) {
			userModel.findById(defaultUsers[0].id, (err, user) => {
				expect(user.password).to.not.equal('123');
				expect(user.password).to.not.equal('new');
				done();
			});
		});
	});


	it('should compare successfully with the correct password', function() {
		let user = new userModel(defaultUser);
		user.comparePassword(defaultUser.password, function(err, isMatch) {
			expect(err).to.be.undefined;
			expect.isMatch.to.be.true;
		})
	});

	it('should compare unsuccessfully with the wrong password', function() {
		let user = new userModel(defaultUser);
		user.comparePassword('wrong password', function(err, isMatch) {
			expect(err).to.be.undefined;
			expect.isMatch.to.be.false;
		})
	});
});
