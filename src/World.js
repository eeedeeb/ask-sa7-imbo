import {BoatModel} from "./BoatModel";
import {State} from "./State";
import {Controller} from "./Controller";
import {SeaModel} from "./SeaModel";
import {DrawBoat} from "./DrawBoat";
import {Physics} from "./Physics";
import {Projection} from "./Projection";

export class World{

    projection;
    boatModel;
    state;
    seeModel;
    drawBoat;
    phy;
    init(scene){
        Controller.init();
        this.boatModel = BoatModel.initModel();
        this.state = State.initState();
        this.seeModel = new SeaModel();
        this.seeModel.init(scene);
        this.drawBoat = new DrawBoat();
        this.drawBoat.init(scene, this.boatModel);
        this.phy = new Physics();
        this.projection = new Projection();
    }

    run(){
        Controller.update();
        this.seeModel.run(this.boatModel, this.state);
        this.state =  this.phy.setState(this.state, this.boatModel).getNewState();
        this.boatModel = this.projection.setState(this.state, this.boatModel).getModel();
        this.drawBoat.run(this.boatModel);
    }


}