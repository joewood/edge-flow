/// <reference types="react" />
import * as React from "react";
import { IBaseProps } from "./edge-flow";
import { EdgeDag, IEdgeDagProps, NodeDag, INodeDagProps } from "./edge-flow-dag-children";
import { IPosNode } from "./dagre-helper";
export { EdgeDag, IEdgeDagProps, NodeDag, INodeDagProps };
export interface IProps extends IBaseProps {
    children?: any;
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
