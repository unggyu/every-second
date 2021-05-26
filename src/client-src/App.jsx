import React from 'react';

import { Button } from '@material-ui/core';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import cyan from '@material-ui/core/colors/cyan';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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
        console.log(this._controller);
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

    onClickEditStartBtn = () => {
        this._controller.startEdit({
            interval: 3,
            numberOfClipsToMultiply: 10,
            toEndOfTheVideo: true
        });
    }
    
    onClickTestBtn = async () => {
        try {
            const result = await this._controller.test();
            console.log('App::onClickTestBtn result: ' + result);
        } catch (err) {
            console.log(err);
        }
    }

    onClickTestWithArgsBtn = async () => {
        try {
            const result = await this._controller.testWithArgs();
            console.log('App::onClickTestWithArgsBtn result: ' + result);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div style={styles.root}>
                <MuiThemeProvider theme={theme}>
                    <div>
                        <Button onClick={this.onClickEditStartBtn}>
                            StartEdit
                        </Button>
                        <Button onClick={this.onClickTestBtn}>
                            Test
                        </Button>
                        <Button onClick={this.onClickTestWithArgsBtn}>
                            Test With Args
                        </Button>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
