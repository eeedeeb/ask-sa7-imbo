import * as Three from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { Mesh, MeshBasicMaterial, Vector4 } from "three";
import { Controller } from "./Controller";
import { Constant } from "./Constant";
import { Maths } from "./Math";

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
			const predX = this.A * this.x + this.B * u;
			const predCov = this.A * this.cov * this.A + this.Q;
			const K = predCov * this.C * (1 / (this.C * predCov * this.C + this.R));
			this.x = predX + K * (z - this.C * predX);
			this.cov = predCov - K * this.C * predCov;
		}

		return this.x;
	}
}

export class SeaModel {
	static color = {
		surface: "#a8d1ee",
		depth: "#4a7b98",
	};
	static geometry = new Three.PlaneBufferGeometry(40, 40, 1000, 1000);
	geoUnder = new Three.PlaneBufferGeometry(40, 40);
	static material = new Three.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		side: Three.DoubleSide,
		transparent: true,
		uniforms: {
			uTime: { value: 0 },
			uWaveElevation: { value: 1 },
			uFrequencyX: { value: 0.3 },
			uFrequencyZ: { value: 0.1 },
			uSurfaceColor: { value: new Three.Color(SeaModel.color.surface) },
			uDepthColor: { value: new Three.Color(SeaModel.color.depth) },
			uColorOffset: { value: 1 },
			uColorMultiply: { value: 0.5 },
			points1: { value: new Vector4(0, 0, 0, 0) },
			points2: { value: new Vector4(0, 0, 0, 0) },
		},
	});
	matUnder = new MeshBasicMaterial({ color: 0x186691 });
	mesh = new Three.Mesh(SeaModel.geometry, SeaModel.material);
	under = new Mesh(this.geoUnder, this.matUnder);
	init(scene) {
		this.mesh.rotation.x = Math.PI / 2;
		scene.add(this.mesh);
		// scene.add(this.under);
		// this.under.translateZ(-0.2);
	}

	kfX = new KalmanFilter(1, 0.01, 1, 0, 1);
	kfY = new KalmanFilter(1, 0.01, 1, 0, 1);

	angleToCartesian(angle) {
		return {
			x: Math.cos((angle * Math.PI) / 180),
			y: Math.sin((angle * Math.PI) / 180),
		};
	}

	cartesianToAngle(x, y) {
		return (Math.atan2(y, x) * 180) / Math.PI;
	}
	getSmoothAngle(state) {
		const { x, y } = this.angleToCartesian(state.linearVelocity.angle);
		const filteredX = this.kfX.filter(x, 0);
		const filteredY = this.kfY.filter(y, 0);
		return this.cartesianToAngle(filteredX, filteredY);
	}

	calculateIntersection(a, b, theta) {
		const thetaRad = (theta * Math.PI) / 180;

		const cosTheta = Math.cos(thetaRad);
		const sinTheta = Math.sin(thetaRad);
		const xIntersection = Math.sqrt(
			1 / (cosTheta ** 2 / a ** 2 + sinTheta ** 2 / b ** 2)
		);

		const yIntersection = Math.sqrt(
			1 / (sinTheta ** 2 / a ** 2 + cosTheta ** 2 / b ** 2)
		);

		return {
			xPositive: xIntersection,
			xNegative: -xIntersection,
			yPositive: yIntersection,
			yNegative: -yIntersection,
		};
	}

	run(boatModel, state, coneModel) {
        console.log(coneModel);
		const clk = Controller.clock.getElapsedTime();
		SeaModel.material.uniforms.uTime.value = clk;
		SeaModel.material.uniforms.uWaveElevation.value =
			Controller.attributes.waves;
		const zB = boatModel.z;
		const xB = boatModel.x;

        

		for (let index = 0; index <coneModel.length; index++) {
			const zC = coneModel[index].z;
			const xC = coneModel[index].x;

			const IntersectionCone = this.calculateIntersection(1, 1, coneModel[index].yAngle);

			const xC1 = +xC + IntersectionCone.yPositive;
			const zC1 = +zC;
			const xC2 = +xC + IntersectionCone.yNegative;
			const zC2 = +zC;
			const xC3 = +xC;
			const zC3 = +zC + IntersectionCone.xPositive;
			const xC4 = +xC;
			const zC4 = +zC + IntersectionCone.xNegative;

			const yC = SeaModel.calcY(zC, xC, clk);
			const yC1 = SeaModel.calcY(zC1, xC1, clk);
			const yC2 = SeaModel.calcY(zC2, xC2, clk);
			const yC3 = SeaModel.calcY(zC3, xC3, clk);
			const yC4 = SeaModel.calcY(zC4, xC4, clk);
			const deltaYC12 = Math.abs(yC1 - yC2);
			const zCAngle = Maths.toDeg(
				Math.asin(
					deltaYC12 /
						Math.sqrt(
							deltaYC12 * deltaYC12 +
								IntersectionCone.yPositive * IntersectionCone.yPositive * 8
						)
				)
			);
			if (yC1 > yC2) {
				coneModel[index].zAngle = +zCAngle;
			} else {
				coneModel[index].zAngle = -zCAngle;
			}
			const deltaYC34 = Math.abs(yC3 - yC4);

			let xCAngle = Maths.toDeg(
				Math.asin(
					deltaYC34 /
						Math.sqrt(
							deltaYC34 * deltaYC34 +
								IntersectionCone.xPositive * IntersectionCone.xPositive * 8
						)
				)
			);
			if (yC3 < yC4) {
				coneModel[index].xAngle = xCAngle;
			} else {
				coneModel[index].xAngle = -xCAngle;
			}
			coneModel[index].y = yC;
		}

		// coneModel.forEach((element) => {
		// 	const zC = element.z;
		// 	const xC = element.x;

		// 	const IntersectionCone = this.calculateIntersection(1, 1, element.yAngle);

		// 	const xC1 = +xC + IntersectionCone.yPositive;
		// 	const zC1 = +zC;
		// 	const xC2 = +xC + IntersectionCone.yNegative;
		// 	const zC2 = +zC;
		// 	const xC3 = +xC;
		// 	const zC3 = +zC + IntersectionCone.xPositive;
		// 	const xC4 = +xC;
		// 	const zC4 = +zC + IntersectionCone.xNegative;

		// 	const yC = SeaModel.calcY(zC, xC, clk);
		// 	const yC1 = SeaModel.calcY(zC1, xC1, clk);
		// 	const yC2 = SeaModel.calcY(zC2, xC2, clk);
		// 	const yC3 = SeaModel.calcY(zC3, xC3, clk);
		// 	const yC4 = SeaModel.calcY(zC4, xC4, clk);
		// 	const deltaYC12 = Math.abs(yC1 - yC2);
		// 	const zCAngle = Maths.toDeg(
		// 		Math.asin(
		// 			deltaYC12 /
		// 				Math.sqrt(
		// 					deltaYC12 * deltaYC12 +
		// 						IntersectionCone.yPositive * IntersectionCone.yPositive * 8
		// 				)
		// 		)
		// 	);
		// 	if (yC1 > yC2) {
		// 		element.zAngle = +zCAngle;
		// 	} else {
		// 		element.zAngle = -zCAngle;
		// 	}
		// 	const deltaYC34 = Math.abs(yC3 - yC4);

		// 	let xCAngle = Maths.toDeg(
		// 		Math.asin(
		// 			deltaYC34 /
		// 				Math.sqrt(
		// 					deltaYC34 * deltaYC34 +
		// 						IntersectionCone.xPositive * IntersectionCone.xPositive * 8
		// 				)
		// 		)
		// 	);
		// 	if (yC3 < yC4) {
		// 		element.xAngle = xCAngle;
		// 	} else {
		// 		element.xAngle = -xCAngle;
		// 	}
		// 	element.y = yC;
		// });
		//end of forEach trash

		this.moveTo(zB, xB);

		this.mesh.rotation.z = -Maths.toRad(boatModel.yAngle);

		// this.mesh.rotation.z = -Maths.toRad(coneModel.yAngle);

		const length = Constant.boatLength / 4;
		const width = Constant.boatWidth / 4;

		// const lengthCone =1;
		// const widthCone =  1;
		const Intersection = this.calculateIntersection(
			length,
			width,
			boatModel.yAngle
		);

		// const yC = SeaModel.calcY(zC, xC, clk);
		// console.log('yc:'+yC);
		// coneModel.y = yC-0.15;
		// console.log('coneModel.y:'+coneModel.y );

		const x1 = +xB + Intersection.yPositive;
		const z1 = +zB;
		const x2 = +xB + Intersection.yNegative;
		const z2 = +zB;
		const x3 = +xB;
		const z3 = +zB + Intersection.xPositive;
		const x4 = +xB;
		const z4 = +zB + Intersection.xNegative;
		const y = SeaModel.calcY(zB, xB, clk);
		const y1 = SeaModel.calcY(z1, x1, clk);
		const y2 = SeaModel.calcY(z2, x2, clk);
		const y3 = SeaModel.calcY(z3, x3, clk);
		const y4 = SeaModel.calcY(z4, x4, clk);
		const deltaY12 = Math.abs(y1 - y2);
		const zAngle = Maths.toDeg(
			Math.asin(
				deltaY12 /
					Math.sqrt(
						deltaY12 * deltaY12 +
							Intersection.yPositive * Intersection.yPositive * 4
					)
			)
		);

		//trash
		// const xC1 = +xC + IntersectionCone.yPositive;
		// const zC1 = +zC;
		// const xC2 = +xC + IntersectionCone.yNegative;
		// const zC2 = +zC;
		// const xC3 = +xC;
		// const zC3 = +zC + IntersectionCone.xPositive;
		// const xC4 = +xC;
		// const zC4 = +zC + IntersectionCone.xNegative;

		// const yC = SeaModel.calcY(zC, xC, clk);
		// const yC1 = SeaModel.calcY(zC1, xC1, clk);
		// const yC2 = SeaModel.calcY(zC2, xC2, clk);
		// const yC3 = SeaModel.calcY(zC3, xC3, clk);
		// const yC4 = SeaModel.calcY(zC4, xC4, clk);
		// const deltaYC12 = Math.abs(yC1 - yC2);
		// const zCAngle = Maths.toDeg(
		// 	Math.asin(
		// 		deltaYC12 /
		// 			Math.sqrt(
		// 				deltaYC12 * deltaYC12 +
		// 					IntersectionCone.yPositive * IntersectionCone.yPositive * 8
		// 			)
		// 	)
		// );
		// if (yC1 > yC2) {
		// 	coneModel.zAngle = +zCAngle;
		// } else {
		// 	coneModel.zAngle = -zCAngle;
		// }
		// const deltaYC34 = Math.abs(yC3 - yC4);

		// let xCAngle = Maths.toDeg(
		// 	Math.asin(
		// 		deltaYC34 /
		// 			Math.sqrt(
		// 				deltaYC34 * deltaYC34 +
		// 					IntersectionCone.xPositive * IntersectionCone.xPositive * 8
		// 			)
		// 	)
		// );
		// if (yC3 < yC4) {
		// 	coneModel.xAngle = xCAngle;
		// } else {
		// 	coneModel.xAngle = -xCAngle;
		// }
		// coneModel.y = yC;
		// // end of trash

		if (y1 > y2) {
			boatModel.zAngle = +zAngle;
		} else {
			boatModel.zAngle = -zAngle;
		}
		const deltaY34 = Math.abs(y3 - y4);

		let xAngle = Maths.toDeg(
			Math.asin(
				deltaY34 /
					Math.sqrt(
						deltaY34 * deltaY34 +
							Intersection.xPositive * Intersection.xPositive * 4
					)
			)
		);
		if (y3 < y4) {
			boatModel.xAngle = xAngle;
		} else {
			boatModel.xAngle = -xAngle;
		}
		boatModel.y = y;

		this.makeWaves(Intersection, state, zB, xB);
	}

	makeWaves(Intersection, state, z, x) {
		const vec41 = new Vector4();
		const vec42 = new Vector4();
		const angle = this.getSmoothAngle(state);
		vec41.x = z + Intersection.xPositive * Maths.cos(angle);
		vec41.y = x + Intersection.yPositive * Maths.sin(angle);

		vec41.z = vec41.x + state.linearVelocity.intensity * Maths.cos(angle + 150);
		vec41.w = vec41.y + state.linearVelocity.intensity * Maths.sin(angle + 150);

		vec42.x = vec41.x;
		vec42.y = vec41.y;
		vec42.z = vec42.x + state.linearVelocity.intensity * Maths.cos(angle - 150);
		vec42.w = vec42.y + state.linearVelocity.intensity * Maths.sin(angle - 150);
		SeaModel.material.uniforms.points1.value = vec41;
		SeaModel.material.uniforms.points2.value = vec42;
	}

	static calcY(z, x, clk) {
		const fX = SeaModel.material.uniforms.uFrequencyX.value;
		const fZ = SeaModel.material.uniforms.uFrequencyZ.value;

		const waveElevation = SeaModel.material.uniforms.uWaveElevation.value;

		function wave(pos, frequency, phase, amplitude) {
			let waveX = Math.sin(pos[0] * frequency + clk * 0.5 * phase) * amplitude;
			let waveY =
				Math.cos(pos[1] * frequency + clk * 0.5 * phase) * amplitude * 0.5;
			return [waveX, waveY];
		}

		console.log();

		const pos = [z, x];
		const wave1 = wave(pos, fZ, 0.5, waveElevation);
		const wave2 = wave(pos, fX, 1.0, waveElevation * 0.5);
		const wave3 = wave(pos, fZ * 2.0, 1.5, waveElevation * 0.25);
		const wave4 = wave(pos, fX * 0.5, 2.0, waveElevation * 0.75);
		// console.log(wave1);
		let y =
			wave1[0] +
			wave2[0] +
			wave3[0] +
			wave4[0] +
			wave1[1] +
			wave2[1] +
			wave3[1] +
			wave4[1];

		if (y < 0) {
			y /= 2;
		}

		return y;
	}

	moveTo(z, x) {
		this.mesh.position.z = z;
		this.mesh.position.x = x;
		// this.under.position.x = x ;
		// this.under.position.y = y;
	}
}
