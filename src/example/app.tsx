import * as React from "react"
import * as ReactDOM from 'react-dom'
import { range } from "lodash";
import Swirl from "./swirl";
import Partition from "./partition"
import Network from "./network"

enum Screen { SWIRL, SIMPLE, PARTITION, NETWORK };

interface IState {
    screen: Screen;
    width?: number;
    height?: number;
    animate?: boolean;
    animationIndex: number;
}

class App extends React.Component<any, IState> {
    private resizeHandler: EventListenerOrEventListenerObject;
    private div: HTMLDivElement;
    private timer: number;

    constructor(p: any) {
        super(p);
        this.state = {
            screen: Screen.PARTITION,
            height: 300,
            width: 300,
            animate: false,
            animationIndex: 0
        }
    }

    private onResize = () => {
        console.log("resize");
        this.setState({ width: document.getElementById("root").clientWidth, height: document.getElementById("root").clientHeight });
    }

    private componentDidMount() {
        this.timer = window.setInterval(this.moveNext, 2000)
        window.addEventListener("resize", this.onResize);
        this.setState({ width: document.getElementById("root").clientWidth, height: document.getElementById("root").clientHeight - 20 });
    }

    private componentWillUnmount() {
        window.clearInterval(this.timer);
        window.removeEventListener("resize", this.onResize);
    }

    private moveNext = () => {
        if (!this.state.animate) return;
        const animationIndex = this.state.animationIndex + 1;
        this.setState({ animationIndex: animationIndex });
    }

    public render() {
        const {screen, width, height, animate, animationIndex} = this.state;
        console.log(`${width} ${height}`);
        const buttonStyle = { height: 50, width: 130, margin: 5, color: "black" };
        return (<div key="root" id="root"
            style={{ backgroundColor: "green", overflow: "hidden" }}
            ref={div => this.div = div}>
            <div style={{ height: 60 }}>
                <button key="pause" style={buttonStyle}
                    onClick={() => this.setState({ animate: !this.state.animate })}>Pause</button>
                <button key="swirl" style={buttonStyle}
                    onClick={() => this.setState({ screen: Screen.SWIRL })}>Swirl</button>
                <button key="partition" style={buttonStyle}
                    onClick={() => this.setState({ screen: Screen.PARTITION })}>Partition</button>
                <button key="network" style={buttonStyle}
                    onClick={() => this.setState({ screen: Screen.NETWORK })}>Network</button>
            </div>
            {screen == Screen.SWIRL ?
                <Swirl animate={animate} animationIndex={animationIndex} height={height - 60} width={width} />
                : (screen == Screen.PARTITION) ? <Partition animate={animate} animationIndex={animationIndex} height={height - 60} width={width} />
                    : <Network animate={animate} animationIndex={animationIndex} height={height - 60} width={width} />
            }
        </div>
        )
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("ready");
    ReactDOM.render(<App />, document.getElementById("root"));
});