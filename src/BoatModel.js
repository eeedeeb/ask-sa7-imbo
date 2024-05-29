export class BoatModel {
    x;
    y;
    z;
    verticalAngle;
    horizontalAngle;
    sailAngel;
    rudderAngle;

    static initModel() {
        const boatModel = new BoatModel();

        boatModel.x = 0;
        boatModel.y = 0;
        boatModel.z = 0;
        boatModel.verticalAngle = 0;
        boatModel.horizontalAngle = 0;
        boatModel.sailAngel = 0;
        boatModel.rudderAngle = 0;

        return boatModel;
    }
}