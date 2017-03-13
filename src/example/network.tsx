import * as React from "react"
// import { range } from "lodash";
import { EdgeFlowDag, NodeDag, EdgeDag } from ".."

export interface IState {
    nodes: { name: string }[];
    flow: number;
    selectedNode: string;
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
            selectedNode: null
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

    private selectNode = (args: { nodeId: string }) => {
        console.log("Select Node ", args)
        this.setState({ selectedNode: args.nodeId })
    }

    render() {
        console.log("Rendering network")
        const { animate, width, height } = this.props;
        // const inc = 1, x = 10, y = 10;
        const nodeStyle = {
            icon: "\uf109",
            iconStyle: {
                color: "#efefef",
                fontSize: 18
            }, labelStyle: {
                color: "#d0d0c0"
            },
            style: { width: 20, height: 10 }
        };
        const topicNode = {
            icon: "\u2225",
            iconStyle: {
                color: "#d8d8d8",
                fontSize: 14
            },
            labelStyle: {
                color: "#d0d0c0"
            },
            style: { width: 10, height: 10 }
        };
        const edgeStyle = {
            nonrandom: true,
            ratePerSecond: (this.state.flow),
            particleStyle: {
                variationMax: 0.05,
                variationMin: -0.05,
                roundness: 0.85,
                size: 4,
                endingColor: "rgb(128,128,255)",
                color: "#ffff90"
            },
            pathStyle: { width: 8, opacity: 0.1 }
        };
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height || 200, width: width || 200, overflow: "hidden" }}>
            <div key="tool" style={{ position: "absolute", right: 5, top: 5 }}>
                <button onClick={this.addNode}>Add Node</button>
            </div>
            <EdgeFlowDag style={{ height: (height || 200), width: (width || 200), backgroundColor: "#080810" }} animate={animate} selectedNodeId={this.state.selectedNode}
                onClickNode={this.selectNode} >
                {[
                    <NodeDag key="source" id="source" {...nodeStyle} label="source events" >
                        <EdgeDag key="11E" linkTo="connector1" {...edgeStyle} />
                        <EdgeDag key="12E" linkTo="connector2" {...edgeStyle} />
                        <EdgeDag key="13E" linkTo="connector3" {...edgeStyle} />
                    </NodeDag>,

                    <NodeDag key="connector1" id="connector1" {...topicNode} label="topic 1">
                        <EdgeDag key="21E" linkTo="connector11" {...edgeStyle} />
                    </NodeDag>,
                    <NodeDag key="connector2" id="connector2" {...topicNode} label="topic 2">
                        <EdgeDag key="21E" linkTo="connector23" {...edgeStyle} />
                    </NodeDag>,
                    <NodeDag key="connector3" id="connector3" {...topicNode} label="topic 3">
                        <EdgeDag key="21E" linkTo="connector13" {...edgeStyle} />
                    </NodeDag>,
                    <NodeDag key="connector11" id="connector11" {...topicNode} label="topic 4">
                        <EdgeDag key="21E" linkTo="target" {...edgeStyle} />
                    </NodeDag>,
                    <NodeDag key="connector12" id="connector12" {...topicNode} label="topic 5">
                        <EdgeDag key="21E" linkTo="target" {...edgeStyle} />
                    </NodeDag>,
                    <NodeDag key="connector13" id="connector13" {...topicNode}>
                        {[
                            ...this.state.nodes
                                .filter((n, i) => ((n && i) % 2) == 1)
                                .map((n, i) => <EdgeDag linkTo={n && "node" + i} key={"node" + i} {...edgeStyle} />),
                            <EdgeDag key="21E" linkTo="connector23" {...edgeStyle} />
                        ]}
                    </NodeDag>,

                    <NodeDag key="connector23" id="connector23" {...topicNode}>
                        <EdgeDag key="21E" linkTo="target" {...edgeStyle} />
                    </NodeDag>,
                    ...this.state.nodes.map((n, i) => <NodeDag key={n && "node" + i} id={"node" + i} {...topicNode} label={"topic " + (i + 8)}>
                        <EdgeDag linkTo={(i % 2) ? "target" : "connector23"} {...edgeStyle} />
                    </NodeDag>),
                    <NodeDag key="target" id="target" {...nodeStyle} label="target" />
                ]}
            </EdgeFlowDag>
        </div >;
    }
}