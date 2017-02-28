/// <reference types="react" />
import * as React from "react";
export interface IState {
    nodes: {
        name: string;
    }[];
}
export interface IProps {
    width: number;
    height: number;
    animate: boolean;
}
export default class Partition extends React.PureComponent<IProps, IState> {
    constructor(p: any);
    componentWillReceiveProps(newProps: IProps): void;
    private addNode;
    render(): JSX.Element;
}
