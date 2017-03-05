import * as React from "react"
// import { range } from "lodash";
import { EdgeFlow, Node, Edge } from ".."

export interface IState {
    // points: { x: number, y: number }[];
}

export interface IProps {
    width: number;
    height: number;
    animationIndex: number;
    animate: boolean;
}


export default class Partition extends React.Component<IProps, IState> {

    constructor(p: any) {
        super(p);
        this.state = {
            // points: range(0, 24).map((pt, i, arr) => circlePoint(i, arr.length)),
        };
    }

    // componentWillReceiveProps(newProps: IProps) {
    //     // const points = this.state.points.map((pt, i, arr) => circlePoint(i + newProps.animationIndex, arr.length));
    //     // this.setState({ points: points });
    // }

    private inc = 0;

    getPartition(x: number, y: number): JSX.Element[] {
        const inc = this.inc++;
        const sourceInc = Math.floor(inc / 2);
        return [
            (!(inc % 2)) && <Node key={"source" + sourceInc} id={"source" + sourceInc} label="source" center={{ x: x, y: y }}  >
                <Edge linkTo={"head" + inc} color="red" shape={1.0} size={12} ratePerSecond={20} pathColor="black" />
                <Edge linkTo={"head" + (inc + 1)} color="red" shape={1.0} size={12} ratePerSecond={20} pathColor="black" />
            </Node>,
            <Node key={"head" + inc} id={"head" + inc} center={{ x: x + 5 + inc, y: y + 10 }} group >
                <Edge linkTo={"tail" + inc} color="rgb(255,224,224)" shape={0.01} size={6} nonrandom pathOpacity={1}
                    variationMax={0} variationMin={0}
                    endingColor="rgba(55,55,55,0.0)" pathColor="#101010" pathWidth={20} ratePerSecond={12} />
            </Node >,
            <Node key={"tail" + inc} id={"tail" + inc} center={{ x: x + 5 + inc, y: y + 55 }} group />,
            <Node key={"deq" + inc} id={"deq" + inc} center={{ x: x + 5.1 + inc, y: y + 15 }} group>
                <Edge linkTo={"sink" + inc} ratePerSecond={20} shape={1} size={12} color="#a0a0a0" pathColor="black" />
            </Node>,
            <Node key={"sink" + inc} id={"sink" + inc} center={{ x: x + 20, y: y }} label="sink" />
        ].filter(f => !!f);
    }


    render() {
        const { animate,  width, height} = this.props;
        // const inc = 1, x = 10, y = 10;
        this.inc = 0;
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height || 200, width: width || 200, overflow: "hidden" }}>
            <EdgeFlow style={{ height: (height || 200) * 0.9, width: (width || 200) * 0.9, backgroundColor: "black" }} run={animate} >
                {
                    [...this.getPartition(10, 10),
                    ...this.getPartition(10, 30),
                    ...this.getPartition(10, 50),
                    ...this.getPartition(10, 70),
                    ...this.getPartition(10, 90),
                    ...this.getPartition(10, 110),
                    ]
                }
            </EdgeFlow>
        </div >;
    }
}