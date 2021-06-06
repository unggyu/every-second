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
    className?: string;
    title?: string;
    clip?: ProjectItem;
}

class Clip extends Component<IClipProps> {
    private classes: IClipProps['classes'];

    constructor(props: IClipProps) {
        super(props);

        this.classes = props.classes;
    }

    render() {
        if (this.props.clip !== undefined) {
            const {
                className,
                title
            } = this.props;

            const {
                name,
                nodeId
            } = this.props.clip;

            return (
                <div className={className}>
                    <Card className={this.classes.root}>
                        <CardContent>
                            <Typography
                                className={this.classes.title}
                                color="textSecondary"
                                gutterBottom>
                                {title ?? 'clip'}
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
                </div>
            );
        } else {
            return (
                <Card className={this.classes.root}>
                    <CardContent>
                        <Typography>
                            No clip
                        </Typography>
                    </CardContent>
                </Card>
            )
        }
    }
}

export default withStyles(styles)(Clip);
export {
    IClipProps
}