/* 
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */

import * as React from "react";
import { maxBy, minBy, keyBy } from "lodash";
import { TransitionMotion, spring } from "react-motion";
import Color = require("color");
import { ParticleCanvas, ParticleEdge } from "partican";

import { Edge, IEdgeProps } from "./edge-flow-edge";
import { Node, INodeProps } from "./edge-flow-node";
import { NodeClickEventArgs, IPathStyle, IParticleStyle, IStyle } from "./model";
import { getChildrenProps } from "./common";
import {
	EdgeAndNodeType,
	MotionStyle,
	createDefaultEdgeStyle,
	createDefaultNodeStyle,
	createEdgeStyle,
	createNodeStyle,
	isNodeStyles,
	isEdgeStyles
} from "./animation-style";
import { Scale } from "./scale";
import SvgGraph from "./svg/svg-graph";

export { Edge, IEdgeProps, Node, INodeProps };

const defaults = {
	iconStyle: {
		fontSize: 10,
		fontFamily: "fontawesome",
		color: "#f0f0f0"
	} as IStyle,
	labelStyle: {
		color: "#f0f0f0",
		fontSize: 10
	} as IStyle,
	pathStyle: {
		color: "white",
		opacity: 0.05,
		strokeWidth: 8
	} as IPathStyle,
	particleStyle: {
		size: 10,
		roundness: 0.5,
		variationMin: 0.01,
		variationMax: 0.01,
		color: "#a0a0a0"
	} as IParticleStyle
};

// define a base set of props, as Component can reuse without children dependency
export interface IBaseProps {
	animate?: boolean;
	style: {
		width: number;
		height: number;
		backgroundColor?: string;
	};
	maxScale?: number;
	iconStyle?: IStyle;
	labelStyle?: IStyle;
	pathStyle?: IPathStyle;
	particleStyle?: IParticleStyle;
	nodeStyle?: { width: number; height: number };
	onClickNode?: (args: NodeClickEventArgs) => void;
	selectedNodeId?: string;
}

export interface IProps extends IBaseProps {
	children?: Node[];
}

export interface IState {}

const styles = {
	container: {
		position: "relative",
		display: "inline-block",
		verticalAlign: "top",
		padding: 0,
		margin: 0
	} as React.CSSProperties
};

export class EdgeFlow extends React.Component<IProps, IState> {
	constructor(p: IProps) {
		super(p);
		this.state = {};
	}

	public render() {
		const nodes = getChildrenProps<INodeProps>(this.props.children) || [];
		// console.log("Rendering Edge Flow: " + nodes.length);
		const errorNodes = nodes.filter(
			n => n.center.x === undefined || isNaN(n.center.x) || n.center.y === undefined || isNaN(n.center.y)
		);
		if (errorNodes.length > 0) {
			console.error("Missing X/Y", errorNodes);
			throw "Error Nodes";
		}
		const nodeDict = keyBy(nodes, n => n.id);
		const {
			animate,
			style,
            maxScale,
			onClickNode,
			selectedNodeId,
			iconStyle,
			labelStyle,
			particleStyle,
			pathStyle
		} = this.props;
		const { backgroundColor, width, height } = style;
		if (!width || isNaN(width) || !height || isNaN(height)) {
			throw "Invalid Height/Width";
		}

		const defaultPathStyle = { ...defaults.pathStyle, color: Color(backgroundColor).lighten(10).toString() };
		const diagramHeight = height;
		const diagramWidth = width;
		const composedStyle = {
			...styles.container,
			...style
		};
		const size = { width: diagramWidth, height: diagramHeight };
		if (nodes.length === 0) return <div />;

		const max = { x: maxBy(nodes, n => n.center.x).center.x, y: maxBy(nodes, n => n.center.y).center.y };
		const min = { x: minBy(nodes, n => n.center.x).center.x, y: minBy(nodes, n => n.center.y).center.y };

		// two stage scaling. Get a rough scale then recalculate based on the average scale because our node height uses
		// an average aspect ratio
		let scale = new Scale(
			min,
			max,
			size,
			{ width: 25, height: 10 },
			{ width: 25, height: 40 },
            maxScale || 3
		);
		scale = new Scale(
			min,
			max,
			size,
			{ width: 25, height: 10 },
			{ width: 25, height: scale.screenHeightToVirtual(scale.avgSizeToScreen(30)) },
			maxScale || 3
		);

		const allEdges = nodes.reduce(
			(p, node: INodeProps) => [
				...p,
				...(getChildrenProps<IEdgeProps>(node.children) || [])
					.map(l => ({ from: node, ...l } as EdgeAndNodeType))
			],
			[] as EdgeAndNodeType[]
		);

		const missingEdges = allEdges.filter(l => !nodeDict[l.linkTo]);
		if (missingEdges.length > 0) {
			console.error("Edges with Missing targets", missingEdges);
			throw "Missing Target";
		}

		const defaultStyles = [
			...allEdges.map(edge => createDefaultEdgeStyle(edge, nodeDict, scale)),
			...nodes.map(node => createDefaultNodeStyle(node, node.center, scale)),
			{
				key: "transform",
				style: {
					x: scale.getTransform().x,
					y: scale.getTransform().y,
					scaleX: scale.getTransform().scaleX,
					scaleY: scale.getTransform().scaleY
				},
				data: { isNode: false, isEdge: false }
			}
		];
		const springStyles = [
			...allEdges.map(edge => createEdgeStyle(edge, nodeDict, scale)),
			...nodes.map(node => createNodeStyle(node, node.center, scale)),
			{
				key: "transform",
				style: {
					x: spring(scale.getTransform().x),
					y: spring(scale.getTransform().y),
					scaleX: spring(scale.getTransform().scaleX),
					scaleY: spring(scale.getTransform().scaleY)
				},
				data: { isNode: false, isEdge: false }
			}
		];
		return (
			<div key="root" style={composedStyle}>
				<svg
					key="svg"
					width={width}
					height={height}
					style={{ left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }}
					onClick={() => onClickNode && onClickNode({ nodeId: null, graph: null, screen: null })}
				>
					<defs>
						<filter id="symglow">
							<feFlood result="flood" floodColor="white" floodOpacity="1.0" />
							<feComposite in="flood" result="mask" in2="SourceGraphic" operator="in" />
							<feMorphology in="mask" result="dilated" operator="dilate" radius="1.3" />
							<feGaussianBlur in="dilated" result="blurred" stdDeviation="4" />
							<feMerge>
								<feMergeNode in="SourceGraphic" />
								<feMergeNode in="blurred" />
							</feMerge>
						</filter>
					</defs>
					<TransitionMotion key="svg-anim" defaultStyles={defaultStyles} styles={springStyles}>
						{(styles: MotionStyle[]) =>
							<g
								key="g"
								transform={`scale(${styles[styles.length - 1].style.scaleX},${styles[styles.length - 1]
									.style.scaleY}) 
                                translate(${styles[styles.length - 1].style["x"]},${styles[styles.length - 1].style[
									"y"
								]})`}
							>
								<SvgGraph
									key="SvgGraph"
									edges={isEdgeStyles(styles).map(edge => ({
										key: edge.data.from.id + "-" + edge.data.linkTo,
										p0: { x: edge.style.pv0x, y: edge.style.pv0y },
										p1: { x: edge.style.pv1x, y: edge.style.pv1y },
										p2: { x: edge.style.pv2x, y: edge.style.pv2y },
										p3: { x: edge.style.pv3x, y: edge.style.pv3y },
										pathStyle: { ...defaultPathStyle, ...pathStyle, ...edge.data.pathStyle }
									}))}
									nodes={isNodeStyles(styles).map(node => ({
										key: node.data.id,
										center: { x: node.style.xv, y: node.style.yv },
										labelStyle: { ...defaults.labelStyle, ...labelStyle, ...node.data.labelStyle },
										iconStyle: { ...defaults.iconStyle, ...iconStyle, ...node.data.iconStyle },
										label: node.data.label,
										icon: node.data.icon,
										filter: selectedNodeId === node.key ? "url(#glow)" : undefined
									}))}
								/>
								/>)
								]}
							</g>}
					</TransitionMotion>)
				</svg>
				<TransitionMotion key="motion-anim" defaultStyles={defaultStyles} styles={springStyles}>
					{(styles: MotionStyle[]) =>
						<ParticleCanvas
							key="particles"
							style={{ width: diagramWidth, height: diagramHeight, backgroundColor: backgroundColor }}
							defaultParticleStyle={particleStyle}
							run={animate}
						>
							{isEdgeStyles(styles).map(edgeStyle => {
								const { linkTo, pathStyle, name, from, isNode, isEdge, ...edgeDat } = edgeStyle.data;
								return (
									<ParticleEdge
										key={edgeStyle.data.from.id + "-" + edgeStyle.data.linkTo}
										{...edgeDat}
										particleStyle={{
											...defaults.particleStyle,
											...particleStyle,
											...edgeStyle.data.particleStyle,
											size: scale.avgSizeToScreen(
												(edgeStyle.data.particleStyle && edgeStyle.data.particleStyle.size) ||
													10
											)
										}}
										p0={{
											x: edgeStyle.style.p0x / diagramWidth,
											y: 1 - edgeStyle.style.p0y / diagramHeight
										}}
										p1={{
											x: edgeStyle.style.p1x / diagramWidth,
											y: 1 - edgeStyle.style.p1y / diagramHeight
										}}
										p2={{
											x: edgeStyle.style.p2x / diagramWidth,
											y: 1 - edgeStyle.style.p2y / diagramHeight
										}}
										p3={{
											x: edgeStyle.style.p3x / diagramWidth,
											y: 1 - edgeStyle.style.p3y / diagramHeight
										}}
									/>
								);
							})}
						</ParticleCanvas>}
				</TransitionMotion>
			</div>
		);
	}
}
