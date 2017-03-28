import React from 'react';
//import { Meteor } from 'meteor/meteor';
//import { render } from 'react-dom';

//import App from '../imports/ui/App.jsx';
export default class Test extends React.Component {
  render() {
    return (
      <h1>Hello {this.props.name ? this.props.name : 'World'} !</h1>

    );
  }
}

//Meteor.startup(() => {
  //render(<App />, document.getElementById('render-target'));
//});
