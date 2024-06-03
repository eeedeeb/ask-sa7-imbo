import {GUI} from "dat.gui";
import {Maths} from "./Math";
import {CameraController} from "./CameraController";

export class Controller {

    static attributes = {
        windSpeed: 0,
        windAngle: 0,
        sailAngle: 0,
        rudderAngle: 0,
        waves: 0,
        position: "Third Person",
    }

    static goalAttributes = {
        waves: 0,
        sailAngle: 0,
        rudderAngle: 0,
        windSpeed: 0,
        windAngle: 0,
    }

    static steps = {
        waves: 0.001,
        sailAngle: 1,
        rudderAngle: 1,
        windSpeed: 0.5,
        windAngle: 1,
    }
    static init(){
        const gui = new GUI();
        const wind = gui.addFolder('wind');
        wind.add(this.goalAttributes, 'windSpeed').min(0).max(15).step(0.1).name('Wind Speed');
        wind.add(this.goalAttributes, 'windAngle').min(0).max(360).step(1).name('Wind Angle');
        const boat = gui.addFolder('boat');
        boat.add(this.goalAttributes, 'sailAngle').min(-90).max(90).step(1).name('Sail Angle');
        boat.add(this.goalAttributes, 'rudderAngle').min(-30).max(30).step(1).name('Rudder Angle');
        const wave = gui.addFolder('wave');
        wave.add(this.goalAttributes, 'waves').min(0).max(1).step(0.01).name('Waves Elevation');
        const camera = gui.addFolder('camera');
        camera.add(this.attributes, 'position', ["First Person", "Third Person"]).onChange(function (value){
            CameraController.position = value;
        });
        gui.open();
    }

    static update(){
        this.attributes = {
            windSpeed: this.smooth(this.attributes.windSpeed, this.goalAttributes.windSpeed, this.steps.windSpeed),
            windAngle: this.smooth(this.attributes.windAngle, this.goalAttributes.windAngle, this.steps.windAngle),
            sailAngle: this.smooth(this.attributes.sailAngle, this.goalAttributes.sailAngle, this.steps.sailAngle),
            rudderAngle: this.smooth(this.attributes.rudderAngle, this.goalAttributes.rudderAngle, this.steps.rudderAngle),
            waves: this.smooth(this.attributes.waves, this.goalAttributes.waves, this.steps.waves),
        }
    }
    static smooth(x, needed, step){
        if(x < needed){
            x = Math.min(needed, x + step);
        }else if(x > needed){
            x = Math.max(needed, x - step);
        }
        return x;
    }

}