import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Controller from './Controller';
import { ScriptLoader, Session } from '../../session/src';
import '../assets/css/style.css';
import '../assets/fonts/typeface-roboto/index.css';
import '../assets/fonts/material-icons/index.css';
import {
    Theme,
    ThemeOptions,
    MuiThemeProvider,
    createMuiTheme
} from '@material-ui/core/styles/index';
import { pink, red, cyan } from '@material-ui/core/colors/index';

declare global {
    interface Window {
        session: Session;
        scriptLoader: ScriptLoader;
    }
}

let controller = new Controller();
window.session = controller.session;
window.scriptLoader = controller.session.scriptLoader;

let theme: Theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: cyan,
        secondary: pink,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2
    },
    status: {
        danger: 'orange',
    },
    typography: {
        // In Japanese the characters are usually larger.
        fontSize: 12,
    },
} as ThemeOptions);

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <App controller={controller} />
    </MuiThemeProvider>,
    document.getElementById('root'));
