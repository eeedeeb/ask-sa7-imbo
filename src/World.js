import {BoatModel} from "./BoatModel";
import {State} from "./State";
import {Controller} from "./Controller";
import * as THREE from "three";
import {SeaModel} from "./SeaModel";

export class World{

    boatModel;
    state;
    seeModel;
    init(scene){
        this.boatModel = BoatModel.initModel();
        this.state = State.initState();
        Controller.init();
        //testing cube
        this.seeModel = new SeaModel();
        this.seeModel.init(scene);

    }

    run(){
        this.seeModel.run();
    }


}