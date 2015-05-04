var FIELDS = [
  {
    name: 'host',
    type: 'string',
    required: true,
    help: 'The name of the party host.',
  },
  {
    name: 'gender_of_host',
    type: 'string',
    required: true,
    choices: ['male', 'female', 'other'],
    help: 'The gender of the party host. Can be "male", "female", or "other".'
  },
  {
    name: 'num_guests',
    type: 'number',
    required: true,
    help: 'The number of guests invited to the party. 0 if the host does not give a party.'
  },
  {
    name: 'guest',
    type: 'string',
    required: false,
    help: 'The name of one of the party guests. Blank if the host does not give a party.'
  }
];

var FieldUtils = {
  blockNameForField: function(name) {
    return 'field_' + name;
  },
  toPropTypeReactString: function(field) {
    var result;

    if (field.type == 'string') {
      result = 'React.PropTypes.string';
    } else if (field.type == 'number') {
      result = 'React.PropTypes.number';
    } else {
      throw new Error('unkown field type: ' + field.type);
    }

    if (field.required) {
      result += '.isRequired';
    }

    return result;
  },
  toPropTypesJs: function(fields) {
    var lines = fields.map(function(info) {
      return '  ' + info.name + ': ' + this.toPropTypeReactString(info)
    }, this);
    return '{\n' + lines.join(',\n') + '\n}';
  },
  toPropTypes: function(fields) {
    var propTypes = eval('(' + this.toPropTypesJs(fields) + ')');

    fields.forEach(function(info) {
      if (typeof(propTypes[info.name]) == 'undefined') {
        throw new Error('prop type for ' + info.name + ' is invalid');
      }
    });

    return propTypes;
  },
  addToBlocklyToolbox: function(fields, toolbox) {
    fields.forEach(function(info) {
      var el = document.createElement('block');
      el.setAttribute('type', this.blockNameForField(info.name));
      toolbox.appendChild(el);
    }, this);
    return toolbox;
  },
  addToBlocklyBlocks: function(fields, Blockly) {
    fields.forEach(function(info) {
      var blockName = this.blockNameForField(info.name);
      Blockly.Blocks[blockName] = {
        init: function() {
          this.appendDummyInput().appendField(info.name);
          if (info.type === 'number') {
            this.setOutput(true, 'Number');
          } else if (info.type === 'string') {
            this.setOutput(true, 'String');
          } else {
            throw new Error("Don't know how to set output for " + info.name);
          }
          this.setTooltip(info.help);
        }
      };
      Blockly.JavaScript[blockName] = function(block) {
        return [
          'this.props.' + info.name,
          Blockly.JavaScript.ORDER_ATOMIC
        ];
      };
    }, this);
  },
  addToDatGUI: function(fields, props, gui, options) {
    options = options || {};
    fields.forEach(function(info) {
      var args = [props, info.name];
      if (info.choices)
        args.push(info.choices);
      var controller = gui.add.apply(gui, args);
      if (typeof(options.onChange) == 'function') {
        controller.onChange(options.onChange);
      }
      if (typeof(controller.tooltip) == 'function') {
        controller.tooltip(info.help);
      }
    });
  }
};
