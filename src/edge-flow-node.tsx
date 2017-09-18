import * as React from "react";

import { INode } from "./model";
import { IEdgeProps } from "./edge-flow-edge";

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
