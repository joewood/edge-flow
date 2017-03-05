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
var svg_components_1 = require("./svg/svg-components");
var particle_canvas_1 = require("./particles/particle-canvas");
var edge_flow_edge_1 = require("./edge-flow-edge");
exports.Edge = edge_flow_edge_1.Edge;
var edge_flow_node_1 = require("./edge-flow-node");
exports.Node = edge_flow_node_1.Node;
var common_1 = require("./common");
var animation_style_1 = require("./animation-style");
var scale_1 = require("./scale");
var styles = {
    container: {
        position: "relative",
        display: "inline-block",
        verticalAlign: "top",
        padding: 0,
        margin: 0
    }
};
var EdgeFlow = (function (_super) {
    __extends(EdgeFlow, _super);
    function EdgeFlow(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {};
        return _this;
    }
    EdgeFlow.prototype.render = function () {
        var nodes = common_1.getChildrenProps(this.props.children) || [];
        console.log("Rendering Edge Flow: " + nodes.length);
        var errorNodes = nodes.filter(function (n) { return n.center.x === undefined || isNaN(n.center.x) || n.center.y === undefined || isNaN(n.center.y); });
        if (errorNodes.length > 0) {
            console.error("Missing X/Y", errorNodes);
            throw "Error Nodes";
        }
        var nodeDict = lodash_1.keyBy(nodes, function (n) { return n.id; });
        var _a = this.props, run = _a.run, style = _a.style, onClickNode = _a.onClickNode, selectedNodeId = _a.selectedNodeId;
        var backgroundColor = style.backgroundColor, width = style.width, height = style.height;
        if (!width || isNaN(width) || !height || isNaN(height)) {
            throw "Invalid Height/Width";
        }
        var defaulltStrokeColor = Color(backgroundColor).lighten(10).toString();
        var diagramHeight = height;
        var diagramWidth = width;
        var composedStyle = __assign({}, styles.container, style);
        var size = { width: diagramWidth, height: diagramHeight };
        if (nodes.length === 0)
            return React.createElement("div", null);
        var max = { x: lodash_1.maxBy(nodes, function (n) { return n.center.x; }).center.x, y: lodash_1.maxBy(nodes, function (n) { return n.center.y; }).center.y };
        var min = { x: lodash_1.minBy(nodes, function (n) { return n.center.x; }).center.x, y: lodash_1.minBy(nodes, function (n) { return n.center.y; }).center.y };
        var scale = new scale_1.Scale(min, max, size, { width: 20, height: 20 });
        var allEdges = nodes.reduce(function (p, node) { return p.concat((common_1.getChildrenProps(node.children) || [])
            .map(function (l) { return (__assign({ from: node }, l)); })); }, []);
        var missingEdges = allEdges.filter(function (l) { return !nodeDict[l.linkTo]; });
        if (missingEdges.length > 0) {
            console.error("Edges with Missing targets", missingEdges);
            throw ("Missing Target");
        }
        var svgLineFn = function (styles, scale) {
            return styles
                .filter(function (style) { return !style.data.isNode; })
                .map(function (edgeStyle) {
                var style = edgeStyle.style;
                var edge = edgeStyle.data;
                return React.createElement("path", { key: edgeStyle.key, d: "M" + style.p0x + "," + style.p0y + " C " + style.p1x + "," + style.p1y + " " + style.p2x + "," + style.p2y + " " + style.p3x + "," + style.p3y, stroke: edge.pathColor || defaulltStrokeColor, opacity: edge.pathOpacity || 0.05, fill: "transparent", strokeWidth: scale.sizeToScreen(edge.pathWidth || 4) });
            });
        };
        var defaultStyles = allEdges.map(function (edge) { return animation_style_1.createDefaultEdgeStyle(edge, nodeDict, scale); }).concat(nodes.map(function (node) { return animation_style_1.createDefaultNodeStyle(node, node.center, scale); }));
        var springStyles = allEdges.map(function (edge) { return animation_style_1.createEdgeStyle(edge, nodeDict, scale); }).concat(nodes.map(function (node) { return animation_style_1.createNodeStyle(node, node.center, scale); }));
        return (React.createElement("div", { key: "root", style: composedStyle },
            React.createElement("svg", { key: "svg", width: width, height: height, style: { left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }, onClick: function () { return onClickNode({ nodeId: null, graph: null, screen: null }); } },
                React.createElement(react_motion_1.TransitionMotion, { key: "svg-anim", defaultStyles: defaultStyles, styles: springStyles }, function (styles) {
                    return React.createElement("g", { key: "g" }, svgLineFn(animation_style_1.isEdgeStyles(styles), scale).concat(animation_style_1.isNodeStyles(styles)
                        .filter(function (style) { return style.data.label; })
                        .map(function (nodeStyle) {
                        return React.createElement(svg_components_1.WrappedSvgText, { key: "TEXT-" + nodeStyle.key, x: nodeStyle.style.x - 25, y: nodeStyle.style.y + 14, height: scale.heightToScreen(40), width: scale.widthToScreen(50), fontWeight: nodeStyle.data.group ? 800 : 400, text: "" + nodeStyle.data.label, lineHeight: scale.heightToScreen(14), fontWidth: scale.sizeToScreen(6), textColor: nodeStyle.data.labelColor || "#fff8f8" });
                    }), animation_style_1.isNodeStyles(styles)
                        .filter(function (style) { return !style.data.group && !style.data.annotation; })
                        .map(function (nodeStyle) {
                        return nodeStyle.data.symbol
                            ? React.createElement("text", { key: "SYM-" + nodeStyle.key, x: nodeStyle.style.x, y: nodeStyle.style.y, height: scale.heightToScreen(24), width: scale.widthToScreen(80), onClick: function (c) {
                                    onClickNode({ nodeId: nodeStyle.key, graph: { x: nodeStyle.style.x, y: nodeStyle.style.y }, screen: null });
                                    c.stopPropagation();
                                }, style: {
                                    fontFamily: nodeStyle.data.symbolFont || "FontAwesome",
                                    fontSize: scale.sizeToScreen(nodeStyle.data.symbolSize || 20),
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
                                }, r: scale.sizeToScreen(((selectedNodeId === nodeStyle.key) ? 9 : 5)), fill: nodeStyle.data.symbolColor || "#80ff80", strokeWidth: (selectedNodeId === nodeStyle.key) ? 3 : 0, stroke: (selectedNodeId === nodeStyle.key) ? "white" : "transparent" });
                    })));
                }),
                ")"),
            React.createElement("div", { key: "particleContainer", style: { pointerEvents: "none", position: "absolute", left: 0, top: 0 } },
                React.createElement(react_motion_1.TransitionMotion, { key: "motion-anim", defaultStyles: defaultStyles, styles: springStyles }, function (styles) {
                    return React.createElement(particle_canvas_1.ParticleCanvas, { key: "particles", width: diagramWidth, height: diagramHeight, run: run, backgroundColor: backgroundColor }, animation_style_1.isEdgeStyles(styles)
                        .map(function (edgeStyle) {
                        return React.createElement(particle_canvas_1.ParticleEdge, __assign({ key: edgeStyle.data.from.id + "-" + edgeStyle.data.linkTo }, edgeStyle.data, { size: scale.sizeToScreen(edgeStyle.data.size || 10), p0: {
                                x: edgeStyle.style.p0x / diagramWidth,
                                y: 1 - edgeStyle.style.p0y / diagramHeight
                            }, p1: {
                                x: edgeStyle.style.p1x / diagramWidth,
                                y: 1 - edgeStyle.style.p1y / diagramHeight
                            }, p2: {
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