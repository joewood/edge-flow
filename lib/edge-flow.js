/*
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var lodash_1 = require("lodash");
var react_motion_1 = require("react-motion");
var Color = require("color");
var svg_components_1 = require("./edge-flow/svg-components");
var particle_canvas_1 = require("./edge-flow/particle-canvas");
var edge_flow_edge_1 = require("./edge-flow/edge-flow-edge");
exports.Edge = edge_flow_edge_1.Edge;
var edge_flow_node_1 = require("./edge-flow/edge-flow-node");
exports.Node = edge_flow_node_1.Node;
// const oldSpring = _Spring;
var spring = react_motion_1.spring; //(v: number) => oldSpring(v, { damping: 10, stiffness: 80 });
var styles = {
    container: {
        position: "relative",
        display: "inline-block",
        verticalAlign: "top",
        padding: 0,
        margin: 0
    }
};
var compKey = function (edge) { return edge.from.id + "-" + edge.linkTo; };
var scaleX = function (x, min, max, diagramWidth) { return Math.round(((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16) * diagramWidth * 10) / 10; };
var scaleY = function (y, min, max, diagramHeight) { return Math.round(((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight * 10) / 10; };
function createEdgeStyle(edge, nodeDict, min, max, size, useSpring) {
    if (useSpring === void 0) { useSpring = false; }
    var from = edge.source || edge.from.center;
    var to = edge.target || nodeDict[edge.linkTo].center;
    var p2 = edge.p2 || from;
    var p3 = edge.p3 || to;
    return {
        key: compKey(edge),
        style: {
            fromx: useSpring ? spring(scaleX(from.x, min, max, size.x)) : scaleX(from.x, min, max, size.x),
            fromy: useSpring ? spring(scaleY(from.y, min, max, size.y)) : scaleY(from.y, min, max, size.y),
            tox: useSpring ? spring(scaleX(to.x, min, max, size.x)) : scaleX(to.x, min, max, size.x),
            toy: useSpring ? spring(scaleY(to.y, min, max, size.y)) : scaleY(to.y, min, max, size.y),
            p2x: useSpring ? spring(scaleX(p2.x, min, max, size.x)) : scaleX(p2.x, min, max, size.x),
            p2y: useSpring ? spring(scaleY(p2.y, min, max, size.y)) : scaleY(p2.y, min, max, size.y),
            p3x: useSpring ? spring(scaleX(p3.x, min, max, size.x)) : scaleX(p3.x, min, max, size.x),
            p3y: useSpring ? spring(scaleY(p3.y, min, max, size.y)) : scaleY(p3.y, min, max, size.y),
        },
        data: __assign({ isNode: false }, edge),
    };
}
function createNodeStyle(node, point, min, max, size, useSpring) {
    if (useSpring === void 0) { useSpring = false; }
    return {
        key: node.id,
        style: {
            x: useSpring ? spring(scaleX(point.x, min, max, size.x)) : scaleX(point.x, min, max, size.x),
            y: useSpring ? spring(scaleY(point.y, min, max, size.y)) : scaleY(point.y, min, max, size.y)
        },
        data: __assign({ isNode: true }, node),
    };
}
/** Helper function, return the props of a children element */
function getChildrenProps(children) {
    return React.Children.map(children, function (child) { return child.props; }) || [];
}
var EdgeFlow = (function (_super) {
    __extends(EdgeFlow, _super);
    function EdgeFlow(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {};
        return _this;
    }
    EdgeFlow.prototype.render = function () {
        var nodes = getChildrenProps(this.props.children) || [];
        console.log("Rendering Edge Flow: " + nodes.length);
        var errorNodes = nodes.filter(function (n) { return n.center.x === undefined || isNaN(n.center.x) || n.center.y === undefined || isNaN(n.center.y); });
        if (errorNodes.length > 0) {
            console.error("Missing X/Y", errorNodes);
            throw "Error Nodes";
        }
        var nodeDict = lodash_1.keyBy(nodes, function (n) { return n.id; });
        var _a = this.props, run = _a.run, children = _a.children, style = _a.style, onClickNode = _a.onClickNode, selectedNodeId = _a.selectedNodeId;
        var backgroundColor = style.backgroundColor, width = style.width, height = style.height;
        if (!width || isNaN(width) || !height || isNaN(height)) {
            throw "Invalid Height/Width";
        }
        var defaulltStrokeColor = Color(backgroundColor).lighten(10).toString();
        var diagramHeight = height;
        var diagramWidth = width;
        var composedStyle = __assign({}, styles.container, style);
        var size = { x: diagramWidth, y: diagramHeight };
        if (nodes.length === 0)
            return React.createElement("div", null);
        var max = { x: lodash_1.maxBy(nodes, function (n) { return n.center.x; }).center.x * 1.1, y: lodash_1.maxBy(nodes, function (n) { return n.center.y; }).center.y * 1.1 };
        var min = { x: lodash_1.minBy(nodes, function (n) { return n.center.x; }).center.x * 0.9, y: lodash_1.minBy(nodes, function (n) { return n.center.y; }).center.y * 0.9 };
        var allEdges = nodes.reduce(function (p, node) { return p.concat((getChildrenProps(node.children) || [])
            .map(function (l) { return (__assign({ from: node }, l)); })); }, []);
        var missingEdges = allEdges.filter(function (l) { return !nodeDict[l.linkTo]; });
        if (missingEdges.length > 0) {
            console.error("Edges with Missing targets", missingEdges);
            throw ("Missing Target");
        }
        var svgLineFn = function (styles) {
            return styles
                .filter(function (style) { return !style.data.isNode; })
                .map(function (edgeStyle) {
                var style = edgeStyle.style;
                var edge = edgeStyle.data;
                return React.createElement("path", { key: edgeStyle.key, d: "M" + style.fromx + "," + style.fromy + " C " + style.p2x + "," + style.p2y + " " + style.p3x + "," + style.p3y + " " + style.tox + "," + style.toy, stroke: edge.pathColor || defaulltStrokeColor, opacity: edge.pathOpacity || 0.1, fill: "transparent", strokeWidth: edge.pathWidth || 12 });
            });
        };
        var defaultStyles = allEdges.map(function (edge) { return createEdgeStyle(edge, nodeDict, min, max, size); }).concat(nodes.map(function (node) { return createNodeStyle(node, node.center, min, max, size); }));
        var springStyles = allEdges.map(function (edge) { return createEdgeStyle(edge, nodeDict, min, max, size, true); }).concat(nodes.map(function (node) { return createNodeStyle(node, node.center, min, max, size, true); }));
        return (React.createElement("div", { key: "root", style: composedStyle },
            React.createElement("svg", { key: "svg", width: width, height: height, style: { left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }, onClick: function () { return onClickNode({ nodeId: null, graph: null, screen: null }); } },
                React.createElement(react_motion_1.TransitionMotion, { key: "svg-anim", defaultStyles: defaultStyles, styles: springStyles }, function (styles) {
                    return React.createElement("g", { key: "g" }, svgLineFn(styles).concat(styles
                        .filter(function (style) { return style.data.isNode && style.data.label; })
                        .map(function (nodeStyle) {
                        return React.createElement(svg_components_1.WrappedSvgText, { key: "TEXT-" + nodeStyle.key, x: nodeStyle.style.x, y: nodeStyle.style.y, height: 60, width: 80, fontWeight: nodeStyle.data.group ? 800 : 400, text: "" + nodeStyle.data.label, lineHeight: 14, fontWidth: 12, textColor: nodeStyle.data.labelColor || "#fff8f8" });
                    }), styles
                        .filter(function (style) { return style.data.isNode && !style.data.group && !style.data.annotation; })
                        .map(function (nodeStyle) {
                        return nodeStyle.data.symbol
                            ? React.createElement("text", { key: "SYM-" + nodeStyle.key, x: nodeStyle.style.x, y: nodeStyle.style.y, height: 20, width: 80, onClick: function (c) {
                                    onClickNode({ nodeId: nodeStyle.key, graph: { x: nodeStyle.style.x, y: nodeStyle.style.y }, screen: null });
                                    c.stopPropagation();
                                }, style: {
                                    fontFamily: nodeStyle.data.symbolFont || "FontAwesome",
                                    fontSize: nodeStyle.data.symbolSize || 23,
                                    textAnchor: "middle",
                                    alignmentBaseline: "central",
                                    dominantBaseline: "central",
                                    fill: nodeStyle.data.symbolColor || "#fff8f8",
                                    strokeWidth: 1,
                                    stroke: "#303050",
                                } }, nodeStyle.data.symbol)
                            : React.createElement("circle", { key: "SYM-" + nodeStyle.key, cx: nodeStyle.style.x, cy: nodeStyle.style.y, onClick: function (c) {
                                    // console.log("CLICK", c);
                                    onClickNode({ nodeId: nodeStyle.key, graph: { x: nodeStyle.style.x, y: nodeStyle.style.y }, screen: null });
                                    c.stopPropagation();
                                }, r: ((selectedNodeId === nodeStyle.key) ? 9 : 5), fill: nodeStyle.data.symbolColor || "#80ff80", strokeWidth: (selectedNodeId === nodeStyle.key) ? 3 : 0, stroke: (selectedNodeId === nodeStyle.key) ? "white" : "transparent" });
                    })));
                }),
                ")"),
            React.createElement("div", { key: "particleContainer", style: { pointerEvents: "none", position: "absolute", left: 0, top: 0 } },
                React.createElement(react_motion_1.TransitionMotion, { key: "motion-anim", defaultStyles: defaultStyles, styles: springStyles }, function (styles) {
                    return React.createElement(particle_canvas_1.ParticleCanvas, { key: "particles", width: diagramWidth, height: diagramHeight, run: run, backgroundColor: backgroundColor }, styles
                        .filter(function (style) { return !style.data.isNode; })
                        .map(function (edgeStyle) {
                        return React.createElement(particle_canvas_1.ParticleEdge, __assign({ key: compKey(edgeStyle.data) }, edgeStyle.data, { fromX: edgeStyle.style.fromx / diagramWidth, fromY: 1 - edgeStyle.style.fromy / diagramHeight, toX: edgeStyle.style.tox / diagramWidth, toY: 1 - edgeStyle.style.toy / diagramHeight, p2: {
                                x: edgeStyle.style.p2x / diagramWidth,
                                y: 1 - edgeStyle.style.p2y / diagramHeight
                            }, p3: {
                                x: edgeStyle.style.p3x / diagramWidth,
                                y: 1 - edgeStyle.style.p3y / diagramHeight
                            } }));
                    }));
                }))));
    };
    return EdgeFlow;
}(React.Component));
exports.EdgeFlow = EdgeFlow;
//# sourceMappingURL=edge-flow.js.map