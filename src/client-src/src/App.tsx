import React, { Component, ChangeEvent } from 'react';
import {
    Button,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography
} from '@material-ui/core/index';
import {
    Theme,
    WithStyles,
    createStyles,
    withStyles
} from '@material-ui/core/styles/index';
import Clip from './components/Clip';
import Controller, { IEverySecondEditData } from './Controller';

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
    label: {
        color: theme.palette.text.primary
    }
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

        this.handleStartEditClick = this.handleStartEditClick.bind(this);
        this.handleIntervalChange = this.handleIntervalChange.bind(this);
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
                        <Clip title="Selected Clip" clip={selectedClip} />
                    ) : (
                        <Typography>
                            Clip not selected
                        </Typography>
                    )}
                    <TextField
                        label="Gap between clips (seconds)"
                        onChange={this.handleIntervalChange}
                        value={interval} />
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