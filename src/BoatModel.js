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
        boatModel.xAngle = 45;
        boatModel.yAngle = 0;
        boatModel.zAngle = 0;
        boatModel.sailAngel = 0;
        boatModel.rudderAngle = 0;

        return boatModel;
    }

    moveAhead() {
        this.x += 0.1 * Maths.cos(this.zAngle);
        this.y += 0.1 * Maths.sin(this.zAngle);
    }

    getPosition(){
        return new Vector3(this.x, this.y, this.z);
    }

    getPositionForCamera() {
        const position = new Vector3();
        position.z = this.z + 2;
        position.x = this.x + 5 * Maths.cos(this.zAngle + 180)
        position.y = this.y + 5 * Maths.sin(this.zAngle + 180)
        return position;
    }

    getPositionForView(){
        const position = new Vector3();
        position.z = this.z;
        position.x = this.x + 4 * Maths.cos(this.zAngle)
        position.y = this.y + 4 * Maths.sin(this.zAngle)
        return position;
    }

}