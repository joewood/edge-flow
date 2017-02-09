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
export default class Particles {
    private canvas;
    private size;
    private worldsize;
    private color;
    private running;
    private igloo;
    private drawProgram;
    private texture;
    private raf;
    backgroundColor: {
        r: number;
        g: number;
        b: number;
    };
    private count;
    private edgeTexData;
    /**
     * @param nparticles initial particle count
     * @param [size=5] particle size in pixels
     */
    constructor(canvas: HTMLCanvasElement, size?: number);
    readonly isRunning: boolean;
    private textureFromFloats(gl, width, height, float32Array);
    /** Set a new particle count.   */
    updateBuffers(flows: IFlow[], width: number, height: number): void;
    /** Draw the current simulation state to the display. */
    draw(): this;
    /** Register with requestAnimationFrame to step and draw a frame.*/
    frame(): void;
    /** Start animating the simulation if it isn't already.*/
    start(): void;
    /** Immediately stop the animation. */
    stop(): void;
}
