import "./style.css";
import * as THREE from "three";
import { World } from "./World";
import { AmbientLight, DirectionalLight } from "three";
import { Controller } from "./Controller";
import { CameraController } from "./CameraController";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};
//scheme
const scene = new THREE.Scene();

// hdri

const loader = new RGBELoader();
loader.setDataType(THREE.UnsignedByteType); // Set the data type
loader.load(
	"kloofendal_43d_clear_puresky_2k.hdr",
	function (texture) {
		console.log(texture);

		texture.mapping = THREE.EquirectangularReflectionMapping;
		scene.background = texture;
		scene.environment = texture;
	},
	() => {
		console.log("in progses");
	},
	(error) => {
		console.log(error);
	}
);

//sky
// const sky = new Sky();
// sky.scale.setScalar( 450000 );

// const phi = THREE.MathUtils.degToRad( 90 );
// const theta = THREE.MathUtils.degToRad( 180 );
// const sunPosition = new THREE.Vector3().setFromSphericalCoords( 1, phi, theta );

// sky.material.uniforms.sunPosition.value = sunPosition;
// console.log(sky);
// sky.rotation.order="XZY";
// // sky.material.rotation.x = 3.14;

// // sky.rotation.y= 3.14/2;
// scene.add( sky );
// let sky, sun;
// sky = new Sky();
// sky.turbidity = 10; // Turbidity of the sky
// sky.rayleigh = 3; // Rayleigh scattering
// sky.mieDirectionalG = 0.7;
// sky.scale.setScalar(450000);
// scene.add(sky);
// -sky

//helper
// const axisHelper = new THREE.AxisHelper(5); // The argument is the length of the axes
// scene.add(axisHelper);
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Color and intensity

//camera
const camera = new THREE.PerspectiveCamera(
	75,
	size.width / size.height,
	0.1,
	100
);
//render
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	alpha: true,
	canvas,
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(size.width, size.height);
const cameraController = new CameraController(camera, scene);

const resize = function () {
	size.width = window.innerWidth;
	size.height = window.innerHeight;
	camera.aspect = size.width / size.height;
	camera.updateProjectionMatrix();
	renderer.setSize(size.width, size.height);
};

scene.add(camera);
const world = new World();
await world.init(scene);
document.addEventListener("keypress", function (evt) {
	if (evt.key === "a") {
		world.boatModel.zAngle += 2;
	}
	if (evt.key === "d") {
		world.boatModel.zAngle -= 2;
	}
});

const lightAmb = new AmbientLight(0xffffff, 0.3);
// scene.add(lightAmb);

const light = new DirectionalLight(0xa0daf9, 3.5);
light.position.x = -20;
light.position.y = -20;
light.position.z = 20;
light.castShadow = true;
scene.add(light);

const light2 = new DirectionalLight(0xa0daf9, 0.4);
light2.position.x = 20;
light2.position.y = 20;
light2.position.z = 20;
light2.castShadow = true;
scene.add(light2);

let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousemove", function (evt) {
	if (evt.buttons === 1) {
		CameraController.currentX -= evt.x - lastX;
		CameraController.currentZ += evt.y - lastY;
	}
	lastX = evt.x;
	lastY = evt.y;
});
canvas.addEventListener("wheel", function (evt) {
	if (evt.deltaY > 0) {
		CameraController.len *= 1.1;
	} else if (evt.deltaY < 0) {
		CameraController.len /= 1.1;
	}
});

// spot light
// const color = 0xeeeeff; // White light
// const intensity = 2; // Full intensity
// const distance = 0; // No limit to the distance
// const angle = Math.PI / 4; // 45 degrees
// const penumbra = 0.05; // Slight penumbra
// const spotLight = new THREE.SpotLight(color, intensity, distance, angle, penumbra);
// spotLight.position.set(10, 4, 20); // Position the light above the scene
// spotLight.castShadow = true;
// scene.add(spotLight);
// - spot light
// function guiChanged() {
// 	const uniforms = sky.material.uniforms;
// 	uniforms["turbidity"].value = effectController.turbidity;
// 	uniforms["rayleigh"].value = effectController.rayleigh;
// 	uniforms["mieCoefficient"].value = effectController.mieCoefficient;
// 	uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

// 	const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
// 	const theta = THREE.MathUtils.degToRad(effectController.azimuth);

// 	sun.setFromSphericalCoords(1, phi, theta);

// 	uniforms["sunPosition"].value.copy(sun);

// 	renderer.toneMappingExposure = effectController.exposure;
// 	renderer.render(scene, camera);
// }

// const gui = new GUI();

// gui.add(effectController, "turbidity", 0.0, 20.0, 0.1).onChange(guiChanged);
// gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
// gui
// 	.add(effectController, "mieCoefficient", 0.0, 0.1, 0.001)
// 	.onChange(guiChanged);
// gui
// 	.add(effectController, "mieDirectionalG", 0.0, 1, 0.001)
// 	.onChange(guiChanged);
// gui.add(effectController, "elevation", 0, 90, 0.1).onChange(guiChanged);
// gui.add(effectController, "azimuth", -180, 180, 0.1).onChange(guiChanged);
// gui.add(effectController, "exposure", 0, 1, 0.0001).onChange(guiChanged);

// guiChanged();
// camera.position.z = 9;
// camera.position.y = -9;
// camera.position.x = -10;
// camera.lookAt(new THREE.Vector3());
// - sky controller

//Animation
const tick = () => {
	//render
	resize();
	renderer.render(scene, camera);
	const angle =
		-Controller.attributes.windAngle +
		world.boatModel.zAngle +
		CameraController.currentX;
	document.getElementById("true-wind").style.transform = `rotate(${angle}deg)`;
	document.getElementById(
		"velocity"
	).innerText = `velocity: ${world.state.linearVelocity.intensity.toFixed(
		3
	)} m/s`;
	world.run(scene);
	cameraController.update(world.boatModel);
	window.requestAnimationFrame(tick);
};

tick();
