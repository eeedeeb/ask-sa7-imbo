import {Force} from "./Force";
import {Torque} from "./Torque";

export class State {

    linearVelocity;
    angularVelocity;

    constructor(linearVelocity, angularVelocity) {
        this.linearVelocity = linearVelocity;
        this.angularVelocity = angularVelocity;
    }

    static initState() {
        return new State(Force.initForce(), Torque.initTorque());
    }
}