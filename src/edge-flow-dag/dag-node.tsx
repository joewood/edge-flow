import * as React from "react";

import { INode } from "./model";
import { IEdgeDagProps } from "./dag-edge";

export interface INodeDagProps extends INode {
    children?: any;
}

export class Node extends React.Component<INodeDagProps, any> {
    public getLinks(): IEdgeDagProps[] {
        return React.Children.map(this.props.children, (c: any) => c.props);
    }
    public render() {
        return <div>Do Not Render</div>;
    }
}
