import "./style.css";
import * as THREE from "three";
import { World } from "./World";
import {
	AmbientLight,
	DirectionalLight,
} from "three";
import { Controller } from "./Controller";
import { CameraController } from "./CameraController";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

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

const lightAmb = new AmbientLight(0xffffff, 0.08);
scene.add(lightAmb);

const light = new DirectionalLight(0xffdd99, 1.5);
light.position.x = -20;
light.position.y = -20;
light.position.z = 20;
light.castShadow = true;
scene.add(light);
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


//Animation
const tick = () => {
	//render
	cameraController.update(world.boatModel);
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
	window.requestAnimationFrame(tick);
};

tick();
