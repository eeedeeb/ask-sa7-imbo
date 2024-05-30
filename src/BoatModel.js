import * as Three from "three";
import {Maths} from "./Math";

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

        boatModel.x = 1;
        boatModel.y = 0;
        boatModel.z = 0;
        boatModel.xAngle = 45;
        boatModel.yAngle = 0;
        boatModel.zAngle = 0;
        boatModel.sailAngel = 0;
        boatModel.rudderAngle = 0;

        return boatModel;
    }

    moveAhead() {
        this.x += 0.2 * Maths.cos(this.zAngle);
        this.y += 0.2 * Maths.sin(this.zAngle);
    }

}