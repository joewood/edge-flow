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

float random(vec2 co)
{
    return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    float timefrac = mod(second+time,1.0);
    // vector coordinates in second row
    vec4 pts = texture2D(edgeData,vec2(edgeIndex/edgeCount,1.5/4.0));
    // vector variations (randomness) in third row (min,max,mid,seed)
    vec4 variations = texture2D(edgeData,vec2(edgeIndex/edgeCount,2.5/4.0));
    // vector roundness in fourth row (size,shape,unused,unused)
    vec4 shapes = texture2D(edgeData,vec2(edgeIndex/edgeCount,3.5/4.0));
    float size = shapes.x;
    shape = shapes.y;
    float seed = variations.w;
    float rnd = random(vec2(time,0));
    vec2 from = pts.xy + nodeVariation * rnd; 
    vec2 to = pts.zw + nodeVariation * rnd;
    vec2 middle = vec2(rnd * variations.z + variations.x,rnd * variations.z + variations.x);

    // position is linear between source and target
    vec2 p1 = mix(from,to,timefrac);
    // add some variation with a mixed in mid point 0t=0 0.25t=0.25(0.15) 0.5t=0.5(0.15) 1t=0
    vec2 p = mix(p1,middle+(to+from)/2.0,clamp(0.5-abs(timefrac-0.5),0.0,0.15));
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
    gl_PointSize = size*256.0;
    particleColor = texture2D(edgeData,vec2(edgeIndex/edgeCount,0.5/4.0));
}