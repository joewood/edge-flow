import { IPoint, ISize } from "./model";
export declare class Scale {
    private min;
    private max;
    private screen;
    private topLeftMarginVirtual;
    private bottomRightMarginVirtual;
    offsetScreen: IPoint;
    private virtualSize;
    private screenSize;
    private toScreenScale;
    constructor(min: IPoint, max: IPoint, screen: ISize, topLeftMarginVirtual: ISize, bottomRightMarginVirtual: ISize);
    getTransform(): {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
    };
    getTranslate(): string;
    getScale(): string;
    private updateScale();
    panTo(screen: IPoint): void;
    scaleXToScreen(x: number): number;
    scaleYToScreen(y: number): number;
    heightToScreen(height: number): number;
    widthToScreen(width: number): number;
    avgSizeToScreen(size: number): number;
    smallestSizeToScreen(size: number): number;
    screenHeightToVirtual(height: number): number;
}
