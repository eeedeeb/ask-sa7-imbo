uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultiply;
varying float vElevation;
varying float vElevation1;
void main(){
    vec3 color = mix(uSurfaceColor, uDepthColor, -vElevation * uColorMultiply + uColorOffset + vElevation1*2.0);
    gl_FragColor = vec4(color , 0.8);
}
