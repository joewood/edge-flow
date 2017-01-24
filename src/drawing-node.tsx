import * as React from "react";


export interface INode {
    symbol?: string;
    symbolColor?:string;
    symbolSize?:number;
    symbolFont?:number;
    label?:string;
    labelColor?:string;
    id: string;
    x: number;
    y: number;
    annotation?:boolean;
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

export class Node extends React.Component<INodeProps, any> {
    public getLinks(): ILinkProps[] {
        return React.Children.map(this.props.children, (c: any) => c.props);
    }
    public render() { return <div>Do Not Render</div>; }
}

export interface ILinkProps extends ILink {
}

export class Link extends React.Component<ILinkProps, any> {
    public render() { return <div>Do Not Render</div>; }
}
