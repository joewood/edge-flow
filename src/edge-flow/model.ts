import * as React from "react";

export interface IPositionlessNode {
    symbol?: string;
    symbolColor?:string;
    symbolSize?:number;
    symbolFont?:string;
    label?:string;
    labelColor?:string;
    id: string;
    annotation?:boolean;
    group?: boolean;
}

export interface INode extends IPositionlessNode {
    x: number;
    y: number;
}

export interface IPoint {
    x:number;
    y:number;
}

export interface IEdge {
    linkTo: string;
    ratePerSecond?: number;
    name?: string;
    color?: string;
    shape?:number;
    size?: number;
    pathColor?:string;
    pathWidth?:number;
    pathOpacity?:number;
    nonrandom?:boolean;
    variationMin?: number;
    variationMax?: number;
    endingColor?:string;
    /** Optional source, defaults to the source node */
    source?:IPoint;
    /** Used for bezier cubic curve */
    p2?:IPoint;
    /** Used for bezier cubic curve */
    p3?:IPoint;
    /** Optional target, use target node by default */
    target?:IPoint;
}

