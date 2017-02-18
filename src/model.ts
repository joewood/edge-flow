import * as React from "react";

export interface INode {
    symbol?: string;
    symbolColor?:string;
    symbolSize?:number;
    symbolFont?:string;
    label?:string;
    labelColor?:string;
    id: string;
    x: number;
    y: number;
    annotation?:boolean;
    group?: boolean;
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
}

