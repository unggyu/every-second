import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Controller from './Controller';
import { ScriptLoader, Session } from '../../session-src/src';
import '../assets/css/style.css';
import '../assets/fonts/typeface-roboto/index.css';
import '../assets/fonts/material-icons/index.css';

declare global {
    interface Window {
        session: Session;
        scriptLoader: ScriptLoader;
    }
}

let controller = new Controller();
window.session = controller.session;
window.scriptLoader = controller.session.scriptLoader;

ReactDOM.render(<App controller={controller} />, document.getElementById('root'));
