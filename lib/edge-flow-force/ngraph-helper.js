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
var graph = require("ngraph.graph");
var layout = require('ngraph.forcelayout');
var lodash_1 = require("lodash");
function getGraphFromNodes(childrenNodes) {
    var g = graph();
    var nodes = eachChild(childrenNodes, function (props) { return (__assign({}, props, { text: props.label, links: eachChild(props.children, function (cc) { return cc; }) })); });
    var nodeDict = lodash_1.keyBy(nodes, function (n) { return n.id; });
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        g.addNode(node.id, node);
        if (node.links) {
            for (var _a = 0, _b = node.links; _a < _b.length; _a++) {
                var link = _b[_a];
                if (!nodeDict[link.linkTo])
                    continue;
                g.addLink(node.id, link.linkTo); //, { ratePerSecond: link.ratePerSecond });
            }
        }
    }
    return g;
}
exports.getGraphFromNodes = getGraphFromNodes;
function eachChild(children, f) {
    var childNodes = React.Children.map(children, function (c) { return c; }) || [];
    var nonNull = childNodes.filter(function (c) { return !!c; }).map(function (c) { return c.props; });
    return nonNull.map(f);
}
function getLayout(g, childrenNodes) {
    var forceLayout = layout(g);
    eachChild(childrenNodes, function (nodeProp) {
        if (!isNaN(nodeProp.center.x) && !isNaN(nodeProp.center.y)) {
            forceLayout.setNodePosition(nodeProp.id, nodeProp.center.x, nodeProp.center.y);
            if (nodeProp.fixed) {
                var node = g.getNode(nodeProp.id);
                forceLayout.pinNode(node, true);
            }
        }
        if (!isNaN(nodeProp.mass)) {
            console.log("Changing Mass");
            forceLayout.getBody(nodeProp.id).mass = nodeProp.mass;
        }
        eachChild(nodeProp.children, function (linkProp) {
            if (!isNaN(linkProp.length) || nodeProp.group) {
                var spring = forceLayout.getSpring(nodeProp.id, linkProp.linkTo);
                if (spring)
                    spring.length = linkProp.length || 6;
            }
        });
        return nodeProp;
    });
    var lockedNodes = mapNodes(g).filter(function (n) { return !!n.data.lockYTo || !!n.data.lockXTo; });
    var nodeDict = lodash_1.keyBy(mapNodes(g), function (n) { return n.data.id; });
    for (var i = 0; i < 100; ++i) {
        forceLayout.step();
        lockedNodes.forEach(function (locked) {
            var lockToPos = forceLayout.getNodePosition(locked.id);
            if (locked.data.lockYTo && nodeDict[locked.data.lockYTo]) {
                lockToPos.y = forceLayout.getNodePosition(locked.data.lockYTo).y;
            }
            if (locked.data.lockXTo && nodeDict[locked.data.lockXTo]) {
                lockToPos.x = forceLayout.getNodePosition(locked.data.lockXTo).x;
            }
            forceLayout.setNodePosition(locked.id, lockToPos.x, lockToPos.y);
        });
    }
    // const rect = forceLayout.getGraphRect();
    return mapNodes(g).map(function (node) { return getPosition(forceLayout, node /*, rect, 20, width, height*/); });
}
exports.getLayout = getLayout;
function mapLinks(graph, node) {
    var nn = [];
    if (node) {
        graph.forEachLinkedNode(node.id, function (l) {
            nn.push(l);
        });
    }
    else {
        graph.forEachLink(function (l) {
            nn.push(l);
        });
    }
    return nn;
}
exports.mapLinks = mapLinks;
function mapNodes(graph) {
    var nn = [];
    graph.forEachNode(function (n) {
        nn.push(n);
    });
    return nn;
}
exports.mapNodes = mapNodes;
function getPosition(layout, n /*, rect: any, blockWidth: number, screenWidth: number, screenHeight: number, center: boolean = false*/) {
    // total width if the graph size + the block size + margin *2
    // if (!n) {
    //     console.error("Invalid Node");
    //     return { x: 0, y: 0, id: null };
    // }
    // const width = rect.x2 - rect.x1 + blockWidth;
    // const height = rect.y2 - rect.y1 + blockWidth;
    // const scaleX = screenWidth / width;
    // const scaleY = screenHeight / height;
    // const offsetX = rect.x1 * -1 + blockWidth * 0.5;
    // const offsetY = rect.y1 * -1 + blockWidth * 0.5;
    // const pos = 
    return __assign({ id: n.id }, layout.getNodePosition(n.id));
    // return {
    //     id: n.id,
    //     x: (pos.x + offsetX) * scaleX - (center ? 0 : blockWidth * 0.5),
    //     y: (pos.y + offsetY) * scaleY - (center ? 0 : blockWidth * 0.5),
    // };
}
exports.getPosition = getPosition;
//# sourceMappingURL=ngraph-helper.js.map