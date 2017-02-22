/// <reference types="react" />
import * as React from "react";
import { Edge, IEdgeProps } from "./edge-flow/edge-flow-edge";
import { Node, INodeProps } from "./edge-flow/edge-flow-node";
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
export interface IProps {
    run?: boolean;
    style: {
        width: number;
        height: number;
        backgroundColor?: string;
    };
    onClickNode?: (args: NodeClickEventArgs) => void;
    selectedNodeId?: string;
    children?: Node[];
}
export interface IState {
}
export declare class EdgeFlow extends React.Component<IProps, IState> {
    constructor(p: IProps);
    render(): JSX.Element;
}
