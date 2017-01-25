import * as React from "react"
import * as ReactDOM from 'react-dom'
import { range } from "lodash";
import { EdgeFlow, Node, Edge } from ".."

interface IState {
    animationIndex: number;
    points: { x: number, y: number }[];
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

    constructor(p: any) {
        super(p);
        this.state = {
            animationIndex: 0, points: range(0, 24).map((pt, i, arr) => circlePoint(i, arr.length)),
        };
    }

    private moveNext = () => {
        const animationIndex = this.state.animationIndex + 1;
        const points = this.state.points.map((pt, i, arr) => circlePoint(i + animationIndex, arr.length));
        this.setState({ animationIndex: animationIndex, points: points });
    }

    private componentDidMount() {
        this.timer = window.setInterval(this.moveNext, 4000)
    }

    private componentWillUnmount() {
        window.clearInterval(this.timer);
    }


    render() {
        const { points} = this.state;
        const numPoints = points.length;
        return <div id="root" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black" }}>
            <EdgeFlow backgroundColor="#0f0f0f" height={600} width={600} run={true} >
                {
                    [...points.map((p, i) =>
                        <Node key={"node" + i} id={"node" + i} label={i.toString()} x={p.x} y={p.y} labelColor="white" >
                            <Edge linkTo={"node" + (i + 1) % numPoints} ratePerSecond={10} variationMin={-0.03} variationMax={0.03} color={`rgb(${Math.round(255 - i / points.length * 200)},200,${Math.round(i / points.length * 200 + 50)})`} />
                            <Edge linkTo={"nodep-" + Math.floor(i / points.length * 4)} ratePerSecond={15+i*2} color="#e0ffe0" />
                        </Node>),
                    <Node key="nodep-0" id="nodep-0" x={radius + radius / 3} y={radius + radius / 3} />,
                    <Node key="nodep-1" id="nodep-1" x={radius - radius / 3} y={radius + radius / 3} />,
                    <Node key="nodep-2" id="nodep-2" x={radius - radius / 3} y={radius - radius / 3} />,
                    <Node key="nodep-3" id="nodep-3" x={radius + radius / 3} y={radius - radius / 3} />
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