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
var particles_1 = require("./particles");
// old way of doing Color import
var Color = require("color");
var ParticleEdge = (function (_super) {
    __extends(ParticleEdge, _super);
    function ParticleEdge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParticleEdge.prototype.render = function () {
        return null;
    };
    return ParticleEdge;
}(React.Component));
exports.ParticleEdge = ParticleEdge;
var ParticleCanvas = (function (_super) {
    __extends(ParticleCanvas, _super);
    function ParticleCanvas() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParticleCanvas.prototype.setupParticles = function (props) {
        if (!this.canvas)
            return;
        if (!this.particles)
            this.particles = new particles_1.default(this.canvas, 2);
        var background = Color(props.backgroundColor);
        // this.particles.stop();
        var flowsAny = React.Children.map(props.children, function (c) { return c.props.style ? c.valueOf() : c; }) || [];
        var flows = flowsAny.map(function (fa) { return fa.props; });
        this.particles.backgroundColor = { r: background.red(), g: background.green(), b: background.blue() };
        this.particles.updateBuffers(flows, props.width, props.height);
        this.particles.draw();
        if (props.run)
            this.particles.start();
    };
    ParticleCanvas.prototype.componentWillReceiveProps = function (newProps) {
        if (!!this.particles) {
            if (this.props.children !== newProps.children || this.props.width != newProps.width || this.props.height != newProps.height) {
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
    ParticleCanvas.prototype.shouldComponentUpdate = function (newProps, newState) {
        // if just run changes then don't update
        if (newProps.children == this.props.children &&
            newProps.backgroundColor === this.props.backgroundColor &&
            newProps.height === this.props.height &&
            newProps.width === this.props.width)
            return false;
        return true;
    };
    ParticleCanvas.prototype.componentWillUnmount = function () {
        if (!!this.particles) {
            this.particles.stop();
        }
    };
    ParticleCanvas.prototype.render = function () {
        var _this = this;
        var _a = this.props, width = _a.width, height = _a.height;
        var running = this.particles && this.particles.isRunning;
        return (React.createElement("canvas", { key: "canva", style: { pointerEvents: "none" }, ref: function (canvas) {
                if (_this.canvas === canvas || !canvas)
                    return;
                _this.canvas = canvas;
                console.log("New Canvas");
                if (_this.particles) {
                    _this.particles.stop();
                    _this.particles = null;
                }
                _this.setupParticles(_this.props);
            }, width: width, height: height }));
    };
    return ParticleCanvas;
}(React.PureComponent));
exports.ParticleCanvas = ParticleCanvas;
//# sourceMappingURL=particle-canvas.js.map