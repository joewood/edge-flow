export interface IPositionlessNode {
    symbol?: string;
    symbolColor?: string;
    symbolSize?: number;
    symbolFont?: string;
    label?: string;
    labelColor?: string;
    id: string;
    annotation?: boolean;
    group?: boolean;
    width?: number;
    height?: number;
}
export interface INode extends IPositionlessNode {
    center: IPoint;
}
export interface IPoint {
    x: number;
    y: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IPositionlessEdge {
    linkTo: string;
    ratePerSecond?: number;
    name?: string;
    color?: string;
    shape?: number;
    size?: number;
    pathColor?: string;
    pathWidth?: number;
    pathOpacity?: number;
    nonrandom?: boolean;
    variationMin?: number;
    variationMax?: number;
    endingColor?: string;
}
export interface IEdge extends IPositionlessEdge {
    /** Optional source, defaults to the source node */
    p0?: IPoint;
    /** Used for bezier cubic curve */
    p1?: IPoint;
    /** Used for bezier cubic curve */
    p2?: IPoint;
    /** Optional target, use target node by default */
    p3?: IPoint;
}
