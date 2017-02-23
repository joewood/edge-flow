import * as React from "react";

import { INode, IEdge} from "./model";
import { Edge, IEdgeForceProps } from "./force-edge";

export interface INodeForceProps extends INode {
    children?: Edge[];
}

export class Node extends React.Component<INodeForceProps, any> {
    public getLinks(): IEdgeForceProps[] {
        return React.Children.map(this.props.children, (c: any) => c.props);
    }
    public render() { return <div>Do Not Render</div>; }
}
