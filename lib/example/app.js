"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ReactDOM = require("react-dom");
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
var App = (function (_super) {
    __extends(App, _super);
    function App(p) {
        var _this = _super.call(this, p) || this;
        _this.moveNext = function () {
            var animationIndex = _this.state.animationIndex + 1;
            var points = _this.state.points.map(function (pt, i, arr) { return circlePoint(i + animationIndex, arr.length); });
            _this.setState({ animationIndex: animationIndex, points: points });
        };
        _this.state = {
            animationIndex: 0,
            points: lodash_1.range(0, 24).map(function (pt, i, arr) { return circlePoint(i, arr.length); }),
            animate: true
        };
        return _this;
    }
    App.prototype.componentDidMount = function () {
        this.timer = window.setInterval(this.moveNext, 2000);
    };
    App.prototype.componentWillUnmount = function () {
        window.clearInterval(this.timer);
    };
    App.prototype.render = function () {
        var _this = this;
        var points = this.state.points;
        var numPoints = points.length;
        return React.createElement("div", { id: "root", style: { display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black" } },
            React.createElement("p", { style: { color: "white" }, onClick: function () { return _this.setState({ animate: !_this.state.animate }); } }, "Click to Pause"),
            React.createElement(__1.EdgeFlow, { style: { height: 600, width: 600, backgroundColor: "#0f0f0f" }, run: this.state.animate }, points.map(function (p, i) {
                return React.createElement(__1.Node, { key: "node" + i, id: "node" + i, label: i.toString(), x: p.x, y: p.y, labelColor: "white" },
                    React.createElement(__1.Edge, { linkTo: "node" + (i + 1) % numPoints, ratePerSecond: 10, variationMin: -0.03, variationMax: 0.03, color: "rgb(" + Math.round(255 - i / points.length * 200) + ",200," + Math.round(i / points.length * 200 + 50) + ")" }),
                    React.createElement(__1.Edge, { linkTo: "nodep-" + Math.floor(i / points.length * 4), ratePerSecond: 15 + i * 2, color: "#e0ffe0" }));
            }).concat([React.createElement(__1.Node, { key: "nodep-0", id: "nodep-0", x: radius + radius / 3, y: radius + radius / 3 }),
                React.createElement(__1.Node, { key: "nodep-1", id: "nodep-1", x: radius - radius / 3, y: radius + radius / 3 }),
                React.createElement(__1.Node, { key: "nodep-2", id: "nodep-2", x: radius - radius / 3, y: radius - radius / 3 }),
                React.createElement(__1.Node, { key: "nodep-3", id: "nodep-3", x: radius + radius / 3, y: radius - radius / 3 })])));
    };
    return App;
}(React.Component));
document.addEventListener("DOMContentLoaded", function () {
    console.log("ready");
    ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
});
//# sourceMappingURL=app.js.map