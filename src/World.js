import {BoatModel} from "./BoatModel";
import {State} from "./State";
import {Controller} from "./Controller";
import * as THREE from "three";
import {SeaModel} from "./SeaModel";
import {DrawBoat} from "./DrawBoat";

export class World{

    boatModel;
    state;
    seeModel;
    drawBoat;
    init(scene){
        this.boatModel = BoatModel.initModel();
        this.state = State.initState();
        Controller.init();
        this.seeModel = new SeaModel();
        this.seeModel.init(scene);
        this.drawBoat = new DrawBoat();
        this.drawBoat.init(scene, this.boatModel);
    }

    run(){
        this.seeModel.run(this.boatModel);
        this.drawBoat.run(this.boatModel);
    }


}