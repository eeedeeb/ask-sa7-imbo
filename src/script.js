import './style.css';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {World} from "./World";
import {Vector3} from "three";

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};
//scheme
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)
const light = new THREE.PointLight( 0xffffff, 1, 100);
light.position.set( 5, 5, 5 );
light.castShadow = true;
scene.add( light );
//camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);


//render
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(size.width, size.height);

const resize = function (){
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
}


const controls = new OrbitControls( camera, canvas);
controls.update();
scene.add(camera);
camera.position.y = -4;
camera.lookAt(new Vector3(0, 0, 0));
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
//Animation
const tick = () => {
    //render
    resize();
    renderer.render(scene, camera);
    controls.update();
    world.run();
    window.requestAnimationFrame(tick);
}

tick()



