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
// import { range } from "lodash";
var __1 = require("..");
var Partition = (function (_super) {
    __extends(Partition, _super);
    function Partition(p) {
        var _this = _super.call(this, p) || this;
        _this.invcFlow = function () {
            _this.setState({ flow: (_this.state.flow + 2) % 100 });
        };
        _this.addNode = function () {
            _this.setState({ nodes: [{ name: "node" + _this.state.nodes.length }].concat(_this.state.nodes) });
        };
        _this.state = {
            nodes: [],
            flow: 10,
        };
        return _this;
    }
    Partition.prototype.componentDidMount = function () {
        // this.interval1 = setInterval(this.invcFlow, 1000) ;
    };
    Partition.prototype.componentWillUnmounnt = function () {
        if (this.interval1)
            clearInterval(this.interval1);
    };
    Partition.prototype.render = function () {
        console.log("Rendering network");
        var _a = this.props, animate = _a.animate, width = _a.width, height = _a.height;
        // const inc = 1, x = 10, y = 10;
        var nodeStyle = { symbol: "\uf109", symbolColor: "white", symbolSize: 18, width: 10, height: 10 };
        var topicNode = { symbol: "\u2225", symbolColor: "white", symbolSize: 14, width: 10, height: 10 };
        var edgeStyle = { nonrandom: true, ratePerSecond: (this.state.flow), variationMax: 0.05, variationMin: -0.05, size: 3, shape: 0.65, color: "#ffff90", pathWidth: 4, pathOpacity: 0.1, endingColor: "rgb(128,128,255)" };
        return React.createElement("div", { key: "root", style: { display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height || 200, width: width || 200, overflow: "hidden" } },
            React.createElement("div", { key: "tool", style: { position: "absolute", right: 5, top: 5 } },
                React.createElement("button", { onClick: this.addNode }, "Add Node")),
            React.createElement(__1.EdgeFlowDag, { style: { height: (height || 200), width: (width || 200), backgroundColor: "#080810" }, run: animate }, [
                React.createElement(__1.NodeDag, __assign({ key: "source", id: "source" }, nodeStyle, { label: "source" }),
                    React.createElement(__1.EdgeDag, __assign({ key: "11E", linkTo: "connector1" }, edgeStyle)),
                    React.createElement(__1.EdgeDag, __assign({ key: "12E", linkTo: "connector2" }, edgeStyle)),
                    React.createElement(__1.EdgeDag, __assign({ key: "13E", linkTo: "connector3" }, edgeStyle))),
                React.createElement(__1.NodeDag, __assign({ key: "connector1", id: "connector1" }, topicNode, { label: "t1" }),
                    React.createElement(__1.EdgeDag, __assign({ key: "21E", linkTo: "connector11" }, edgeStyle))),
                React.createElement(__1.NodeDag, __assign({ key: "connector2", id: "connector2" }, topicNode, { label: "t2" }),
                    React.createElement(__1.EdgeDag, __assign({ key: "21E", linkTo: "connector23" }, edgeStyle))),
                React.createElement(__1.NodeDag, __assign({ key: "connector3", id: "connector3" }, topicNode),
                    React.createElement(__1.EdgeDag, __assign({ key: "21E", linkTo: "connector13" }, edgeStyle))),
                React.createElement(__1.NodeDag, __assign({ key: "connector11", id: "connector11" }, topicNode),
                    React.createElement(__1.EdgeDag, __assign({ key: "21E", linkTo: "target" }, edgeStyle))),
                React.createElement(__1.NodeDag, __assign({ key: "connector12", id: "connector12" }, topicNode),
                    React.createElement(__1.EdgeDag, __assign({ key: "21E", linkTo: "target" }, edgeStyle))),
                React.createElement(__1.NodeDag, __assign({ key: "connector13", id: "connector13" }, topicNode), this.state.nodes
                    .filter(function (n, i) { return ((n && i) % 2) == 1; })
                    .map(function (n, i) { return React.createElement(__1.EdgeDag, __assign({ linkTo: n && "node" + i, key: "node" + i }, edgeStyle)); }).concat([
                    React.createElement(__1.EdgeDag, __assign({ key: "21E", linkTo: "connector23" }, edgeStyle))
                ])),
                React.createElement(__1.NodeDag, __assign({ key: "connector23", id: "connector23" }, topicNode),
                    React.createElement(__1.EdgeDag, __assign({ key: "21E", linkTo: "target" }, edgeStyle)))
            ].concat(this.state.nodes.map(function (n, i) { return React.createElement(__1.NodeDag, __assign({ key: n && "node" + i, id: "node" + i }, topicNode),
                React.createElement(__1.EdgeDag, __assign({ linkTo: (i % 2) ? "target" : "connector23" }, edgeStyle))); }), [
                React.createElement(__1.NodeDag, __assign({ key: "target", id: "target" }, nodeStyle, { label: "target" }))
            ])));
    };
    return Partition;
}(React.PureComponent));
exports.default = Partition;
//# sourceMappingURL=network.js.map