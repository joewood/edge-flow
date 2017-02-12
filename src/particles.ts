import Igloo, { Program, Buffer, Texture } from "igloo-ts";
const vertexShader = require("./shaders/vertex.glsl");
const pixelShader = require("./shaders/pixel.glsl");
import Color = require("color");
import TextureData from "./texture-data";
import { IEdge as IModelEdge } from "./flow-node"

export interface IFlow extends IModelEdge {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}

// texture buffer used to hold vertex information
const colorRow = 0;
const vertexRow = 1;
const variationRow = 2;
const shapeRow = 3;
const endColorRow = 4;
const edgeRows = 5;

export default class Particles {
    private worldsize: Float32Array;
    private color: string;
    private running = false;
    private igloo: Igloo;
    private program: Program;
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

        this.program = this.igloo.program(vertexShaderText, pixelShaderText);
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


    /** If the vertices have changed then update the buffers   */
    public updateBuffers(edges: IFlow[], width: number, height: number) {
        try {
            const gl = this.igloo.gl;
            const particleCount = edges.reduce((p, c) => c.ratePerSecond + p, 0);
            const edgeCount = edges.length;
            this.worldsize = new Float32Array([width, height]);

            // if the total particle count has changed then we need to change the associations
            // between the particle and the vertex data (edge) 
            if (particleCount != this.count) {
                console.log("Updating Edge Data: " + particleCount);
                this.count = particleCount;
                let i = 0;
                const edgeIndexArray = new Float32Array(particleCount);
                const timeOffsetArray = new Float32Array(particleCount);
                let edgeIndex = 0;
                for (let edge of edges) {
                    for (let n = 0; n < edge.ratePerSecond; n++) {
                        timeOffsetArray[i] = Math.random();
                        edgeIndexArray[i] = edgeIndex;
                        i++;
                    }
                    edgeIndex++;
                }
                this.program.use();
                // update time
                const timeBuffer = this.igloo.array(timeOffsetArray, gl.STATIC_DRAW);
                timeBuffer.update(timeOffsetArray, gl.STATIC_DRAW);
                this.program.attrib('time', timeBuffer, 1);
                // update edge Index
                const edgeIndexBuffer = this.igloo.array(edgeIndexArray, gl.STATIC_DRAW);
                edgeIndexBuffer.update(edgeIndexArray, gl.STATIC_DRAW);
                this.program.attrib('edgeIndex', edgeIndexBuffer, 1);
            }

            if (this.textureData.length != edgeCount) {
                this.textureData = new TextureData(edgeRows, edgeCount);
                console.log(`Allocated Texture ${this.textureData.lengthPower2} x ${this.textureData.rowsPower2}`)
            }
            const nodeVariation = 0.005;
            let edgeIndex = 0;
            // update the texture Data, each row is a different attribute of the edge
            for (let edge of edges) {
                // set-up vertices in edgedata
                this.textureData.setValue(vertexRow, edgeIndex, edge.fromX, edge.fromY, edge.toX, edge.toY);
                // random variation of the particles
                this.textureData.setValue(variationRow, edgeIndex, edge.variationMin || -0.01, edge.variationMax || 0.01, (edge.variationMax || 0.01) - (edge.variationMin || -0.01), Math.random());
                // set-up color in edge Data
                this.textureData.setColor(colorRow, edgeIndex, edge.color || this.color);
                this.textureData.setColor(endColorRow, edgeIndex, edge.endingColor || edge.color || this.color);
                // set-up shape
                this.textureData.setValue(shapeRow, edgeIndex, (edge.size || this.size || 8.0) / 256, edge.shape || 0.0, 0.0, 0.0);

                edgeIndex++;
            }
            this.program.use();

            this.program.uniform('edgeCount', this.textureData.lengthPower2);
            this.program.uniform('variationRow', (variationRow + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('colorRow', (colorRow + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('vertexRow', (vertexRow + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('endColorRow', (endColorRow + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('shapeRow', (shapeRow + 0.5) / this.textureData.rowsPower2);

            const edgeTexture = this.textureData.bindTexture(this.igloo.gl, gl.TEXTURE0);

            this.program.uniform('edgeData', 0, true);
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
        this.program.use();
        this.program.uniform('second', ((new Date().valueOf() % 2000) / 2000.0));
        this.program.uniform('worldsize', this.worldsize);
        // this.drawProgram.uniform('size', this.size);
        this.program.uniform('edgeData', 0, true);

        const background = Color(this.color).array();
        this.program.uniform('color', [background[0] / 255, background[1] / 255, background[2] / 255, 1.0]);
        this.program.draw(gl.POINTS, this.count);
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