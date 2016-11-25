const React = require('react');
const ReactDOM = require('react-dom');
var Hello = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

module.exports = {
  render: function(){
    ReactDOM.render(
      <Hello name="World" />,
      document.getElementById('container')
    );
  }
}
