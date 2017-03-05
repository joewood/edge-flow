/// <reference types="react" />
import * as React from "react";
import { Edge, IEdgeProps } from "./edge-flow-edge";
import { Node, INodeProps } from "./edge-flow-node";
export { Edge, IEdgeProps, Node, INodeProps };
export interface NodeClickEventArgs {
    nodeId: string;
    graph: {
        x: number;
        y: number;
    };
    screen: {
        x: number;
        y: number;
    };
}
export interface IBaseProps {
    run?: boolean;
    style: {
        width: number;
        height: number;
        backgroundColor?: string;
    };
    nodeSize?: {
        width: number;
        height: number;
    };
    onClickNode?: (args: NodeClickEventArgs) => void;
    selectedNodeId?: string;
}
export interface IProps extends IBaseProps {
    children?: Node[];
}
export interface IState {
}
export declare class EdgeFlow extends React.Component<IProps, IState> {
    constructor(p: IProps);
    render(): JSX.Element;
}
