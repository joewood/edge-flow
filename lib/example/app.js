"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ReactDOM = require("react-dom");
var drawing_1 = require("../drawing");
var lodash_1 = require("lodash");
var radius = 40;
function circlePoint(i, length) {
    var angle = (i % length) / length * 2 * Math.PI;
    return {
        x: radius + radius * Math.cos(angle),
        y: radius + radius * Math.sin(angle)
    };
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
        _this.state = { animationIndex: 0, points: lodash_1.range(0, 20).map(function (pt, i, arr) { return circlePoint(i, arr.length); }) };
        return _this;
    }
    App.prototype.componentDidMount = function () {
        this.timer = window.setInterval(this.moveNext, 8000);
    };
    App.prototype.componentWillUnmount = function () {
        window.clearInterval(this.timer);
    };
    App.prototype.render = function () {
        var points = this.state.points;
        var numPoints = points.length;
        return React.createElement("div", { id: "root", style: { display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black" } },
            React.createElement(drawing_1.Graph, { backgroundColor: "#0f0f0f", height: 600, width: 600, run: true }, points.map(function (p, i) {
                return React.createElement(drawing_1.Node, { key: "node" + i, id: "node" + i, label: i.toString(), x: p.x, y: p.y, labelColor: "white" },
                    React.createElement(drawing_1.Link, { linkTo: "node" + (i + 1) % numPoints, ratePerSecond: 10, variationMin: -0.1, variationMax: 0.1, color: "rgb(" + (255 - i / points.length * 200) + ",200," + (i / points.length * 200 + 50) + ")" }),
                    React.createElement(drawing_1.Link, { linkTo: "node" + Math.floor(i + numPoints / 2) % numPoints, ratePerSecond: 10, color: "#e0e0ff" }));
            })));
    };
    return App;
}(React.Component));
document.addEventListener("DOMContentLoaded", function () {
    console.log("ready");
    ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
});
//# sourceMappingURL=app.js.map