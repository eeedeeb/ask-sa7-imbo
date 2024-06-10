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
		this.sailMesh.scale.set(0.037, 0.037, 0.037);
		this.cube = new Three.BoxGeometry(
			Constant.boatLength * scale,
			Constant.boatWidth * scale,
			Constant.boatHeight * scale
		);
		this.cubeMesh = new Three.Mesh(this.cube, this.cubeMat);
		this.boat = new Three.Group();
		this.boat.add(this.boatMesh);
		this.boat.add(this.sailMesh);
		scene.add(this.boat);
		this.isLoaded = true;
	}

	async run(model) {
		if(!this.isLoaded) return;
		this.sailMesh.rotation.y = Maths.toRad(Controller.attributes.sailAngle);
		this.boat.position.x = model.x;
		this.boat.position.y = model.y;
		this.boat.position.z = model.z;
		this.boat.rotation.x = Maths.toRad(model.xAngle);
		this.boat.rotation.y = Maths.toRad(model.yAngle);
		this.boat.rotation.z = Maths.toRad(model.zAngle);
	}
}
