"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function mapChild(children, f) {
    var childNodes = React.Children.map(children, function (c) { return c; }) || [];
    var nonNull = childNodes.filter(function (c) { return !!c; }).map(function (c) { return c.props; });
    return nonNull.map(f);
}
exports.mapChild = mapChild;
function getChildrenProps(children) {
    return React.Children.map(children, function (child) { return child.props; }) || [];
}
exports.getChildrenProps = getChildrenProps;
//# sourceMappingURL=common.js.map