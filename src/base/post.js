import _ from 'lodash';
import jsonApiDeserializer from './jsonapi-deserializer';
import normalize from './jsonapi-normalizer';


// takes a mongoose model and a serializer with 'serialize' function
export function handlePost(model, serializer, deserializer = jsonApiDeserializer) {
	return (req, res, next) => {

		// deserialize and normalize input data
		let data = deserializer.deserialize(req.body);
		_.merge(data, normalize(req.body.data.relationships));

		// create entry
		model.create(data).then(entry => {
			const serialized = serializer.serialize(entry.toObject());
			return res.status(201).send(serialized);
		}, err => {
			next(err);
		});
	}
}
