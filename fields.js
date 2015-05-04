var FIELDS = [
  {
    name: 'host',
    type: React.PropTypes.string,
    required: true,
    help: 'The name of the party host.',
  },
  {
    name: 'gender_of_host',
    type: React.PropTypes.string,
    required: true,
    choices: ['male', 'female', 'other'],
    help: 'The gender of the party host. Can be "male", "female", or "other".'
  },
  {
    name: 'num_guests',
    type: React.PropTypes.number,
    required: true,
    help: 'The number of guests invited to the party. 0 if the host does not give a party.'
  },
  {
    name: 'guest',
    type: React.PropTypes.string,
    required: false,
    help: 'The name of one of the party guests. Blank if the host does not give a party.'
  }
];

function fieldsToPropTypes(fields) {
  var propTypes = {};

  fields.forEach(function(info) {
    propTypes[info.name] = info.required
                           ? info.type.isRequired
                           : info.type;
    if (typeof(propTypes[info.name]) == 'undefined') {
      throw new Error('prop type for ' + info.name + ' is invalid');
    }
  });

  return propTypes;
}
