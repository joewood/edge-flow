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
var react_motion_1 = require("react-motion");
var scaleX = function (x, min, max, diagramWidth) { return Math.round(((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16) * diagramWidth * 10) / 10; };
var scaleY = function (y, min, max, diagramHeight) { return Math.round(((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight * 10) / 10; };
var compKey = function (edge) { return edge.from.id + "-" + edge.linkTo; };
function isNodeStyle(style) {
    return style.data.isNode;
}
exports.isNodeStyle = isNodeStyle;
function isEdgeStyle(style) {
    return !style.data.isNode;
}
exports.isEdgeStyle = isEdgeStyle;
function isEdgeStyles(styles) {
    return styles.reduce(function (p, s) { return isEdgeStyle(s) ? p.concat([s]) : p; }, []);
}
exports.isEdgeStyles = isEdgeStyles;
function isNodeStyles(styles) {
    return styles.reduce(function (p, s) { return isNodeStyle(s) ? p.concat([s]) : p; }, []);
}
exports.isNodeStyles = isNodeStyles;
function getDefaultPositions(edge, nodeDict) {
    return {
        p0: edge.p0 || edge.from.center,
        p1: edge.p1 || edge.p0 || edge.from.center,
        p2: edge.p2 || edge.p3 || nodeDict[edge.linkTo].center,
        p3: edge.p3 || nodeDict[edge.linkTo].center,
    };
}
function createEdgeStyle(edge, nodeDict, min, max, size) {
    // default values for lines- use source and target node
    var _a = getDefaultPositions(edge, nodeDict), p0 = _a.p0, p1 = _a.p1, p2 = _a.p2, p3 = _a.p3;
    return {
        key: compKey(edge),
        style: {
            p0x: react_motion_1.spring(scaleX(p0.x, min, max, size.x)),
            p0y: react_motion_1.spring(scaleY(p0.y, min, max, size.y)),
            p1x: react_motion_1.spring(scaleX(p1.x, min, max, size.x)),
            p1y: react_motion_1.spring(scaleY(p1.y, min, max, size.y)),
            p2x: react_motion_1.spring(scaleX(p2.x, min, max, size.x)),
            p2y: react_motion_1.spring(scaleY(p2.y, min, max, size.y)),
            p3x: react_motion_1.spring(scaleX(p3.x, min, max, size.x)),
            p3y: react_motion_1.spring(scaleY(p3.y, min, max, size.y)),
        },
        data: __assign({ isNode: false }, edge),
    };
}
exports.createEdgeStyle = createEdgeStyle;
function createDefaultEdgeStyle(edge, nodeDict, min, max, size) {
    // default values for lines- use source and target node
    var _a = getDefaultPositions(edge, nodeDict), p0 = _a.p0, p1 = _a.p1, p2 = _a.p2, p3 = _a.p3;
    return {
        key: compKey(edge),
        style: {
            p0x: scaleX(p0.x, min, max, size.x),
            p0y: scaleY(p0.y, min, max, size.y),
            p1x: scaleX(p1.x, min, max, size.x),
            p1y: scaleY(p1.y, min, max, size.y),
            p2x: scaleX(p2.x, min, max, size.x),
            p2y: scaleY(p2.y, min, max, size.y),
            p3x: scaleX(p3.x, min, max, size.x),
            p3y: scaleY(p3.y, min, max, size.y),
        },
        data: __assign({ isNode: false }, edge),
    };
}
exports.createDefaultEdgeStyle = createDefaultEdgeStyle;
function createNodeStyle(node, point, min, max, size) {
    return {
        key: node.id,
        style: {
            x: react_motion_1.spring(scaleX(point.x, min, max, size.x)),
            y: react_motion_1.spring(scaleY(point.y, min, max, size.y))
        },
        data: __assign({ isNode: true }, node),
    };
}
exports.createNodeStyle = createNodeStyle;
function createDefaultNodeStyle(node, point, min, max, size) {
    return {
        key: node.id,
        style: {
            x: scaleX(point.x, min, max, size.x),
            y: scaleY(point.y, min, max, size.y)
        },
        data: __assign({ isNode: true }, node),
    };
}
exports.createDefaultNodeStyle = createDefaultNodeStyle;
//# sourceMappingURL=animation-style.js.map