import * as React from "react";

import { IPositionlessEdge, IPositionlessNode } from "./model";

export interface INodeDagProps extends IPositionlessNode {
    children?: any;
}

export class NodeDag extends React.Component<INodeDagProps, any> {
    public getLinks(): IEdgeDagProps[] {
        return React.Children.map(this.props.children, (c: any) => c.props);
    }
    public render() {
        return <div>Do Not Render</div>;
    }
}

export interface IEdgeDagProps extends IPositionlessEdge {}

export class EdgeDag extends React.Component<IEdgeDagProps, any> {
    public render() {
        return <div>Do Not Render</div>;
    }
}
