/// <reference types="react" />
import * as React from "react";
import { IBaseProps } from "./edge-flow";
import { Edge as EdgeForce, IEdgeForceProps } from "./edge-flow-force/force-edge";
import { Node as NodeForce, INodeForceProps } from "./edge-flow-force/force-node";
export { EdgeForce, IEdgeForceProps, NodeForce, INodeForceProps };
import { IPosNode } from "./edge-flow-force/ngraph-helper";
export interface IProps extends IBaseProps {
    children?: NodeForce[];
}
export interface IState {
    nodes?: IPosNode[];
}
export declare class EdgeFlowForce extends React.Component<IProps, IState> {
    constructor(p: IProps);
    private getStateFromProps(newProps);
    private componentWillReceiveProps(newProps);
    render(): JSX.Element;
}
