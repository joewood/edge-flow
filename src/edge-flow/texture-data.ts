// import Igloo, { Program, Buffer, Texture } from "igloo-ts";
import Color = require("color");

export default class TextureData {
    public rowsPower2: number;
    public lengthPower2: number;
    private data: Float32Array;
    private texture: WebGLTexture;

    constructor(private rows: number, public length: number) {
        this.rowsPower2 = 2 ** Math.ceil(Math.log2(this.rows));
        this.lengthPower2 = 2 ** Math.ceil(Math.log2(length));
        this.data = new Float32Array(this.rowsPower2 * this.lengthPower2 * 4)
    }

    /** Set the data in the texture
     * @param value1 must be 0->1.0
     * @param value2 must be 0->1.0
     * @param value3 must be 0->1.0
     * @param value3 must be 0->1.0
     */
    public setValue(row: number, index: number, value1: number, value2: number, value3: number, value4: number): void {
        this.data[row * this.lengthPower2 * 4 + index * 4 + 0] = value1;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 1] = value2;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 2] = value3;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 3] = value4;
    }

    /** Set the data in the texture
     * @param vec1 must be (0->1.0,0->1.0)
     * @param vec2 must be (0->1.0,0->1.0)
     */
    public setVec2(row: number, index: number, vec1:{x:number,y:number}, vec2: {x:number,y:number}): void {
        this.data[row * this.lengthPower2 * 4 + index * 4 + 0] = vec1.x;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 1] = vec1.y;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 2] = vec2.x;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 3] = vec2.y;
    }


    public setColor(row: number, index: number, color: string): void {
        const colorObj = Color(color);
        const colorarray = colorObj.array();
        this.setValue(row, index, colorarray[0] / 256, colorarray[1] / 256, colorarray[2] / 256, colorObj.alpha());
    }

    public getData() : Float32Array {
        return this.data;
    }

    public bindTexture(gl: WebGLRenderingContext, register:number) /*width: number, height: number, float32Array: Float32Array)*/: WebGLTexture {
        var oldActive = gl.getParameter(gl.ACTIVE_TEXTURE);
        if (this.texture) gl.deleteTexture(this.texture);
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            this.lengthPower2, this.rowsPower2, 0,
            gl.RGBA, gl.FLOAT, this.data);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.activeTexture(register); // working register 31, thanks.
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.activeTexture(oldActive);
        return this.texture;
    }


}