"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Edge = (function (_super) {
    __extends(Edge, _super);
    function Edge() {
        return _super.apply(this, arguments) || this;
    }
    Edge.prototype.render = function () { return React.createElement("div", null, "Do Not Render"); };
    return Edge;
}(React.Component));
exports.Edge = Edge;
//# sourceMappingURL=force-edge.js.map