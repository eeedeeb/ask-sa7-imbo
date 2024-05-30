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


}