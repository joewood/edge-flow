import * as React from "react"
// import { range } from "lodash";
import { EdgeFlowDag, NodeDag, EdgeDag } from ".."

export interface IState {
    nodes: { name: string }[];
    flow: number;
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
            nodes: [],
            flow: 10,
        };
    }

    private interval1: any;

    public invcFlow = () => {
        this.setState({ flow: (this.state.flow + 2) % 100 });
    }

    public componentDidMount() {
        // this.interval1 = setInterval(this.invcFlow, 1000) ;
    }

    public componentWillUnmounnt() {
        if (this.interval1) clearInterval(this.interval1);
    }

    private addNode = () => {
        this.setState({ nodes: [{ name: "node" + this.state.nodes.length }, ...this.state.nodes] })
    }

    render() {
        console.log("Rendering network")
        const { animate, width, height } = this.props;
        // const inc = 1, x = 10, y = 10;
        const nodeStyle = { symbol: "\uf109", symbolColor: "white", symbolSize: 35, width: 10, height: 10 };
        const topicNode = { symbol: "\u2225", symbolColor: "white", symbolSize: 50, width: 2, height: 10 };
        const edgeStyle = { nonrandom:true, ratePerSecond:  (this.state.flow), variationMax: 0.05, variationMin: -0.05, size: 10, shape: 0.65, color: "#ffff90", endingColor: "rgb(128,128,255)" };
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height || 200, width: width || 200, overflow: "hidden" }}>
            <div key="tool" style={{ position: "absolute", right: 5, top: 5 }}>
                <button onClick={this.addNode}>Add Node</button>
            </div>
            <EdgeFlowDag style={{ height: (height || 200), width: (width || 200), backgroundColor: "#080810" }} run={animate} >
                {[
                    <NodeDag key="source" id="source" {...nodeStyle} >
                        <EdgeDag key="11E" linkTo="connector1" {...edgeStyle} />
                        <EdgeDag key="12E" linkTo="connector2" {...edgeStyle} />
                        <EdgeDag key="13E" linkTo="connector3" {...edgeStyle} />
                    </NodeDag>,

                    <NodeDag key="connector1" id="connector1" {...topicNode} label="t1">
                        <EdgeDag key="21E" linkTo="connector11" {...edgeStyle} />
                    </NodeDag>,
                    <NodeDag key="connector2" id="connector2" {...topicNode} label="t2">
                        <EdgeDag key="21E" linkTo="connector23" {...edgeStyle} />
                    </NodeDag>,
                    <NodeDag key="connector3" id="connector3" {...topicNode}>
                        <EdgeDag key="21E" linkTo="connector13" {...edgeStyle} />
                    </NodeDag>,

                    <NodeDag key="connector11" id="connector11" {...topicNode}>
                        <EdgeDag key="21E" linkTo="target" {...edgeStyle} />
                    </NodeDag>,
                    <NodeDag key="connector12" id="connector12" {...topicNode}>
                        <EdgeDag key="21E" linkTo="target" {...edgeStyle} />
                    </NodeDag>,
                    <NodeDag key="connector13" id="connector13" {...topicNode}>
                        {[
                            ...this.state.nodes
                                .filter((n, i) => ((n && i) % 2) == 1)
                                .map((n, i) => <EdgeDag linkTo={ n && "node" + i} key={"node" + i} {...edgeStyle} />),
                            <EdgeDag key="21E" linkTo="connector23" {...edgeStyle} />
                        ]}
                    </NodeDag>,

                    <NodeDag key="connector23" id="connector23" {...topicNode}>
                        <EdgeDag key="21E" linkTo="target" {...edgeStyle} />
                    </NodeDag>,
                    <NodeDag key="target" id="target" {...nodeStyle}>
                    </NodeDag>,
                    ...this.state.nodes.map((n, i) => <NodeDag key={n && "node" + i} id={"node" + i} {...topicNode}>
                        <EdgeDag linkTo={(i % 2) ? "target" : "connector23"} {...edgeStyle} />
                    </NodeDag>)
                ]}
            </EdgeFlowDag>
        </div >;
    }
}