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
var ReactDOM = require("react-dom");
require("font-awesome/css/font-awesome.css");
var network_1 = require("./network");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(p) {
        var _this = _super.call(this, p) || this;
        _this.nodeIndex = 10;
        _this.onResize = function () {
            console.log("resize");
            _this.setState({
                width: document.getElementById("root").clientWidth,
                height: document.getElementById("root").clientHeight
            });
        };
        _this.addNode = function () {
            _this.setState({ nodes: [{ name: "node" + _this.nodeIndex++ }].concat(_this.state.nodes) });
        };
        _this.removeNode = function () {
            console.log("Removing  " + _this.state.selectedNode, _this.state.nodes);
            _this.setState({ nodes: _this.state.nodes.filter(function (n) { return n.name != _this.state.selectedNode; }) });
            console.log("Removing Afer " + _this.state.selectedNode, _this.state.nodes.filter(function (n) { return n.name != _this.state.selectedNode; }));
        };
        _this.state = {
            nodes: [],
            height: 300,
            width: 300,
            animate: false,
            selectedNode: null
        };
        return _this;
    }
    App.prototype.componentDidMount = function () {
        // this.timer = window.setInterval(this.moveNext, 2000);
        window.addEventListener("resize", this.onResize);
        this.setState({
            width: document.getElementById("root").clientWidth,
            height: document.getElementById("root").clientHeight - 20
        });
    };
    App.prototype.componentWillUnmount = function () {
        // window.clearInterval(this.timer);
        window.removeEventListener("resize", this.onResize);
    };
    App.prototype.render = function () {
        var _this = this;
        var _a = this.state, width = _a.width, height = _a.height, animate = _a.animate;
        var buttonStyle = { height: 50, width: 130, margin: 5, color: "black" };
        return (React.createElement("div", { key: "root", id: "root", style: { backgroundColor: "black", overflow: "hidden" }, ref: function (div) { return (_this.div = div); } },
            React.createElement("div", { style: { height: 60 } },
                React.createElement("button", { key: "pause", style: buttonStyle, onClick: function () { return _this.setState({ animate: !_this.state.animate }); } }, "Pause"),
                React.createElement("button", { key: "Add", style: buttonStyle, onClick: this.addNode }, "Add"),
                React.createElement("button", { key: "Remove", style: buttonStyle, onClick: this.removeNode },
                    "Remove ",
                    this.state.selectedNode),
                React.createElement("button", { key: "Reset", style: buttonStyle, onClick: function () { return _this.setState({ nodes: [] }); } }, "Reset")),
            React.createElement(network_1.default, { animate: animate, height: height - 60, width: width, nodes: this.state.nodes, selectedNode: this.state.selectedNode, onSelectNode: function (node) {
                    console.log("NODE", node);
                    _this.setState({ selectedNode: node });
                } })));
    };
    return App;
}(React.Component));
document.addEventListener("DOMContentLoaded", function () {
    ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
});
//# sourceMappingURL=app.js.map