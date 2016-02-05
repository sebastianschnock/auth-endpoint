// I'm currenlty on this branch:
// https://github.com/sescobb27/jsonapi-serializer
import JSONAPISerializer from 'jsonapi-serializer';

export default {
	deserialize(data) {
		return new JSONAPISerializer.DeSerializer({}, data);
	}
}
