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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var __1 = require("..");
var Partition = (function (_super) {
    __extends(Partition, _super);
    function Partition(p) {
        var _this = _super.call(this, p) || this;
        _this.inc = 0;
        _this.state = {};
        return _this;
    }
    Partition.prototype.componentWillReceiveProps = function (newProps) {
        // const points = this.state.points.map((pt, i, arr) => circlePoint(i + newProps.animationIndex, arr.length));
        // this.setState({ points: points });
    };
    Partition.prototype.getPartition = function (x, y) {
        var inc = this.inc++;
        var sourceInc = Math.floor(inc / 2);
        return [
            (!(inc % 2)) && React.createElement(__1.Node, { key: "source" + sourceInc, id: "source" + sourceInc, label: "source", x: x, y: y },
                React.createElement(__1.Edge, { linkTo: "head" + inc, color: "red", shape: 1.0, size: 12, ratePerSecond: 20, pathColor: "black" }),
                React.createElement(__1.Edge, { linkTo: "head" + (inc + 1), color: "red", shape: 1.0, size: 12, ratePerSecond: 20, pathColor: "black" })),
            React.createElement(__1.Node, { key: "head" + inc, id: "head" + inc, x: x + 5 + inc, y: y + 10, group: true },
                React.createElement(__1.Edge, { linkTo: "tail" + inc, color: "rgb(255,224,224)", shape: 0.01, size: 6, nonrandom: true, pathOpacity: 1, variationMax: 0, variationMin: 0, endingColor: "rgba(55,55,55,0.0)", pathColor: "#101010", pathWidth: 20, ratePerSecond: 12 })),
            React.createElement(__1.Node, { key: "tail" + inc, id: "tail" + inc, x: x + 5 + inc, y: y + 55, group: true }),
            React.createElement(__1.Node, { key: "deq" + inc, id: "deq" + inc, x: x + 5.1 + inc, y: y + 15, group: true },
                React.createElement(__1.Edge, { linkTo: "sink" + inc, ratePerSecond: 20, shape: 1, size: 12, color: "#a0a0a0", pathColor: "black" })),
            React.createElement(__1.Node, { key: "sink" + inc, id: "sink" + inc, x: x + 20, y: y, label: "sink" })
        ].filter(function (f) { return !!f; });
    };
    Partition.prototype.render = function () {
        var _a = this.props, animate = _a.animate, animationIndex = _a.animationIndex, width = _a.width, height = _a.height;
        var inc = 1, x = 10, y = 10;
        this.inc = 0;
        return React.createElement("div", { key: "root", style: { display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height || 200, width: width || 200, overflow: "hidden" } },
            React.createElement(__1.EdgeFlow, { style: { height: (height || 200) * 0.9, width: (width || 200) * 0.9, backgroundColor: "black" }, run: animate }, this.getPartition(10, 10).concat(this.getPartition(10, 30), this.getPartition(10, 50), this.getPartition(10, 70), this.getPartition(10, 90), this.getPartition(10, 110))));
    };
    return Partition;
}(React.Component));
exports.default = Partition;
//# sourceMappingURL=partition.js.map