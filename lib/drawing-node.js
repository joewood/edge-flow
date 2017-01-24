"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Node = (function (_super) {
    __extends(Node, _super);
    function Node() {
        return _super.apply(this, arguments) || this;
    }
    Node.prototype.getLinks = function () {
        return React.Children.map(this.props.children, function (c) { return c.props; });
    };
    Node.prototype.render = function () { return React.createElement("div", null, "Do Not Render"); };
    return Node;
}(React.Component));
exports.Node = Node;
var Link = (function (_super) {
    __extends(Link, _super);
    function Link() {
        return _super.apply(this, arguments) || this;
    }
    Link.prototype.render = function () { return React.createElement("div", null, "Do Not Render"); };
    return Link;
}(React.Component));
exports.Link = Link;
//# sourceMappingURL=drawing-node.js.map