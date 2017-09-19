import * as React from "react";

import { INode, IEdge} from "./model";


export interface IEdgeProps extends IEdge {
}

export class Edge extends React.Component<IEdgeProps, any> {
    public render() { return <div>Do Not Render</div>; }
}


export interface INodeProps extends INode {
    children?: any;
}

export class Node extends React.Component<INodeProps, any> {
    public getLinks(): IEdgeProps[] {
        return React.Children.map(this.props.children, (c: any) => c.props);
    }
    public render() {
        return <div>Do Not Render</div>;
    }
}
