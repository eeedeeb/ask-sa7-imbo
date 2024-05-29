import {Force} from "./Force";

export class Torque{
    force;
    distance;
    clockwise;
    intensity;

    constructor(force, distance, clockwise, intensity) {
        this.force = force;
        this.distance = distance;
        this.clockwise = clockwise;
        this.intensity = intensity;
    }

    calcTorqueIntensity(forceIntensity, distance, clockwise) {
        this.intensity = forceIntensity * distance * (clockwise ? 1 : -1);
        return this;
    }

    static initTorque(){
        return new Torque(Force.initForce(), 0, 0, 0);
    }
}