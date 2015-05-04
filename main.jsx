var workspace = Blockly.inject('blockly', {
  toolbox: document.getElementById('toolbox')
});

var SampleLocalizableComponent = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  propTypes: fieldsToPropTypes(FIELDS),
  statics: {
    instances: [],
    updateRenderMethod: function(js) {
      console.log('updateRenderMethod', js);
      this.instances.forEach(function(instance) {
        instance.setState({renderMethod: js});
      });
    }
  },
  getInitialState: function() {
    return {renderMethod: ''};
  },
  componentDidMount: function() {
    this.constructor.instances.push(this);
  },
  componentWillUnmount: function() {
    var index = this.constructor.instances.indexOf(this);
    this.constructor.instances.splice(index, 1);
  },
  render: function() {
    var children = this.state.renderMethod
                   ? eval(this.state.renderMethod)(this, [])
                   : [];
    return React.createElement(
      'span',
      {},
      children
    );
  }
});

var Main = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Hi.</h1>
        <SampleLocalizableComponent host="Alice" gender_of_host="female" num_guests={0}/>
      </div>
    );
  }
});

React.render(
  <Main/>,
  document.getElementById('react')
);

workspace.addChangeListener(function() {
  var lines = Blockly.JavaScript.workspaceToCode(workspace).split('\n');

  var js = (
    '(function(component, children) {\n' +
    lines.map(function(line) {
      return '  ' + line;
    }).join('\n') +
    '\n' + 
    '  return children;\n' +
    '})\n'
  );
  SampleLocalizableComponent.updateRenderMethod(js);
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
    num_guests: 0,
    guest: ''
  };
  var render = function() {
    React.render(
      <SampleLocalizableComponent {...props}/>,
      document.getElementById('react')
    );
  };

  FIELDS.forEach(function(info) {
    var args = [props, info.name];
    if (info.choices)
      args.push(info.choices);
    var controller = gui.add.apply(gui, args);
    controller.onChange(render);
    controller.title(info.help);
  });

  render();
}

loadWorkspace(workspace);
start();
