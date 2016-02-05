import _ from 'lodash';
import jsonApiDeserializer from './jsonapi-deserializer';
import normalize from './jsonapi-normalizer';

// takes a mongoose model and a serializer with 'serialize' function
export function handlePatch(model, serializer, deserializer = jsonApiDeserializer) {
	return (req, res, next) => {

		// deserialize and normalize input data
		let data = deserializer.deserialize(req.body);
		_.merge(data, normalize(req.body.data.relationships));

		// update entry
		model.findByIdAndUpdate(req.params.id, data, { new: true }, (err, entry) => {
			if(err) {
				// wrong id format
				if(err.name === 'CastError' && err.path === '_id')
					return res.status(404).end();
				next(err);
			}
			if(!entry) return res.status(404).end();
			const serialized = serializer.serialize(entry.toObject());
			res.send(serialized);
		});
	}
}
