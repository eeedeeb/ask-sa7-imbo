import * as Three from "three";
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl'
import {Mesh, MeshBasicMaterial, Vector4} from "three";
import {Controller} from "./Controller";
import {Constant} from "./Constant";
import {Maths} from "./Math";


class KalmanFilter {
    constructor(R, Q, A, B, C) {
        this.R = R;
        this.Q = Q;
        this.A = A;
        this.B = B;
        this.C = C;
        this.cov = NaN;
        this.x = NaN;
    }

    filter(z, u) {
        if (isNaN(this.x)) {
            this.x = (1 / this.C) * z;
            this.cov = (1 / this.C) * this.R * (1 / this.C);
        } else {
            const predX = (this.A * this.x) + (this.B * u);
            const predCov = ((this.A * this.cov) * this.A) + this.Q;
            const K = predCov * this.C * (1 / ((this.C * predCov * this.C) + this.R));
            this.x = predX + K * (z - (this.C * predX));
            this.cov = predCov - (K * this.C * predCov);
        }

        return this.x;
    }
}

export class SeaModel {
    color = {
        surface: '#a8d1ee',
        depth: '#4a7b98',
    }
    geometry = new Three.PlaneBufferGeometry(40, 40, 1000, 1000);
    geoUnder = new Three.PlaneBufferGeometry(40, 40);
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
            uColorMultiply: {value: 0.5},
            points1: {value: new Vector4(0, 0, 0, 0)},
            points2: {value: new Vector4(0, 0, 0, 0)}
        }
    })
    matUnder = new MeshBasicMaterial({color: 0x186691})
    mesh = new Three.Mesh(this.geometry, this.material);
    under = new Mesh(this.geoUnder, this.matUnder);
    init(scene) {
        scene.add(this.mesh);
        // scene.add(this.under);
        this.under.translateZ(-0.2);
    }

    kfX = new KalmanFilter(1, 0.01, 1, 0, 1);
    kfY = new KalmanFilter(1, 0.01, 1, 0, 1);

    angleToCartesian(angle) {
        return {
            x: Math.cos(angle * Math.PI / 180),
            y: Math.sin(angle * Math.PI / 180),
        };
    }

    cartesianToAngle(x, y) {
        return Math.atan2(y, x) * 180 / Math.PI;
    }
    getSmoothAngle(state) {
        const { x, y } = this.angleToCartesian(state.linearVelocity.angle);
        const filteredX = this.kfX.filter(x, 0);
        const filteredY = this.kfY.filter(y, 0);
        return this.cartesianToAngle(filteredX, filteredY);
    }

    calculateIntersection(a, b, theta) {
        const thetaRad = theta * Math.PI / 180;

        const cosTheta = Math.cos(thetaRad);
        const sinTheta = Math.sin(thetaRad);
        const xIntersection = Math.sqrt(1 / ((cosTheta ** 2 / a ** 2) + (sinTheta ** 2 / b ** 2)));

        const yIntersection = Math.sqrt(1 / ((sinTheta ** 2 / a ** 2) + (cosTheta ** 2 / b ** 2)));

        return {
            xPositive: xIntersection,
            xNegative: -xIntersection,
            yPositive: yIntersection,
            yNegative: -yIntersection
        };
    }

    run(model, state) {
        const clk = Controller.clock.getElapsedTime();
        this.material.uniforms.uTime.value = clk;
        this.material.uniforms.uWaveElevation.value = Controller.attributes.waves;
        const x = model.x;
        const y = model.y;
        this.moveTo(x, y);
        this.mesh.rotation.z = Maths.toRad(model.zAngle);
        const length = Constant.boatLength / 4 ;
        const width = Constant.boatWidth / 4 ;
        const Intersection = this.calculateIntersection(length, width, model.zAngle);
        const y1 = +y + Intersection.yPositive;
        const x1 = +x;
        const y2 = +y + Intersection.yNegative;
        const x2 = +x;
        const y3 = +y;
        const x3 = +x + Intersection.xPositive;
        const y4 = +y ;
        const x4 = +x + Intersection.xNegative;
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

        this.makeWaves(Intersection, state, x, y);
    }

    makeWaves(Intersection, state, x, y){
        const vec41 = new Vector4();
        const vec42 = new Vector4();
        const angle = this.getSmoothAngle(state);
        vec41.x = x + (Intersection.xPositive) * Maths.cos(angle);
        vec41.y = y + (Intersection.yPositive) * Maths.sin(angle);
        vec41.z = vec41.x +  state.linearVelocity.intensity * Maths.cos(angle + 150);
        vec41.w = vec41.y +  state.linearVelocity.intensity * Maths.sin(angle + 150);

        vec42.x = vec41.x;
        vec42.y = vec41.y;
        vec42.z = vec42.x +  state.linearVelocity.intensity * Maths.cos(angle - 150);
        vec42.w = vec42.y +  state.linearVelocity.intensity * Maths.sin(angle - 150);
        this.material.uniforms.points1.value = vec41;
        this.material.uniforms.points2.value = vec42;
    }

    calcZ(x, y, clk) {
        const fY = this.material.uniforms.uFrequencyY.value;
        const fX = this.material.uniforms.uFrequencyX.value;
        const waveElevation = this.material.uniforms.uWaveElevation.value;

        function wave(pos, frequency, phase, amplitude) {
            let waveX = Math.sin(pos[0] * frequency + clk * 0.5 * phase) * amplitude;
            let waveY = Math.cos(pos[1] * frequency + clk * 0.5 * phase) * amplitude * 0.5;
            return [waveX, waveY];
        }

        const pos = [x, y];
        const wave1 = wave(pos, fX, 0.5, waveElevation);
        const wave2 = wave(pos, fY, 1.0, waveElevation * 0.5);
        const wave3 = wave(pos, fX * 2.0, 1.5, waveElevation * 0.25);
        const wave4 = wave(pos, fY * 0.5, 2.0, waveElevation * 0.75);

        let z = wave1[0] + wave2[0] + wave3[0] + wave4[0] + wave1[1] + wave2[1] + wave3[1] + wave4[1];

        if (z < 0) {
            z /= 2;
        }

        return z;
    }


    moveTo(x, y) {
        this.mesh.position.x = x ;
        this.mesh.position.y = y;
        this.under.position.x = x ;
        this.under.position.y = y;
    }
}