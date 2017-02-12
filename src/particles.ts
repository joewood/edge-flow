import Igloo, { Program, Buffer, Texture } from "igloo-ts";
const seedRandom = require("seedrandom");
const vertexShader = require("./shaders/vertex.glsl");
const pixelShader = require("./shaders/pixel.glsl");
import Color = require("color");
import TextureData from "./texture-data";


export interface IFlow {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    ratePerSecond: number;
    color?: string;
    size?: number;
    shape?: number;
    variationMin?: number;
    variationMax?: number;
}


const colorRow = 0;
const vertexRow = 1;
const variationRow = 2;
const shapeRow = 3;
const edgeRows = 4;

export default class Particles {
    private worldsize: Float32Array;
    private color: string;
    private running = false;
    private igloo: Igloo;
    private drawProgram: Program;
    private texture: WebGLTexture = null;
    private raf: number = 0;

    public backgroundColor: { r: number, g: number, b: number } = null;
    private count: number;
    private textureData: TextureData;

    /**
     * @param nparticles initial particle count
     * @param [size=5] particle size in pixels
     */
    constructor(private canvas: HTMLCanvasElement, private size: number = 8) {
        const igloo = this.igloo = new Igloo(canvas);
        const vertexShaderText = vertexShader;
        const pixelShaderText = pixelShader;

        this.drawProgram = this.igloo.program(vertexShaderText, pixelShaderText);
        const gl = igloo.gl;

        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_texture_float');
        const w = canvas.width;
        const h = canvas.height;
        gl.disable(gl.DEPTH_TEST);
        this.worldsize = new Float32Array([w, h]);
        this.textureData = new TextureData(2, edgeRows);
        /* Drawing parameters. */
        this.color = "blue";
        console.log("Initialized Particle system")
    }

    public get isRunning() {
        return this.running;
    }


    /** Set a new particle count.   */
    public updateBuffers(flows: IFlow[], width: number, height: number) {
        try {
            const gl = this.igloo.gl;
            const pointCount = flows.reduce((p, c) => c.ratePerSecond + p, 0);
            const edgeCount = flows.length;

            if (pointCount != this.count) {
                console.log("Updating Edge Data: " + pointCount);
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
                const timeBuffer = this.igloo.array(timeOffsetArray, gl.STATIC_DRAW);
                timeBuffer.update(timeOffsetArray, gl.STATIC_DRAW);
                this.drawProgram.attrib('time', timeBuffer, 1);
                // update edge Index
                const edgeIndexBuffer = this.igloo.array(edgeIndexArray, gl.STATIC_DRAW);
                edgeIndexBuffer.update(edgeIndexArray, gl.STATIC_DRAW);
                this.drawProgram.attrib('edgeIndex', edgeIndexBuffer, 1);
            }

            this.worldsize = new Float32Array([width, height]);
            const w = this.worldsize[0];
            const h = this.worldsize[1];

            if (this.textureData.length != edgeCount) {
                this.textureData = new TextureData(edgeRows, edgeCount);
            }
            const nodeVariation = 0.005;
            let edgeIndex = 0;
            for (let flow of flows) {
                // set-up vertices in edgedata
                this.textureData.setValue(vertexRow, edgeIndex, flow.fromX, flow.fromY, flow.toX, flow.toY);

                this.textureData.setValue(variationRow, edgeIndex, flow.variationMin || -0.01, flow.variationMax || 0.01, (flow.variationMax || 0.01) - (flow.variationMin || -0.01), Math.random());
                // set-up color in edge Data
                this.textureData.setColor(colorRow, edgeIndex, flow.color || this.color);
                // set-up shape
                this.textureData.setValue(shapeRow, edgeIndex, (flow.size || this.size || 8.0) / 256, flow.shape || 0.0, 0.0, 0.0);

                edgeIndex++;
            }
            this.drawProgram.use();

            this.drawProgram.uniform('edgeCount', this.textureData.lengthPower2);
            const edgeTexture = this.textureData.bindTexture(this.igloo.gl, gl.TEXTURE0);

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
        this.drawProgram.uniform('second', ((new Date().valueOf() % 2000) / 2000.0));
        this.drawProgram.uniform('worldsize', this.worldsize);
        // this.drawProgram.uniform('size', this.size);
        this.drawProgram.uniform('edgeData', 0, true);

        const background = Color(this.color).array();
        this.drawProgram.uniform('color', [background[0] / 255, background[1] / 255, background[2] / 255, 1.0]);
        this.drawProgram.draw(gl.POINTS, this.count);
        return this;
    };

    /** Register with requestAnimationFrame to step and draw a frame.*/
    public frame() {
        this.raf = window.requestAnimationFrame(() => {
            if (this.running) {
                this.draw();
                this.frame();
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
        if (this.raf) window.cancelAnimationFrame(this.raf);
    }
}