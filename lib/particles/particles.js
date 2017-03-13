"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var igloo_ts_1 = require("igloo-ts");
var vertexShader = require("../../loader/raw-loader!../../shaders/vertex.glsl");
var pixelShader = require("../../loader/raw-loader!../../shaders/pixel.glsl");
var Color = require("color");
var texture_data_1 = require("./texture-data");
// texture buffer used to hold vertex information
var COLOR_ROW = 0;
var VERTEX_ROW = 1;
var VARIATION_ROW = 2;
var SHAPE_ROW = 3;
var END_COLOR_ROW = 4;
var BEZIER_ROW = 4;
var edgeRows = 6;
var Particles = (function () {
    /**
     * @param nparticles initial particle count
     * @param [size=5] particle size in pixels
     */
    function Particles(canvas, size) {
        if (size === void 0) { size = 8; }
        this.canvas = canvas;
        this.size = size;
        this.running = false;
        this.raf = 0;
        this.backgroundColor = null;
        var igloo = this.igloo = new igloo_ts_1.default(this.canvas);
        var vertexShaderText = vertexShader;
        var pixelShaderText = pixelShader;
        this.program = this.igloo.program(vertexShaderText, pixelShaderText);
        var gl = igloo.gl;
        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_texture_float');
        var w = canvas.width;
        var h = canvas.height;
        gl.disable(gl.DEPTH_TEST);
        this.worldsize = new Float32Array([w, h]);
        this.textureData = new texture_data_1.default(2, edgeRows);
        /* Drawing parameters. */
        this.color = "blue";
        console.log("Initialized Particle system");
    }
    Object.defineProperty(Particles.prototype, "isRunning", {
        get: function () {
            return this.running;
        },
        enumerable: true,
        configurable: true
    });
    /** If the vertices have changed then update the buffers   */
    Particles.prototype.updateBuffers = function (edges, width, height) {
        try {
            var gl = this.igloo.gl;
            var particleCount = edges.reduce(function (p, c) { return (c.ratePerSecond || 0) + p; }, 0);
            var edgeCount = edges.length;
            this.worldsize = new Float32Array([width, height]);
            // const scale = { x: width, y: height };
            var convertBezierPoints = function (edgePoint, defaultPoint) {
                return edgePoint ? { x: edgePoint.x, y: edgePoint.y } : { x: defaultPoint.x, y: defaultPoint.y };
            };
            // if the total particle count has changed then we need to change the associations
            // between the particle and the vertex data (edge) 
            if (particleCount != this.count) {
                console.log("Updating Edge Data: " + particleCount);
                this.count = particleCount;
                var i = 0;
                var edgeIndexArray = new Float32Array(particleCount);
                var timeOffsetArray = new Float32Array(particleCount);
                var edgeIndex_1 = 0;
                for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
                    var edge = edges_1[_i];
                    if (!edge.ratePerSecond) {
                        edgeIndex_1++;
                        continue;
                    }
                    for (var n = 0; n < edge.ratePerSecond; n++) {
                        timeOffsetArray[i] = edge.nonrandom ? (n / edge.ratePerSecond) : Math.random();
                        edgeIndexArray[i] = edgeIndex_1;
                        i++;
                    }
                    edgeIndex_1++;
                }
                this.program.use();
                // update time
                var timeBuffer = this.igloo.array(timeOffsetArray, gl.STATIC_DRAW);
                timeBuffer.update(timeOffsetArray, gl.STATIC_DRAW);
                this.program.attrib('time', timeBuffer, 1);
                // update edge Index
                var edgeIndexBuffer = this.igloo.array(edgeIndexArray, gl.STATIC_DRAW);
                edgeIndexBuffer.update(edgeIndexArray, gl.STATIC_DRAW);
                this.program.attrib('edgeIndex', edgeIndexBuffer, 1);
            }
            if (this.textureData.length != edgeCount) {
                this.textureData = new texture_data_1.default(edgeRows, edgeCount);
                console.log("Allocated Texture " + this.textureData.lengthPower2 + " x " + this.textureData.rowsPower2);
            }
            var edgeIndex = 0;
            // update the texture Data, each row is a different attribute of the edge
            for (var _a = 0, edges_2 = edges; _a < edges_2.length; _a++) {
                var edge = edges_2[_a];
                var variationMin = (edge.particleStyle.variationMin === undefined) ? -0.01 : edge.particleStyle.variationMin;
                var variationMax = (edge.particleStyle.variationMax === undefined) ? 0.01 : edge.particleStyle.variationMax;
                // set-up vertices in edgedata
                this.textureData.setVec2(VERTEX_ROW, edgeIndex, convertBezierPoints(edge.p0, edge.p0), convertBezierPoints(edge.p3, edge.p3));
                // random variation of the particles
                this.textureData.setValue(VARIATION_ROW, edgeIndex, variationMin, variationMax, variationMax - variationMin, Math.random());
                // set-up color in edge Data
                this.textureData.setColor(COLOR_ROW, edgeIndex, edge.particleStyle.color || this.color);
                this.textureData.setColor(END_COLOR_ROW, edgeIndex, edge.particleStyle.endingColor || edge.particleStyle.color || this.color);
                // set-up shape
                this.textureData.setValue(SHAPE_ROW, edgeIndex, (edge.particleStyle.size || this.size || 8.0) / 256, edge.particleStyle.roundness || 0.0, 0.0, 0.0);
                // bezier
                this.textureData.setVec2(BEZIER_ROW, edgeIndex, convertBezierPoints(edge.p1, edge.p1), convertBezierPoints(edge.p2, edge.p2));
                edgeIndex++;
            }
            this.program.use();
            this.program.uniform('edgeCount', this.textureData.lengthPower2);
            this.program.uniform('variationRow', (VARIATION_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('colorRow', (COLOR_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('vertexRow', (VERTEX_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('endColorRow', (END_COLOR_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('shapeRow', (SHAPE_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('bezierRow', (BEZIER_ROW + 0.5) / this.textureData.rowsPower2);
            this.textureData.bindTexture(this.igloo.gl, gl.TEXTURE0);
            this.program.uniform('edgeData', 0, true);
        }
        catch (e) {
            console.error("UpdateBuffers", e);
        }
    };
    ;
    /** Draw the current simulation state to the display. */
    Particles.prototype.draw = function () {
        var igloo = this.igloo;
        var gl = igloo.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        igloo.defaultFramebuffer.bind();
        gl.viewport(0, 0, this.worldsize[0], this.worldsize[1]);
        gl.clearColor(this.backgroundColor ? this.backgroundColor.r / 256 : 0, this.backgroundColor ? this.backgroundColor.g / 256 : 0, this.backgroundColor ? this.backgroundColor.b / 256 : 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.program.use();
        this.program.uniform('second', ((new Date().valueOf() % 2000) / 2000.0));
        this.program.uniform('worldsize', this.worldsize);
        // this.drawProgram.uniform('size', this.size);
        this.program.uniform('edgeData', 0, true);
        var background = Color(this.color).array();
        this.program.uniform('color', [background[0] / 255, background[1] / 255, background[2] / 255, 1.0]);
        if (this.count > 0)
            this.program.draw(gl.POINTS, this.count);
        return this;
    };
    ;
    /** Register with requestAnimationFrame to step and draw a frame.*/
    Particles.prototype.frame = function () {
        var _this = this;
        this.raf = window.requestAnimationFrame(function () {
            if (_this.running) {
                _this.draw();
                _this.frame();
            }
            else {
                console.log("Stopped");
            }
        });
    };
    ;
    /** Start animating the simulation if it isn't already.*/
    Particles.prototype.start = function () {
        if (!this.running) {
            this.running = true;
            this.frame();
        }
    };
    ;
    /** Immediately stop the animation. */
    Particles.prototype.stop = function () {
        this.running = false;
        if (this.raf)
            window.cancelAnimationFrame(this.raf);
    };
    return Particles;
}());
exports.default = Particles;
//# sourceMappingURL=particles.js.map