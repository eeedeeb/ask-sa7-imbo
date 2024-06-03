import math from "dat.gui/src/dat/color/math";

export class Maths{

    static toRad(angle){
        return Math.PI * angle / 180;
    }

    static toDeg(angle){
        return 180 * angle / Math.PI;
    }

    //cos in degree
    static cos(angle){
        return Math.cos(this.toRad(angle))
    }

    //sin in degree
    static sin(angle){
        return Math.sin(this.toRad(angle))
    }

    static fix(angle){
        while (angle < 0) angle += 360;
        while (angle > 360) angle -=360;
        return angle;
    }

    static fix180(angle){
        angle = this.fix(angle);
        if(angle >= 180) angle -= 180;
        return angle;
    }

    static differance(angle1, angle2){
        angle1 = this.fix(angle1);
        angle2 = this.fix(angle2);
        return Math.min(this.fix(angle2 - angle1), this.fix(angle1 - angle2));
    }
}