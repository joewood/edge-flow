"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var __1 = require("..");
var Partition = (function (_super) {
    __extends(Partition, _super);
    function Partition(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {};
        return _this;
    }
    Partition.prototype.componentWillReceiveProps = function (newProps) {
    };
    Partition.prototype.render = function () {
        var _a = this.props, animate = _a.animate, animationIndex = _a.animationIndex, width = _a.width, height = _a.height;
        var inc = 1, x = 10, y = 10;
        return React.createElement("div", { key: "root", style: { display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height || 200, width: width || 200, overflow: "hidden" } },
            React.createElement(__1.EdgeFlowForce, { style: { height: (height || 200) * 0.9, width: (width || 200) * 0.9, backgroundColor: "black" }, run: animate },
                React.createElement(__1.NodeForce, { key: "source", id: "source", x: 10, symbol: "\uf109", symbolColor: "white", symbolSize: 50 },
                    React.createElement(__1.EdgeForce, { key: "11E", linkTo: "connector1", ratePerSecond: 20, variationMax: 0.2, variationMin: -0.2, size: 20, shape: 1, color: "blue", endingColor: "green" }),
                    React.createElement(__1.EdgeForce, { key: "12E", linkTo: "connector2", ratePerSecond: 20, variationMax: 0.2, variationMin: -0.2, size: 20, shape: 1, color: "blue", endingColor: "green" }),
                    React.createElement(__1.EdgeForce, { key: "13E", linkTo: "connector3", ratePerSecond: 20, variationMax: 0.2, variationMin: -0.2, size: 20, shape: 1, color: "blue", endingColor: "green" })),
                React.createElement(__1.NodeForce, { key: "connector1", id: "connector1", x: 20, symbol: "\u2225", symbolSize: 50 },
                    React.createElement(__1.EdgeForce, { key: "21E", linkTo: "connector11", ratePerSecond: 20, size: 20, variationMax: 0.2, variationMin: -0.2, shape: 1, color: "green", endingColor: "red" })),
                React.createElement(__1.NodeForce, { key: "connector2", id: "connector2", lockXTo: "connector1", symbol: "\u2225", symbolSize: 50 },
                    React.createElement(__1.EdgeForce, { key: "21E", linkTo: "connector12", ratePerSecond: 20 })),
                React.createElement(__1.NodeForce, { key: "connector3", id: "connector3", lockXTo: "connector1", symbol: "\u2225", symbolSize: 50 },
                    React.createElement(__1.EdgeForce, { key: "21E", linkTo: "connector13", ratePerSecond: 20 })),
                React.createElement(__1.NodeForce, { key: "connector11", id: "connector11", x: 40, symbol: "\u2225", symbolSize: 50 },
                    React.createElement(__1.EdgeForce, { key: "21E", linkTo: "target", ratePerSecond: 20, size: 20, variationMax: 0.2, variationMin: -0.2, shape: 1, color: "green", endingColor: "red" })),
                React.createElement(__1.NodeForce, { key: "connector12", id: "connector12", lockXTo: "connector11", symbol: "\u2225", symbolSize: 50 },
                    React.createElement(__1.EdgeForce, { key: "21E", linkTo: "target", ratePerSecond: 20 })),
                React.createElement(__1.NodeForce, { key: "connector13", id: "connector13", lockXTo: "connector11", symbol: "\u2225", symbolSize: 50 },
                    React.createElement(__1.EdgeForce, { key: "21E", linkTo: "target", ratePerSecond: 20 })),
                React.createElement(__1.NodeForce, { key: "target", id: "target", x: 140, symbol: "\uf109", symbolColor: "white", symbolSize: 50 })));
    };
    return Partition;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Partition;
//# sourceMappingURL=network.js.map