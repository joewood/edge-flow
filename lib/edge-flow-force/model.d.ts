import * as BaseModel from '../model';
export interface INode extends BaseModel.IPositionlessNode {
    center?: {
        x: number;
        y: number;
    };
    mass?: number;
    fixed?: boolean;
    lockXTo?: string;
    lockYTo?: string;
}
export interface IEdge extends BaseModel.IEdge {
    length?: number;
}
