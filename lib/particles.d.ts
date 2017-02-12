import { IEdge as IModelEdge } from "./flow-node";
export interface IFlow extends IModelEdge {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}
export default class Particles {
    private canvas;
    private size;
    private worldsize;
    private color;
    private running;
    private igloo;
    private program;
    private raf;
    backgroundColor: {
        r: number;
        g: number;
        b: number;
    };
    private count;
    private textureData;
    /**
     * @param nparticles initial particle count
     * @param [size=5] particle size in pixels
     */
    constructor(canvas: HTMLCanvasElement, size?: number);
    readonly isRunning: boolean;
    /** If the vertices have changed then update the buffers   */
    updateBuffers(edges: IFlow[], width: number, height: number): void;
    /** Draw the current simulation state to the display. */
    draw(): this;
    /** Register with requestAnimationFrame to step and draw a frame.*/
    frame(): void;
    /** Start animating the simulation if it isn't already.*/
    start(): void;
    /** Immediately stop the animation. */
    stop(): void;
}
