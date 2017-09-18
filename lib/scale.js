"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const scaleX = (x: number, min: IPoint, max: IPoint, diagramWidth: number) => ;
// const scaleY = (y: number, min: IPoint, max: IPoint, diagramHeight: number) => Math.round(((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight * 10) / 10;
var Scale = /** @class */ (function () {
    function Scale(min, max, screen, topLeftMarginVirtual, bottomRightMarginVirtual, maxScale) {
        if (maxScale === void 0) { maxScale = 3; }
        this.min = min;
        this.max = max;
        this.screen = screen;
        this.topLeftMarginVirtual = topLeftMarginVirtual;
        this.bottomRightMarginVirtual = bottomRightMarginVirtual;
        this.maxScale = maxScale;
        this.offsetScreen = { x: 0, y: 0 };
        this.updateScale();
    }
    Scale.prototype.getTransform = function () {
        return {
            x: this.offsetScreen.x / this.toScreenScale.x + this.topLeftMarginVirtual.width,
            y: this.offsetScreen.y / this.toScreenScale.y + this.topLeftMarginVirtual.height,
            scaleX: this.toScreenScale.x,
            scaleY: this.toScreenScale.y
        };
    };
    Scale.prototype.getTranslate = function () {
        return "translate(" + (this.offsetScreen.x + this.topLeftMarginVirtual.width * this.toScreenScale.x) + "," + (this
            .offsetScreen.y +
            this.topLeftMarginVirtual.height * this.toScreenScale.y) + ")";
    };
    Scale.prototype.getScale = function () {
        return "scale(" + this.toScreenScale.x + "," + this.toScreenScale.y + ")";
    };
    Scale.prototype.updateScale = function () {
        this.virtualSize = {
            width: this.max.x - this.min.x + this.bottomRightMarginVirtual.width + this.topLeftMarginVirtual.width,
            height: this.max.y - this.min.y + this.topLeftMarginVirtual.height + this.bottomRightMarginVirtual.height
        };
        this.screenSize = this.screen;
        var uniformScale = Math.min(Math.min(this.screenSize.width / this.virtualSize.width, this.screenSize.height / this.virtualSize.height), this.maxScale);
        this.toScreenScale = { x: uniformScale, y: uniformScale };
        this.offsetScreen = {
            x: (this.screen.width - this.toScreenScale.x * this.virtualSize.width) / 2,
            y: (this.screen.height - this.toScreenScale.y * this.virtualSize.height) / 2
        };
        // console.log("Scale:",scaleuniform );
        // this.toScreenScale = { x: this.screenSize.width / this.virtualSize.width, y: this.screenSize.height / this.virtualSize.height };
        // if (this.toScreenScale.x > (2 * this.toScreenScale.y)) this.toScreenScale.x = this.toScreenScale.y * 2;
        // if (this.toScreenScale.y > (2 * this.toScreenScale.x)) this.toScreenScale.y = this.toScreenScale.x * 2;
    };
    Scale.prototype.panTo = function (screen) {
        this.offsetScreen = screen;
    };
    Scale.prototype.scaleXToScreen = function (x) {
        return this.toScreenScale.x * (x + this.topLeftMarginVirtual.width) + this.offsetScreen.x;
    };
    Scale.prototype.scaleYToScreen = function (y) {
        return this.toScreenScale.y * (y + this.topLeftMarginVirtual.height) + this.offsetScreen.y;
    };
    Scale.prototype.heightToScreen = function (height) {
        return this.toScreenScale.y * height;
    };
    Scale.prototype.widthToScreen = function (width) {
        return this.toScreenScale.x * width;
    };
    Scale.prototype.avgSizeToScreen = function (size) {
        return (this.toScreenScale.x + this.toScreenScale.y) / 2.0 * size;
    };
    Scale.prototype.smallestSizeToScreen = function (size) {
        return Math.min(this.toScreenScale.x * size, this.toScreenScale.y * size);
    };
    Scale.prototype.screenHeightToVirtual = function (height) {
        return height / this.toScreenScale.y;
    };
    return Scale;
}());
exports.Scale = Scale;
//# sourceMappingURL=scale.js.map