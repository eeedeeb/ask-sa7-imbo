import * as Three from "three";
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl'
import {GUI} from "dat.gui";
import {Clock} from "three";

export class SeaModel {
     clock = new Clock();
     color = {
         surface: '#9bd8ff',
         depth: '#186691',
     }
     cube = new Three.BoxGeometry(0.4, 0.4, 0.4);
     cubeMat = new Three.MeshBasicMaterial();
     cubeMesh = new Three.Mesh(this.cube, this.cubeMat);
     geometry = new Three.PlaneBufferGeometry(100, 100, 800, 800);
     material = new Three.ShaderMaterial({
         vertexShader: vertexShader,
         fragmentShader: fragmentShader,
         side: Three.DoubleSide,
         transparent: true,
         uniforms: {
             uTime: {value:0},
             uWaveElevation: {value : 1},
             uFrequencyY: {value : 0.3},
             uFrequencyX: {value : 0.1},
             uSurfaceColor: {value: new Three.Color(this.color.surface)},
             uDepthColor: {value: new Three.Color(this.color.depth)},
             uColorOffset: {value: 1},
             uColorMultiply: {value: 0.5},
         }
    })
    mesh = new Three.Mesh(this.geometry, this.material);
    init(scene){

        // const gui = new GUI();
        // gui.add(this.material.uniforms.uWaveElevation, 'value').min(0).max(10).step(0.1).name('wive elevation');
        // gui.add(this.material.uniforms.uFrequencyY, 'value').min(0).max(10).step(0.01).name('X elevation');
        // gui.add(this.material.uniforms.uFrequencyX, 'value').min(0).max(10).step(0.01).name('Y elevation');
        // gui.add(this.material.uniforms.uColorOffset, 'value').min(-10).max(10).step(0.01).name('color offset');
        // gui.add(this.material.uniforms.uColorMultiply, 'value').min(-10).max(10).step(0.01).name('color multiply');
        // gui.addColor(this.color, 'surface').onChange(()=>{
        //    this.material.uniforms.uSurfaceColor.value.set(this.color.surface);
        // });
        // gui.addColor(this.color, 'depth').onChange(()=>{
        //     this.material.uniforms.uDepthColor.value.set(this.color.depth);
        // });
        // this.cubeMesh.castShadow = true;
        // this.mesh.castShadow = true;
        // this.mesh.receiveShadow = true;
        // this.cubeMesh.receiveShadow = true;
        scene.add(this.mesh);
        scene.add(this.cubeMesh);
    }
    run(){
        this.material.uniforms.uTime.value = this.clock.getElapsedTime();
        const x = this.geometry.attributes.position.array[1200000];
        const y = this.geometry.attributes.position.array[1200001];
        this.cubeMesh.position.x = x;
        this.cubeMesh.position.y = y;
        this.cubeMesh.position.z =
            Math.sin(x * this.material.uniforms.uFrequencyX.value + this.clock.getElapsedTime())
            * Math.sin(y * this.material.uniforms.uFrequencyY.value + this.clock.getElapsedTime())
            * this.material.uniforms.uWaveElevation.value
            -0.07;
    }
}