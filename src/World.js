import {BoatModel} from "./BoatModel";
import {State} from "./State";
import {Controller} from "./Controller";
import {SeaModel} from "./SeaModel";
import {DrawBoat} from "./DrawBoat";
import {Physics} from "./Physics";
import {Projection} from "./Projection";
import {Collision} from "./Collision" //shadi

export class World{

    projection;
    boatModel;
    state;
    seeModel;
    drawBoat;
    phy;
    collision; //shadi
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
	this.collision = new Collision(); //shadi
    }

    run(){
        Controller.update();
        this.seeModel.run(this.boatModel, this.state);
        this.state =  this.phy.setState(this.state, this.boatModel).getNewState();
        this.boatModel = this.projection.setState(this.state, this.boatModel).getModel();
        this.drawBoat.run(this.boatModel);
	this.collision.setModel(this.boatModel, this.state).checkAndCollide(); //shadi
    }


}