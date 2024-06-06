import {BoxGeometry, Clock, Mesh, MeshBasicMaterial, Vector3} from "three";
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
            view = this.getPositionForViewF(position);
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
        position.z = model.z + 2 * Maths.sin(CameraController.currentZ / 2);
        position.x = model.x + 4 * Maths.cos(model.zAngle + CameraController.currentX)
        position.y = model.y + 4 * Maths.sin(model.zAngle + CameraController.currentX)
        return position;
    }

     getPositionForCameraF(model) {
        const position = new Vector3();
        position.x = model.x + 2 * Maths.cos(model.zAngle + 180);
        position.y = model.y + 2 * Maths.sin(model.zAngle + 180);
        const fY = 0.3;
        const fX = 0.1;
        const clk = Controller.clock.getElapsedTime();
        let z = (
                 Math.sin((position.y * fY - position.x * fX + clk) * 0.7)
                 + Math.sin((position.y * fY + position.x * fX * 2 + clk)* 0.7)
                 + Math.cos((position.x * fX / 2 + clk)* 0.7)
             )
             * Controller.attributes.waves
             - 0.07;
         if (z < 0) {
             z = z / 2;
         }
        position.z = z + 1;
        return position;
    }

     getPositionForViewF(camera) {
        const position = new Vector3();
        position.z = camera.z + 2 * Maths.sin(CameraController.currentZ / 2);
        position.x = camera.x + 4 * Maths.cos( CameraController.currentX)
        position.y = camera.y + 4 * Maths.sin( CameraController.currentX)
        return position;
    }
}