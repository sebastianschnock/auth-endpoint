import _ from 'lodash';

// copied from https://github.com/sescobb27/jsonapi-serializer
export default function normalize(relationships) {
	var normalizedData = {};
	relationships = relationships || {};
	Object.keys(relationships).forEach((key) => {
		var relationData = relationships[key].data;
		if (!relationData) {
			return;
		}
		if (_.isArray(relationData)) {
			normalizedData[key] = relationData.map((relationObject) => relationObject.id);
		} else if (relationData.id) {
			normalizedData[_.camelCase(key)] = relationData.id;
		}
	});
	return normalizedData;
}
