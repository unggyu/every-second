import React, { Component } from 'react';
import {
    Card,
    CardContent,
    Theme,
    Tooltip,
    Typography,
    withStyles,
    WithStyles
} from '@material-ui/core';

let styles = (theme: Theme) => ({
    root: {
        minWidth: 350
    },
    title: {
        fontSize: 14
    }
});

interface IClipProps extends WithStyles<typeof styles> {
    title: string;
    clip?: ProjectItem;
}

interface IClipState {
    title: string;
    clip?: ProjectItem;
}

class Clip extends Component<IClipProps, IClipState> {
    private classes: IClipProps['classes'];

    constructor(props: IClipProps) {
        super(props);

        this.state = {
            title: props.title,
            clip: props.clip
        };

        this.classes = props.classes;
    }

    render() {
        const {
            name,
            nodeId
        } = this.state.clip ?? new ProjectItem();

        return (
            <Card className={this.classes.root}>
                <CardContent>
                    <Typography
                        className={this.classes.title}
                        color="textSecondary"
                        gutterBottom>
                        {this.state.title}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {name}
                    </Typography>
                    <Tooltip title="Node Id">
                        <Typography color="textSecondary">
                            {nodeId}
                        </Typography>
                    </Tooltip>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(Clip);
export {
    IClipProps,
    IClipState
}