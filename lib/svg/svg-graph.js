"use strict";
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
var svg_components_1 = require("./svg-components");
var iconStyle = {
    userSelect: "none",
    cursor: "default",
    textAnchor: "middle",
    alignmentBaseline: "central",
    dominantBaseline: "central",
};
function EdgeLine(props) {
    return React.createElement("path", { d: "M" + props.p0.x + "," + props.p0.y + " C " + props.p1.x + "," + props.p1.y + " " + props.p2.x + "," + props.p2.y + " " + props.p3.x + "," + props.p3.y, stroke: props.pathColor, opacity: props.pathOpacity || 0.05, fill: "transparent", strokeWidth: props.strokeWidth });
}
function SvgGraph(props) {
    var onClickNode = props.onClickNode, nodes = props.nodes, edges = props.edges;
    return React.createElement("g", { key: "g" }, edges.map(function (edge) {
        return React.createElement(EdgeLine, { key: edge.key, p0: edge.p0, p1: edge.p1, p2: edge.p2, p3: edge.p3, pathColor: edge.pathStyle.color, pathOpacity: edge.pathStyle.opacity, strokeWidth: edge.pathStyle.width });
    }).concat(nodes.filter(function (node) { return node.label; }).map(function (node) {
        return React.createElement(svg_components_1.WrappedSvgText, { key: node.key + "symbol", x: node.center.x, y: node.center.y + 10, height: 40, width: 40, text: node.label, top: true, center: true, filter: node.filter, lineHeight: 6, fontWidth: 6, textColor: node.labelStyle.color });
    }), nodes.filter(function (node) { return !!node.icon; }).map(function (node) {
        return React.createElement("text", { key: node.key + "label", x: node.center.x, y: node.center.y, height: 20, width: 20, onClick: function (c) {
                console.log("Click");
                onClickNode && onClickNode({ nodeId: node.key, graph: { x: node.center.x, y: node.center.y }, screen: null });
                c.stopPropagation();
            }, filter: node.filter, style: __assign({}, iconStyle, { fontFamily: node.iconStyle.fontFamily, fontSize: node.iconStyle.fontSize, fill: node.iconStyle.color, strokeWidth: 0 }) }, node.icon);
    })));
}
exports.default = SvgGraph;
//# sourceMappingURL=svg-graph.js.map