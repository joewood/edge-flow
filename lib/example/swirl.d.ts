/// <reference types="react" />
import * as React from "react";
export interface IState {
    points: {
        x: number;
        y: number;
    }[];
}
export interface IProps {
    width: number;
    height: number;
    animationIndex: number;
    animate: boolean;
}
export default class Swirl extends React.Component<IProps, IState> {
    constructor(p: any);
    componentWillReceiveProps(newProps: IProps): void;
    render(): JSX.Element;
}
