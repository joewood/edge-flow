"use strict";
/*
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var lodash_1 = require("lodash");
var react_motion_1 = require("react-motion");
var Color = require("color");
var partican_1 = require("partican");
var edge_flow_children_1 = require("./edge-flow-children");
exports.Edge = edge_flow_children_1.Edge;
exports.Node = edge_flow_children_1.Node;
var common_1 = require("./common");
var animation_style_1 = require("./animation-style");
var scale_1 = require("./scale");
var svg_graph_1 = require("./svg/svg-graph");
var defaults = {
    iconStyle: {
        fontSize: 10,
        fontFamily: "fontawesome",
        color: "#f0f0f0"
    },
    labelStyle: {
        color: "#f0f0f0",
        fontSize: 10
    },
    pathStyle: {
        color: "white",
        opacity: 0.05,
        strokeWidth: 8
    },
    particleStyle: {
        size: 10,
        roundness: 0.5,
        variationMin: 0.01,
        variationMax: 0.01,
        color: "#a0a0a0"
    }
};
var styles = {
    container: {
        position: "relative",
        display: "inline-block",
        verticalAlign: "top",
        padding: 0,
        margin: 0
    }
};
var EdgeFlow = /** @class */ (function (_super) {
    __extends(EdgeFlow, _super);
    function EdgeFlow(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {};
        return _this;
    }
    EdgeFlow.prototype.render = function () {
        var nodes = common_1.getChildrenProps(this.props.children) || [];
        // console.log("Rendering Edge Flow: " + nodes.length);
        var errorNodes = nodes.filter(function (n) { return n.center.x === undefined || isNaN(n.center.x) || n.center.y === undefined || isNaN(n.center.y); });
        if (errorNodes.length > 0) {
            console.error("Missing X/Y", errorNodes);
            throw "Error Nodes";
        }
        var nodeDict = lodash_1.keyBy(nodes, function (n) { return n.id; });
        var _a = this.props, animate = _a.animate, style = _a.style, maxScale = _a.maxScale, onClickNode = _a.onClickNode, selectedNodeId = _a.selectedNodeId, iconStyle = _a.iconStyle, labelStyle = _a.labelStyle, particleStyle = _a.particleStyle, pathStyle = _a.pathStyle;
        var backgroundColor = style.backgroundColor, width = style.width, height = style.height;
        if (!width || isNaN(width) || !height || isNaN(height)) {
            throw "Invalid Height/Width";
        }
        var defaultPathStyle = __assign({}, defaults.pathStyle, { color: Color(backgroundColor)
                .lighten(10)
                .toString() });
        var diagramHeight = height;
        var diagramWidth = width;
        var composedStyle = __assign({}, styles.container, style);
        var size = { width: diagramWidth, height: diagramHeight };
        if (nodes.length === 0)
            return React.createElement("div", null);
        var max = { x: lodash_1.maxBy(nodes, function (n) { return n.center.x; }).center.x, y: lodash_1.maxBy(nodes, function (n) { return n.center.y; }).center.y };
        var min = { x: lodash_1.minBy(nodes, function (n) { return n.center.x; }).center.x, y: lodash_1.minBy(nodes, function (n) { return n.center.y; }).center.y };
        // two stage scaling. Get a rough scale then recalculate based on the average scale because our node height uses
        // an average aspect ratio
        var scale = new scale_1.Scale(min, max, size, { width: 25, height: 10 }, { width: 25, height: 40 }, maxScale || 3);
        scale = new scale_1.Scale(min, max, size, { width: 25, height: 10 }, { width: 25, height: scale.screenHeightToVirtual(scale.avgSizeToScreen(30)) }, maxScale || 3);
        var allEdges = nodes.reduce(function (p, node) { return p.concat((common_1.getChildrenProps(node.children) || [])
            .map(function (l) { return (__assign({ from: node }, l)); })); }, []);
        var missingEdges = allEdges.filter(function (l) { return !nodeDict[l.linkTo]; });
        if (missingEdges.length > 0) {
            console.error("Edges with Missing targets", missingEdges);
            throw "Missing Target";
        }
        var defaultStyles = allEdges.map(function (edge) { return animation_style_1.createDefaultEdgeStyle(edge, nodeDict, scale); }).concat(nodes.map(function (node) { return animation_style_1.createDefaultNodeStyle(node, node.center, scale); }), [
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
        ]);
        var motionSpringStyles = allEdges.map(function (edge) { return animation_style_1.createEdgeStyle(edge, nodeDict, scale); }).concat(nodes.map(function (node) { return animation_style_1.createNodeStyle(node, node.center, scale); }), [
            {
                key: "transform",
                style: {
                    x: react_motion_1.spring(scale.getTransform().x),
                    y: react_motion_1.spring(scale.getTransform().y),
                    scaleX: react_motion_1.spring(scale.getTransform().scaleX),
                    scaleY: react_motion_1.spring(scale.getTransform().scaleY)
                },
                data: { isNode: false, isEdge: false }
            }
        ]);
        return (React.createElement("div", { key: "root", style: composedStyle },
            React.createElement("svg", { key: "svg", width: width, height: height, style: { left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }, onClick: function () { return onClickNode && onClickNode({ nodeId: null, graph: null, screen: null }); } },
                React.createElement("defs", null,
                    React.createElement("filter", { id: "symglow" },
                        React.createElement("feFlood", { result: "flood", floodColor: "white", floodOpacity: "1.0" }),
                        React.createElement("feComposite", { in: "flood", result: "mask", in2: "SourceGraphic", operator: "in" }),
                        React.createElement("feMorphology", { in: "mask", result: "dilated", operator: "dilate", radius: "1.3" }),
                        React.createElement("feGaussianBlur", { in: "dilated", result: "blurred", stdDeviation: "4" }),
                        React.createElement("feMerge", null,
                            React.createElement("feMergeNode", { in: "SourceGraphic" }),
                            React.createElement("feMergeNode", { in: "blurred" })))),
                React.createElement(react_motion_1.TransitionMotion, { key: "svg-anim", defaultStyles: defaultStyles, styles: motionSpringStyles }, function (styles) { return (React.createElement("g", { key: "g", transform: "scale(" + styles[styles.length - 1].style.scaleX + "," + styles[styles.length - 1]
                        .style.scaleY + ") \n                                translate(" + styles[styles.length - 1].style["x"] + "," + styles[styles.length - 1].style["y"] + ")" },
                    React.createElement(svg_graph_1.default, { key: "SvgGraph", edges: animation_style_1.isEdgeStyles(styles).map(function (edge) { return ({
                            key: edge.data.from.id + "-" + edge.data.linkTo,
                            p0: { x: edge.style.pv0x, y: edge.style.pv0y },
                            p1: { x: edge.style.pv1x, y: edge.style.pv1y },
                            p2: { x: edge.style.pv2x, y: edge.style.pv2y },
                            p3: { x: edge.style.pv3x, y: edge.style.pv3y },
                            pathStyle: __assign({}, defaultPathStyle, pathStyle, edge.data.pathStyle)
                        }); }), nodes: animation_style_1.isNodeStyles(styles).map(function (node) { return ({
                            key: node.data.id,
                            center: { x: node.style.xv, y: node.style.yv },
                            labelStyle: __assign({}, defaults.labelStyle, labelStyle, node.data.labelStyle),
                            iconStyle: __assign({}, defaults.iconStyle, iconStyle, node.data.iconStyle),
                            label: node.data.label,
                            icon: node.data.icon,
                            filter: selectedNodeId === node.key ? "url(#glow)" : undefined
                        }); }) }),
                    "/>) ]}")); }),
                ")"),
            React.createElement(react_motion_1.TransitionMotion, { key: "motion-anim", defaultStyles: defaultStyles, styles: motionSpringStyles }, function (styles) { return (React.createElement(partican_1.ParticleCanvas, { key: "particles", style: { width: diagramWidth, height: diagramHeight, backgroundColor: backgroundColor }, particleStyle: particleStyle, run: animate }, animation_style_1.isEdgeStyles(styles).map(function (edgeStyle) {
                var _a = edgeStyle.data, linkTo = _a.linkTo, pathStyle = _a.pathStyle, name = _a.name, from = _a.from, isNode = _a.isNode, isEdge = _a.isEdge, edgeDat = __rest(_a, ["linkTo", "pathStyle", "name", "from", "isNode", "isEdge"]);
                return (React.createElement(partican_1.ParticleEdge, __assign({ key: edgeStyle.data.from.id + "-" + edgeStyle.data.linkTo }, edgeDat, { particleStyle: __assign({}, defaults.particleStyle, particleStyle, edgeStyle.data.particleStyle, { size: scale.avgSizeToScreen((edgeStyle.data.particleStyle && edgeStyle.data.particleStyle.size) ||
                            10) }), p0: {
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
                    } })));
            }))); })));
    };
    return EdgeFlow;
}(React.Component));
exports.EdgeFlow = EdgeFlow;
//# sourceMappingURL=edge-flow.js.map