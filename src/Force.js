import {Maths} from "./Math";
import {BufferGeometry, Line, LineBasicMaterial, Vector3} from "three";
import {Constant} from "./Constant";

export class Force {
    intensity;
    angle;
    mat = new LineBasicMaterial({color: 0xff00ff});
    geo = new BufferGeometry().setFromPoints([
        new Vector3(0, 0, 1),
        new Vector3(0, 0, 1),
    ]);
    line = new Line(this.geo, this.mat);
    calcForceIntensity(coefficient, rho, velocity, area){
        this.intensity = coefficient * rho * velocity * velocity * area / 2 ;
        return this;
    }

    projectOnXAxis(){
        return Maths.cos(this.angle) * this.intensity;
    }

    projectOnYAxis(){
        return Maths.sin(this.angle) * this.intensity;
    }

    static initForce() {
        const force = new Force();
        force.intensity = 0;
        force.angle = 0;
        return force;
    }

    static initForceWith(intensity, angle) {
        const force = new Force();
        force.intensity = intensity;
        force.angle = angle;
        return force;
    }

    static getFromCoordinate(x, y){
        if(x === 0 && y === 0) return Force.initForce();

        const intensity = Math.sqrt(x*x + y*y);
        let angle = Maths.toDeg(Math.acos(x / intensity));
        if(y < 0){
            angle = 360 - angle;
        }
        return this.initForceWith(intensity, angle);
    }

    static clacSegma(forces){
        let totalX = 0, totalY = 0;

        for(let i = 0; i < forces.length; i++){
            totalX += forces[i].projectOnXAxis();
            totalY += forces[i].projectOnYAxis();
        }

        return this.getFromCoordinate(totalX, totalY);
    }

    draw(scene, color){
        this.mat.color = color;
        scene.add(this.line);
    }

    update(x, y){
        this.geo.setFromPoints([
            new Vector3(0, 0, 5),
            new Vector3( this.intensity / 70 * Maths.cos(this.angle), this.intensity/ 70 * Maths.sin(this.angle), 5),
        ]);
        this.line.position.x = x;
        this.line.position.y = y;
    }

}