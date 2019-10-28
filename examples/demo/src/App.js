import React, { Component, Fragment } from 'react';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider, connect, ReactReduxContext } from 'react-redux';
import { createStore } from 'redux';
import Demo from './games/Demo';
import Playground from './games/Playground';

const history = createBrowserHistory();

export default () => (
	<Router history={history}>
		<Switch>
			<Route component={Demo} path="/" exact />
			<Route component={Playground} path="/playground" exact />
		</Switch>
	</Router>
);
