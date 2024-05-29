import {Maths} from "./Math";

export class Force {
    intensity;
    angle;

    calcForceIntensity(coefficient, rho, velocity, area){
        this.intensity = coefficient * rho * velocity * velocity * area / 2;
        return this;
    }

    projectOnXAxis(angleOfXAxisAccordingToWorld){
        return Maths.cos(this.angle - angleOfXAxisAccordingToWorld) * this.intensity;
    }

    projectOnYAxis(angleOfXAxisAccordingToWorld){
        return Maths.sin(this.angle - angleOfXAxisAccordingToWorld) * this.intensity;
    }

    static initForce() {
        const force = new Force();
        force.intensity = 0;
        force.angle = 0;
        return force;
    }


}