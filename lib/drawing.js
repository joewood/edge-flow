/*
 * Simple Flow Drawing using Absolute Position of nodes
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
var flow_1 = require("./flow");
// re-exports
var drawing_node_1 = require("./drawing-node");
exports.Node = drawing_node_1.Node;
exports.Link = drawing_node_1.Link;
var svg_components_1 = require("./svg-components");
var Color = require("color");
var react_motion_1 = require("react-motion");
var spring = function (v) { return react_motion_1.spring(v, { damping: 10, stiffness: 80 }); };
var styles = {
    container: {
        position: "relative",
        display: "inline-block",
        verticalAlign: "top",
        padding: 0,
        margin: 0
    }
};
/** For a ILink return the Path Line Element (<path d="M x y L x y"/>) */
function svgLineFromLink(nodeDict, linkFrom, link, strokeColor, scaleX, scaleY) {
    if (!nodeDict[link.linkTo]) {
        console.error("Cannot find node referenced '" + link.linkTo + "'");
        return null;
    }
    var fn = function (p) {
        return React.createElement("path", { key: linkFrom.id + "--" + link.linkTo, d: "M" + p.fromx + " " + p.fromy + " L" + p.tox + " " + p.toy, stroke: strokeColor, opacity: 0.1, fill: "transparent", strokeWidth: 12 });
    };
    var linkTo = nodeDict[link.linkTo];
    return React.createElement(react_motion_1.Motion, {
        key: linkFrom.id + "--" + link.linkTo,
        defaultStyle: { fromx: 0, fromy: 0, tox: 0, toy: 0 },
        style: { fromx: spring(scaleX(linkFrom.x)), fromy: spring(scaleY(linkFrom.y)), tox: spring(scaleX(linkTo.x)), toy: spring(scaleY(linkTo.y)) }
    }, fn);
}
function flowStepFromLink(nodeDict, width, height, linkFrom, link, scaleX, scaleY) {
    if (!nodeDict[link.linkTo])
        return null;
    var linkTo = nodeDict[link.linkTo];
    return React.createElement(react_motion_1.Motion, { key: linkFrom.id + "--" + link.linkTo, defaultStyle: {
            fromX: scaleX(linkFrom.x) / width,
            fromY: 1 - scaleY(linkFrom.y) / height,
            toX: scaleX(linkTo.x) / width,
            toY: 1 - scaleY(linkTo.y) / height
        }, style: {
            fromX: spring(scaleX(linkFrom.x) / width),
            fromY: spring(1 - scaleY(linkFrom.y) / height),
            toX: spring(scaleX(linkTo.x) / width),
            toY: spring(1 - scaleY(linkTo.y) / height)
        } }, function (_a) {
        var fromX = _a.fromX, fromY = _a.fromY, toX = _a.toX, toY = _a.toY;
        return React.createElement(flow_1.Step, __assign({ key: linkFrom.id + "--" + link.linkTo, fromX: scaleX(linkFrom.x) / width, fromY: 1 - scaleY(linkFrom.y) / height, toX: scaleX(linkTo.x) / width, toY: 1 - scaleY(linkTo.y) / height, ratePerSecond: link.ratePerSecond }, link));
    });
}
/** Helper function, return the props of a children element */
function getChildrenProps(children) {
    return React.Children.map(children, function (child) { return child.props; });
}
var Graph = (function (_super) {
    __extends(Graph, _super);
    function Graph(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {};
        return _this;
    }
    Graph.prototype.render = function () {
        var nodes = getChildrenProps(this.props.children) || [];
        var nodeDict = lodash_1.keyBy(nodes, function (n) { return n.id; });
        var _a = this.props, width = _a.width, height = _a.height, run = _a.run, children = _a.children, containerStyle = _a.containerStyle, backgroundColor = _a.backgroundColor, onClickNode = _a.onClickNode, selectedNodeId = _a.selectedNodeId;
        var strokeColor = Color(backgroundColor).lighten(10).toString();
        var diagramHeight = height;
        var diagramWidth = width;
        var style = __assign({}, styles.container, containerStyle, { width: diagramWidth, height: diagramHeight, backgroundColor: backgroundColor });
        if (nodes.length === 0)
            return React.createElement("div", null);
        var max = { x: lodash_1.maxBy(nodes, function (n) { return n.x; }).x, y: lodash_1.maxBy(nodes, function (n) { return n.y; }).y };
        var min = { x: lodash_1.minBy(nodes, function (n) { return n.x; }).x, y: lodash_1.minBy(nodes, function (n) { return n.y; }).y };
        var scaleX = function (x) { return ((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16) * diagramWidth; };
        var scaleY = function (y) { return ((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight; };
        var allLinks = nodes.reduce(function (p, node) { return p.concat(getChildrenProps(node.children)
            .filter(function (link) { return !isNaN(link.ratePerSecond) && (link.ratePerSecond > 0); })
            .map(function (l) { return (__assign({ from: node }, l)); })); }, []);
        return (React.createElement("div", { key: "root", style: style },
            React.createElement("svg", { width: width, height: height, style: { left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }, onClick: function () { return onClickNode({ nodeId: null, graph: null, screen: null }); } },
                React.createElement("g", null, nodes.reduce(function (p, node) {
                    return p.concat([getChildrenProps(node.children)
                            .filter(function (link) { return !isNaN(link.ratePerSecond) && (link.ratePerSecond > 0); })
                            .map(function (link) { return svgLineFromLink(nodeDict, node, link, strokeColor, scaleX, scaleY); })]);
                }, [])),
                React.createElement("g", null, nodes.map(function (node) { return node.label && React.createElement(react_motion_1.Motion, { key: node.id, defaultStyle: { x: 0, y: 0 }, style: { x: spring(scaleX(node.x)), y: spring(scaleY(node.y)) } }, function (_a) {
                    var x = _a.x, y = _a.y;
                    return React.createElement(svg_components_1.WrappedSvgText, { key: node.id, x: x, y: y, height: 60, width: 80, fontWeight: node.group ? 800 : 400, text: "" + node.label, lineHeight: 14, fontWidth: 12, textColor: node.labelColor || "#fff8f8" });
                }); })),
                React.createElement("g", null, nodes.filter(function (node) { return !node.group && !node.annotation; })
                    .map(function (node) { return node.symbol ? React.createElement("text", { key: node.id, x: scaleX(node.x), y: scaleY(node.y), height: 20, width: 80, onClick: function (c) {
                        console.log("CLICK", c);
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
                    : React.createElement(react_motion_1.Motion, { key: node.id, defaultStyle: { x: 0, y: 0 }, style: { x: spring(scaleX(node.x)), y: spring(scaleY(node.y)) } }, function (_a) {
                        var x = _a.x, y = _a.y;
                        return React.createElement("circle", { key: node.id, cx: x, cy: y, onClick: function (c) {
                                console.log("CLICK", c);
                                onClickNode({ nodeId: node.id, graph: { x: node.x, y: node.y }, screen: null });
                                c.stopPropagation();
                            }, r: ((selectedNodeId === node.id) ? 9 : 5), fill: node.symbolColor || "#80ff80", strokeWidth: (selectedNodeId === node.id) ? 3 : 0, stroke: (selectedNodeId === node.id) ? "white" : "transparent" });
                    }); }))),
            React.createElement("div", { key: "particleContainer", style: { pointerEvents: "none", position: "absolute", left: 0, top: 0 } },
                React.createElement(react_motion_1.Motion, { defaultStyle: allLinks.reduce(function (p, link) {
                        return (__assign((_a = {}, _a[link.from.id + "-" + link.linkTo + "-fromX"] = scaleX(link.from.x) / width, _a[link.from.id + "-" + link.linkTo + "-fromY"] = 1 - scaleY(link.from.y) / height, _a[link.from.id + "-" + link.linkTo + "-toX"] = scaleX(nodeDict[link.linkTo].x) / width, _a[link.from.id + "-" + link.linkTo + "-toY"] = 1 - scaleY(nodeDict[link.linkTo].y) / height, _a), p));
                        var _a;
                    }, {}), style: allLinks.reduce(function (p, link) {
                        return (__assign((_a = {}, _a[link.from.id + "-" + link.linkTo + "-fromX"] = spring(scaleX(link.from.x) / width), _a[link.from.id + "-" + link.linkTo + "-fromY"] = spring(1 - scaleY(link.from.y) / height), _a[link.from.id + "-" + link.linkTo + "-toX"] = spring(scaleX(nodeDict[link.linkTo].x) / width), _a[link.from.id + "-" + link.linkTo + "-toY"] = spring(1 - scaleY(nodeDict[link.linkTo].y) / height), _a), p));
                        var _a;
                    }, {}) }, function (style) { return React.createElement(flow_1.Flow, { key: "particles", width: diagramWidth, height: diagramHeight, run: run, backgroundColor: backgroundColor }, allLinks.map(function (link) {
                    return React.createElement(flow_1.Step, __assign({ key: link.from.id + "-" + link.linkTo, fromX: style[link.from.id + "-" + link.linkTo + "-fromX"], fromY: style[link.from.id + "-" + link.linkTo + "-fromY"], toX: style[link.from.id + "-" + link.linkTo + "-toX"], toY: style[link.from.id + "-" + link.linkTo + "-toY"], ratePerSecond: link.ratePerSecond }, link));
                })); }))));
    };
    return Graph;
}(React.Component));
exports.Graph = Graph;
//# sourceMappingURL=drawing.js.map