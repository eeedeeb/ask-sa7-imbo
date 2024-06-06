import * as Three from "three";
import { Constant } from "./Constant";
import {BoxGeometry, Mesh, MeshBasicMaterial, Vector3} from "three";
import { Maths } from "./Math";
import { Controller } from "./Controller";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class DrawBoat {
	cube;
	cubeMat = new Three.MeshBasicMaterial();
	cubeMesh;
	sail;
	sailMat = new Three.MeshBasicMaterial();
	sailMesh;
	boat;

	isLoaded = false;
	async init(scene) {
		const scale = 0.5;
		// const gltfLoader = new GLTFLoader();
		const loader = new GLTFLoader();
		const gltf = await loader.loadAsync("untitled.glb");
		gltf.scene.traverse((node) => {
			if (node.isMesh) {
				node.material.reflectivity = 1; // Enable reflections
				node.material.refractionRatio = 0.98; // Adjust refraction ratio if necessary
				node.castShadow = true; // Ensure the mesh casts shadows
				node.receiveShadow = true; // Ensure the mesh receives shadows
			}
		});
		this.boatMesh = gltf.scene.children[0];
		this.sailMesh = gltf.scene.children[1];
		this.boatMesh.scale.set(0.003, 0.003, 0.002);
		this.boatMesh.rotation.x = 3.14 * 2;
		this.boatMesh.rotation.z = 3.14 / 2;

		this.sailMesh.scale.set(0.037, 0.037, 0.037);
		this.sailMesh.rotation.x = 3.14 /2;
		this.sailMesh.position.z = 0.54;
		this.sailMesh.position.x = 0.41;
		this.sailMesh.position.y = -0.002;

		// this.sailMesh.rotation.y = 3.14 /2;
		// this.sailMesh.rotateY(3.14 / 2);
		// this.sailMesh.rotateZ(3.14 / 2);
		// this.boatMesh.rotation.z = 3.14 * 2;
		// scene.add(this.boatMesh); //
		// await gltfLoader.load(
		//     "sailboat.glb",
		//    async (gltf) => {
		//         // console.log(gltf);
		//         // scene.add(gltf.scenes[0].children[0]);
		//         this.boatMesh = gltf.scene.children[0];
		//         this.boat.scale.set(0.006,0.006,0.006);
		//         // this.boat.rotation.x = 3.14*2;
		//         // this.sail = new BoxGeometry(3, 0.05, 4);
		//         // this.sailMesh = new Three.Mesh(this.sail, this.sailMat);
		//         // this.sailMesh.position.z = 2;
		//         // scene.add(this.boat); // A
		//         console.log('console.log(this.boat.position.x) from init in drawBoat:');
		//         console.log(this.boat.position.x);
		//         console.log('success');

		// //         // console.log(gltf.scenes[0].children[0]);
		// //         // scene.add(this.boat);
		// //         // this.boat = gltf.scene.children[0]
		// //         // console.log('boat');
		// //         // console.log(this.boat);
		// //         // console.log(boat);
		// //     },
		// //     () => {
		// //         console.log("progress");
		// //     },
		// //     () => {
		// //         console.log("failed");
		//     }
		// );
		// Load the GLTF model asynchronously
		// const loader = new GLTFLoader();
		// const gltf = await loader.loadAsync('sailboat.glb');
		// const gltf = await loader.loadAsync('Duck.glb');
		// console.log(gltf.scene);
		// this.boat = gltf.scene.children[0];
		// this.boat.scale.set(0.01,0.01,0.01);
		// this.boat.rotation.x = 3.14*2;
		// this.sail = new BoxGeometry(3, 0.05, 4);
		// this.sailMesh = new Three.Mesh(this.sail, this.sailMat);
		// this.sailMesh.position.z = 2;
		// scene.add(this.boat); // A
		// const scale = 0.5;
		this.cube = new Three.BoxGeometry(
			Constant.boatLength * scale,
			Constant.boatWidth * scale,
			Constant.boatHeight * scale
		);
		this.cubeMesh = new Three.Mesh(this.cube, this.cubeMat);
		// this.sailMesh.position.z = 2;
		this.boat = new Three.Group();
		// this.boat.add(this.cubeMesh);
		this.boat.add(this.boatMesh);
		this.boat.add(this.sailMesh);
		// this.boat.add(this.sailMesh);
		scene.add(this.boat);
		this.isLoaded = true;
	}

	async run(model) {

		if(!this.isLoaded) return;

		this.sailMesh.rotation.y = Maths.toRad(90+Controller.attributes.sailAngle);

		this.boat.position.x = model.x;
		this.boat.position.y = model.y;
		this.boat.position.z = model.z;
		this.boat.rotation.x = Maths.toRad(model.xAngle);
		this.boat.rotation.y = Maths.toRad(model.yAngle);
		this.boat.rotation.z = Maths.toRad(model.zAngle);
	}
}
