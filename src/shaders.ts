export function pixelShader(edgeCount:number) : string {
    return `
        precision mediump float;
        uniform vec4 color;
        const float DELTA = 0.4;
        varying vec4 mycol;
        varying vec2 velocity;

        void main() {
            // p if the drawn pixel with a range of -1,-1 to +1,+1
            vec2 p =  (gl_PointCoord - 0.5)*2.0 ;
            // vec2 v = vec2(1.0,1.0)-velocity;
            // velocity is the vector of the particle
            // length of the pixel determines color (higher more transparent)
            // if velocity is (0.5,0.5) then shorten the pixel distance by 0.5 to make it lighter (1.0,1.0) should be 0.5,0.5,-1.0,1.0
            // if velocity is stationary then leave pixel as is
            // if velocity is (-0.5,0.5) then
            // vec2 p2 = min(p,velocity*10.0);
            // float a = smoothstep(1.0 - DELTA, 1.0, length(p));
            // float a2 = smoothstep(1.0 - 0.2, 1.0, length(p2));
            // vec4 bc = mix(mycol*0.3,vec4(0.0),a2);
            gl_FragColor =   mix(mycol, vec4(0.0), length(p));
//            gl_FragColor = mycol; 
        }`;
}

export function vertexShader(edgeCount:number): string {
    return `
        precision mediump float;
        attribute float time;
        attribute float edgeIndex;  
        uniform sampler2D edgeData;
        uniform vec2 worldsize;
        uniform float size;
        uniform float second;
        uniform float edgeCount;
        varying vec4 mycol;
        varying vec2 velocity;
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
            float seed = variations.w;
            float rnd = random(vec2(time,0));
            vec2 from = pts.xy + nodeVariation * rnd; 
            vec2 to = pts.zw + nodeVariation * rnd;
            vec2 middle = vec2(rnd * variations.z + variations.x,rnd * variations.z + variations.x);

            // position is linear between source and target
            vec2 p1 = mix(from,to,timefrac);
            // add some variation with a mixed in mid point 0t=0 0.25t=0.25(0.15) 0.5t=0.5(0.15) 1t=0
            vec2 p = mix(p1,middle+(to+from)/2.0,clamp(0.5-abs(timefrac-0.5),0.0,0.15));
            velocity = (to-from);
            gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
            gl_PointSize = size*4.0;
            mycol = texture2D(edgeData,vec2(edgeIndex/edgeCount,0.5/4.0));
        }
        `;
}