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
var Edge = /** @class */ (function (_super) {
    __extends(Edge, _super);
    function Edge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Edge.prototype.render = function () { return React.createElement("div", null, "Do Not Render"); };
    return Edge;
}(React.Component));
exports.Edge = Edge;
var Node = /** @class */ (function (_super) {
    __extends(Node, _super);
    function Node() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Node.prototype.getLinks = function () {
        return React.Children.map(this.props.children, function (c) { return c.props; });
    };
    Node.prototype.render = function () {
        return React.createElement("div", null, "Do Not Render");
    };
    return Node;
}(React.Component));
exports.Node = Node;
//# sourceMappingURL=edge-flow-children.js.map