/// <reference types="react" />
import * as React from "react";
export interface IState {
    flow: number;
}
export interface IProps {
    width: number;
    height: number;
    animate: boolean;
    nodes: {
        name: string;
    }[];
    selectedNode: string;
    onSelectNode: (node: string) => void;
}
export default class Network extends React.PureComponent<IProps, IState> {
    constructor(p: any);
    private interval1;
    invcFlow: () => void;
    componentDidMount(): void;
    componentWillUnmounnt(): void;
    private selectNode;
    render(): JSX.Element;
}
