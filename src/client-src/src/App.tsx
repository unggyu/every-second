import React, { Component, ChangeEvent } from 'react';
import { Button, TextField, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core/index';
import { pink, red, cyan } from '@material-ui/core/colors/index';
import {
    createStyles,
    withStyles,
    WithStyles,
    MuiThemeProvider,
    createMuiTheme,
    Theme,
    ThemeOptions
} from '@material-ui/core/styles/index';
import Controller, { EverySecondEditData } from './Controller';

let theme: Theme = createMuiTheme({
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
} as ThemeOptions);

let styles = ((theme: Theme) => createStyles({
    root: {
        width: '100%',
        height: '100vh'
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

interface AppProps extends WithStyles<typeof styles> {
    controller: Controller;
}

interface AppState extends EverySecondEditData { }

/**
 * main app component
 *
 */
class App extends Component<AppProps, AppState> {
    private controller: Controller;
    private classes: AppProps['classes'];

    constructor(props: AppProps) {
        super(props);

        this.state = {
            interval: 1,
            clipsToMultipy: 0,
            toEndOfTheVideo: true
        }

        this.controller = props.controller;
        this.classes = props.classes;

        this.handleIntervalChange = this.handleIntervalChange.bind(this);
        this.handleClipsToMultipyChange = this.handleClipsToMultipyChange.bind(this);
        this.handleToEndOfTheVideoChange = this.handleToEndOfTheVideoChange.bind(this);
    }

    removeNotNumbers(str: string): string {
        return str.replace(/[^0-9]/g, '');
    }

    onClickEditStartBtn = async (): Promise<void> => {
        try {
            const result = await this.controller.startEdit(this.state);
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }

    handleIntervalChange(e: ChangeEvent<HTMLInputElement>) {
        const onlyNums = this.removeNotNumbers(e.target.value);
        this.setState({
            interval: +onlyNums
        });
    }

    handleClipsToMultipyChange(e: ChangeEvent<HTMLInputElement>) {
        const onlyNums = this.removeNotNumbers(e.target.value);
        this.setState({
            clipsToMultipy: +onlyNums
        });
    }

    handleToEndOfTheVideoChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            toEndOfTheVideo: e.target.checked
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
                            value={this.state.interval} />
                        <TextField
                            label="Number of clips to multipy"
                            disabled={!this.state.toEndOfTheVideo}
                            onChange={this.handleClipsToMultipyChange}
                            value={this.state.clipsToMultipy} />
                        <FormGroup>
                            <FormControlLabel
                                label="To end of the video"
                                control={
                                    <Checkbox
                                        name="toEndOfTheVideo"
                                        checked={this.state.toEndOfTheVideo}
                                        onChange={this.handleToEndOfTheVideoChange} />} />
                        </FormGroup>
                        <Button onClick={this.onClickEditStartBtn}>
                            StartEdit
                        </Button>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default withStyles(styles)(App);