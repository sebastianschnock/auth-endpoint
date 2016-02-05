import bcrypt from 'bcrypt';

export default function(value, done) {
	// generate salt
	bcrypt.genSalt(function(err, salt) {
		if(err) throw err;
		// encrypt with salt
		bcrypt.hash(value, salt, function(err, hash) {
			if(err) throw err;
			done(hash);
		})
	});
}
