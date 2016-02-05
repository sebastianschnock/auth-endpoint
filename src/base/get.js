// takes a mongoose model and a serializer with 'serialize' function
export function handleGet(model, serializer) {
	return (req, res, next) => {

		model.findById(req.params.id).lean().exec((err, entry) => {
			if(err) {
				// wrong id format
				if(err.name === 'CastError' && err.path === '_id')
					return res.status(404).end();
				next(err);
			}
			if(!entry) return res.status(404).end();
			const serialized = serializer.serialize(entry);
			return res.send(serialized);
		});
	}
}

export function handleGetAll(model, serializer) {
	return (req, res, next) => {

		// use lean to get plain json
		// http://mongoosejs.com/docs/api.html#query_Query-lean
		model.find().lean().exec(function(err, entries) {
			if(err) next(err);
			if(!entries) return res.status(404).end();
			const serialized = serializer.serialize(entries);
			return res.send(serialized);
		});
	}
}
