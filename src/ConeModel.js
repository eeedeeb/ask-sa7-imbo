import {Maths} from "./Math";
import {Vector3} from "three";

export class ConeModel {
    x;
    y;
    z;
    xAngle; // is forward vector in degree
    yAngle; // is side vector in degree
    zAngle; // is up vector in degree

    static initModel() {
        const coneModel = new ConeModel();

        coneModel.x = 0;
        coneModel.y = 0;
        coneModel.z = 0;
        coneModel.xAngle = 0;
        coneModel.yAngle = 0;
        coneModel.zAngle = 0;



        return coneModel;
    }

    getPosition(){
        return new Vector3(this.x, this.y, this.z);
    }



}