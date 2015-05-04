Blockly.Blocks['react_component_print'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    this.setColour(Blockly.Blocks.texts.HUE);
    this.interpolateMsg(Blockly.Msg.TEXT_PRINT_TITLE,
                        ['TEXT', null, Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);
  }
};

Blockly.JavaScript['react_component_print'] = function(block) {
  var argument0 = Blockly.JavaScript.valueToCode(block, 'TEXT',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'children.push(' + argument0 + ');\n';
};

FIELDS.forEach(function(info) {
  var blockName = 'field_' + info.name;
  Blockly.Blocks[blockName] = {
    init: function() {
      this.appendDummyInput().appendField(info.name);
      if (info.type === React.PropTypes.number) {
        this.setOutput(true, 'Number');
      } else if (info.type === React.PropTypes.string) {
        this.setOutput(true, 'String');
      } else {
        throw new Error("Don't know how to set output for " + info.name);
      }
      this.setTooltip(info.help);
    }
  };
  Blockly.JavaScript[blockName] = function(block) {
    return [
      'component.props.' + info.name,
      Blockly.JavaScript.ORDER_ATOMIC
    ];
  };
});
