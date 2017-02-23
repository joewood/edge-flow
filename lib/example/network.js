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
                React.createElement(__1.NodeForce, { key: "source", id: "source" },
                    React.createElement(__1.EdgeForce, { key: "12E", linkTo: "connector", ratePerSecond: 20 })),
                React.createElement(__1.NodeForce, { key: "connector", id: "connector" },
                    React.createElement(__1.EdgeForce, { key: "21E", linkTo: "target", ratePerSecond: 20 })),
                React.createElement(__1.NodeForce, { key: "target", id: "target" })));
    };
    return Partition;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Partition;
//# sourceMappingURL=network.js.map