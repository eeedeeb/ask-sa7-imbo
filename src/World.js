import {BoatModel} from "./BoatModel";
import {State} from "./State";
import {Controller} from "./Controller";
import * as THREE from "three";
import {SeaModel} from "./SeaModel";
import {DrawBoat} from "./DrawBoat";
import {Physics} from "./Physics";
import {Clock} from "three";

export class World{

    clock = new Clock();
    last = 0;
    boatModel;
    state;
    seeModel;
    drawBoat;
    phy;
    init(scene){
        this.boatModel = BoatModel.initModel();
        this.state = State.initState();
        Controller.init();
        this.seeModel = new SeaModel();
        this.seeModel.init(scene);
        this.drawBoat = new DrawBoat();
        this.drawBoat.init(scene, this.boatModel);
        this.phy = new Physics();
        this.phy.init(scene);
    }

    run(){
        const now = this.clock.getElapsedTime();
        this.seeModel.run(this.boatModel);
        this.drawBoat.run(this.boatModel);
        this.phy.setState(this.state, this.boatModel);
        this.state = this.phy.getNewState();
        this.boatModel.x += this.state.linearVelocity.projectOnXAxis(0) / 2 * (now - this.last);
        this.boatModel.y += this.state.linearVelocity.projectOnYAxis(0) / 2 * (now - this.last);
        this.last = now;
    }


}