/// <reference types="react" />
import * as React from "react";
import { IEdge } from "./model";
export interface IEdgeForceProps extends IEdge {
}
export declare class Edge extends React.Component<IEdgeForceProps, any> {
    render(): JSX.Element;
}
