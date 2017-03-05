/// <reference types="react" />
import * as React from "react";
export interface IState {
}
export interface IProps {
    width: number;
    height: number;
    animationIndex: number;
    animate: boolean;
}
export default class Partition extends React.Component<IProps, IState> {
    constructor(p: any);
    private inc;
    getPartition(x: number, y: number): JSX.Element[];
    render(): JSX.Element;
}
