FieldUtils.addToBlocklyBlocks(FIELDS, Blockly);

var workspace = Blockly.inject('blockly', {
  toolbox: FieldUtils.addToBlocklyToolbox(
    FIELDS,
    document.getElementById('toolbox')
  )
});

var SampleLocalizableComponent = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  statics: {
    instances: [],
    updateImplementation: function(impl) {
      this.instances.forEach(function(instance) {
        instance.setState({impl: impl});
      });
    }
  },
  getInitialState: function() {
    return {impl: null};
  },
  componentDidMount: function() {
    this.constructor.instances.push(this);
  },
  componentWillUnmount: function() {
    var index = this.constructor.instances.indexOf(this);
    this.constructor.instances.splice(index, 1);
  },
  render: function() {
    if (!this.state.impl) return null;
    return React.createElement(this.state.impl, this.props);
  }
});

function saveWorkspace(workspace) {
  var dom = Blockly.Xml.workspaceToDom(workspace);
  var xml = Blockly.Xml.domToPrettyText(dom);
  try {
    window.sessionStorage['workspace_xml'] = xml;
  } catch (e) {
    console.log("Unable to save workspace", e);
  }
  return xml;
}

function getDefaultWorkspaceXML() {
  var dom = document.getElementById('default-workspace');
  return Blockly.Xml.domToPrettyText(dom);
}

function loadWorkspace(workspace) {
  var xml = window.sessionStorage['workspace_xml'] ||
            getDefaultWorkspaceXML();
  workspace.clear();
  if (!xml) return;
  var dom = Blockly.Xml.textToDom(xml);
  Blockly.Xml.domToWorkspace(workspace, dom);
}

function start() {
  var gui = new dat.GUI();
  var props = {
    host: 'Alice',
    gender_of_host: 'female',
    num_guests: 3,
    guest: 'Bob'
  };
  var dummyOnChange = function() {
    // We want textarea elements that allow the user to move their
    // cursor around and select text, which readOnly doesn't provide,
    // so we'll provide a dummy onChange handler so React doesn't complain.
  };
  var render = function() {
    React.render(
      <SampleLocalizableComponent {...props}/>,
      document.getElementById('react')
    );
  };

  workspace.addChangeListener(function() {
    var js = generateL10nComponent(
      FIELDS,
      Blockly.JavaScript.workspaceToCode(workspace)
    );
    React.render(
      <textarea value={'var LocalizedComponent = ' + js + ';'} onChange={dummyOnChange} style={{
        width: '100%',
        height: '10em'
      }} spellCheck={false}/>,
      document.getElementById('react-js')
    );

    var component = eval(js);

    SampleLocalizableComponent.updateImplementation(component);
    var xml = saveWorkspace(workspace);
    React.render(
      <textarea value={xml} onChange={dummyOnChange} style={{
        width: '100%',
        height: '10em'
      }} spellCheck={false}/>,
      document.getElementById('blockly-xml')
    );
  });
  loadWorkspace(workspace);
  FieldUtils.addToDatGUI(FIELDS, props, gui, {onChange: render});
  render();
}

document.getElementById('props').innerHTML = 
  React.renderToStaticMarkup(
    <ul>
      {FIELDS.map(function(info) {
        return (
          <li key={info.name}>
            <code>{info.name}</code> &mdash; {info.help}
            {info.required ? " Required." : null}
          </li>
        );
      })}
    </ul>
  );

start();
