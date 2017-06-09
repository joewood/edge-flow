/// <reference types="react" />
import * as React from "react";
import { Edge, IEdgeProps } from "./edge-flow-edge";
import { Node, INodeProps } from "./edge-flow-node";
import { NodeClickEventArgs, IPathStyle, IParticleStyle, IStyle } from "./model";
export { Edge, IEdgeProps, Node, INodeProps };
export interface IBaseProps {
    animate?: boolean;
    style: {
        width: number;
        height: number;
        backgroundColor?: string;
    };
    maxScale?: number;
    iconStyle?: IStyle;
    labelStyle?: IStyle;
    pathStyle?: IPathStyle;
    particleStyle?: IParticleStyle;
    nodeStyle?: {
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
