import * as BaseModel from '../edge-flow/model';

export interface INode extends BaseModel.IPositionlessNode {
    x?: number;
    y?: number;
    mass?: number; // default 1
    fixed?: boolean;
    lockXTo?: string;
    lockYTo?: string;
}

export interface IEdge extends BaseModel.IEdge {
    length?: number; // default 30
}
