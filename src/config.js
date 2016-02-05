export default {
	port: {
		production: 3000,
		testing: 4444
	},
	tokenSecret: 'totallysecure',
	db: {
		development: 'mongodb://localhost/auth-endpoint',
		testing: 'mongodb://localhost/auth-endpoint-test'
	}
}
