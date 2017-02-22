import * as React from "react";

import { INode, IEdge} from "./model";
import { Edge, IEdgeProps } from "./edge-flow-edge";

export interface INodeProps extends INode {
    children?: Edge[];
}

export class Node extends React.Component<INodeProps, any> {
    public getLinks(): IEdgeProps[] {
        return React.Children.map(this.props.children, (c: any) => c.props);
    }
    public render() { return <div>Do Not Render</div>; }
}
