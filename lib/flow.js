"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var particles_1 = require("./particles");
// old way of doing Color import
var Color = require("color");
var Step = (function (_super) {
    __extends(Step, _super);
    function Step() {
        return _super.apply(this, arguments) || this;
    }
    Step.prototype.render = function () {
        return null;
    };
    return Step;
}(React.Component));
exports.Step = Step;
var Flow = (function (_super) {
    __extends(Flow, _super);
    function Flow() {
        return _super.apply(this, arguments) || this;
    }
    Flow.prototype.setupParticles = function (props) {
        if (!this.canvas)
            return;
        if (!this.particles)
            this.particles = new particles_1.default(this.canvas, 2);
        var background = Color(props.backgroundColor);
        // console.log("children: ", React.Children.map(props.children, (f => f.valueOf() as any)).slice(0,1)[0]);
        this.particles.stop();
        var flowsAny = React.Children.map(props.children, function (c) { return c.props.style ? c.valueOf() : c; }) || [];
        var flows = flowsAny.map(function (fa) { return fa.props; });
        this.particles.backgroundColor = { r: background.red(), g: background.green(), b: background.blue() };
        this.particles.updateBuffers(flows);
        this.particles.draw();
        if (props.run)
            this.particles.start();
    };
    Flow.prototype.componentWillReceiveProps = function (newProps) {
        if (!!this.particles) {
            if (this.props.children !== newProps.children) {
                this.setupParticles(newProps);
            }
            if (newProps.run !== this.props.run) {
                if (newProps.run)
                    this.particles.start();
                else
                    this.particles.stop();
            }
        }
    };
    Flow.prototype.shouldComponentUpdate = function (newProps, newState) {
        // if just run changes then don't update
        if (newProps.children == this.props.children &&
            newProps.backgroundColor === this.props.backgroundColor &&
            newProps.height === this.props.height &&
            newProps.width === this.props.width)
            return false;
        return true;
    };
    Flow.prototype.componentWillUnmount = function () {
        if (!!this.particles) {
            this.particles.stop();
        }
    };
    Flow.prototype.render = function () {
        var _this = this;
        var _a = this.props, width = _a.width, height = _a.height;
        var running = this.particles && this.particles.isRunning;
        return (React.createElement("canvas", { key: "canva", style: { pointerEvents: "none" }, ref: function (canvas) {
                if (_this.canvas === canvas || !canvas)
                    return;
                _this.canvas = canvas;
                if (_this.particles) {
                    _this.particles.stop();
                    _this.particles = null;
                }
                _this.setupParticles(_this.props);
            }, width: width, height: height }));
    };
    return Flow;
}(React.PureComponent));
exports.Flow = Flow;
//# sourceMappingURL=flow.js.map