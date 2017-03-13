/// <reference types="react" />
import { NodeClickEventArgs, IPathStyle, IStyle, IPoint } from "../model";
export interface INodeStyle {
    key: string;
    labelStyle: IStyle;
    iconStyle: IStyle;
    icon: string;
    label: string;
    center: IPoint;
    filter?: string;
}
export interface IEdgeStyle {
    key: string;
    p0: IPoint;
    p1: IPoint;
    p2: IPoint;
    p3: IPoint;
    pathStyle: IPathStyle;
}
export interface IProps {
    nodes: INodeStyle[];
    edges: IEdgeStyle[];
    onClickNode?: (args: NodeClickEventArgs) => void;
}
export default function SvgGraph(props: IProps): JSX.Element;
