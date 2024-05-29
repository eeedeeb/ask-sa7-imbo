import {GUI} from "dat.gui";

export class Controller {

    static attributes = {
        windSpeed: 0,
        windAngle: 0,
        sailAngle: 0,
        rudderAngle: 0,
    }

    static init(){
        const gui = new GUI();
        gui.add(this.attributes, 'windSpeed').min(0).max(15).step(0.1).name('Wind Speed');
        gui.add(this.attributes, 'windAngle').min(0).max(360).step(1).name('Wind Angle');
        gui.add(this.attributes, 'sailAngle').min(-90).max(90).step(0.2).name('Sail Angle');
        gui.add(this.attributes, 'rudderAngle').min(-30).max(30).step(0.2).name('Rudder Angle');
        gui.open();
    }
}