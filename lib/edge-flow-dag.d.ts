/// <reference types="react" />
import * as React from "react";
import { IBaseProps } from "./edge-flow";
import { Edge as EdgeDag, IEdgeDagProps } from "./edge-flow-dag/dag-edge";
import { Node as NodeDag, INodeDagProps } from "./edge-flow-dag/dag-node";
export { EdgeDag, IEdgeDagProps, NodeDag, INodeDagProps };
import { IPosNode } from "./edge-flow-dag/dagre-helper";
export interface IProps extends IBaseProps {
    children?: NodeDag[];
}
export interface IState {
    nodes?: IPosNode[];
}
export declare class EdgeFlowDag extends React.PureComponent<IProps, IState> {
    constructor(p: IProps);
    private getStateFromProps(newProps, force?);
    componentWillReceiveProps(newProps: IProps): void;
    render(): JSX.Element;
}
