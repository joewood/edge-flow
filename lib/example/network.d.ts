/// <reference types="react" />
import * as React from "react";
export interface IState {
    nodes: {
        name: string;
    }[];
    flow: number;
}
export interface IProps {
    width: number;
    height: number;
    animate: boolean;
}
export default class Partition extends React.PureComponent<IProps, IState> {
    constructor(p: any);
    private interval1;
    invcFlow: () => void;
    componentDidMount(): void;
    componentWillUnmounnt(): void;
    private addNode;
    render(): JSX.Element;
}
