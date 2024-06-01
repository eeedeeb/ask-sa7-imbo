import * as Three from "three";
import {Constant} from "./Constant";
import {BoxGeometry, Vector3} from "three";
import {Maths} from "./Math";
import {Controller} from "./Controller";

export class DrawBoat{
    
    cube;
    cubeMat = new Three.MeshStandardMaterial();
    cubeMesh;
    sail;
    sailMat = new Three.MeshStandardMaterial();
    sailMesh;
    boat;

    init(scene){
        const scale = 0.5;
        this.cube =  new Three.BoxGeometry(Constant.boatLength * scale, Constant.boatWidth * scale, Constant.boatHeight * scale);
        this.cubeMesh = new Three.Mesh(this.cube, this.cubeMat);
        this.sail = new BoxGeometry(3, 0.05, 4);
        this.sailMesh = new Three.Mesh(this.sail, this.sailMat);
        this.sailMesh.position.z = 2;
        this.boat = new Three.Group();
        this.boat.add(this.cubeMesh);
        this.boat.add(this.sailMesh);
        this.sailMesh.castShadow = true;
        this.cubeMesh.castShadow = true;
        this.sailMesh.receiveShadow = true;
        this.cubeMesh.receiveShadow = true;
        scene.add(this.boat);
    }
    run(model){
        this.sailMesh.rotation.z = Maths.toRad(Controller.attributes.sailAngle);
        this.boat.position.x = model.x;
        this.boat.position.y = model.y;
        this.boat.position.z = model.z;
        this.boat.rotation.x = Maths.toRad(model.xAngle);
        this.boat.rotation.y = Maths.toRad(model.yAngle);
        this.boat.rotation.z = Maths.toRad(model.zAngle);
    }
}