import { IPoint, ISize } from "./model";
export declare class Scale {
    private min;
    private max;
    private screen;
    private marginVirtual;
    private offsetScreen;
    private virtualSize;
    private screenSize;
    private scaleToScreen;
    constructor(min: IPoint, max: IPoint, screen: ISize, marginVirtual: ISize);
    private updateScale();
    panTo(screen: IPoint): void;
    setMargin(margin: ISize): void;
    scaleXToScreen(x: number): number;
    scaleYToScreen(y: number): number;
    heightToScreen(height: number): number;
    widthToScreen(width: number): number;
    avgSizeToScreen(size: number): number;
    smallestSizeToScreen(size: number): number;
}
