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
var edge_flow_1 = require("./edge-flow");
var force_edge_1 = require("./edge-flow-force/force-edge");
exports.EdgeForce = force_edge_1.Edge;
var force_node_1 = require("./edge-flow-force/force-node");
exports.NodeForce = force_node_1.Node;
var common_1 = require("./common");
var ngraph_helper_1 = require("./edge-flow-force/ngraph-helper");
var styles = {
    container: {
        position: "relative",
        display: "inline-block",
        verticalAlign: "top",
        padding: 0,
        margin: 0
    }
};
var EdgeFlowForce = (function (_super) {
    __extends(EdgeFlowForce, _super);
    function EdgeFlowForce(p) {
        var _this = _super.call(this, p) || this;
        _this.state = { nodes: _this.getStateFromProps(p) };
        return _this;
    }
    EdgeFlowForce.prototype.getStateFromProps = function (newProps) {
        var graph = ngraph_helper_1.getGraphFromNodes(newProps.children);
        return ngraph_helper_1.getLayout(graph, newProps.children, newProps.style.width, newProps.style.height);
    };
    EdgeFlowForce.prototype.componentWillReceiveProps = function (newProps) {
        this.setState({ nodes: this.getStateFromProps(newProps) });
    };
    EdgeFlowForce.prototype.render = function () {
        var state = this.state;
        var posNodes = lodash_1.keyBy(state.nodes, function (n) { return n.id; });
        var _a = this.props, children = _a.children, props = __rest(_a, ["children"]);
        var nodes = common_1.getChildrenProps(children) || [];
        var nodeDict = lodash_1.keyBy(nodes, function (n) { return n.id; });
        var allEdges = nodes.reduce(function (p, node) { return p.concat((common_1.getChildrenProps(node.children))
            .filter(function (edge) { return !isNaN(edge.ratePerSecond) && (edge.ratePerSecond > 0); })
            .map(function (edge) { return (__assign({ fromForceNode: node.id }, edge)); })); }, []);
        var groupedEdges = lodash_1.groupBy(allEdges, function (e) { return e.fromForceNode; });
        return (React.createElement(edge_flow_1.EdgeFlow, __assign({}, props), nodes.map(function (node) { return React.createElement(edge_flow_1.Node, __assign({ key: node.id, center: posNodes[node.id] }, node), groupedEdges[node.id] && groupedEdges[node.id].map(function (edge) { return React.createElement(edge_flow_1.Edge, __assign({ key: edge.fromForceNode + "-" + edge.linkTo }, edge)); })); })));
    };
    return EdgeFlowForce;
}(React.Component));
exports.EdgeFlowForce = EdgeFlowForce;
//# sourceMappingURL=edge-flow-force.js.map