import {Force} from "./Force";
import {Torque} from "./Torque";
import { Constant } from "./Constant";
import { Controller } from "./Controller";
import {Maths} from "./Math";
import {Color} from "three";
import {State} from "./State";

export class Physics{
    state = State.initState();
    model;
    apparentWind = Force.initForce();
    waterLiftForce = Force.initForce();
    waterDragForce = Force.initForce();
    windLiftForce = Force.initForce();
    windDragForce = Force.initForce();
    rudderLiftForce = Force.initForce();
    rudderDragForce = Force.initForce(); 
    rudderTotalForce = Force.initForce();
    segmaForces = Force.initForce();
    totalHullResistance;
    viscousResistance;
    airResistance;

    rudderTorque = Torque.initTorque();
    hullTorque;
    keelTorque;
    sailTorque;

    setState(state, model) {
        this.state = state;
        this.model = model;
    }

    init(scene){
        this.waterLiftForce.draw(scene, new Color(0xffbb55));
        this.waterDragForce.draw(scene, new Color(0x0000ff));
        this.windLiftForce.draw(scene, new Color(0xff0000));
        this.windDragForce.draw(scene, new Color(0x00ff00));
        this.segmaForces.draw(scene, new Color(0xffffff));
    }
    calcRudderLiftForce() {
        this.rudderLiftForce.calcForceIntensity(Constant.rudderLiftCoef, Constant.waterRho, state.linearVelocity, Constant.rudderArea);
    }

    calcRudderDragForce() {
        this.rudderDragForce.calcForceIntensity(Constant.rudderDragCoef, Constant.waterRho, state.linearVelocity, Constant.rudderArea);
    }

    calcRudderTotalForce() {
        const driftAngle = Controller.attributes.rudderAngle - this.state.linearVelocity.angle;
        this.rudderTotalForce.intensity = this.rudderLiftForce.intensity * Maths.cos(driftAngle) - this.rudderDragForce.intensity * Maths.sin(driftAngle);
    }

    calcRudderTorque() {
        const clockwise = (Controller.attributes.rudderAngle > 0);
        this.rudderTorque.calcTorqueIntensity(this.rudderTotalForce.intensity, Constant.boatLength/2, clockwise);
    }
    getAngleOfAttackInSail() {
        return Math.round(Maths.fix180(this.apparentWind.angle - Controller.attributes.sailAngle + this.model.zAngle));
    }
    getAngleOfAttackInKeel(){
        return Math.round(Maths.fix180(this.state.linearVelocity.angle + 180 - this.model.zAngle));
    }
    getDirectionForLift(angleOfForce, angle){
        angleOfForce = Maths.fix(angleOfForce);
        angle = Maths.fix(angle);
        const result = Maths.fix(angle - angleOfForce);

        return ! ((result <= 90) || (result >= 180 && result <= 270));
    }


    calcFDWind(){
        const cd = Constant.cd[this.getAngleOfAttackInSail()];
        this.windDragForce.calcForceIntensity(cd, Constant.airRho, this.apparentWind.intensity, Constant.sailArea);
        this.windDragForce.angle = this.apparentWind.angle;
    }

    calcFLWind(){
        const cl = Constant.cl[this.getAngleOfAttackInSail()];
        this.windLiftForce.calcForceIntensity(cl, Constant.airRho, this.apparentWind.intensity, Constant.sailArea);
        if(this.getDirectionForLift(this.apparentWind.angle, Controller.attributes.sailAngle + this.model.zAngle)){
            this.windLiftForce.angle = Maths.fix(this.apparentWind.angle + 90);
        }else{
            this.windLiftForce.angle = Maths.fix(this.apparentWind.angle - 90);
        }
    }

    calcFDWater(){
        const cd = Constant.cd[this.getAngleOfAttackInKeel()] /10 ;
        this.waterDragForce.calcForceIntensity(cd, Constant.waterRho, this.state.linearVelocity.intensity, Constant.keelArea);
        this.waterDragForce.angle = Maths.fix(this.state.linearVelocity.angle + 180);
    }

    calcFLWater(){
        const cl = Constant.cl[this.getAngleOfAttackInKeel()] /10;
        this.waterLiftForce.calcForceIntensity(cl, Constant.waterRho, this.state.linearVelocity.intensity, Constant.keelArea);
        if( this.getDirectionForLift(this.state.linearVelocity.angle + 180, this.model.zAngle) ) {
            this.waterLiftForce.angle = Maths.fix(this.state.linearVelocity.angle - 90);
        } else {
            this.waterLiftForce.angle = Maths.fix(this.state.linearVelocity.angle + 90);
        }
    }
    calcSegma(){

        this.apparentWind = Force.clacSegma([
            Force.initForceWith(Controller.attributes.windSpeed, Controller.attributes.windAngle),
            Force.initForceWith(this.state.linearVelocity.intensity, this.state.linearVelocity.angle + 180),
        ]);
        this.calcFDWater();
        this.calcFLWater();
        this.calcFDWind();
        this.calcFLWind();
        this.segmaForces = Force.clacSegma([
            this.waterLiftForce,
            this.waterDragForce,
            this.windLiftForce,
            this.windDragForce,
        ]);
        this.waterLiftForce.update(this.model.x, this.model.y);
        this.waterDragForce.update(this.model.x, this.model.y);
        this.windLiftForce.update(this.model.x, this.model.y);
        this.windDragForce.update(this.model.x, this.model.y);
        // this.segmaForces.update();

    }

    getNewState(){
        this.calcSegma();
        const acceleration = Force.initForceWith(this.segmaForces.intensity / Constant.boatMass, this.segmaForces.angle);
        this.state.linearVelocity = Force.clacSegma([
            this.state.linearVelocity,
            acceleration
        ])
        console.log(acceleration.intensity);
        // console.log(this.state.linearVelocity.intensity);
        return this.state;
    }

}