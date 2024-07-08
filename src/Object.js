export class Object{
    mass;
    x;
    y;
    vx;
    vy;
    constructor(mass,x,y,vx,vy){
        this.mass = mass;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
    getVx(){
        return this.vx;
    }
    getVy(){
        return this.vy;
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    getMass(){
        return this.mass;
    }
}