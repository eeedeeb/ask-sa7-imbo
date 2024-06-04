import {Vector3} from "three";
import {Maths} from "./Math";
import {Controller} from "./Controller";

export class CameraController{

    camera;
    static currentZ = 0;
    static currentX = 0;
    static len = 5;
    static position = "Third Person";
    constructor(camera) {
        this.camera = camera;
    }

    update(model){
        if(CameraController.currentZ > 120) CameraController.currentZ = 120;
        if(CameraController.currentZ < -120) CameraController.currentZ = -120;
        let position;
        let view;
        if(CameraController.position === "Third Person"){
            position = this.getPositionForCameraT(model);
            view = this.getPositionForViewT(model);
            this.camera.up.z = 1;
            this.camera.up.x = 0;
            this.camera.up.y = 0;
        }else{
            position = this.getPositionForCameraF(model);
            view = this.getPositionForViewF(model);
        }
        this.camera.position.x = position.x;
        this.camera.position.y = position.y;
        this.camera.position.z = position.z;
        this.camera.lookAt(view);
    }

    getPositionForCameraT(model) {
        const position = new Vector3();
        position.z = model.z + 4 * Maths.sin(CameraController.currentZ) + 2;
        position.x = model.x + CameraController.len * Maths.cos(model.zAngle + 180 + CameraController.currentX)
        position.y = model.y + CameraController.len * Maths.sin(model.zAngle + 180 + CameraController.currentX)
        return position;
    }

    getPositionForViewT(model){
        const position = new Vector3();
        position.z = model.z + 2*Maths.sin(CameraController.currentZ / 2) + 0;
        position.x = model.x + 4 * Maths.cos(model.zAngle + CameraController.currentX)
        position.y = model.y + 4 * Maths.sin(model.zAngle + CameraController.currentX)
        return position;
    }

     getPositionForCameraF(model) {
        const position = new Vector3();
        position.z = model.z + 1;
        position.x = model.x + 2 * Maths.cos(model.zAngle + 180)
        position.y = model.y + 2 * Maths.sin(model.zAngle + 180)
        return position;
    }

     getPositionForViewF(model) {
        const position = new Vector3();
        position.z = model.z + 2*Maths.sin(CameraController.currentZ / 2);
        position.x = model.x + 4 * Maths.cos(model.zAngle + CameraController.currentX)
        position.y = model.y + 4 * Maths.sin(model.zAngle + CameraController.currentX)
        return position;
    }
}