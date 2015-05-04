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

workspace.addChangeListener(function() {
  var componentJs = generateL10nComponent(
    FIELDS,
    Blockly.JavaScript.workspaceToCode(workspace)
  );
  console.log(componentJs);
  var component = eval(componentJs);

  SampleLocalizableComponent.updateImplementation(component);
  saveWorkspace(workspace);
});

function saveWorkspace(workspace) {
  var dom = Blockly.Xml.workspaceToDom(workspace);
  var xml = Blockly.Xml.domToPrettyText(dom);
  try {
    window.sessionStorage['workspace_xml'] = xml;
  } catch (e) {
    console.log("Unable to save workspace", e);
  }
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
  var render = function() {
    React.render(
      <SampleLocalizableComponent {...props}/>,
      document.getElementById('react')
    );
  };

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

loadWorkspace(workspace);
start();
