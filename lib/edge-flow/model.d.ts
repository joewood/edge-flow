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
}
export interface INode extends IPositionlessNode {
    x: number;
    y: number;
}
export interface IEdge {
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
