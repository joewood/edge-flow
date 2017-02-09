precision mediump float;
uniform vec4 color;
const float DELTA = 0.4;
varying vec4 particleColor;
varying float size;
varying float shape;

void main() {
    // p if the drawn pixel with a range of -1,-1 to +1,+1
    vec2 p =  (gl_PointCoord - 0.5)*2.0 ;
    // length of the pixel determines color (higher more transparent)
    // vec2 p2 = min(p,velocity*10.0);
    // float a = smoothstep(1.0 - DELTA, 1.0, length(p));
    // float a2 = smoothstep(1.0 - 0.2, 1.0, length(p2));
    // vec4 bc = mix(particleColor*0.3,vec4(0.0),a2);
    float roundness = mix(max(abs(p.x),abs(p.y)),length(p),shape);
    gl_FragColor =   mix(particleColor, vec4(0.0), roundness);
}
