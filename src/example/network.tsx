import * as React from "react"
import { range } from "lodash";
import { EdgeFlowForce, NodeForce, EdgeForce } from ".."

export interface IState {
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
        };
    }

    componentWillReceiveProps(newProps: IProps) {
    }

    render() {
        const { animate, animationIndex, width, height} = this.props;
        const inc = 1, x = 10, y = 10;
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height || 200, width: width || 200, overflow: "hidden" }}>
            <EdgeFlowForce style={{ height: (height || 200) * 0.9, width: (width || 200) * 0.9, backgroundColor: "black" }} run={animate} >

                <NodeForce key="source" id="source" x={0} y={200} fixed symbol={"\uf109"} symbolColor="white" symbolSize={50} >
                    <EdgeForce key="11E" linkTo="connector1" ratePerSecond={20} variationMax={0.2} variationMin={-0.2} size={20} shape={1} color="blue" endingColor="green" />
                    <EdgeForce key="12E" linkTo="connector2" ratePerSecond={20} variationMax={0.2} variationMin={-0.2} size={20} shape={1} color="blue" endingColor="green" />
                    <EdgeForce key="13E" linkTo="connector3" ratePerSecond={20} variationMax={0.2} variationMin={-0.2} size={20} shape={1} color="blue" endingColor="green" />
                </NodeForce>

                <NodeForce key="connector1" id="connector1" x={100} y={320} fixed symbol={"\u2225"} symbolSize={50}>
                    <EdgeForce key="21E" linkTo="connector11" ratePerSecond={20} size={20} variationMax={0.2} variationMin={-0.2} shape={1} color="green" endingColor="red" />
                </NodeForce>
                <NodeForce key="connector2" id="connector2" symbol={"\u2225"} y={200} lockXTo="connector1"  lockYTo="source" symbolSize={50}>
                    <EdgeForce key="21E" linkTo="connector12" ratePerSecond={20} size={20} variationMax={0.2} variationMin={-0.2} shape={1} color="green" endingColor="red"/>
                </NodeForce>
                <NodeForce key="connector3" id="connector3" symbol={"\u2225"} lockXTo="connector1" symbolSize={50}>
                    <EdgeForce key="21E" linkTo="connector13" ratePerSecond={20} size={20} variationMax={0.2} variationMin={-0.2} shape={1} color="green" endingColor="red"/>
                </NodeForce>

                <NodeForce key="connector11" id="connector11" x={200} y={320} fixed symbol={"\u2225"} symbolSize={50}>
                    <EdgeForce key="21E" linkTo="target" ratePerSecond={20} size={20} variationMax={0.2} variationMin={-0.2} shape={1} color="green" endingColor="red" />
                </NodeForce>
                <NodeForce key="connector12" id="connector12" lockXTo="connector11" y={200}  lockYTo="source" symbol={"\u2225"} symbolSize={50}>
                    <EdgeForce key="21E" linkTo="target" ratePerSecond={20} size={20} variationMax={0.2} variationMin={-0.2} shape={1} color="green" endingColor="red" />
                </NodeForce>
                <NodeForce key="connector13" id="connector13" lockXTo="connector11" y={100} symbol={"\u2225"} symbolSize={50}>
                    <EdgeForce key="21E" linkTo="target" ratePerSecond={20} size={20} variationMax={0.2} variationMin={-0.2} shape={1} color="green" endingColor="red" />
                </NodeForce>
                <NodeForce key="target" id="target" x={500} y={200} fixed symbol={"\uf109"} symbolColor="white" symbolSize={50}>
                </NodeForce>
            </EdgeFlowForce>
        </div >;
    }
}