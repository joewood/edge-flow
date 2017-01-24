/// <reference types="react" />
import * as React from "react";
export interface INode {
    symbol?: string;
    symbolColor?: string;
    symbolSize?: number;
    symbolFont?: number;
    label?: string;
    labelColor?: string;
    id: string;
    x: number;
    y: number;
    annotation?: boolean;
    group?: boolean;
}
export interface ILink {
    linkTo: string;
    ratePerSecond?: number;
    name?: string;
    color?: string;
    size?: number;
    variationMin?: number;
    variationMax?: number;
}
export interface INodeProps extends INode {
    children?: Link[];
}
export declare class Node extends React.Component<INodeProps, any> {
    getLinks(): ILinkProps[];
    render(): JSX.Element;
}
export interface ILinkProps extends ILink {
}
export declare class Link extends React.Component<ILinkProps, any> {
    render(): JSX.Element;
}
