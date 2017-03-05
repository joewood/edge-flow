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
var layout = require("ciena-dagre");
var Graph = require("ciena-graphlib").Graph;
var lodash_1 = require("lodash");
var common_1 = require("../common");
function getGraphFromNodes(childrenNodes) {
    // Create a new directed graph 
    var g = new Graph()
        .setGraph({ rankdir: "LR" })
        .setDefaultEdgeLabel(function () { return {}; });
    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function () { return {}; });
    var nodes = common_1.mapChild(childrenNodes, function (props) { return (__assign({}, props, { label: props.label, links: common_1.mapChild(props.children, function (cc) { return cc; }) })); });
    var nodeDict = lodash_1.keyBy(nodes, function (n) { return n.id; });
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        g.setNode(node.id, node);
        if (node.links) {
            for (var _a = 0, _b = node.links; _a < _b.length; _a++) {
                var link = _b[_a];
                if (!nodeDict[link.linkTo])
                    continue;
                g.setEdge(node.id, link.linkTo);
            }
        }
    }
    return g;
}
exports.getGraphFromNodes = getGraphFromNodes;
function getLayout(g, childrenNodes, width, height) {
    g.rankdir = "LR";
    var dagLayout = layout.layout(g, { rankdir: "LR" });
    var nodes = g.nodes();
    var posNodes = nodes.map(function (node) {
        var pt = g.node(node);
        if (!pt) {
            console.error("Unknown Node ", node);
            return null;
        }
        return { id: node, x: pt.x, y: pt.y, edges: [] };
    }).filter(function (e) { return e; });
    var posNodesDict = lodash_1.keyBy(posNodes, function (n) { return n.id; });
    var edges = g.edges();
    for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
        var edge = edges_1[_i];
        var e = g.edge(edge);
        if (posNodesDict[edge.v]) {
            posNodesDict[edge.v].edges.push({
                linkTo: edge.w,
                p0: e.points[0],
                p1: e.points[1] || e.points[0],
                p2: e.points[2] || e.points[1] || e.points[0],
                p3: e.points.slice(-1)[0],
            });
        }
        else {
            console.error("edge in layout has missing source node", edge);
            debugger;
        }
    }
    return posNodes;
}
exports.getLayout = getLayout;
//# sourceMappingURL=dagre-helper.js.map