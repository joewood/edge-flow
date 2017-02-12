/// <reference types="react" />
import * as React from "react";
export interface INode {
    symbol?: string;
    symbolColor?: string;
    symbolSize?: number;
    symbolFont?: string;
    label?: string;
    labelColor?: string;
    id: string;
    x: number;
    y: number;
    annotation?: boolean;
    group?: boolean;
}
export interface IEdge {
    linkTo: string;
    ratePerSecond?: number;
    name?: string;
    color?: string;
    shape?: number;
    size?: number;
    pathColor?: string;
    pathWidth?: number;
    pathOpacity?: number;
    variationMin?: number;
    variationMax?: number;
    endingColor?: string;
}
export interface INodeProps extends INode {
    children?: Edge[];
}
export declare class Node extends React.Component<INodeProps, any> {
    getLinks(): IEdgeProps[];
    render(): JSX.Element;
}
export interface IEdgeProps extends IEdge {
}
export declare class Edge extends React.Component<IEdgeProps, any> {
    render(): JSX.Element;
}
