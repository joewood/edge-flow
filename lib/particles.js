"use strict";
var igloo_ts_1 = require("igloo-ts");
var seedRandom = require("seedrandom");
var shaders_1 = require("./shaders");
var Color = require("color");
var Particles = (function () {
    /**
     * @param nparticles initial particle count
     * @param [size=5] particle size in pixels
     */
    function Particles(canvas, size) {
        if (size === void 0) { size = 5; }
        this.size = size;
        this.running = false;
        this.backgroundColor = null;
        var igloo = this.igloo = new igloo_ts_1.default(canvas);
        var vertexShaderText = shaders_1.vertexShader(0);
        var pixelShaderText = shaders_1.pixelShader(0);
        this.drawProgram = this.igloo.program(vertexShaderText, pixelShaderText);
        var gl = igloo.gl;
        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_texture_float');
        var w = canvas.width;
        var h = canvas.height;
        gl.disable(gl.DEPTH_TEST);
        this.worldsize = new Float32Array([w, h]);
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
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, float32Array);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE0); // working register 31, thanks.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // gl.activeTexture(oldActive);
        return texture;
    };
    /** Set a new particle count.   */
    Particles.prototype.updateBuffers = function (flows) {
        try {
            var gl = this.igloo.gl;
            var pointCount = flows.reduce(function (p, c) { return c.ratePerSecond + p; }, 0);
            var edgeCount = flows.length;
            // seed random for consistency
            // const random = seedRandom("FlowNetwork");
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
            var w = this.worldsize[0];
            var h = this.worldsize[1];
            var edgeCountPower = Math.pow(2, Math.floor(Math.log2(edgeCount) + 1));
            // edge buffer
            // edge buffer usage:
            var colorRow = 0;
            var vertexRow = 1;
            var variationRow = 2;
            // row #0 - colors
            // row #1 - fromx,fromy,tox,toy
            var edgeRows = 3;
            var edgeRowsPower = Math.pow(2, Math.floor(Math.log2(edgeRows) + 1));
            var edgeTexData = new Float32Array(edgeCountPower * 4 * edgeRowsPower);
            // console.log(`Texture ${edgeCountPower} ${edgeRowsPower}`)
            var nodeVariation = 0.005;
            var edgeIndex = 0;
            for (var _a = 0, flows_2 = flows; _a < flows_2.length; _a++) {
                var flow = flows_2[_a];
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
                var edgeColor = Color(flow.color || this.color).array();
                // console.log("Color: " + flow.color,edgeColor);
                edgeTexData[edgeIndex * 4 + colorRow * edgeCountPower * 4] = edgeColor[0] / 256;
                edgeTexData[edgeIndex * 4 + 1 + colorRow * edgeCountPower * 4] = edgeColor[1] / 256;
                edgeTexData[edgeIndex * 4 + 2 + colorRow * edgeCountPower * 4] = edgeColor[2] / 256;
                edgeTexData[edgeIndex * 4 + 3 + colorRow * edgeCountPower * 4] = 1.0;
                edgeIndex++;
            }
            this.drawProgram.use();
            this.drawProgram.uniform('edgeCount', edgeCountPower);
            var edgeTexture = this.textureFromFloats(this.igloo.gl, edgeCountPower, edgeRowsPower, edgeTexData);
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
        this.drawProgram.uniform('second', ((new Date().valueOf() % 3000) / 3000.0));
        this.drawProgram.uniform('worldsize', this.worldsize);
        this.drawProgram.uniform('size', this.size);
        this.drawProgram.uniform('edgeData', 0, true);
        var background = Color(this.color).array();
        this.drawProgram.uniform('color', [background[0] / 255, background[1] / 255, background[2] / 255, 1.0]); // Color(this.color).array();
        this.drawProgram.draw(gl.POINTS, this.count);
        return this;
    };
    ;
    /** Register with requestAnimationFrame to step and draw a frame.*/
    Particles.prototype.frame = function () {
        var _this = this;
        window.requestAnimationFrame(function () {
            if (_this.running) {
                _this.draw().frame();
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
    };
    return Particles;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Particles;
//# sourceMappingURL=particles.js.map