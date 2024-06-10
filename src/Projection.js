import {Clock} from "three";
import { Maths } from "./Math";
import { Controller } from "./Controller";

export class Projection{
    clock = new Clock();
    last = 0;
    state;
    model;
    angle = 0;

    setState(state, model){
        this.state = state;
        this.model = model;
        return this;
    }
    getModel() {
        const now = this.clock.getElapsedTime();
        this.model.z += this.state.linearVelocity.projectOnXAxis() / 2 * (now - this.last);
        this.model.x += this.state.linearVelocity.projectOnYAxis() / 2 * (now - this.last);
        
        this.model.yAngle += Controller.attributes.rudderAngle !== 0?this.state.angularVelocity.intensity * (now-this.last): 0;
        
        this.last = now;
        return this.model;
    }

}