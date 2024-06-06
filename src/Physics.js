import {Force} from "./Force";
import {Torque} from "./Torque";
import {Constant} from "./Constant";
import {Controller} from "./Controller";
import {Maths} from "./Math";
import {State} from "./State";

export class Physics {
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
    totalHullResistance = Force.initForce();
    viscousResistance = Force.initForce();
    waveMakingResistance = Force.initForce();
    airResistance = Force.initForce();

    rudderTorque = Torque.initTorque();
    hullTorque = Torque.initTorque();
    keelTorque;
    sailTorque;

    setState(state, model) {
        this.state = state;
        this.model = model;
        return this;
    }

    calcRudderLiftForce() {
        this.rudderLiftForce.calcForceIntensity(Constant.rudderLiftCoef, Constant.waterRho, this.state.linearVelocity.intensity, Constant.rudderArea);
    }

    calcRudderDragForce() {
        this.rudderDragForce.calcForceIntensity(Constant.rudderDragCoef, Constant.waterRho, this.state.linearVelocity.intensity, Constant.rudderArea);
    }

    calcRudderTotalForce() {
        this.calcRudderDragForce();
        this.calcRudderLiftForce();
        const driftAngle = Controller.attributes.rudderAngle - this.state.linearVelocity.angle;
        this.rudderTotalForce.intensity = this.rudderLiftForce.intensity * Maths.cos(driftAngle) - this.rudderDragForce.intensity * Maths.sin(driftAngle);
    }

    calcRudderTorque() {
        this.calcRudderTotalForce();
        const clockwise = (Controller.attributes.rudderAngle > 0);
        this.rudderTorque.calcTorqueIntensity(this.rudderTotalForce.intensity, Constant.boatLength / 2, clockwise);
    }


    /**
     * Calculate Cv and return it
     * @returns {number}
     */
    getViscousResistanceCoefficient() {
        let reynoldsNumber = (Constant.boatLength * this.state.linearVelocity.intensity * Constant.waterRho) / Constant.waterViscosity;
        return (0.075) / (Math.pow((Math.log10(reynoldsNumber) - 2), 2));
    }

    /**
     * Calculate Rv: Viscous Resistance
     */
    calcViscousResistance() {
        this.viscousResistance.calcForceIntensity(this.getViscousResistanceCoefficient(), Constant.waterRho, this.state.linearVelocity.intensity, Constant.hullArea / 2);
    }

    /**
     * Calculate Cw and return it
     * @returns {number}
     */
    getWaveMakingResistanceCoefficient() {
        let froudeNumber = this.state.linearVelocity.intensity / Math.sqrt(Constant.accelerationOfGravity * Constant.boatLength);
        if (froudeNumber <= 0.4)
            return 0.0025;
        else if (froudeNumber > 0.4 && froudeNumber <= 0.7)
            return 0.0015;
        else
            return 0.0005;
    }

    /**
     * Calculate Rw: Wave Making Resistance
     */
    calcWaveMakingResistance() {
        this.waveMakingResistance.calcForceIntensity(this.getWaveMakingResistanceCoefficient(), Constant.waterRho, this.state.linearVelocity.intensity, Constant.hullArea / 2);
    }

    /**
     * Calculate Ra: Air Resistance
     */
    calcAirResistance() {
        this.airResistance.calcForceIntensity(Constant.airResistanceCoef, Constant.airRho, this.state.linearVelocity.intensity, Constant.hullArea / 2);
    }

    /**
     * Calculate Rt: Total Hull Resistance
     */
    calcTotalHullResistance() {
        this.calcViscousResistance();
        this.calcWaveMakingResistance();
        this.calcAirResistance();
        this.totalHullResistance.intensity = (this.viscousResistance.intensity + this.waveMakingResistance.intensity + this.airResistance.intensity) / 2;
        this.totalHullResistance.angle = this.state.linearVelocity.angle + 180;
    }

    calcHullResistanceTorque() {
        this.hullTorque.calcTorqueIntensity(this.totalHullResistance.intensity, Constant.boatWidth / 2, !this.rudderTorque.clockwise); 
    }

    clacAngleOfRotation() {
        return 2*(this.rudderTorque.intensity - this.hullTorque.intensity) / Constant.inertia;
    }


    getAngleOfAttackInSail() {
        return Math.round(Maths.fix180(this.apparentWind.angle - (Controller.attributes.sailAngle + this.model.zAngle)));
    }

    getAngleOfAttackInKeel() {
        return Math.round(Maths.fix180(this.model.zAngle - this.state.linearVelocity.angle - 180));
    }

    getDirectionForLift(angleOfForce, angle) {
        angleOfForce = Maths.fix(angleOfForce);
        angle = Maths.fix(angle);
        const result = Maths.fix(angle - angleOfForce);

        return !((result <= 90) || (result >= 180 && result <= 270));
    }


    calcFDWind() {
        const cd = Math.abs(Constant.cd[this.getAngleOfAttackInSail()]);
        this.windDragForce.calcForceIntensity(cd, Constant.airRho, this.apparentWind.intensity, Constant.sailArea);
        this.windDragForce.angle = this.apparentWind.angle;
    }

    calcFLWind() {
        const cl = Math.abs(Constant.cl[this.getAngleOfAttackInSail()]);
        this.windLiftForce.calcForceIntensity(cl, Constant.airRho, this.apparentWind.intensity, Constant.sailArea);
        if (this.getDirectionForLift(this.apparentWind.angle, Controller.attributes.sailAngle + this.model.zAngle)) {
            this.windLiftForce.angle = Maths.fix(this.apparentWind.angle + 90);
        } else {
            this.windLiftForce.angle = Maths.fix(this.apparentWind.angle - 90);
        }
    }

    calcFDWater() {
        const cd = Math.abs(Constant.cd[this.getAngleOfAttackInKeel()] / 10);
        this.waterDragForce.calcForceIntensity(cd, Constant.waterRho, this.state.linearVelocity.intensity, Constant.keelArea);
        this.waterDragForce.angle = Maths.fix(this.state.linearVelocity.angle + 180);
    }

    calcFLWater() {
        const cl = Math.abs(Constant.cl[this.getAngleOfAttackInKeel()] / 10);
        this.waterLiftForce.calcForceIntensity(cl, Constant.waterRho, this.state.linearVelocity.intensity, Constant.keelArea);
        if (this.getDirectionForLift(this.state.linearVelocity.angle + 180, this.model.zAngle)) {
            this.waterLiftForce.angle = Maths.fix(this.state.linearVelocity.angle - 90);
        } else {
            this.waterLiftForce.angle = Maths.fix(this.state.linearVelocity.angle + 90);
        }
    }

    calcSegma() {
        this.apparentWind = Force.calcSegma([
            Force.initForceWith(Controller.attributes.windSpeed, Controller.attributes.windAngle),
            Force.initForceWith(this.state.linearVelocity.intensity, Maths.fix(this.state.linearVelocity.angle - 180)),
        ]);
        this.calcFDWater();
        this.calcFLWater();
        this.calcFDWind();
        this.calcFLWind();
        this.calcTotalHullResistance();
        this.calcRudderTorque();
        this.calcHullResistanceTorque();
        this.segmaForces = Force.calcSegma([
            this.waterLiftForce,
            this.waterDragForce,
            this.windLiftForce,
            this.windDragForce,
            this.totalHullResistance
        ]);
    }

    getNewState() {
        this.calcSegma();
        const acc = Force.initForceWith(this.segmaForces.intensity / Constant.boatMass, this.segmaForces.angle)
        this.state.linearVelocity = Force.calcSegma([
            this.state.linearVelocity,
            acc,
        ]);
        this.state.angularVelocity.intensity = this.clacAngleOfRotation();
        return this.state;
    }

}