"use strict";
var igloo_ts_1 = require("igloo-ts");
var seedRandom = require("seedrandom");
var vertexShader = require("./shaders/vertex.glsl");
var pixelShader = require("./shaders/pixel.glsl");
var Color = require("color");
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
        this.texture = null;
        this.raf = 0;
        this.backgroundColor = null;
        var igloo = this.igloo = new igloo_ts_1.default(canvas);
        var vertexShaderText = vertexShader;
        var pixelShaderText = pixelShader;
        this.drawProgram = this.igloo.program(vertexShaderText, pixelShaderText);
        var gl = igloo.gl;
        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_texture_float');
        var w = canvas.width;
        var h = canvas.height;
        gl.disable(gl.DEPTH_TEST);
        this.worldsize = new Float32Array([w, h]);
        this.edgeTexData = new Float32Array([0, 0]);
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
    Particles.prototype.textureFromFloats = function (gl, width, height, float32Array) {
        var oldActive = gl.getParameter(gl.ACTIVE_TEXTURE);
        if (this.texture)
            gl.deleteTexture(this.texture);
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, float32Array);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE0); // working register 31, thanks.
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        // gl.activeTexture(oldActive);
        return this.texture;
    };
    /** Set a new particle count.   */
    Particles.prototype.updateBuffers = function (flows, width, height) {
        try {
            var gl = this.igloo.gl;
            var pointCount = flows.reduce(function (p, c) { return c.ratePerSecond + p; }, 0);
            var edgeCount = flows.length;
            if (pointCount != this.count) {
                console.log("Updating Time: " + pointCount);
                this.count = pointCount;
                var i = 0;
                var edgeIndexArray = new Float32Array(pointCount);
                var timeOffsetArray = new Float32Array(pointCount);
                var edgeIndex_1 = 0;
                for (var _i = 0, flows_1 = flows; _i < flows_1.length; _i++) {
                    var flow = flows_1[_i];
                    for (var n = 0; n < flow.ratePerSecond; n++) {
                        timeOffsetArray[i] = Math.random();
                        edgeIndexArray[i] = edgeIndex_1;
                        i++;
                    }
                    edgeIndex_1++;
                }
                this.drawProgram.use();
                // update time
                var timeBuffer = this.igloo.array(timeOffsetArray, gl.STATIC_DRAW);
                timeBuffer.update(timeOffsetArray, gl.STATIC_DRAW);
                this.drawProgram.attrib('time', timeBuffer, 1);
                // update edge Index
                var edgeIndexBuffer = this.igloo.array(edgeIndexArray, gl.STATIC_DRAW);
                edgeIndexBuffer.update(edgeIndexArray, gl.STATIC_DRAW);
                this.drawProgram.attrib('edgeIndex', edgeIndexBuffer, 1);
            }
            this.worldsize = new Float32Array([width, height]);
            var w = this.worldsize[0];
            var h = this.worldsize[1];
            var edgeCountPower = Math.pow(2, Math.ceil(Math.log2(edgeCount)));
            // edge buffer
            // edge buffer usage:
            var colorRow = 0;
            var vertexRow = 1;
            var variationRow = 2;
            var shapeRow = 3;
            // row #0 - colors
            // row #1 - fromx,fromy,tox,toy
            var edgeRows = 4;
            var edgeRowsPower = Math.pow(2, Math.ceil(Math.log2(edgeRows)));
            if (this.edgeTexData.length != edgeCountPower * 4 * edgeRowsPower) {
                this.edgeTexData = new Float32Array(edgeCountPower * 4 * edgeRowsPower);
            }
            // console.log(`Texture ${edgeCountPower} ${edgeRowsPower}`)
            var nodeVariation = 0.005;
            var edgeIndex = 0;
            for (var _a = 0, flows_2 = flows; _a < flows_2.length; _a++) {
                var flow = flows_2[_a];
                // set-up vertices in edgedata
                this.edgeTexData[edgeIndex * 4 + vertexRow * edgeCountPower * 4] = flow.fromX;
                this.edgeTexData[edgeIndex * 4 + 1 + vertexRow * edgeCountPower * 4] = flow.fromY;
                this.edgeTexData[edgeIndex * 4 + 2 + vertexRow * edgeCountPower * 4] = flow.toX;
                this.edgeTexData[edgeIndex * 4 + 3 + vertexRow * edgeCountPower * 4] = flow.toY;
                this.edgeTexData[edgeIndex * 4 + variationRow * edgeCountPower * 4] = flow.variationMin || -0.01;
                this.edgeTexData[edgeIndex * 4 + 1 + variationRow * edgeCountPower * 4] = flow.variationMax || 0.01;
                this.edgeTexData[edgeIndex * 4 + 2 + variationRow * edgeCountPower * 4] = (flow.variationMax || 0.01) - (flow.variationMin || -0.01);
                this.edgeTexData[edgeIndex * 4 + 3 + variationRow * edgeCountPower * 4] = Math.random();
                // set-up color in edge Data
                var edgeColor = Color(flow.color || this.color).array();
                this.edgeTexData[edgeIndex * 4 + colorRow * edgeCountPower * 4] = edgeColor[0] / 256;
                this.edgeTexData[edgeIndex * 4 + 1 + colorRow * edgeCountPower * 4] = edgeColor[1] / 256;
                this.edgeTexData[edgeIndex * 4 + 2 + colorRow * edgeCountPower * 4] = edgeColor[2] / 256;
                this.edgeTexData[edgeIndex * 4 + 3 + colorRow * edgeCountPower * 4] = 1.0;
                // set-up shape
                this.edgeTexData[edgeIndex * 4 + shapeRow * edgeCountPower * 4] = (flow.size || this.size || 8.0) / 256;
                this.edgeTexData[edgeIndex * 4 + 1 + shapeRow * edgeCountPower * 4] = flow.shape || 1.0;
                this.edgeTexData[edgeIndex * 4 + 2 + shapeRow * edgeCountPower * 4] = 0;
                this.edgeTexData[edgeIndex * 4 + 3 + shapeRow * edgeCountPower * 4] = 0;
                edgeIndex++;
            }
            this.drawProgram.use();
            this.drawProgram.uniform('edgeCount', edgeCountPower);
            var edgeTexture = this.textureFromFloats(this.igloo.gl, edgeCountPower, edgeRowsPower, this.edgeTexData);
            this.drawProgram.uniform('edgeData', 0, true);
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
        this.drawProgram.use();
        this.drawProgram.uniform('second', ((new Date().valueOf() % 2000) / 2000.0));
        this.drawProgram.uniform('worldsize', this.worldsize);
        // this.drawProgram.uniform('size', this.size);
        this.drawProgram.uniform('edgeData', 0, true);
        var background = Color(this.color).array();
        this.drawProgram.uniform('color', [background[0] / 255, background[1] / 255, background[2] / 255, 1.0]);
        this.drawProgram.draw(gl.POINTS, this.count);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Particles;
//# sourceMappingURL=particles.js.map