import React, { Component, ChangeEvent } from 'react';
import {
    Button,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    Slider,
    Grid
} from '@material-ui/core/index';
import {
    Theme,
    WithStyles,
    createStyles,
    withStyles
} from '@material-ui/core/styles/index';
import Clip from './components/Clip';
import Controller, { IEverySecondEditData } from './Controller';
import Input from '@material-ui/core/Input';

let styles = ((theme: Theme) => createStyles({
    root: {
        width: '100%',
        height: '100vh'
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px'
    },
    clip: {
        marginBottom: '16px'
    },
    label: {
        color: theme.palette.text.primary
    },
}));

interface IAppProps extends WithStyles<typeof styles> {
    controller: Controller;
}

interface IAppState extends IEverySecondEditData {
    isClipSelected: boolean;
    selectedClip?: ProjectItem;
}

/**
 * main app component
 *
 */
class App extends Component<IAppProps, IAppState> {
    private controller: Controller;
    private classes: IAppProps['classes'];
    private minInterval: number;
    private maxInterval: number;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            interval: 1,
            injectCount: 0,
            untilEndOfClip: true,
            trimEnd: true,
            isClipSelected: false
        }

        this.controller = props.controller;
        this.classes = props.classes;
        this.minInterval = 0.1;
        this.maxInterval = 100;

        this.checkSelectedClip = this.checkSelectedClip.bind(this);
        this.handleStartEditClick = this.handleStartEditClick.bind(this);
        this.handleIntervalSliderChange = this.handleIntervalSliderChange.bind(this);
        this.handleIntervalInputChange = this.handleIntervalInputChange.bind(this);
        this.handleinjectCountChange = this.handleinjectCountChange.bind(this);
        this.handleUntilEndOfClipChange = this.handleUntilEndOfClipChange.bind(this);
        this.handleTrimEndChange = this.handleTrimEndChange.bind(this);
    }

    public componentDidMount() {
        // polling selected clip
        setInterval(this.checkSelectedClip, 1000);
    }

    private async checkSelectedClip() {
        try {
            var isSelected = await this.controller.isClipSelected();
            if (isSelected !== this.state.isClipSelected) {
                this.setState({
                    isClipSelected: isSelected
                });

                if (isSelected) {
                    var clip = await this.controller.getSelectedClip();
                    this.setState({
                        selectedClip: clip
                    });
                } else {
                    this.setState({
                        selectedClip: undefined 
                    });
                }
            }
        } catch (err) {
            this.controller.alert(err, 'error');
        }
    }

    private removeNotNumbers(str: string): string {
        return str.replace(/[^0-9]/g, '');
    }

    private trimInterval(interval: number): number {
        if (interval < this.minInterval) {
            interval = this.minInterval;
        } else if (interval > this.maxInterval) {
            interval = this.maxInterval;
        }

        return interval;
    }

    private handleStartEditClick = async (): Promise<void> => {
        try {
            const result = await this.controller.startEdit(this.state);
            console.log(result);
            this.controller.alert('Edit success', 'info');
        } catch (err) {
            console.error(err);
            this.controller.alert(err.message, 'error');
        }
    }

    private handleIntervalSliderChange(event: ChangeEvent<{}>, newValue: number | number[]) {
        if (typeof newValue === 'object') {
            newValue = newValue[0];
        }

        newValue = this.trimInterval(newValue);

        this.setState({
            interval: newValue
        });
    }

    private handleIntervalInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {
            value
        } = event.target;

        let interval = value === '' ? this.minInterval : Number(value);
        interval = this.trimInterval(interval);

        this.setState({
            interval: interval
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
        const {
            interval,
            injectCount,
            untilEndOfClip,
            trimEnd,
            isClipSelected,
            selectedClip
        } = this.state;

        return (
            <div className={this.classes.root}>
                <div className={this.classes.flexContainer}>
                    {isClipSelected ? (
                        <Clip className={this.classes.clip} title="Selected Clip" clip={selectedClip} />
                    ) : (
                        <Typography color="error" gutterBottom>
                            Clip not selected
                        </Typography>
                    )}
                    <div>
                        <Typography id="interval-input-slider" color="textPrimary" gutterBottom>
                            Gap between clips (seconds)
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs>
                                <Slider
                                    value={interval}
                                    onChange={this.handleIntervalSliderChange}
                                    aria-labelledby="interval-input-slider" />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={interval}
                                    margin="dense"
                                    onChange={this.handleIntervalInputChange}
                                    inputProps={{
                                        min: this.minInterval,
                                        max: this.maxInterval,
                                        type: 'number',
                                        'aria-labelledby': 'interval-input-slider'
                                    }} />
                            </Grid>
                        </Grid>
                    </div>
                    {/* <TextField
                        label="Gap between clips (seconds)"
                        onChange={this.handleIntervalChange}
                        value={interval} /> */}
                    <TextField
                        label="Number of clips to inject"
                        disabled={untilEndOfClip}
                        onChange={this.handleinjectCountChange}
                        value={injectCount} />
                    <FormGroup>
                        <FormControlLabel
                            label={<Typography className={this.classes.label}>Until end of clip</Typography>}
                            control={
                                <Checkbox
                                    name="untilEndOfClip"
                                    checked={untilEndOfClip}
                                    onChange={this.handleUntilEndOfClipChange} />} />
                        <FormControlLabel
                            label={<Typography className={this.classes.label}>Trim end</Typography>}
                            control={
                                <Checkbox
                                    name="trimEnd"
                                    checked={trimEnd}
                                    onChange={this.handleTrimEndChange} />} />
                    </FormGroup>
                    <Button onClick={this.handleStartEditClick}>
                        StartEdit
                    </Button>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(App);
export {
    IAppProps,
    IAppState
}