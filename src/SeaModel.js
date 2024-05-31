import * as Three from "three";
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl'
import {Clock} from "three";
import {Controller} from "./Controller";
import {Constant} from "./Constant";
import {Maths} from "./Math";

export class SeaModel {
    clock = new Clock();
    color = {
        surface: '#9bd8ff',
        depth: '#186691',
    }
    geometry = new Three.PlaneBufferGeometry(20, 20, 800, 800);
    material = new Three.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: Three.DoubleSide,
        transparent: true,
        uniforms: {
            uTime: {value: 0},
            uWaveElevation: {value: 1},
            uFrequencyY: {value: 0.3},
            uFrequencyX: {value: 0.1},
            uSurfaceColor: {value: new Three.Color(this.color.surface)},
            uDepthColor: {value: new Three.Color(this.color.depth)},
            uColorOffset: {value: 1},
            uColorMultiply: {value: 0.4},
        }
    })
    mesh = new Three.Mesh(this.geometry, this.material);

    init(scene) {
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);
    }

    run(model) {
        const clk = this.clock.getElapsedTime();
        this.material.uniforms.uTime.value = clk;
        this.material.uniforms.uWaveElevation.value = Controller.attributes.waves;
        const x = model.x;
        const y = model.y;
        this.moveTo(x, y);
        const length = Constant.boatLength / 4 - 0.5;
        const width = Constant.boatWidth / 4 - 0.5;

        const y1 = +y + width * Maths.sin(90);
        const x1 = +x + length * Maths.cos(90);
        const y2 = +y + width * Maths.sin(-90);
        const x2 = +x + length * Maths.cos(-90);

        const y3 = +y + width * Maths.sin(0);
        const x3 = +x + length * Maths.cos(0);
        const y4 = +y + width * Maths.sin(180);
        const x4 = +x + length * Maths.cos(180);

        const z = this.calcZ(x, y, clk);
        const z1 = this.calcZ(x1, y1, clk);
        const z2 = this.calcZ(x2, y2, clk);
        const z3 = this.calcZ(x3, y3, clk);
        const z4 = this.calcZ(x4, y4, clk);
        const xAngle = Maths.toDeg(Math.asin(Math.abs(z1 - z2) / Math.sqrt((z1 - z2) * (z1 - z2) + width * width)));
        if (z1 > z2) {
            model.xAngle = +xAngle;
        } else {
            model.xAngle = -xAngle;
        }
        let yAngle = Maths.toDeg(Math.asin(Math.abs(z4 - z3) / Math.sqrt((z4 - z3) * (z4 - z3) + length * length)));
        if (z3 < z4) {
            model.yAngle = yAngle;
        } else {
            model.yAngle = -yAngle;
        }

        model.z = z;
    }

    calcZ(x, y, clk) {
        const fY = this.material.uniforms.uFrequencyY.value;
        const fX = this.material.uniforms.uFrequencyX.value;
        let z = (
                Math.sin(y * fY / 2 - x * fX + clk)
                + Math.sin(y * fY + x * fX * 2 + clk)
                + Math.cos(x * fX / 2 + clk)
            )
            * this.material.uniforms.uWaveElevation.value
            - 0.07;
        if (z < 0) {
            z = z / 2;
        }
        return z;
    }

    moveTo(x, y) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
    }
}