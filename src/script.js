import './style.css';
import * as THREE from 'three';
import {World} from "./World";
import {BufferGeometry, Line, LineBasicMaterial, Vector3} from "three";
import {Controller} from "./Controller";
import {Maths} from "./Math";
import {MapControls, OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};
//scheme
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)
//camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.y = 4;
//render
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(size.width, size.height);
// const controller = new MapControls(camera, canvas);
// controller.update();

const resize = function (){
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
}
camera.up.z =1 ;
camera.up.x =0 ;
camera.up.y =0 ;
scene.add(camera);
const world = new World();
world.init(scene);
document.addEventListener('keypress', function (evt){
    if(evt.key === 'w'){
        world.boatModel.moveAhead();
    }
    if(evt.key === 'a'){
        world.boatModel.zAngle += 2;
    }
    if(evt.key === 'd'){
        world.boatModel.zAngle -= 2;
    }
});

const mat = new LineBasicMaterial({color: 0xffff00})
let geo = new BufferGeometry().setFromPoints([
    new Vector3(0, 0, 1),
    new Vector3(0, 0, 1),
])
const line = new Line(geo, mat);
scene.add(line);
//Animation
const tick = () => {
    //render
    const position = world.boatModel.getPositionForCamera();
    camera.position.x = position.x;
    camera.position.y = position.y;
    camera.position.z = position.z + 2;
    camera.lookAt(world.boatModel.getPositionForView());
    geo.setFromPoints([
        new Vector3(0, 0, 6),
        new Vector3(- 3 * Maths.cos(Controller.attributes.windAngle), - 3 * Maths.sin(Controller.attributes.windAngle), 4),
    ])
    line.position.x = world.boatModel.x;
    line.position.y = world.boatModel.y;
    resize();
    renderer.render(scene, camera);
    // controller.update();
    world.run(scene);
    window.requestAnimationFrame(tick);
}

tick()



