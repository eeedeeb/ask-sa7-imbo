//import boat properities here
import {Maths} from "./Math";
import {Object} from "./Object";
import { Force } from "./Force";
import { Clock, log } from "three";
//____________________________
export class Collision{
    newVx;
    newVy;
    changed;
    boatModel;
    boatState;
    object1;
    object2;
    clock = new Clock();
    last;
    Collision(){
        this.newVx = 0;
        this.newVy = 0;
        this.changed = false;
        this.last = -1;
    }
    setModel(boatModel, boatState){
        this.boatModel = boatModel;
        this.boatState = boatState;
        return this;
    }
    setObjects(object){

        let Vx = this.boatState.linearVelocity.projectOnXAxis();
        let Vy = this.boatState.linearVelocity.projectOnYAxis();
        this.object1 = new Object(500, this.boatModel.x, this.boatModel.y, Vx, Vy);
        console.log(this.object1);
        this.object2 = object;
    }
    //________________________
    //_________________
    collision() {
        // Calculate relative velocities
        let relativeVx = this.object1.vx - this.object2.vx;
        let relativeVy = this.object1.vy - this.object2.vy;
    
        
        // Calculate the normal vector in the direction of the collision
        let dx = this.object1.x - this.object2.x;
        let dy = this.object1.y - this.object2.y;
        let norm = Math.sqrt(dx * dx + dy * dy);
        let nx = dx / norm;
        let ny = dy / norm;

        // Calculate the impulse magnitude
        let impulse = ((this.object1.mass * this.object2.mass) * (relativeVx * nx + relativeVy * ny)) / (this.object1.mass + this.object2.mass);
      
        // Update velocities after the collision
        this.object1.vx += (impulse * nx) / this.object1.mass;
        this.newVx = (impulse * nx) / this.object1.mass;
        this.object1.vy += (impulse * ny) / this.object1.mass;
        this.newVy = (impulse * ny) / this.object1.mass;
        this.object2.vx -= (impulse * nx) / this.object2.mass;
        this.object2.vy -= (impulse * ny) / this.object2.mass;
        //change boat state after collision
        this.boatState.linearVelocity = Force.getFromCoordinate(this.newVx, this.newVy);
        let newAngle = Math.atan(this.newVy, this.newvX);
        this.boatModel.zAngle = Maths.toDeg(newAngle);
        console.log(this.boatModel.zAngle);
    }
    //_____________________________________________
    manualCheck(x, y){
        let first  = (((x-this.boatModel.x)*Maths.cos(this.boatModel.zAngle))*
                      ((x-this.boatModel.x)*Maths.cos(this.boatModel.zAngle)) 
                      +
                      ((y-this.boatModel.y)*Maths.sin(this.boatModel.zAngle))*
                      ((y-this.boatModel.y)*Maths.sin(this.boatModel.zAngle))
                      )/2;
        let second = (((x-this.boatModel.x)*Maths.sin(this.boatModel.zAngle))*
                      ((x-this.boatModel.x)*Maths.sin(this.boatModel.zAngle)) 
                      +
                      ((y-this.boatModel.y)*Maths.cos(this.boatModel.zAngle))*
                      ((y-this.boatModel.y)*Maths.cos(this.boatModel.zAngle))
                      )/16;
        if(first + second <= 1)
            return true;
        else
            return false;
    }
    //_____________________________________________
    static isCollidingRotatedOval(circleCenterX, circleCenterY, ovalCenterX, ovalCenterY, ovalRadiusX, ovalRadiusY, angle) {
        // Convert circle's position relative to the rotated oval's center
        let relativeX = circleCenterX - ovalCenterX;
        let relativeY = circleCenterY - ovalCenterY;
      
        // Apply rotation matrix to transform the point based on the angle
        let cosA = Math.cos(angle * Math.PI / 180);
        let sinA = Math.sin(angle * Math.PI / 180);
        let rotatedX = relativeX * cosA - relativeY * sinA;
        let rotatedY = relativeX * sinA + relativeY * cosA;
      
        // Check if the rotated point is within the ellipse defined by radii
        return (rotatedX * rotatedX) / (ovalRadiusX * ovalRadiusX) + (rotatedY * rotatedY) / (ovalRadiusY * ovalRadiusY) <= 1;
    }
    //_____________________________________________
     checkAndCollide(){

        if(this.clock.getElapsedTime() - this.last < 3) return;
        //define objects.
        let hits = [
            [10000,10,0,0.5,10,10] // [mass, x, y, Radius, Vx, Vy]
            //add more in production
        ]
        //actually start checking
        for (let i = 0; i < hits.length; i++) {
            for(let j = 0;j < 360; j++){
                let newX = hits[i][1] + hits[i][3]*Maths.cos(j);
                let newY = hits[i][2] + hits[i][3]*Maths.sin(j);
                if(this.manualCheck(newX, newY)){
                    console.log("Collision happened")
                    if(this.boatState.linearVeocity != 0)
                        this.last = this.clock.getElapsedTime();
                    console.log(this.last);
                    this.setObjects(new Object(hits[i][0], hits[i][1], hits[i][2], hits[i][4], hits[i][5]));
                    this.collision();
                    break;
                }   
            }
        }
    }
}