/// <reference types="react" />
import * as React from "react";
export interface IStepProps {
    ratePerSecond: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}
export declare class Step extends React.Component<IStepProps, any> {
    render(): any;
}
export interface IProps {
    width: number;
    height: number;
    children?: Step[];
    run?: boolean;
    backgroundColor?: string;
}
export declare class Flow extends React.PureComponent<IProps, any> {
    private canvas;
    private particles;
    private setupParticles(props);
    private componentWillReceiveProps(newProps);
    shouldComponentUpdate(newProps: IProps, newState: any): boolean;
    private componentWillUnmount();
    render(): JSX.Element;
}
