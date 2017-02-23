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
                <NodeForce key="source" id="source" >
                    <EdgeForce key="12E" linkTo="connector"  ratePerSecond={20} />
                </NodeForce>
                <NodeForce key="connector" id="connector" >
                    <EdgeForce key="21E" linkTo="target" ratePerSecond={20}/>
                </NodeForce>
                <NodeForce key="target" id="target" >
                </NodeForce>
            </EdgeFlowForce>
        </div >;
    }
}