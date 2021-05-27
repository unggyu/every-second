import React from 'react';

import { Button, TextField } from '@material-ui/core';
import { pink, red, cyan } from '@material-ui/core/colors';
import { makeStyles, createStyles } from '@material-ui/core/styles';

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
});

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: '100%',
        height: '100vh'
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

/**
 * main app component
 *
 */
export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            interval: 1
        }
        this._controller = props.controller;
        this.classes = useStyles();
    }

    /**
     * get controller
     *
     * @return {Controller}
     */
    get controller() {
        return this._controller;
    }

    onClickEditStartBtn = async () => {
        try {
            const result = await this._controller.startEdit({
                interval: 3,
                numberOfClipsToMultiply: 10,
                toEndOfTheVideo: true
            });
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }

    handleIntervalChange(e) {
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        this.setState({
            interval: onlyNums
        });
    }

    render() {
        return (
            <div className={this.classes.root}>
                <MuiThemeProvider theme={theme}>
                    <div className={this.classes.flexContainer}>
                        <TextField
                            label="Time interval between clips (seconds)"
                            onChange={this.handleIntervalChange}
                            value={this.state.interval}/>
                        <Button onClick={this.onClickEditStartBtn}>
                            StartEdit
                        </Button>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
