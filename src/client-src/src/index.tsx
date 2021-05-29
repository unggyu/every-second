import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Controller from './Controller';
import '../assets/css/style.css';
import '../assets/fonts/typeface-roboto/index.css';
import '../assets/fonts/material-icons/index.css';

let controller = new Controller();
ReactDOM.render(<App controller={controller} />, document.getElementById('root'));
