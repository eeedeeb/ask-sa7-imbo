import { BoatModel } from "./BoatModel";
import { ConeModel } from "./ConeModel";
import { Constant } from "./Constant";
import { State } from "./State";
import { Controller } from "./Controller";
import { SeaModel } from "./SeaModel";
import { DrawBoat } from "./DrawBoat";
import { DrawCone } from "./DrawCone";
import { Physics } from "./Physics";
import { Projection } from "./Projection";
import { Collision } from "./Collision"; //shadi

export class World {
	projection;
	boatModel;
	state;
	seeModel;
	drawBoat;
	coneModel;
	drawCone;
	drawConeList = [];
	coneModelList = [];
	phy;
	collision; //shadi
	init(scene) {
		Controller.init();
		this.boatModel = BoatModel.initModel();
		// this.coneModel = ConeModel.initModel();
		this.state = State.initState();
		this.seeModel = new SeaModel();
		this.seeModel.init(scene);
		this.drawBoat = new DrawBoat();

		this.drawBoat.init(scene, this.boatModel);
		for (let index = 0; index < Constant.conePos.length; index++) {
			this.coneModelList[index] = ConeModel.initModel();
			this.drawConeList[index] = new DrawCone();
			this.drawConeList[index].init(
				scene,
				this.coneModelList[index],
				Constant.conePos[index].x,
				Constant.conePos[index].z
			);

			// this.coneModelList[index] = this.coneModel;
			// this.drawConeList[index] = drawCone;
			// this.drawConeList[index].init(scene, Constant.conePos[index].x,Constant.conePos[index].z);
		}
		// this.drawCone.init(scene, this.coneModel);
		this.phy = new Physics();
		this.projection = new Projection();
		this.collision = new Collision(); //shadi
	}

	run() {
		Controller.update();
		this.seeModel.run(this.boatModel, this.state, this.coneModelList);
		// this.seeModel.run(this.coneModel, this.state);
		this.state = this.phy.setState(this.state, this.boatModel).getNewState();
		this.boatModel = this.projection
			.setState(this.state, this.boatModel)
			.getModel();
		// this.coneModel = this.projection
		// 	.setState(this.state, this.coneModel)
		// 	.getModel();
		this.drawBoat.run(this.boatModel);
        for (let index = 0; index < Constant.conePos.length; index++) {
            // const element = array[index];
            
            this.drawConeList[index].run(this.coneModelList[index]);
        }
		this.collision.setModel(this.boatModel, this.state).checkAndCollide(); //shadi
	}
}
