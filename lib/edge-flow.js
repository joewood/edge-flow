/*
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
        var errorNodes = nodes.filter(function (n) { return n.x === undefined || isNaN(n.x) || n.y === undefined || isNaN(n.y); });
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
        if (nodes.length === 0)
            return React.createElement("div", null);
        var max = { x: lodash_1.maxBy(nodes, function (n) { return n.x; }).x * 1.1, y: lodash_1.maxBy(nodes, function (n) { return n.y; }).y * 1.1 };
        var min = { x: lodash_1.minBy(nodes, function (n) { return n.x; }).x * 0.9, y: lodash_1.minBy(nodes, function (n) { return n.y; }).y * 0.9 };
        var scaleX = function (x) { return ((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16) * diagramWidth; };
        var scaleY = function (y) { return ((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight; };
        var allEdges = nodes.reduce(function (p, node) { return p.concat((getChildrenProps(node.children) || [])
            .filter(function (edge) { return !isNaN(edge.ratePerSecond) && (edge.ratePerSecond > 0); })
            .map(function (l) { return (__assign({ from: node }, l)); })); }, []);
        var missingEdges = allEdges.filter(function (l) { return !nodeDict[l.linkTo]; });
        if (missingEdges.length > 0) {
            console.error("Edges with Missing targets", missingEdges);
            throw ("MIssing Target");
        }
        var compKey = function (edge, suffix) { return edge.from.id + "-" + edge.linkTo + "-" + suffix; };
        var svgLineFn = function (style) {
            return React.createElement("g", null, allEdges.map(function (edge) {
                var styleX = style[compKey(edge, "fromX")];
                var styleY = style[compKey(edge, "fromY")];
                var styletoX = style[compKey(edge, "toX")];
                var styletoY = style[compKey(edge, "toY")];
                if (!styleX || !styleY || !styletoX || !styletoY)
                    throw "Invalid Style";
                return React.createElement("path", { key: edge.from.id + "-" + edge.linkTo, d: "M" + styleX + " " + styleY + " L" + styletoX + " " + styletoY, stroke: edge.pathColor || defaulltStrokeColor, opacity: edge.pathOpacity || 0.1, fill: "transparent", strokeWidth: edge.pathWidth || 12 });
            }));
        };
        return (React.createElement("div", { key: "root", style: composedStyle },
            React.createElement("svg", { width: width, height: height, style: { left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }, onClick: function () { return onClickNode({ nodeId: null, graph: null, screen: null }); } },
                React.createElement(react_motion_1.Motion, { defaultStyle: allEdges.reduce(function (p, edge) {
                        return (__assign((_a = {}, _a[compKey(edge, "fromX")] = scaleX(edge.from.x), _a[compKey(edge, "fromY")] = scaleY(edge.from.y), _a[compKey(edge, "toX")] = scaleX(nodeDict[edge.linkTo].x), _a[compKey(edge, "toY")] = scaleY(nodeDict[edge.linkTo].y), _a), p));
                        var _a;
                    }, {}), style: allEdges.reduce(function (p, edge) {
                        return (__assign((_a = {}, _a[compKey(edge, "fromX")] = spring(scaleX(edge.from.x)), _a[compKey(edge, "fromY")] = spring(scaleY(edge.from.y)), _a[compKey(edge, "toX")] = spring(scaleX(nodeDict[edge.linkTo].x)), _a[compKey(edge, "toY")] = spring(scaleY(nodeDict[edge.linkTo].y)), _a), p));
                        var _a;
                    }, {}) }, svgLineFn),
                React.createElement("g", null, nodes.map(function (node) { return node.label && React.createElement(react_motion_1.Motion, { key: node.id, defaultStyle: { x: scaleX(node.x), y: scaleX(node.y) }, style: { x: spring(scaleX(node.x)), y: spring(scaleY(node.y)) } }, function (_a) {
                    var x = _a.x, y = _a.y;
                    return React.createElement(svg_components_1.WrappedSvgText, { key: node.id, x: x, y: y, height: 60, width: 80, fontWeight: node.group ? 800 : 400, text: "" + node.label, lineHeight: 14, fontWidth: 12, textColor: node.labelColor || "#fff8f8" });
                }); })),
                React.createElement("g", null, nodes.filter(function (node) { return !node.group && !node.annotation; })
                    .map(function (node) { return node.symbol ? React.createElement("text", { key: node.id, x: scaleX(node.x), y: scaleY(node.y), height: 20, width: 80, onClick: function (c) {
                        // console.log("CLICK", c);
                        onClickNode({ nodeId: node.id, graph: { x: node.x, y: node.y }, screen: null });
                        c.stopPropagation();
                    }, style: {
                        fontFamily: node.symbolFont || "FontAwesome",
                        fontSize: node.symbolSize || 23,
                        textAnchor: "middle",
                        alignmentBaseline: "central",
                        dominantBaseline: "central",
                        fill: node.symbolColor || "#fff8f8",
                        strokeWidth: 1,
                        stroke: "#303050",
                    } }, node.symbol)
                    : React.createElement(react_motion_1.Motion, { key: node.id, defaultStyle: { x: scaleX(node.x), y: scaleX(node.y) }, style: { x: spring(scaleX(node.x)), y: spring(scaleY(node.y)) } }, function (_a) {
                        var x = _a.x, y = _a.y;
                        return React.createElement("circle", { key: node.id, cx: x, cy: y, onClick: function (c) {
                                // console.log("CLICK", c);
                                onClickNode({ nodeId: node.id, graph: { x: node.x, y: node.y }, screen: null });
                                c.stopPropagation();
                            }, r: ((selectedNodeId === node.id) ? 9 : 5), fill: node.symbolColor || "#80ff80", strokeWidth: (selectedNodeId === node.id) ? 3 : 0, stroke: (selectedNodeId === node.id) ? "white" : "transparent" });
                    }); }))),
            React.createElement("div", { key: "particleContainer", style: { pointerEvents: "none", position: "absolute", left: 0, top: 0 } },
                React.createElement(react_motion_1.Motion, { defaultStyle: allEdges.reduce(function (p, edge) {
                        return (__assign((_a = {}, _a[compKey(edge, "fromX")] = scaleX(edge.from.x) / width, _a[compKey(edge, "fromY")] = 1 - scaleY(edge.from.y) / height, _a[compKey(edge, "toX")] = scaleX(nodeDict[edge.linkTo].x) / width, _a[compKey(edge, "toY")] = 1 - scaleY(nodeDict[edge.linkTo].y) / height, _a), p));
                        var _a;
                    }, {}), style: allEdges.reduce(function (p, edge) {
                        return (__assign((_a = {}, _a[compKey(edge, "fromX")] = spring(scaleX(edge.from.x) / width), _a[compKey(edge, "fromY")] = spring(1 - scaleY(edge.from.y) / height), _a[compKey(edge, "toX")] = spring(scaleX(nodeDict[edge.linkTo].x) / width), _a[compKey(edge, "toY")] = spring(1 - scaleY(nodeDict[edge.linkTo].y) / height), _a), p));
                        var _a;
                    }, {}) }, function (style) { return React.createElement(particle_canvas_1.ParticleCanvas, { key: "particles", width: diagramWidth, height: diagramHeight, run: run, backgroundColor: backgroundColor }, allEdges.map(function (edge) {
                    return React.createElement(particle_canvas_1.ParticleEdge, __assign({ key: edge.from.id + "-" + edge.linkTo, fromX: style[compKey(edge, "fromX")], fromY: style[compKey(edge, "fromY")], toX: style[compKey(edge, "toX")], toY: style[compKey(edge, "toY")], ratePerSecond: edge.ratePerSecond }, edge));
                })); }))));
    };
    return EdgeFlow;
}(React.Component));
exports.EdgeFlow = EdgeFlow;
//# sourceMappingURL=edge-flow.js.map