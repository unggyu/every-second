import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import Controller from './Controller'

import './assets/fonts/typeface-roboto/index.css';
import './assets/fonts/material-icons/index.css';
import './assets/css/style.css';

var controller = new Controller();
ReactDOM.render(<App controller={controller}/>,
                document.getElementById('root')
)
