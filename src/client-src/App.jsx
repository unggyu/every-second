/**
 * @author Tomer Riko Shalev
 */

import React from 'react'

import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import cyan from '@material-ui/core/colors/cyan';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: cyan,
        secondary: pink,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    status: {
        danger: 'orange',
    },
    typography: {
        // In Japanese the characters are usually larger.
        fontSize: 12,
    },
})

const styles = {
    root: {
        width: '100%',
        height: '100vh'
    }
}

/**
 * main app component
 *
 */
export default class App extends React.Component {
    _controller = undefined

    constructor(props) {
        super(props)

        // controller
        this._controller = props.controller
    }

    /**
     * get controller
     *
     * @return {Controller}
     */
    get controller() {
        return this._controller
    }

    /**
     * execute the plugin
     *
     * @param  {type} options description
     */
    onExecutePlugin = (options) => {
        console.log('App:: onExecutePlugin')
        // here disable UI
        this._controller.invokePlugin(options)
        // here enable ui
    }

    render() {

        return (
            <div style={styles.root}>
                <MuiThemeProvider theme={theme}>
                    <div></div>
                </MuiThemeProvider>
            </div>
        )

    }

}
