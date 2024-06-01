import {Clock} from "three";

export class Projection{
    clock = new Clock();
    last = 0;
    state;
    model;

    setState(state, model){
        this.state = state;
        this.model = model;
        return this;
    }
    getModel() {
        const now = this.clock.getElapsedTime();
        this.model.x += this.state.linearVelocity.projectOnXAxis() / 2 * (now - this.last);
        this.model.y += this.state.linearVelocity.projectOnYAxis() / 2 * (now - this.last);
        this.last = now;
        return this.model;
    }

}