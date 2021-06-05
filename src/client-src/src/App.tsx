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
    private checkSelectedClipTimeout: NodeJS.Timeout;
    private checkSelectedClipChangedTimeout: NodeJS.Timeout;
    private minInterval: number;
    private maxInterval: number;
    private minInjectCount: number;
    private maxInjectCount: number;

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
        this.minInjectCount = 0;
        this.maxInjectCount = 100;

        this.checkSelectedClip = this.checkSelectedClip.bind(this);
        this.checkSelectedClipChanged = this.checkSelectedClipChanged.bind(this);
        this.trimInterval = this.trimInterval.bind(this);
        this.trimInjectCount = this.trimInjectCount.bind(this);
        this.handleStartEditClick = this.handleStartEditClick.bind(this);
        this.handleIntervalSliderChange = this.handleIntervalSliderChange.bind(this);
        this.handleIntervalInputChange = this.handleIntervalInputChange.bind(this);
        this.handleInjectCountSliderChange = this.handleInjectCountSliderChange.bind(this);
        this.handleInjectCountInputChange = this.handleInjectCountInputChange.bind(this);
        this.handleUntilEndOfClipChange = this.handleUntilEndOfClipChange.bind(this);
        this.handleTrimEndChange = this.handleTrimEndChange.bind(this);
    }

    public componentDidMount() {
        // polling selected clip
        this.checkSelectedClipTimeout = setInterval(this.checkSelectedClip, 1000);
    }

    public componentWillUnmount() {
        clearInterval(this.checkSelectedClipTimeout);
        clearInterval(this.checkSelectedClipChangedTimeout);
    }

    private async checkSelectedClip() {
        try {
            const isSelected = await this.controller.isClipSelected();
            if (isSelected !== this.state.isClipSelected) {
                this.setState({
                    isClipSelected: isSelected
                });

                if (isSelected) {
                    var clip = await this.controller.getSelectedClip();
                    this.setState({
                        selectedClip: clip
                    });
                    this.checkSelectedClipChangedTimeout = setInterval(this.checkSelectedClipChanged, 1000);
                } else {
                    this.setState({
                        selectedClip: undefined 
                    });
                    clearInterval(this.checkSelectedClipChangedTimeout);
                }
            }
        } catch (err) {
            this.controller.alert(err, 'error');
        }
    }

    private async checkSelectedClipChanged() {
        try {
            const clip = await this.controller.getSelectedClip();
            const {
                selectedClip
            } = this.state;

            if (clip && selectedClip && clip.nodeId !== selectedClip.nodeId) {
                this.setState({
                    selectedClip: clip
                });
            }
        } catch (err) {
            this.controller.alert(err, 'error');
        }
    }

    private trimInterval(interval: number): number {
        if (interval < this.minInterval) {
            interval = this.minInterval;
        } else if (interval > this.maxInterval) {
            interval = this.maxInterval;
        }

        return interval;
    }

    private trimInjectCount(injectCount: number): number {
        if (injectCount < this.minInjectCount) {
            injectCount = this.minInjectCount
        } else if (injectCount > this.maxInjectCount) {
            injectCount = this.maxInjectCount;
        }

        return injectCount;
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

    private handleInjectCountSliderChange(event: ChangeEvent<{}>, newValue: number | number[]) {
        if (typeof newValue === 'object') {
            newValue = newValue[0];
        }

        newValue = this.trimInjectCount(newValue);

        this.setState({
            injectCount: newValue
        });
    }

    private handleInjectCountInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {
            value
        } = event.target;

        let injectCount = value === '' ? this.minInjectCount : Number(value);
        injectCount = this.trimInjectCount(injectCount);

        this.setState({
            injectCount: injectCount
        });
    }

    private handleUntilEndOfClipChange(e: ChangeEvent<HTMLInputElement>) {
        const {
            checked
        } = e.target;

        this.setState({
            untilEndOfClip: checked
        });
    }

    private handleTrimEndChange(e: ChangeEvent<HTMLInputElement>) {
        const {
            checked
        } = e.target;

        this.setState({
            trimEnd: checked
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
                    <div>
                        <Typography id="inject-count-input-slider" color="textPrimary" gutterBottom>
                            Number of clips to inject
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs>
                                <Slider
                                    value={injectCount}
                                    onChange={this.handleInjectCountSliderChange}
                                    disabled={untilEndOfClip}
                                    aria-labelledby="inject-count-input-slider" />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={injectCount}
                                    margin="dense"
                                    onChange={this.handleInjectCountInputChange}
                                    disabled={untilEndOfClip}
                                    inputProps={{
                                        min: this.minInjectCount,
                                        max: this.maxInjectCount,
                                        type: 'number',
                                        'aria-labelledby': 'inject-count-input-slider'
                                    }} />
                            </Grid>
                        </Grid>
                    </div>
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