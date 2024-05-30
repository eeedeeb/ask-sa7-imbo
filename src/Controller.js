import {GUI} from "dat.gui";

export class Controller {

    static attributes = {
        windSpeed: 0,
        windAngle: 0,
        sailAngle: 0,
        rudderAngle: 0,
        waves: 0.2,
    }

    static init(){
        const gui = new GUI();
        const wind = gui.addFolder('wind');
        wind.add(this.attributes, 'windSpeed').min(0).max(15).step(0.1).name('Wind Speed');
        wind.add(this.attributes, 'windAngle').min(0).max(360).step(1).name('Wind Angle');
        const boat = gui.addFolder('boat');
        boat.add(this.attributes, 'sailAngle').min(-90).max(90).step(0.2).name('Sail Angle');
        boat.add(this.attributes, 'rudderAngle').min(-30).max(30).step(0.2).name('Rudder Angle');
        const wave = gui.addFolder('wave');
        wave.add(this.attributes, 'waves').min(0).max(1).step(0.01).name('Waves Elevation');
        gui.open();
    }
}