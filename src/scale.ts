import { IPoint, ISize } from "./model"


// const scaleX = (x: number, min: IPoint, max: IPoint, diagramWidth: number) => ;
// const scaleY = (y: number, min: IPoint, max: IPoint, diagramHeight: number) => Math.round(((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight * 10) / 10;

export class Scale {
    public offsetScreen: IPoint;
    private virtualSize: ISize;
    private screenSize: ISize;
    private toScreenScale: IPoint;

    constructor(private min: IPoint, private max: IPoint, private screen: ISize, private topLeftMarginVirtual: ISize, private bottomRightMarginVirtual: ISize) {
        this.offsetScreen = { x: 0, y: 0 };
        this.updateScale();
    }

    public getTransform() {
        return { x:this.offsetScreen.x+this.topLeftMarginVirtual.width,
            y:this.offsetScreen.y+this.topLeftMarginVirtual.height,
            scaleX:this.toScreenScale.x,
            scaleY:this.toScreenScale.y
         }
    }

    public getTranslate() {
        return `translate(${this.offsetScreen.x+this.topLeftMarginVirtual.width},${this.offsetScreen.y+this.topLeftMarginVirtual.height})`;
    }

    public getScale() {
        return `scale(${this.toScreenScale.x},${this.toScreenScale.y})`;
    }

    private updateScale() {
        this.virtualSize = { width: this.max.x - this.min.x + this.bottomRightMarginVirtual.width + this.topLeftMarginVirtual.width, height: this.max.y - this.min.y + this.topLeftMarginVirtual.height + this.bottomRightMarginVirtual.height };
        this.screenSize = this.screen;
        this.toScreenScale = { x: this.screenSize.width / this.virtualSize.width, y: this.screenSize.height / this.virtualSize.height };
        if (this.toScreenScale.x > (2 * this.toScreenScale.y)) this.toScreenScale.x = this.toScreenScale.y * 2;
        if (this.toScreenScale.y > (2 * this.toScreenScale.x)) this.toScreenScale.y = this.toScreenScale.x * 2;
    }

    public panTo(screen: IPoint) {
        this.offsetScreen = screen;
    }

    public scaleXToScreen(x: number): number {
        return this.toScreenScale.x * (x + this.topLeftMarginVirtual.width) - this.offsetScreen.x;
    }

    public scaleYToScreen(y: number): number {
        return this.toScreenScale.y * (y + this.topLeftMarginVirtual.height) - this.offsetScreen.y;
    }

    public heightToScreen(height: number): number {
        return this.toScreenScale.y * height;
    }

    public widthToScreen(width: number): number {
        return this.toScreenScale.x * width;
    }

    public avgSizeToScreen(size: number): number {
        return (this.toScreenScale.x + this.toScreenScale.y) / 2.0 * size;
    }

    public smallestSizeToScreen(size: number): number {
        return Math.min(this.toScreenScale.x * size, this.toScreenScale.y * size);
    }

    public screenHeightToVirtual(height: number): number {
        return height / this.toScreenScale.y;
    }

}

