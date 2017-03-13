export interface IStyle {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
}
export interface IPathStyle {
    color?: string;
    width?: number;
    opacity?: number;
}
export interface IPositionlessNode {
    id: string;
    icon?: string;
    /** Style to apply to the Icon */
    iconStyle?: IStyle;
    label?: string;
    labelStyle?: IStyle;
    annotation?: boolean;
    group?: boolean;
    style?: {
        width?: number;
        height?: number;
    };
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
export interface IParticleStyle {
    color?: string;
    roundness?: number;
    size?: number;
    variationMin?: number;
    variationMax?: number;
    endingColor?: string;
}
export interface IPositionlessEdge {
    linkTo: string;
    ratePerSecond?: number;
    pathStyle?: IPathStyle;
    particleStyle?: IParticleStyle;
    nonrandom?: boolean;
    name?: string;
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
export interface NodeClickEventArgs {
    nodeId: string;
    graph: {
        x: number;
        y: number;
    };
    screen: {
        x: number;
        y: number;
    };
}
