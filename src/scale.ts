import { IPoint, ISize } from "./model"


// const scaleX = (x: number, min: IPoint, max: IPoint, diagramWidth: number) => ;
// const scaleY = (y: number, min: IPoint, max: IPoint, diagramHeight: number) => Math.round(((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight * 10) / 10;

export class Scale {
    private offsetScreen: IPoint;
    private virtualSize: ISize;
    private screenSize: ISize;
    private scaleToScreen: IPoint;

    constructor(private min: IPoint, private max: IPoint, private screen: ISize, private marginVirtual: ISize) {
        this.offsetScreen = { x: 0, y: 0 };
        this.updateScale();
    }

    private updateScale() {
        this.virtualSize = { width: this.max.x - this.min.x + 2 * this.marginVirtual.width, height: this.max.y - this.min.y + 2 * this.marginVirtual.height };
        this.screenSize = this.screen;
        this.scaleToScreen = { x: this.screenSize.width / this.virtualSize.width, y: this.screenSize.height / this.virtualSize.height };
    }

    public panTo(screen: IPoint) {
        this.offsetScreen = screen;
    }

    public setMargin(margin: ISize) {
        this.marginVirtual = margin;
        this.updateScale();
    }

    public scaleXToScreen(x: number): number {
        return this.scaleToScreen.x * (x + this.marginVirtual.width) - this.offsetScreen.x;
    }

    public scaleYToScreen(y: number): number {
        return this.scaleToScreen.y * (y + this.marginVirtual.height) - this.offsetScreen.y;
    }

    public heightToScreen(height: number): number {
        return this.scaleToScreen.y * height;
    }

    public widthToScreen(width: number): number {
        return this.scaleToScreen.x * width;
    }

    public avgSizeToScreen(size: number): number {
        return (this.scaleToScreen.x + this.scaleToScreen.y) / 2.0 * size;
    }

    public smallestSizeToScreen(size: number): number {
        return Math.min(this.scaleToScreen.x * size, this.scaleToScreen.y * size);
    }


}