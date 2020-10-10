import React from "react";
import Screen from "./Screen";
import {HEIGHT, WIDTH} from "./config";
import StuffAroundTicker from "./StuffAroundTicker";

const Player = (props) =>
{
    const {screens, ticker, files} = props;
    const list = screens && ticker && files ? modifyData(props) : null;

    return (
        <div style={{
            height: `${HEIGHT}px`,
            width: `${WIDTH * screens}px`,
            position: "relative",
            background: "#000",
            overflow: "hidden"
        }}>
            {list}
            {ticker && ticker.text && screens ?
                <div className="tickerContainer">
                    <StuffAroundTicker ticker={ticker} screens={screens}/>
                </div> : null
            }
        </div>
    );
};

function modifyData(props)
{
    const files = props.files;
    return files.map((file, i) =>
    {
        let startTime = 0;
        for (let j = 0; j < i; j++)
        {
            if (files[j].screen.indexOf(file.screen[0]) !== -1)
            {
                startTime += files[j].showTime;
            }
        }
        let sum = 0;
        for (let k = 0; k < files.length; k++)
        {
            if (files[k].screen.indexOf(1) !== -1)
            {
                sum += files[k].showTime;
            }
        }

        let interval = sum - file.showTime;

        return (
            <Screen
                key={i}
                name={file.name}
                type={file.type}
                screens={file.screen}
                branchScr={props.screens}
                showTime={file.showTime * 1000}
                startTime={startTime * 1000}
                interval={interval * 1000}
            />
        );
    })
}

export default Player;
