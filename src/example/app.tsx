import * as React from "react";
import * as ReactDOM from "react-dom";
import "font-awesome/css/font-awesome.css";
import Network from "./network";

interface IState {
    width?: number;
    height?: number;
    animate?: boolean;
    nodes?: { name: string }[];
    selectedNode?: string;
}

class App extends React.Component<any, IState> {
    // private resizeHandler: EventListenerOrEventListenerObject;
    private div: HTMLDivElement;
    private nodeIndex=10;

    constructor(p: any) {
        super(p);
        this.state = {
            nodes: [],
            height: 300,
            width: 300,
            animate: false,
            selectedNode: null
        };
    }

    private onResize = () => {
        console.log("resize");
        this.setState({
            width: document.getElementById("root").clientWidth,
            height: document.getElementById("root").clientHeight
        });
    };

    public componentDidMount() {
        // this.timer = window.setInterval(this.moveNext, 2000);
        window.addEventListener("resize", this.onResize);
        this.setState({
            width: document.getElementById("root").clientWidth,
            height: document.getElementById("root").clientHeight - 20
        });
    }

    public componentWillUnmount() {
        // window.clearInterval(this.timer);
        window.removeEventListener("resize", this.onResize);
    }


    private addNode = () => {
        this.setState({ nodes: [{ name: "node" + this.nodeIndex++ }, ...this.state.nodes] });
    };

    private removeNode = () => {
        console.log("Removing  " + this.state.selectedNode, this.state.nodes);
        this.setState({ nodes: this.state.nodes.filter(n => n.name != this.state.selectedNode) });
        console.log(
            "Removing Afer " + this.state.selectedNode,
            this.state.nodes.filter(n => n.name != this.state.selectedNode)
        );
    };

    public render() {
        const { width, height, animate } = this.state;
        const buttonStyle = { height: 50, width: 130, margin: 5, color: "black" };
        return (
            <div
                key="root"
                id="root"
                style={{ backgroundColor: "black", overflow: "hidden" }}
                ref={div => (this.div = div)}
            >
                <div style={{ height: 60 }}>
                    <button
                        key="pause"
                        style={buttonStyle}
                        onClick={() => this.setState({ animate: !this.state.animate })}
                    >
                        Pause
                    </button>
                    <button key="Add" style={buttonStyle} onClick={this.addNode}>
                        Add
                    </button>
                    <button key="Remove" style={buttonStyle} onClick={this.removeNode}>
                        Remove {this.state.selectedNode}
                    </button>
                    <button key="Reset" style={buttonStyle} onClick={() => this.setState({ nodes: [] })}>
                        Reset
                    </button>
                </div>
                <Network
                    animate={animate}
                    height={height - 60}
                    width={width}
                    nodes={this.state.nodes}
                    selectedNode={this.state.selectedNode}
                    onSelectNode={node => {
                        console.log("NODE", node);
                        this.setState({ selectedNode: node });
                    }}
                />
            </div>
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(<App />, document.getElementById("root"));
});
