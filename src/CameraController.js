import {Vector3} from "three";
import {Maths} from "./Math";

export class CameraController{

    camera;
    currentZ = 0;
    currentX = 0;
    len = 5;
    constructor(camera) {
        this.camera = camera;
    }

    update(model){
        if(this.currentZ > 120) this.currentZ = 120;
        if(this.currentZ < -45) this.currentZ = -45;
        const position = this.getPositionForCamera(model);
        this.camera.position.x = position.x;
        this.camera.position.y = position.y;
        this.camera.position.z = position.z + 2;
        this.camera.lookAt(this.getPositionForView(model));
    }

    getPositionForCamera(model) {
        const position = new Vector3();
        position.z = model.z + 4 * Maths.sin(this.currentZ);
        position.x = model.x + this.len * Maths.cos(model.zAngle + 180 + this.currentX)
        position.y = model.y + this.len * Maths.sin(model.zAngle + 180 + this.currentX)
        return position;
    }

    getPositionForView(model){
        const position = new Vector3();
        position.z = model.z + 2*Maths.sin(this.currentZ / 2);
        position.x = model.x + 4 * Maths.cos(model.zAngle + this.currentX)
        position.y = model.y + 4 * Maths.sin(model.zAngle + this.currentX)
        return position;
    }

}