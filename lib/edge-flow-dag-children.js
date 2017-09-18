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
var NodeDag = /** @class */ (function (_super) {
    __extends(NodeDag, _super);
    function NodeDag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodeDag.prototype.getLinks = function () {
        return React.Children.map(this.props.children, function (c) { return c.props; });
    };
    NodeDag.prototype.render = function () {
        return React.createElement("div", null, "Do Not Render");
    };
    return NodeDag;
}(React.Component));
exports.NodeDag = NodeDag;
var EdgeDag = /** @class */ (function (_super) {
    __extends(EdgeDag, _super);
    function EdgeDag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EdgeDag.prototype.render = function () {
        return React.createElement("div", null, "Do Not Render");
    };
    return EdgeDag;
}(React.Component));
exports.EdgeDag = EdgeDag;
//# sourceMappingURL=edge-flow-dag-children.js.map