import * as React from "react"
import * as ReactDOM from 'react-dom'
import { Graph, Node, Link } from "../drawing"
import { range } from "lodash";

interface IState {
    animationIndex: number;
    points: { x: number, y: number }[];
}

const radius = 40;

function circlePoint(i: number, length: number) {
    const angle = (i % length) / length * 2 * Math.PI;
    return {
        x: radius + radius * Math.cos(angle),
        y: radius + radius * Math.sin(angle)
    };
}

class App extends React.Component<any, IState> {
    private timer: number;

    constructor(p: any) {
        super(p);
        this.state = { animationIndex: 0, points: range(0, 20).map((pt, i, arr) => circlePoint(i, arr.length)) };
    }

    private moveNext = () => {
        const animationIndex = this.state.animationIndex + 1;
        const points = this.state.points.map((pt, i, arr) => circlePoint(i + animationIndex, arr.length));
        this.setState({ animationIndex: animationIndex, points: points });
    }

    private componentDidMount() {
        this.timer = window.setInterval(this.moveNext, 8000)
    }

    private componentWillUnmount() {
        window.clearInterval(this.timer);
    }


    render() {
        const { points } = this.state;
        const numPoints = points.length;
        return <div id="root" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black" }}>
            <Graph backgroundColor="#0f0f0f" height={600} width={600} run={true} >
                {
                    points.map((p, i) =>
                        <Node key={"node" + i} id={"node" + i} label={i.toString()} x={p.x} y={p.y} labelColor="white" >
                            <Link linkTo={"node" + (i + 1) % numPoints} ratePerSecond={10} variationMin={-0.1} variationMax={0.1} color={`rgb(${255-i/points.length*200},200,${i/points.length*200+50})`} />
                            <Link linkTo={"node" + Math.floor(i + numPoints / 2) % numPoints} ratePerSecond={10} color="#e0e0ff" />
                        </Node>
                    )
                }
            </Graph>
        </div>;
    }

}


document.addEventListener("DOMContentLoaded", () => {
    console.log("ready");
    ReactDOM.render(<App />, document.getElementById("root"));
}
);