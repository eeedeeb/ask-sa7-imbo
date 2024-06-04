uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultiply;
varying float vElevation;
void main(){
    vec3 color = mix(uSurfaceColor, uDepthColor, -vElevation * uColorMultiply + uColorOffset);
    gl_FragColor = vec4(color , 0.3);
}
