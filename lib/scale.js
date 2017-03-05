"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const scaleX = (x: number, min: IPoint, max: IPoint, diagramWidth: number) => ;
// const scaleY = (y: number, min: IPoint, max: IPoint, diagramHeight: number) => Math.round(((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight * 10) / 10;
var Scale = (function () {
    function Scale(min, max, screen, marginVirtual) {
        this.min = min;
        this.max = max;
        this.screen = screen;
        this.marginVirtual = marginVirtual;
        this.offsetScreen = { x: 0, y: 0 };
        this.updateScale();
    }
    Scale.prototype.updateScale = function () {
        this.virtualSize = { width: this.max.x - this.min.x + 2 * this.marginVirtual.width, height: this.max.y - this.min.y + 2 * this.marginVirtual.height };
        this.screenSize = this.screen;
        this.scaleToScreen = { x: this.screenSize.width / this.virtualSize.width, y: this.screenSize.height / this.virtualSize.height };
    };
    Scale.prototype.panTo = function (screen) {
        this.offsetScreen = screen;
    };
    Scale.prototype.setMargin = function (margin) {
        this.marginVirtual = margin;
        this.updateScale();
    };
    Scale.prototype.scaleXToScreen = function (x) {
        return this.scaleToScreen.x * (x + this.marginVirtual.width) - this.offsetScreen.x;
    };
    Scale.prototype.scaleYToScreen = function (y) {
        return this.scaleToScreen.y * (y + this.marginVirtual.height) - this.offsetScreen.y;
    };
    Scale.prototype.heightToScreen = function (height) {
        return this.scaleToScreen.y * height;
    };
    Scale.prototype.widthToScreen = function (width) {
        return this.scaleToScreen.x * width;
    };
    Scale.prototype.avgSizeToScreen = function (size) {
        return (this.scaleToScreen.x + this.scaleToScreen.y) / 2.0 * size;
    };
    Scale.prototype.smallestSizeToScreen = function (size) {
        return Math.min(this.scaleToScreen.x * size, this.scaleToScreen.y * size);
    };
    return Scale;
}());
exports.Scale = Scale;
//# sourceMappingURL=scale.js.map