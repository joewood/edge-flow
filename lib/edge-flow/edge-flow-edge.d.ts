/// <reference types="react" />
import * as React from "react";
import { IEdge } from "./model";
export interface IEdgeProps extends IEdge {
}
export declare class Edge extends React.Component<IEdgeProps, any> {
    render(): JSX.Element;
}
