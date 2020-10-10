import React, {createRef} from "react";
import {HEIGHT, WIDTH} from "./config";
import {isEqual} from "lodash";

const path = "/../public/files/";

class Screen extends React.Component
{
    timeOutId;
    videoRef;
    constructor(props)
    {
        super(props);
        this.state = {
            display: "none"
        };
        this.timeOutId = 0;
        this.videoRef = createRef();
    }

    toBlock = () =>
    {
        this.reset();
        if (this.videoRef && this.videoRef.current && this.props.type.split("/")[0] === "video")
        {
            const playPromise = this.videoRef.current.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(_ => {
                        // Automatic playback started!
                        // Show playing UI.
                        console.log("audio played auto");
                    })
                    .catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                        console.log("playback prevented");
                    });
            }
        }
        this.setState({display: "block"}, () =>
        {
            this.timeOutId = window.setTimeout(this.toNone, this.props.showTime);
        });
    };

    toNone = () =>
    {
        this.reset();
        this.setState({display: "none"}, () =>
        {
            this.timeOutId = window.setTimeout(this.toBlock, this.props.interval);
        });

    };

    reset = () =>
    {
        window.clearTimeout(this.timeOutId);
        this.timeOutId = 0;
        if (this.videoRef?.current && this.props.type.split("/")[0] === "video")
        {
            this.videoRef.current.pause();
            this.videoRef.current.currentTime = 0;
        }
    };

    componentDidMount()
    {
        this.reset();
        this.timeOutId = window.setTimeout(this.toBlock, this.props.startTime)
    }

    componentDidUpdate(prevProps)
    {
        if (!isEqual(prevProps, this.props))
        {
            this.setState({display: "none"});
            this.reset();
            this.timeOutId = window.setTimeout(this.toBlock, this.props.startTime);
        }
    }

    componentWillUnmount()
    {
        this.setState({display: "none"});
        this.reset();
    }

    render()
    {
        const {screens, name, type} = this.props;

        const styleFile = {
            position: "absolute",
            height: HEIGHT + "px",
            objectFit: "contain",
            display: this.state.display,
            left: (screens[0] === 1) ? "0px" : (screens[0] === 2) ? WIDTH + "px" : WIDTH * 2 + "px",
            width: `${WIDTH * screens.length}px`
        };
        return this.state.display ? (
            type.split("/")[0] === "image" ?
                <img
                    style={styleFile}
                    src={`${path + name}`}
                    alt={name}/>
                :
                <video
                    loop
                    muted
                    ref={this.videoRef}
                    style={styleFile}
                    src={`${path + name}`}
                    alt={name}/>
        ) : null;
    };
}

export default Screen;

