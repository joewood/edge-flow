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
var compKey = function (edge) { return edge.from.id + "-" + edge.linkTo; };
function isNodeStyle(style) {
    return style.data.isNode;
}
exports.isNodeStyle = isNodeStyle;
function isEdgeStyle(style) {
    return style.data.isEdge;
}
exports.isEdgeStyle = isEdgeStyle;
function isEdgeStyles(styles) {
    return styles.reduce(function (p, s) { return (isEdgeStyle(s) ? p.concat([s]) : p); }, []);
}
exports.isEdgeStyles = isEdgeStyles;
function isNodeStyles(styles) {
    return styles.reduce(function (p, s) { return (isNodeStyle(s) ? p.concat([s]) : p); }, []);
}
exports.isNodeStyles = isNodeStyles;
function getDefaultPositions(edge, nodeDict) {
    return {
        p0: edge.p0 || edge.from.center,
        p1: edge.p1 || edge.p0 || edge.from.center,
        p2: edge.p2 || edge.p3 || nodeDict[edge.linkTo].center,
        p3: edge.p3 || nodeDict[edge.linkTo].center
    };
}
function createEdgeStyle(edge, nodeDict, scale) {
    // default values for lines- use source and target node
    var _a = getDefaultPositions(edge, nodeDict), p0 = _a.p0, p1 = _a.p1, p2 = _a.p2, p3 = _a.p3;
    return {
        key: compKey(edge),
        style: {
            p0x: react_motion_1.spring(scale.scaleXToScreen(p0.x)),
            p0y: react_motion_1.spring(scale.scaleYToScreen(p0.y)),
            p1x: react_motion_1.spring(scale.scaleXToScreen(p1.x)),
            p1y: react_motion_1.spring(scale.scaleYToScreen(p1.y)),
            p2x: react_motion_1.spring(scale.scaleXToScreen(p2.x)),
            p2y: react_motion_1.spring(scale.scaleYToScreen(p2.y)),
            p3x: react_motion_1.spring(scale.scaleXToScreen(p3.x)),
            p3y: react_motion_1.spring(scale.scaleYToScreen(p3.y)),
            pv0x: react_motion_1.spring(p0.x),
            pv0y: react_motion_1.spring(p0.y),
            pv1x: react_motion_1.spring(p1.x),
            pv1y: react_motion_1.spring(p1.y),
            pv2x: react_motion_1.spring(p2.x),
            pv2y: react_motion_1.spring(p2.y),
            pv3x: react_motion_1.spring(p3.x),
            pv3y: react_motion_1.spring(p3.y)
        },
        data: __assign({ isNode: false, isEdge: true }, edge)
    };
}
exports.createEdgeStyle = createEdgeStyle;
function createDefaultEdgeStyle(edge, nodeDict, scale /* min: IPoint, max: IPoint, size: IPoint*/) {
    // default values for lines- use source and target node
    var _a = getDefaultPositions(edge, nodeDict), p0 = _a.p0, p1 = _a.p1, p2 = _a.p2, p3 = _a.p3;
    return {
        key: compKey(edge),
        style: {
            p0x: scale.scaleXToScreen(p0.x),
            p0y: scale.scaleYToScreen(p0.y),
            p1x: scale.scaleXToScreen(p1.x),
            p1y: scale.scaleYToScreen(p1.y),
            p2x: scale.scaleXToScreen(p2.x),
            p2y: scale.scaleYToScreen(p2.y),
            p3x: scale.scaleXToScreen(p3.x),
            p3y: scale.scaleYToScreen(p3.y),
            pv0x: p0.x,
            pv0y: p0.y,
            pv1x: p1.x,
            pv1y: p1.y,
            pv2x: p2.x,
            pv2y: p2.y,
            pv3x: p3.x,
            pv3y: p3.y
        },
        data: __assign({ isNode: false, isEdge: true }, edge)
    };
}
exports.createDefaultEdgeStyle = createDefaultEdgeStyle;
function createNodeStyle(node, point, scale /*min: IPoint, max: IPoint, size: IPoint*/) {
    return {
        key: node.id,
        style: {
            x: react_motion_1.spring(scale.scaleXToScreen(point.x)),
            y: react_motion_1.spring(scale.scaleYToScreen(point.y)),
            xv: react_motion_1.spring(point.x),
            yv: react_motion_1.spring(point.y)
        },
        data: __assign({ isNode: true, isEdge: false }, node)
    };
}
exports.createNodeStyle = createNodeStyle;
function createDefaultNodeStyle(node, point, scale) {
    return {
        key: node.id,
        style: {
            x: scale.scaleXToScreen(point.x),
            y: scale.scaleYToScreen(point.y),
            xv: point.x,
            yv: point.y
        },
        data: __assign({ isNode: true, isEdge: false }, node)
    };
}
exports.createDefaultNodeStyle = createDefaultNodeStyle;
//# sourceMappingURL=animation-style.js.map