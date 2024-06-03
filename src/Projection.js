import {Clock} from "three";
import { Maths } from "./Math";

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
        // const delta = now - this.last;
        // this.angle += this.state.angularVelocity.intensity * delta;
        //  const velocityX = this.state.linearVelocity.intensity * Maths.cos(this.angle);
        //  const velocityY = this.state.linearVelocity.intensity * Maths.sin(this.angle);
        //console.log(this.state.angularVelocity.intensity);
        this.model.x += this.state.linearVelocity.projectOnXAxis() / 2 * (now - this.last);
        this.model.y += this.state.linearVelocity.projectOnYAxis() / 2 * (now - this.last);
        
        this.model.zAngle += this.state.angularVelocity.intensity;
        //this.state.linearVelocity.angle += this.state.angularVelocity.intensity;
        this.last = now;
        return this.model;
    }

}