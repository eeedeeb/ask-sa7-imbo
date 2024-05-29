export class Maths{

    static toRad(angle){
        return Math.PI * angle / 180;
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