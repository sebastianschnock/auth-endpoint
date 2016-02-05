export function handleError(err, req, res, next) {
	if(err.name === 'ValidationError') res.status(422);
	else res.status(500);
	res.end();
}
