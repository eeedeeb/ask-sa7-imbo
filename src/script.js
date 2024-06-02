import "./style.css";
import * as THREE from "three";
import { World } from "./World";
import {
	AmbientLight,
	BufferGeometry,
	DirectionalLight,
	Line,
	LineBasicMaterial,
	Vector3,
} from "three";
import { Controller } from "./Controller";
import { Maths } from "./Math";
import { CameraController } from "./CameraController";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};
//scheme
const scene = new THREE.Scene();

const loader = new RGBELoader();
loader.setDataType(THREE.UnsignedByteType); // Set the data type
loader.load(
	"kloofendal_43d_clear_puresky_2k.hdr",
	function (texture) {
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
console.log(scene);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Color and intensity
// scene.add(ambientLight);

//camera
const camera = new THREE.PerspectiveCamera(
	75,
	size.width / size.height,
	0.1,
	200
);
camera.position.y = 4;
//render

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(size.width, size.height);
const cameraController = new CameraController(camera);

const resize = function () {
	size.width = window.innerWidth;
	size.height = window.innerHeight;
	camera.aspect = size.width / size.height;
	camera.updateProjectionMatrix();
	renderer.setSize(size.width, size.height);
};
camera.up.z = 1;
camera.up.x = 0;
camera.up.y = 0;
scene.add(camera);
const world = new World();
await world.init(scene);
document.addEventListener("keypress", function (evt) {
	if (evt.key === "w") {
		world.boatModel.moveAhead();
	}
	if (evt.key === "a") {
		world.boatModel.zAngle += 2;
	}
	if (evt.key === "d") {
		world.boatModel.zAngle -= 2;
	}
});

const lightAmb = new AmbientLight(0xffffff, 1);
// scene.add(lightAmb);

const light = new DirectionalLight(0xffdd77, 1);
light.position.x = 500;
light.position.y = 500;
light.position.z = 500;
light.castShadow = true;
// scene.add(light);

let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousemove", function (evt) {
	if (evt.buttons === 1) {
		cameraController.currentX -= evt.x - lastX;
		cameraController.currentZ += evt.y - lastY;
	}
	lastX = evt.x;
	lastY = evt.y;
});
canvas.addEventListener("wheel", function (evt) {
	if (evt.deltaY > 0) {
		// Scrolled up/backward
		cameraController.len += 0.1;
		// Implement your logic for backward movement here
	} else if (evt.deltaY < 0) {
		// Scrolled down/forward
		cameraController.len -= 0.1;
		// Implement your logic for forward movement here
	}
});

//Animation
const tick = () => {
	//render
	cameraController.update(world.boatModel);
	resize();
	renderer.render(scene, camera);
	const angle =
		-Controller.attributes.windAngle +
		world.boatModel.zAngle +
		cameraController.currentX;
	document.getElementById("true-wind").style.transform = `rotate(${angle}deg)`;
	document.getElementById(
		"velocity"
	).innerText = `velocity: ${world.state.linearVelocity.intensity.toFixed(
		3
	)} m/s`;
	world.run(scene);
	window.requestAnimationFrame(tick);
};

tick();
