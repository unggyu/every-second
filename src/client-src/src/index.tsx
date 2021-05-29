import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Controller from './Controller';

let controller = new Controller();
ReactDOM.render(<App controller={controller} />, document.getElementById('root'));
