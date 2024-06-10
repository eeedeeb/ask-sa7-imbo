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
		world.boatModel.yAngle += 2;
	}
	if (evt.key === "d") {
		world.boatModel.yAngle -= 2;
	}
});

const light = new DirectionalLight(0xa0daf9, 3.5);
light.position.x = -20;
light.position.y = 20;
light.position.z = -20;
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
		CameraController.currentZ -= evt.x - lastX;
		CameraController.currentY += evt.y - lastY;
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

//Animation
const tick = () => {
	//render
	resize();
	renderer.render(scene, camera);
	const angle =
		-Controller.attributes.windAngle +
		world.boatModel.yAngle +
		CameraController.currentZ;
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
