/// <reference types="react" />
import * as React from "react";
import { Node } from "./edge-flow-node";
export { Edge, IEdgeProps } from "./edge-flow-edge";
export { Node, INodeProps } from "./edge-flow-node";
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
