uniform float uWaveElevation;
uniform float uFrequencyY;
uniform float uFrequencyX;
uniform float uTime;

varying float vElevation;

void main(){
    vec4 modelVec =  modelMatrix * vec4(position, 1.0);

    float x = 1.0 - uWaveElevation;
    float elevation = (
                       sin((modelVec.y * uFrequencyY/2.0  - modelVec.x * uFrequencyX + uTime) * x)
                     + sin((modelVec.y * uFrequencyY + modelVec.x * uFrequencyX*2.0 + uTime) *)
                     + cos((modelVec.x * uFrequencyX/2.0 + uTime) *)
                     )
                    * uWaveElevation;
    if(elevation < 0.0) elevation /= 2.0;
    modelVec.z += elevation;

    gl_Position = projectionMatrix * viewMatrix * modelVec;

    vElevation = elevation;
}
