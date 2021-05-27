import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { pink, red, cyan } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
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

const styles = theme => ({
    root: {
        width: '100%',
        height: '100vh'
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'column'
    }
});

/**
 * main app component
 *
 */
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            interval: 1,
            clipsToMultipy: 0,
            toEndOfTheVideo: true
        }

        this._controller = props.controller;
        this.classes = props.classes;

        this.handleIntervalChange = this.handleIntervalChange.bind(this);
        this.handleClipsToMultipyChange = this.handleClipsToMultipyChange.bind(this);
        this.handleToEndOfTheVideoChange = this.handleToEndOfTheVideoChange.bind(this);
    }

    /**
     * get controller
     *
     * @return {Controller}
     */
    get controller() {
        return this._controller;
    }

    removeNotNumbers(str) {
        return str.replace(/[^0-9]/g, '');
    }

    onClickEditStartBtn = async () => {
        try {
            const result = await this._controller.startEdit(this.state);
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }

    handleIntervalChange(e) {
        const onlyNums = this.removeNotNumbers(e.target.value);
        this.setState({
            interval: onlyNums
        });
    }

    handleClipsToMultipyChange(e) {
        const onlyNums = this.removeNotNumbers(e.target.value);
        this.setState({
            clipsToMultipy: onlyNums
        });
    }

    handleToEndOfTheVideoChange(e) {
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

App.propTypes = {
    controller: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App);