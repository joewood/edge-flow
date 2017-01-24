/// <reference types="react" />
import * as React from "react";
import { Node } from "./drawing-node";
export { Node, Link, INode, ILink, ILinkProps, INodeProps } from "./drawing-node";
export interface IEvent {
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
    text?: string;
    width: number;
    height: number;
    run?: boolean;
    containerStyle?: React.CSSProperties;
    onClickNode?: (args: IEvent) => void;
    backgroundColor?: string;
    selectedNodeId?: string;
    children?: Node[];
}
export interface IState {
}
export declare class Graph extends React.Component<IProps, IState> {
    constructor(p: IProps);
    render(): JSX.Element;
}
