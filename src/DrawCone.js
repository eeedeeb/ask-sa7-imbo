import * as Three from "three";
import { Constant } from "./Constant";
import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { Maths } from "./Math";
import { Controller } from "./Controller";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Group } from "three";

export class DrawCone {

	coneMesh;

    coneTest;

 

	isLoaded = false;
	async init(scene,coneModel, posX,posZ) {
		
		const coneLoader = new GLTFLoader();
		const coneGltf = await coneLoader.loadAsync("cone.glb");
		coneGltf.scene.traverse((node) => {
			if (node.isMesh) {
				node.material.reflectivity = 1; // Enable reflections
				node.material.refractionRatio = 0.98; // Adjust refraction ratio if necessary
				node.castShadow = true; // Ensure the mesh casts shadows
				node.receiveShadow = true; // Ensure the mesh receives shadows
			}
		});

        // const coneLoader2 = new GLTFLoader();
		// const coneGltf2 = await coneLoader2.loadAsync("cone.glb");
		// coneGltf2.scene.traverse((node) => {
		// 	if (node.isMesh) {
		// 		node.material.reflectivity = 1; // Enable reflections
		// 		node.material.refractionRatio = 0.98; // Adjust refraction ratio if necessary
		// 		node.castShadow = true; // Ensure the mesh casts shadows
		// 		node.receiveShadow = true; // Ensure the mesh receives shadows
		// 	}
		// });
       
		this.coneMesh = coneGltf.scene.children[0];
		this.coneMesh.position.x = posX;
		this.coneMesh.position.z = posZ;
		
		//this.coneMesh.position.y = -1;
		//this.coneMesh.scale.set(0.1, 0.1,0.1);

        // this.coneTest = coneGltf2.scene.children[0];
		// this.coneTest.position.x = -3;
		scene.add(this.coneMesh);
		// scene.add(this.coneTest);

	}

	async run(model) {
		// if (!this.isLoaded) return;
		// this.sailMesh.rotation.y = Maths.toRad(Controller.attributes.sailAngle);

		// this.rudderMesh.rotation.y = Maths.toRad(Controller.attributes.rudderAngle);

		// this.boat.position.x = model.x;
		 this.coneMesh.position.y = model.y-0.12;
		// this.boat.position.z = model.z;

		// // this.coneGltf.position.x = model.x;
		// // this.coneGltf.position.y = model.y;
		// // this.coneGltf.position.z = model.z;
		//this.coneMesh.rotateX(90);

		 this.coneMesh.rotation.x = Maths.toRad(model.xAngle - 90);
		// this.coneMesh.rotation.y = Maths.toRad(model.yAngle);
		// this.coneMesh.rotation.z = Maths.toRad(model.zAngle);
	}
}
