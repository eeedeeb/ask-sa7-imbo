import {Maths} from "./Math";
import {Vector3} from "three";

export class BoatModel {
    x;
    y;
    z;
    xAngle; // is forward vector in degree
    yAngle; // is side vector in degree
    zAngle; // is up vector in degree
    sailAngel;
    rudderAngle;
    static initModel() {
        const boatModel = new BoatModel();

        boatModel.x = 0;
        boatModel.y = 0;
        boatModel.z = 0;
        boatModel.xAngle = 0;
        boatModel.yAngle = 0;
        boatModel.zAngle = 0;
        boatModel.sailAngel = 0;
        boatModel.rudderAngle = 0;

        return boatModel;
    }

    getPosition(){
        return new Vector3(this.x, this.y, this.z);
    }



}