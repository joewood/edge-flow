/// <reference types="react" />
import * as React from "react";
import { IEdge } from "./model";
export interface IEdgeDagProps extends IEdge {
}
export declare class Edge extends React.Component<IEdgeDagProps, any> {
    render(): JSX.Element;
}
