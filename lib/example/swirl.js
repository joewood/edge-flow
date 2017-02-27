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
var lodash_1 = require("lodash");
var __1 = require("..");
var radius = 200;
function circlePoint(i, length) {
    var angle = (i % length) / length * 2 * Math.PI;
    return {
        x: radius + radius * Math.cos(angle),
        y: radius + radius * Math.sin(angle)
    };
}
function segment(p) {
    return p < radius ? "0" : "1";
}
var Swirl = (function (_super) {
    __extends(Swirl, _super);
    function Swirl(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {
            points: lodash_1.range(0, 24).map(function (pt, i, arr) { return circlePoint(i, arr.length); }),
        };
        return _this;
    }
    Swirl.prototype.componentWillReceiveProps = function (newProps) {
        var points = this.state.points.map(function (pt, i, arr) { return circlePoint(i + newProps.animationIndex, arr.length); });
        this.setState({ points: points });
    };
    Swirl.prototype.render = function () {
        var points = this.state.points;
        var _a = this.props, animate = _a.animate, animationIndex = _a.animationIndex, width = _a.width, height = _a.height;
        var numPoints = points.length;
        return React.createElement("div", { key: "root", style: { display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height, width: width, overflow: "hidden" } },
            React.createElement(__1.EdgeFlow, { style: { height: height * 0.8 - 20, width: width * 0.8, backgroundColor: "#0f0f0f" }, run: animate }, points.map(function (p, i) {
                return React.createElement(__1.Node, { key: "node" + i, id: "node" + i, label: i.toString(), x: p.x, y: p.y, labelColor: "white" },
                    React.createElement(__1.Edge, { linkTo: "node" + (i + 1) % numPoints, ratePerSecond: 7, variationMin: -0.1, variationMax: 0.1, size: 5.0, shape: 0.0, pathOpacity: 0.05, color: "rgb(" + Math.round(255 - i / points.length * 200) + ",200," + Math.round(i / points.length * 200 + 50) + ")", pathColor: "rgb(" + Math.round(255 - i / points.length * 200) + ",200," + Math.round(i / points.length * 200 + 50) + ")" }),
                    React.createElement(__1.Edge, { linkTo: "nodep-" + Math.floor(i / points.length * 4), ratePerSecond: 10, color: "#e0ffe0", size: 8, shape: 1.0, pathWidth: 3, pathOpacity: 0.001, nonrandom: true, source: { x: p.x, y: p.y }, p2: { x: p.x + 10.0, y: p.y + 10.0 }, p3: { x: radius + 40, y: radius + 40 }, target: { x: radius, y: radius }, endingColor: "rgba(192,255,192,0.0)" }));
            }).concat([React.createElement(__1.Node, { key: "nodep-0", id: "nodep-0", x: radius + radius / 8, y: radius + radius / 8, group: true }),
                React.createElement(__1.Node, { key: "nodep-1", id: "nodep-1", x: radius - radius / 8, y: radius + radius / 8, group: true }),
                React.createElement(__1.Node, { key: "nodep-2", id: "nodep-2", x: radius - radius / 8, y: radius - radius / 8, group: true }),
                React.createElement(__1.Node, { key: "nodep-3", id: "nodep-3", x: radius + radius / 8, y: radius - radius / 8, group: true })])));
    };
    return Swirl;
}(React.Component));
exports.default = Swirl;
//# sourceMappingURL=swirl.js.map