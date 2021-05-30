import React, { Component, ChangeEvent } from 'react';
import {
    Button,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@material-ui/core/index';
import { pink, red, cyan } from '@material-ui/core/colors/index';
import {
    Theme,
    ThemeOptions,
    WithStyles,
    MuiThemeProvider,
    createStyles,
    withStyles,
    createMuiTheme
} from '@material-ui/core/styles/index';
import Controller, { IEverySecondEditData } from './Controller';

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
        flexDirection: 'column',
        padding: '10px'
    }
}));

interface IAppProps extends WithStyles<typeof styles> {
    controller: Controller;
}

interface IAppState extends IEverySecondEditData {}

/**
 * main app component
 *
 */
class App extends Component<IAppProps, IAppState> {
    private controller: Controller;
    private classes: IAppProps['classes'];

    constructor(props: IAppProps) {
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

    private removeNotNumbers(str: string): string {
        return str.replace(/[^0-9]/g, '');
    }

    private onClickEditStartBtn = async (): Promise<void> => {
        try {
            const result = await this.controller.startEdit(this.state);
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    }

    private handleIntervalChange(e: ChangeEvent<HTMLInputElement>) {
        const onlyNums = this.removeNotNumbers(e.target.value);
        this.setState({
            interval: +onlyNums
        });
    }

    private handleClipsToMultipyChange(e: ChangeEvent<HTMLInputElement>) {
        const onlyNums = this.removeNotNumbers(e.target.value);
        this.setState({
            clipsToMultipy: +onlyNums
        });
    }

    private handleToEndOfTheVideoChange(e: ChangeEvent<HTMLInputElement>) {
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
                            disabled={this.state.toEndOfTheVideo}
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
export {
    IAppProps,
    IAppState
}