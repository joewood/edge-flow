import * as React from "react"
import * as ReactDOM from 'react-dom'
import { range } from "lodash";
import { EdgeFlow, Node, Edge } from ".."

interface IState {
    animationIndex: number;
    points: { x: number, y: number }[];
    width?: number;
    height?: number;
    animate?: boolean;
}

const radius = 200;

function circlePoint(i: number, length: number) {
    const angle = (i % length) / length * 2 * Math.PI;
    return {
        x: radius + radius * Math.cos(angle),
        y: radius + radius * Math.sin(angle)
    };
}

function segment(p: number): string {
    return p < radius ? "0" : "1";
}

class App extends React.Component<any, IState> {
    private timer: number;
    private resizeHandler: EventListenerOrEventListenerObject;
    private div: HTMLDivElement;

    constructor(p: any) {
        super(p);
        this.state = {
            animationIndex: 0,
            points: range(0, 24).map((pt, i, arr) => circlePoint(i, arr.length)),
            height: 300,
            width: 300,
            animate: true
        };
    }

    private onResize = () => {
        console.log("resize");
        this.setState({ width: document.getElementById("root").clientWidth, height: document.getElementById("root").clientHeight });
    }

    private moveNext = () => {
        const animationIndex = this.state.animationIndex + 1;
        const points = this.state.points.map((pt, i, arr) => circlePoint(i + animationIndex, arr.length));
        this.setState({ animationIndex: animationIndex, points: points });
    }

    private componentDidMount() {
        this.timer = window.setInterval(this.moveNext, 2000)
        window.addEventListener("resize", this.onResize);
        this.setState({ width: document.getElementById("root").clientWidth, height: document.getElementById("root").clientHeight-20 });
    }

    private componentWillUnmount() {
        window.clearInterval(this.timer);
        window.removeEventListener("resize", this.onResize);
    }


    render() {
        const { points, width, height} = this.state;
        const numPoints = points.length;
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black",height:height,width:width,overflow:"hidden" }}
            ref={div => this.div = div}>
            <p style={{ color: "white", height: 20 }} onClick={() => this.setState({ animate: !this.state.animate })}>Click to Pause</p>
            <EdgeFlow style={{ height: height*0.8 - 20, width: width*0.8, backgroundColor: "#0f0f0f" }} run={this.state.animate} >
                {
                       [...points.map((p, i) =>
                        <Node key={"node" + i} id={"node" + i} label={i.toString()} x={p.x} y={p.y} labelColor="white" >
                            <Edge linkTo={"node" + (i + 1) % numPoints} ratePerSecond={7} variationMin={-0.1} variationMax={0.1} 
                                    size={5.0} shape={0.0} pathOpacity={0.05}
                                    color={`rgb(${Math.round(255 - i / points.length * 200)},200,${Math.round(i / points.length * 200 + 50)})`} 
                                    pathColor={`rgb(${Math.round(255 - i / points.length * 200)},200,${Math.round(i / points.length * 200 + 50)})`} />
                            <Edge linkTo={"nodep-" + Math.floor(i / points.length * 4)} ratePerSecond={10} color="#e0ffe0" size={8}  shape={1.0} pathWidth={3} pathOpacity={0.02}/>
                        </Node>),
                    <Node key="nodep-0" id="nodep-0" x={radius + radius / 4} y={radius + radius / 4} />,
                    <Node key="nodep-1" id="nodep-1" x={radius - radius / 4} y={radius + radius / 4} />,
                    <Node key="nodep-2" id="nodep-2" x={radius - radius / 4} y={radius - radius / 4} />,
                    <Node key="nodep-3" id="nodep-3" x={radius + radius / 4} y={radius - radius / 4} />
                    ]
                }
            </EdgeFlow>
        </div>;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("ready");
    ReactDOM.render(<App />, document.getElementById("root"));
});