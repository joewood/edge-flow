import * as React from "react"
import { range } from "lodash";
import { EdgeFlow, Node, Edge } from ".."

export interface IState {
    points: { x: number, y: number }[];
}

export interface IProps {
    width: number;
    height: number;
    animationIndex: number;
    animate: boolean;
}

const radius = 200;

function circlePoint(i: number, length: number) {
    console.log("Circle " + i + " " + length);
    const angle = (i % length) / length * 2 * Math.PI;
    return {
        x: radius + radius * Math.cos(angle),
        y: radius + radius * Math.sin(angle)
    };
}

export default class Swirl extends React.Component<IProps, IState> {

    constructor(p: any) {
        super(p);
        this.state = {
            points: range(0, 24).map((_pt, i) => circlePoint(i, 24)),
        };
    }

    componentWillReceiveProps(newProps: IProps) {
        const points = this.state.points.map((pt, i, arr) => circlePoint(i + (pt && newProps.animationIndex), arr.length));
        this.setState({ points: points });

    }

    render() {
        const { points } = this.state;
        const { animate, width, height } = this.props;
        const numPoints = points.length;
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height, width: width, overflow: "hidden" }}>
            <EdgeFlow key="edgeflow" style={{ height: height * 0.8 - 20, width: width * 0.8, backgroundColor: "#0f0f0f" }} 
            
            animate={animate} >
                {
                    [...points.map((p, i) =>
                        <Node key={"node" + i} id={"node" + i} label={i.toString()} center={{ x: p.x, y: p.y }}
                            labelStyle={{
                                color: "white"
                            }}>
                            <Edge linkTo={"node" + (i + 1) % numPoints}
                                ratePerSecond={7}
                                particleStyle={{
                                    variationMin: -0.1,
                                    variationMax: 0.1,
                                    size: 8.0,
                                    roundness: 0.6,
                                    color: `rgb(${Math.round(255 - i / points.length * 200)},200,${Math.round(i / points.length * 200 + 50)})`
                                }}
                                pathStyle={{
                                    opacity: 0.05,
                                    color: `rgb(${Math.round(255 - i / points.length * 200)},200,${Math.round(i / points.length * 200 + 50)})`
                                }}
                            />

                            }}
                            <Edge linkTo={"nodep-" + Math.floor(i / points.length * 4)}
                                ratePerSecond={10}
                                nonrandom
                                p0={{ x: p.x, y: p.y }}
                                p1={{ x: p.x + 10.0, y: p.y + 10.0 }}
                                p2={{ x: radius + 40, y: radius + 40 }}
                                p3={{ x: radius, y: radius }}
                                particleStyle={{
                                    color: "#e0ffe0",
                                    size: 8,
                                    roundness: 0.6,
                                    endingColor: "rgba(192,255,192,0.0)"
                                }}
                                pathStyle={{
                                    width: 3,
                                    opacity: 0.001
                                }}
                            />
                        </Node>),
                    <Node key="nodep-0" id="nodep-0" center={{ x: radius + radius / 8, y: radius + radius / 8 }} group />,
                    <Node key="nodep-1" id="nodep-1" center={{ x: radius - radius / 8, y: radius + radius / 8 }} group />,
                    <Node key="nodep-2" id="nodep-2" center={{ x: radius - radius / 8, y: radius - radius / 8 }} group />,
                    <Node key="nodep-3" id="nodep-3" center={{ x: radius + radius / 8, y: radius - radius / 8 }} group />,
                    ]
                }
            </EdgeFlow>
        </div >;
    }
}