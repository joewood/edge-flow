export default class TextureData {
    private rows;
    length: number;
    rowsPower2: number;
    lengthPower2: number;
    private data;
    private texture;
    constructor(rows: number, length: number);
    /** Set the data in the texture
     * @param value1 must be 0->1.0
     * @param value2 must be 0->1.0
     * @param value3 must be 0->1.0
     * @param value3 must be 0->1.0
     */
    setValue(row: number, index: number, value1: number, value2: number, value3: number, value4: number): void;
    setColor(row: number, index: number, color: string, alpha?: number): void;
    getData(): Float32Array;
    bindTexture(gl: WebGLRenderingContext, register: number): WebGLTexture;
}