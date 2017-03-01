import * as React from "react"
import { range } from "lodash";
import { EdgeFlowDag, NodeDag, EdgeDag } from ".."

export interface IState {
    nodes: { name: string }[];
}

export interface IProps {
    width: number;
    height: number;
    animate: boolean;
}

export default class Partition extends React.PureComponent<IProps, IState> {

    constructor(p: any) {
        super(p);
        this.state = {
            nodes: []
        };
    }

    componentWillReceiveProps(newProps: IProps) {
    }

    private addNode = () => {
        this.setState({ nodes: [{ name: "node" + this.state.nodes.length }, ...this.state.nodes] })
    }

    render() {
        console.log("Rendering network")
        const { animate, width, height} = this.props;
        const inc = 1, x = 10, y = 10;
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height || 200, width: width || 200, overflow: "hidden" }}>
            <div key="tool" style={{ position: "absolute", right: 5, top: 5 }}>
                <button onClick={this.addNode}>Add Node</button>
            </div>
            <EdgeFlowDag style={{ height: (height || 200) , width: (width || 200) , backgroundColor: "#020210" }} run={animate} >
                {[
                    <NodeDag key="source" id="source" symbol={"\uf109"} label="Source" symbolColor="white" symbolSize={50} >
                        <EdgeDag key="11E" linkTo="connector1" ratePerSecond={20} variationMax={0.02} variationMin={-0.02} size={20} shape={1} color="blue" endingColor="green" />
                        <EdgeDag key="12E" linkTo="connector2" ratePerSecond={20} variationMax={0.02} variationMin={-0.02} size={20} shape={1} color="blue" endingColor="green" />
                        <EdgeDag key="13E" linkTo="connector3" ratePerSecond={20} variationMax={0.02} variationMin={-0.02} size={20} shape={1} color="blue" endingColor="green" />
                    </NodeDag>,

                    <NodeDag key="connector1" id="connector1" symbol={"\u2225"} symbolSize={50} label="t1">
                        <EdgeDag key="21E" linkTo="connector11" ratePerSecond={20} size={20} variationMax={0.02} variationMin={-0.02} shape={1} color="green" endingColor="red" />
                    </NodeDag>,
                    <NodeDag key="connector2" id="connector2" symbol={"\u2225"} symbolSize={50} label="t2">
                        <EdgeDag key="21E" linkTo="connector23" ratePerSecond={20} size={20} variationMax={0.02} variationMin={-0.02} shape={1} color="green" endingColor="red" />
                    </NodeDag>,
                    <NodeDag key="connector3" id="connector3" symbol={"\u2225"} symbolSize={50}>
                        <EdgeDag key="21E" linkTo="connector13" ratePerSecond={20} size={20} variationMax={0.02} variationMin={-0.02} shape={1} color="green" endingColor="red" />
                    </NodeDag>,

                    <NodeDag key="connector11" id="connector11" symbol={"\u2225"} symbolSize={50}>
                        <EdgeDag key="21E" linkTo="target" ratePerSecond={20} size={20} variationMax={0.02} variationMin={-0.02} shape={1} color="green" endingColor="red" />
                    </NodeDag>,
                    <NodeDag key="connector12" id="connector12" symbol={"\u2225"} symbolSize={50}>
                        <EdgeDag key="21E" linkTo="target" ratePerSecond={20} size={20} variationMax={0.02} variationMin={-0.02} shape={1} color="green" endingColor="red" />
                    </NodeDag>,
                    <NodeDag key="connector13" id="connector13" symbol={"\u2225"} symbolSize={50}>
                        <EdgeDag key="21E" linkTo="connector23" ratePerSecond={20} size={20} variationMax={0.02} variationMin={-0.02} shape={1} color="green" endingColor="red" />
                    </NodeDag>,

                    <NodeDag key="connector23" id="connector23" symbol={"\u2225"} symbolSize={50}>
                        <EdgeDag key="21E" linkTo="target" ratePerSecond={20} size={20} variationMax={0.02} variationMin={-0.02} shape={1} color="green" endingColor="red" />
                    </NodeDag>,

                    <NodeDag key="target" id="target" symbol={"\uf109"} symbolColor="white" symbolSize={50}>
                    </NodeDag>,
                    ...this.state.nodes.map((n, i) => <NodeDag key={"node" + i} id={"node" + i} symbol={"\uf109"} symbolColor="white" symbolSize={50}>
                        <EdgeDag linkTo="target" ratePerSecond={8} size={20} variationMax={0.04} variationMin={-0.04} shape={1} color="green" endingColor="red" />
                    </NodeDag>)
                ]}
            </EdgeFlowDag>
        </div >;
    }
}