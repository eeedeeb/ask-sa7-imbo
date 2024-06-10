import {Vector3} from "three";
import {Maths} from "./Math";
import {Controller} from "./Controller";
import {SeaModel} from "./SeaModel";

export class CameraController{

    camera;
    static currentY = 0;
    static currentZ = 0;
    static len = 5;
    static position = "Third Person";
    constructor(camera) {
        this.camera = camera;
    }

    update(model){
        if(CameraController.currentY > 120) CameraController.currentY = 120;
        if(CameraController.currentY < -120) CameraController.currentY = -120;
        let position;
        let view;
        if(CameraController.position === "Third Person"){
            position = this.getPositionForCameraT(model);
            view = this.getPositionForViewT(model);
            this.camera.up.y = 1;
            this.camera.up.z = 0;
            this.camera.up.x = 0;
        }else{
            position = this.getPositionForCameraF(model);
            view = this.getPositionForViewF(position);
        }
        this.camera.position.x = position.x;
        this.camera.position.y = position.y;
        this.camera.position.z = position.z;
        this.camera.lookAt(view);
    }

    getPositionForCameraT(model) {
        const position = new Vector3();
        position.y = model.y + 4 * Maths.sin(CameraController.currentY) + 2;
        position.z = model.z + CameraController.len * Maths.cos(model.yAngle + 180 + CameraController.currentZ)
        position.x = model.x + CameraController.len * Maths.sin(model.yAngle + 180 + CameraController.currentZ)
        return position;
    }

    getPositionForViewT(model){
        const position = new Vector3();
        position.y = model.y + 2 * Maths.sin(CameraController.currentY / 2);
        position.z = model.z + 4 * Maths.cos(model.yAngle + CameraController.currentZ)
        position.x = model.x + 4 * Maths.sin(model.yAngle + CameraController.currentZ)
        return position;
    }

     getPositionForCameraF(model) {
        const position = new Vector3();
        position.z = model.z + 2 * Maths.cos(model.yAngle + 180);
        position.x = model.x + 2 * Maths.sin(model.yAngle + 180);
        const fX = 0.3;
        const fZ = 0.1;
        const clk = Controller.clock.getElapsedTime();
        let y = SeaModel.calcY(position.z, position.x, clk)
        position.y = y + 1;

        return position;
    }

     getPositionForViewF(camera) {
        const position = new Vector3();
        position.y = camera.y + 2 * Maths.sin(CameraController.currentY / 2);
        position.z = camera.z + 4 * Maths.cos( CameraController.currentZ)
        position.x = camera.x + 4 * Maths.sin( CameraController.currentZ)
        return position;
    }
}