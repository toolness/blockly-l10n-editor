function generateL10nComponent(fields, rawCode) {
  var lines = [];
  var renderLines = rawCode.split('\n').map(function(line) {
    return '      ' + line;
  });
  var propTypesLines = FieldUtils.toPropTypesJs(fields).split('\n')
    .slice(1, -1).map(function(line) {
      return '  ' + line
    });

  lines = [
    'React.createClass({',
    '  propTypes: {',
    propTypesLines.join('\n'),
    '  },',
    '  render: function() {',
    "    return React.createElement('span', {}, (function() {",
    '      var c = [];',
    renderLines.join('\n'),
    '      return c;',
    '    }).call(this));',
    '  }',
    '})'
  ];

  return lines.join('\n');
}
