precision mediump float;
attribute float time;
attribute float edgeIndex;  
uniform sampler2D edgeData;
uniform vec2 worldsize;
uniform float second;
uniform float edgeCount;
varying vec4 particleColor;
varying float shape;
const float nodeVariation = 0.005; 

uniform float colorRow;
uniform float shapeRow;
uniform float bezierRow;
uniform float vertexRow;
uniform float endColorRow;
uniform float variationRow;

float random(vec2 co)
{
    return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 toBezier(float delta, int i, vec2 P0, vec2 P1, vec2 P2, vec2 P3)
{
    float t = delta * float(i);
    float t2 = t * t;
    float one_minus_t = 1.0 - t;
    float one_minus_t2 = one_minus_t * one_minus_t;
    return (P0 * one_minus_t2 * one_minus_t + P1 * 3.0 * t * one_minus_t2 + P2 * 3.0 * t2 * one_minus_t + P3 * t2 * t);
}

void main() {
    float timefrac = mod(second+time,1.0);
    // vector coordinates in second row
    vec4 pts = texture2D(edgeData,vec2(edgeIndex/edgeCount,vertexRow));
    // vector variations (randomness) in third row (min,max,mid,seed)
    vec4 variations = texture2D(edgeData,vec2(edgeIndex/edgeCount,variationRow));
    // vector roundness in fourth row (size,shape,unused,unused)
    vec4 shapes = texture2D(edgeData,vec2(edgeIndex/edgeCount,shapeRow));
    vec4 bezier = texture2D(edgeData,vec2(edgeIndex/edgeCount,bezierRow));
    float size = shapes.x;
    shape = shapes.y;
    float seed = variations.w;
    float rnd = random(vec2(time,0));
    vec2 from = pts.xy;
    vec2 to = pts.zw;
    if (variations.z!=0.0) {
        pts.xy += (nodeVariation * rnd-nodeVariation/2.0); 
        to += (nodeVariation * rnd-nodeVariation/2.0);
    }
    vec2 middle = vec2(rnd * variations.z + variations.x,rnd * variations.z + variations.x);

    // position is linear between source and target
    // vec2 p1 = mix(from,to,timefrac);
    vec2 p1 = toBezier(timefrac, 1, from, bezier.xy, bezier.zw, to);

    // add some variation with a mixed in mid point 0t=0 0.25t=0.25(0.15) 0.5t=0.5(0.15) 1t=0
    vec2 p = mix(p1,middle+(to+from)/2.0,clamp(0.5-abs(timefrac-0.5),0.0,0.15));
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
    gl_PointSize = size*256.0;
    vec4 color = texture2D(edgeData,vec2(edgeIndex/edgeCount,colorRow));
    vec4 endColor = texture2D(edgeData,vec2(edgeIndex/edgeCount,endColorRow));
    particleColor = mix(color,endColor,timefrac);
}