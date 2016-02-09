import './assets/style/main.less';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import PolyFill from 'babel-polyfill';

import EditorComponent from './components/editor';
import ViewerComponent from './components/viewer';

const App = React.createClass({
  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
});

render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={ EditorComponent } />
      <Route path="leraar" component={ ViewerComponent } />
    </Route>
  </Router>
), document.getElementById('container'));