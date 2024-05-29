import {Force} from "./Force";
import {Torque} from "./Torque";
import {State} from "./State";
import { Constant } from "./Constant";
import { Controller } from "./Controller";
import {Maths} from "./Math";

export class Physics{
    state;

    waterLiftForce;
    waterDragForce;
    windLiftForce;
    windDragForce;
    rudderLiftForce = Force.initForce();
    rudderDragForce = Force.initForce(); 
    rudderTotalForce = Force.initForce();
    totalHullResistance;
    viscousResistance;
    airResistance;
    segmaForces;

    rudderTorque = Torque.initTorque();
    hullTorque;
    keelTorque;
    sailTorque;

    constructor(state) {
        this.state = state;
    }

    calcRudderLiftForce() {
        this.rudderLiftForce.calcForceIntensity(Constant.rudderLiftCoef, Constant.waterRho, state.linearVelocity, Constant.rudderArea);
    }

    calcRudderDragForce() {
        this.rudderDragForce.calcForceIntensity(Constant.rudderDragCoef, Constant.waterRho, state.linearVelocity, Constant.rudderArea);
    }

    calcRudderTotalForce() {
        driftAngle = Controller.attributes.rudderAngle - this.state.linearVelocity.angle;
        this.rudderTotalForce.intensity = this.rudderLiftForce.intensity * Maths.cos(driftAngle) - this.rudderDragForce.intensity * Maths.sin(driftAngle);
    }

    calcRudderTorque() {
        clockwise = (Controller.attributes.rudderAngle > 0);
        this.rudderTorque.calcTorqueIntensity(this.rudderTotalForce.intensity, Constant.boatLength/2, clockwise);
    }

    

}