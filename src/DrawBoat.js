import * as Three from "three";
import {Constant} from "./Constant";
import {Vector3} from "three";
import {Maths} from "./Math";

export class DrawBoat{


    cube;
    cubeMat = new Three.MeshBasicMaterial();
    cubeMesh;

    init(scene){
        const scale = 0.5;
        this.cube =  new Three.BoxGeometry(Constant.boatLength * scale, Constant.boatWidth * scale, Constant.boatHeight * scale);
        this.cubeMesh = new Three.Mesh(this.cube, this.cubeMat);
        scene.add(this.cubeMesh);
    }

    run(model){
        this.cubeMesh.position.x = model.x;
        this.cubeMesh.position.y = model.y;
        this.cubeMesh.position.z = model.z;
        this.cubeMesh.rotation.x = this.smooth(this.cubeMesh.rotation.x, Maths.toRad(model.xAngle));
        this.cubeMesh.rotation.y = this.smooth(this.cubeMesh.rotation.y,  Maths.toRad(model.yAngle));
        this.cubeMesh.rotation.z = this.smooth(this.cubeMesh.rotation.z, Maths.toRad(model.zAngle));
    }

    smooth(current, needed){
        // if(needed > current)
        //     return Math.min(current + 0.1, needed);
        //
        // return Math.max(current - 0.1, needed);
        return needed;
    }

}