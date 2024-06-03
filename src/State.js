import {Force} from "./Force";
import {Torque} from "./Torque";

export class State {

    linearVelocity;
    angularVelocity;

    constructor(lin, ang) {
        this.linearVelocity = lin;
        this.angularVelocity = ang;
    }
    static initState() {
        return new State(Force.initForce(), Force.initForce());
    }
}