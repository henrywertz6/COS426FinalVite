import dat from 'dat.gui';
import { Scene, Color, LoadingManager, Box3, Object3D } from 'three';

import BasicLights from '../lights/BasicLights';
import Turtle from '../objects/Turtle';
import Boat from '../objects/Boat';
import Rod from '../objects/Rod';
import Fish from '../objects/Fish';
import Cat from '../objects/Cat';
import Reel from '../objects/Reel';
import Hook from '../objects/Hook';
import GamePlane from '../objects/GamePlane';

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

// Define an object type which describes each object in the update list
type UpdateChild = {
    // Each object *might* contain an update function
    update?: (timeStamp: number) => void;
};

class SeedScene extends Scene {
    // Define the type of the state field
    state: {
        gui: dat.GUI;
        rotationSpeed: number;
        updateList: UpdateChild[];
        spawnFish: () => void;
        fishList: Array<Fish>;
        obstacleList: Array<Turtle>;
        center: number;
        score: number;
        bait: number;
    };

    constructor(loadManager: LoadingManager) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
            spawnFish: () => this.spawnFish(),
            fishList: [],
            obstacleList: [],
            center: 0,
            score: 0,
            bait: 3
        };

        // Set background to a nice color
        this.background = new Color(0x334b66);

        // Add meshes to scene
        const plane = new GamePlane(this);
        const turtle = new Turtle(this, loadManager);
        const boat = new Boat(this, loadManager);
        const rod = new Rod(this, loadManager);
        const cat = new Cat(this, loadManager);
        const reel = new Reel(this);
        const hook = new Hook(this, loadManager);
        const lights = new BasicLights();
        this.add(lights, boat, turtle, rod, cat, hook, plane, reel);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        this.state.gui.add(this.state, 'spawnFish');
    }

    addToUpdateList(object: UpdateChild): void {
        this.state.updateList.push(object);
    }

    removeFromUpdateList(object: UpdateChild): void {
        const index = this.state.updateList.indexOf(object);
        this.state.updateList.splice(index, 1);
    }

    spawnFish(): void {
        // console.log('fish spawned!');
        const fish = new Fish(this);
        this.state.fishList.push(fish);
        this.add(fish);
    }

    spawnTurtle(): void {
        // console.log('turtle spawned!');
        const turtle = new Turtle(this, undefined, true);
        this.state.obstacleList.push(turtle);
        this.add(turtle);
    }
    

    update(timeStamp: number): void {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // randomly generate fish at each time step
        if (random(0, 1000) < 5) {
            this.spawnFish();
        }
        // randomly generate turtles at each time step (less than fish?)
        if (random(0, 1000) < 3) {
            this.spawnTurtle();
        }
        // if fish has passed "out of view", then stop updating + remove from GUI
        for (let fish of this.state.fishList) {
            if (fish.state.active && fish.position.z > this.state.center + 2) {
                fish.state.active = false;
                this.removeFromUpdateList(fish);
                this.remove(fish);
            }
        }

        // if turtle has passed "out of view", then stop updating + remove from GUI
        for (let turtle of this.state.obstacleList) {
            if (turtle.position.z > this.state.center + 2) {
                this.removeFromUpdateList(turtle);
                this.remove(turtle);
            }
        }

        // Call update for each object in the updateList
        for (const obj of updateList) {
            if (obj.update !== undefined) {
                obj.update(timeStamp);
            }
        }
    }
}

export default SeedScene;
