import Igloo, { Program, Buffer, Texture } from "igloo-ts";
const seedRandom = require("seedrandom");
import { vertexShader, pixelShader } from "./shaders"
import Color = require("color");

export interface IFlow {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    ratePerSecond: number;
    color?: string;
    size?: number;
    variationMin?: number;
    variationMax?: number;
}

export default class Particles {

    private worldsize: Float32Array;
    private color: string;
    private running = false;
    private igloo: Igloo;
    private drawProgram: Program;

    public backgroundColor: { r: number, g: number, b: number } = null;
    private count: number;

    /**
     * @param nparticles initial particle count
     * @param [size=5] particle size in pixels
     */
    constructor(canvas: HTMLCanvasElement, private size: number = 5) {
        const igloo = this.igloo = new Igloo(canvas);
        const vertexShaderText = vertexShader(0);
        const pixelShaderText = pixelShader(0);

        this.drawProgram = this.igloo.program(vertexShaderText, pixelShaderText);
        const gl = igloo.gl;

        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_texture_float');
        const w = canvas.width;
        const h = canvas.height;
        gl.disable(gl.DEPTH_TEST);
        this.worldsize = new Float32Array([w, h]);
        /* Drawing parameters. */
        this.color = "blue";

        console.log("Initialized Particle system")
    }

    public get isRunning() {
        return this.running;
    }

    private textureFromFloats(gl: WebGLRenderingContext, width: number, height: number, float32Array: Float32Array): WebGLTexture {
        var oldActive = gl.getParameter(gl.ACTIVE_TEXTURE);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            width, height, 0,
            gl.RGBA, gl.FLOAT, float32Array);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.activeTexture(gl.TEXTURE0); // working register 31, thanks.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // gl.activeTexture(oldActive);
        return texture;
    }

    /** Set a new particle count.   */
    public updateBuffers(flows: IFlow[]) {
        try {
            const gl = this.igloo.gl;
            const pointCount = flows.reduce((p, c) => c.ratePerSecond + p, 0);
            const edgeCount = flows.length;
            // seed random for consistency
            // const random = seedRandom("FlowNetwork");

            if (pointCount != this.count) {
                console.log("Updating Time: " + pointCount);
                this.count = pointCount;
                let i = 0;
                const edgeIndexArray = new Float32Array(pointCount);
                const timeOffsetArray = new Float32Array(pointCount);
                let edgeIndex = 0;
                for (let flow of flows) {
                    for (let n = 0; n < flow.ratePerSecond; n++) {
                        timeOffsetArray[i] = Math.random();
                        edgeIndexArray[i] = edgeIndex;
                        i++;
                    }
                    edgeIndex++;
                }
                this.drawProgram.use();
                // update time
                const timeBuffer = this.igloo.array(timeOffsetArray,gl.STATIC_DRAW);
                timeBuffer.update(timeOffsetArray, gl.STATIC_DRAW);
                this.drawProgram.attrib('time', timeBuffer, 1);
                // update edge Index
                const edgeIndexBuffer = this.igloo.array(edgeIndexArray,gl.STATIC_DRAW);
                edgeIndexBuffer.update(edgeIndexArray, gl.STATIC_DRAW);
                this.drawProgram.attrib('edgeIndex', edgeIndexBuffer, 1);
            }

            const w = this.worldsize[0];
            const h = this.worldsize[1];
            const edgeCountPower = 2 ** Math.floor(Math.log2(edgeCount) + 1);
            // edge buffer
            // edge buffer usage:
            const colorRow = 0;
            const vertexRow = 1;
            const variationRow = 2;
            // row #0 - colors
            // row #1 - fromx,fromy,tox,toy
            const edgeRows = 3;
            const edgeRowsPower = 2 ** Math.floor(Math.log2(edgeRows) + 1);

            const edgeTexData = new Float32Array(edgeCountPower * 4 * edgeRowsPower);
            // console.log(`Texture ${edgeCountPower} ${edgeRowsPower}`)
            const nodeVariation = 0.005;
            let edgeIndex = 0;
            for (let flow of flows) {
                // set-up vertices in edgedata
                edgeTexData[edgeIndex * 4 + vertexRow * edgeCountPower * 4] = flow.fromX;
                edgeTexData[edgeIndex * 4 + 1 + vertexRow * edgeCountPower * 4] = flow.fromY;
                edgeTexData[edgeIndex * 4 + 2 + vertexRow * edgeCountPower * 4] = flow.toX;
                edgeTexData[edgeIndex * 4 + 3 + vertexRow * edgeCountPower * 4] = flow.toY;

                edgeTexData[edgeIndex * 4 + variationRow * edgeCountPower * 4] = flow.variationMin || -0.01;
                edgeTexData[edgeIndex * 4 + 1 + variationRow * edgeCountPower * 4] = flow.variationMax || 0.01;
                edgeTexData[edgeIndex * 4 + 2 + variationRow * edgeCountPower * 4] = (flow.variationMax || 0.01) - (flow.variationMin || -0.01);
                edgeTexData[edgeIndex * 4 + 3 + variationRow * edgeCountPower * 4] = Math.random(); 
                // set-up color in edge Data
                const edgeColor = Color(flow.color || this.color).array();
                // console.log("Color: " + flow.color,edgeColor);
                edgeTexData[edgeIndex * 4 + colorRow * edgeCountPower * 4] = edgeColor[0]/256;
                edgeTexData[edgeIndex * 4 + 1 + colorRow * edgeCountPower * 4] = edgeColor[1]/256;
                edgeTexData[edgeIndex * 4 + 2 + colorRow * edgeCountPower * 4] = edgeColor[2]/256;
                edgeTexData[edgeIndex * 4 + 3 + colorRow * edgeCountPower * 4] = 1.0;
                edgeIndex++;
            }
            this.drawProgram.use();

            this.drawProgram.uniform('edgeCount', edgeCountPower);
            const edgeTexture = this.textureFromFloats(this.igloo.gl, edgeCountPower, edgeRowsPower, edgeTexData);

            this.drawProgram.uniform('edgeData', 0, true);
        }
        catch (e) {
            console.error("UpdateBuffers", e);
        }
    };

    /** Draw the current simulation state to the display. */
    public draw() {
        const igloo = this.igloo;
        const gl = igloo.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        igloo.defaultFramebuffer.bind();
        gl.viewport(0, 0, this.worldsize[0], this.worldsize[1]);
        gl.clearColor(
            this.backgroundColor ? this.backgroundColor.r / 256 : 0,
            this.backgroundColor ? this.backgroundColor.g / 256 : 0,
            this.backgroundColor ? this.backgroundColor.b / 256 : 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.drawProgram.use();
        this.drawProgram.uniform('second', ((new Date().valueOf() % 3000) / 3000.0));
        this.drawProgram.uniform('worldsize', this.worldsize);
        this.drawProgram.uniform('size', this.size);
        this.drawProgram.uniform('edgeData', 0, true);

        const background = Color(this.color).array();
        this.drawProgram.uniform('color', [background[0] / 255, background[1] / 255, background[2] / 255, 1.0]);// Color(this.color).array();
        this.drawProgram.draw(gl.POINTS, this.count);
        return this;
    };

    /** Register with requestAnimationFrame to step and draw a frame.*/
    public frame() {
        window.requestAnimationFrame(() => {
            if (this.running) {
                this.draw().frame();
            } else {
                console.log("Stopped");
            }
        });
    };

    /** Start animating the simulation if it isn't already.*/
    public start() {
        if (!this.running) {
            this.running = true;
            this.frame();
        }
    };

    /** Immediately stop the animation. */
    public stop() {
        this.running = false;
    }
}