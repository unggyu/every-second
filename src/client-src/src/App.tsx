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
            injectCount: 0,
            untilEndOfClip: true,
            trimEnd: true
        }

        this.controller = props.controller;
        this.classes = props.classes;

        this.handleStartEditClick = this.handleStartEditClick.bind(this);
        this.handleIntervalChange = this.handleIntervalChange.bind(this);
        this.handleinjectCountChange = this.handleinjectCountChange.bind(this);
        this.handleUntilEndOfClipChange = this.handleUntilEndOfClipChange.bind(this);
        this.handleTrimEndChange = this.handleTrimEndChange.bind(this);
    }

    private removeNotNumbers(str: string): string {
        return str.replace(/[^0-9]/g, '');
    }

    private handleStartEditClick = async (): Promise<void> => {
        try {
            const result = await this.controller.startEdit(this.state);
            console.log(result);
        } catch (err) {
            console.error(err);
            this.controller.alert(err.message);
        }
    }

    private handleIntervalChange(e: ChangeEvent<HTMLInputElement>) {
        const onlyNums = this.removeNotNumbers(e.target.value);
        this.setState({
            interval: +onlyNums
        });
    }

    private handleinjectCountChange(e: ChangeEvent<HTMLInputElement>) {
        const onlyNums = this.removeNotNumbers(e.target.value);
        this.setState({
            injectCount: +onlyNums
        });
    }

    private handleUntilEndOfClipChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            untilEndOfClip: e.target.checked
        });
    }

    private handleTrimEndChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            trimEnd: e.target.checked
        });
    }

    render() {
        return (
            <div className={this.classes.root}>
                <MuiThemeProvider theme={theme}>
                    <div className={this.classes.flexContainer}>
                        <TextField
                            label="Gap between clips (seconds)"
                            onChange={this.handleIntervalChange}
                            value={this.state.interval} />
                        <TextField
                            label="Number of clips to inject"
                            disabled={this.state.untilEndOfClip}
                            onChange={this.handleinjectCountChange}
                            value={this.state.injectCount} />
                        <FormGroup>
                            <FormControlLabel
                                label="Until end of clip"
                                control={
                                    <Checkbox
                                        name="untilEndOfClip"
                                        checked={this.state.untilEndOfClip}
                                        onChange={this.handleUntilEndOfClipChange} />} />
                            <FormControlLabel
                                label="Trim end"
                                control={
                                    <Checkbox
                                        name="trimEnd"
                                        checked={this.state.trimEnd}
                                        onChange={this.handleTrimEndChange} />} />
                        </FormGroup>
                        <Button onClick={this.handleStartEditClick}>
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