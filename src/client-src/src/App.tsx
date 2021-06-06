import React, { Component, ChangeEvent } from 'react';
import {
    Button,
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

interface IAppState {
    isClipSelected: boolean;
    selectedClip?: ProjectItem;
    intervalRange: {
        min: number,
        max: number
    };
    canEdit: boolean;
    editData: IEverySecondEditData;
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
    private minInjectCount: number;
    private maxInjectCount: number;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            isClipSelected: false,
            intervalRange: {
                min: 1,
                max: 100000
            },
            canEdit: false,
            editData: {
                interval: 1000,
                injectCount: 0,
                untilEndOfClip: true,
                trimEnd: true
            }
        }

        this.controller = props.controller;
        this.classes = props.classes;
        this.minInjectCount = 0;
        this.maxInjectCount = 100;

        this.checkSelectedClip = this.checkSelectedClip.bind(this);
        this.checkSelectedClipChanged = this.checkSelectedClipChanged.bind(this);
        this.determineIfCanEdit = this.determineIfCanEdit.bind(this);
        this.getIntervalRangeByOutPointSeconds = this.getIntervalRangeByOutPointSeconds.bind(this);
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

    public componentDidUpdate() {
        const { canEdit } = this.state;
        const newCanEdit = this.determineIfCanEdit();
        if (newCanEdit !== canEdit) {
            this.setState({
                canEdit: newCanEdit
            });
        }
    }

    public componentWillUnmount() {
        clearInterval(this.checkSelectedClipTimeout);
        clearInterval(this.checkSelectedClipChangedTimeout);
    }

    private async checkSelectedClip(): Promise<void> {
        try {
            const isSelected = await this.controller.isClipSelected();
            if (isSelected !== this.state.isClipSelected) {
                if (isSelected) {
                    const clip = await this.controller.getSelectedClip();
                    const outPointSeconds = await this.controller.getClipOutPointSecondsByNodeId(clip.nodeId);
                    const intervalRange = this.getIntervalRangeByOutPointSeconds(outPointSeconds);
                    this.setState({
                        isClipSelected: isSelected,
                        selectedClip: clip,
                        intervalRange: intervalRange
                    });
                    this.checkSelectedClipChangedTimeout = setInterval(this.checkSelectedClipChanged, 1000);
                } else {
                    this.setState({
                        isClipSelected: isSelected,
                        selectedClip: undefined 
                    });
                    clearInterval(this.checkSelectedClipChangedTimeout);
                }
            }
        } catch (err) {
            await this.controller.alert(err, 'error');
        }
    }

    private async checkSelectedClipChanged(): Promise<void> {
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
            await this.controller.alert(err, 'error');
        }
    }

    private determineIfCanEdit(): boolean {
        const { isClipSelected } = this.state;
        const { injectCount, untilEndOfClip } = this.state.editData;
        if (untilEndOfClip) {
            return isClipSelected;
        } else {
            return isClipSelected && injectCount !== 0;
        }
    }

    private getIntervalRangeByOutPointSeconds(seconds: number): IAppState['intervalRange'] {
        const currentRange = this.state.intervalRange;
        currentRange['max'] = seconds * 1000;
        return currentRange;
    }

    private trimInterval(interval: number): number {
        const { min, max } = this.state.intervalRange;

        if (interval < min) {
            interval = min;
        } else if (interval > max) {
            interval = max;
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
            await this.controller.startEdit(this.state.editData);
            await this.controller.alert('Edit success', 'info');
        } catch (err) {
            console.error(err);
            await this.controller.alert(err.message, 'error');
        }
    }

    private handleIntervalSliderChange(event: ChangeEvent<{}>, newValue: number | number[]) {
        if (typeof newValue === 'object') {
            newValue = newValue[0];
        }

        newValue = this.trimInterval(newValue);
        const currentEditData = this.state.editData;
        currentEditData['interval'] = newValue;

        this.setState({
            editData: currentEditData
        });
    }

    private handleIntervalInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { value} = event.target;
        const { min } = this.state.intervalRange;

        let interval = value === '' ? min : Number(value);
        interval = this.trimInterval(interval);
        const currentEditData = this.state.editData;
        currentEditData['interval'] = interval;

        this.setState({
            editData: currentEditData
        });
    }

    private handleInjectCountSliderChange(event: ChangeEvent<{}>, newValue: number | number[]) {
        if (typeof newValue === 'object') {
            newValue = newValue[0];
        }

        newValue = this.trimInjectCount(newValue);
        const currentEditData = this.state.editData;
        currentEditData['injectCount'] = newValue;

        this.setState({
            editData: currentEditData
        });
    }

    private handleInjectCountInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {
            value
        } = event.target;

        let injectCount = value === '' ? this.minInjectCount : Number(value);
        injectCount = this.trimInjectCount(injectCount);
        const currentEditData = this.state.editData;
        currentEditData['injectCount'] = injectCount;

        this.setState({
            editData: currentEditData
        });
    }

    private handleUntilEndOfClipChange(e: ChangeEvent<HTMLInputElement>) {
        const {
            checked
        } = e.target;

        const currentEditData = this.state.editData;
        currentEditData['untilEndOfClip'] = checked;

        this.setState({
            editData: currentEditData
        });
    }

    private handleTrimEndChange(e: ChangeEvent<HTMLInputElement>) {
        const {
            checked
        } = e.target;

        const currentEditData = this.state.editData;
        currentEditData['trimEnd'] = checked;

        this.setState({
            editData: currentEditData
        });
    }

    render() {
        const {
            isClipSelected,
            selectedClip,
            canEdit
        } = this.state;

        const {
            interval,
            injectCount,
            untilEndOfClip,
            trimEnd
        } = this.state.editData;

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
                            Gap between clips (milliseconds)
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs>
                                <Slider
                                    value={interval}
                                    min={0}
                                    max={this.state.intervalRange.max}
                                    step={1000}
                                    onChange={this.handleIntervalSliderChange}
                                    aria-labelledby="interval-input-slider" />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={interval}
                                    margin="dense"
                                    onChange={this.handleIntervalInputChange}
                                    inputProps={{
                                        min: this.state.intervalRange.min,
                                        max: this.state.intervalRange.max,
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
                                    min={this.minInjectCount}
                                    max={this.maxInjectCount}
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
                    <Button
                        disabled={!canEdit}
                        onClick={this.handleStartEditClick}>
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