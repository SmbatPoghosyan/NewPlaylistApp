import React from "react";
import Marquee from "react-smooth-marquee";
import {style} from "typestyle";
import {WIDTH} from "./config"
import useResizeObserver from "use-resize-observer";

const StuffAroundTicker = (props) =>
{
    const {ref, width = 1} = useResizeObserver();

    const {ticker, screens} = props;
    const {r, g, b, a} = ticker.color;
    const color = ticker.color ? `rgba(${r},${g},${b},${a})` : "#fff";
    const fontSize = ticker.fontSize + "px";

    const styles = {
        stuffAround: style({
            overflow: "hidden",
            whiteSpace: "nowrap",
            color: color,
            fontSize: fontSize,
            $nest: {
                "& .MarqueeContent": {
                    width: width + WIDTH * screens,
                    display: "block",
                    lineHeight: 1.3,
                    textAlign: "right"
                }
            }
        }),
    };

    return (
        <div className={styles.stuffAround}>
            <div ref={ref} style={{
                fontSize: ticker.fontSize,
                position: "absolute",
                visibility: "hidden",
                height: "auto",
                width: "auto",
                whiteSpace: "nowrap"
            }}>{ticker.text}</div>

            {width ?
                <Marquee velocity="0.12">
                    {ticker.text}
                </Marquee> : null
            }
        </div>
    );
};

export default StuffAroundTicker;

