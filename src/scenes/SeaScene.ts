import dat from 'dat.gui';
import {
    Scene,
    Color,
    LoadingManager,
    Audio,
    AudioListener,
    AudioLoader,
} from 'three';

import BasicLights from '../lights/BasicLights';
import Turtle from '../objects/Turtle';
import Boat from '../objects/Boat';
import Rod from '../objects/Rod';
import Fish from '../objects/Fish';
import Cat from '../objects/Cat';
import Reel from '../objects/Reel';
import Hook from '../objects/Hook';
import Bait from '../objects/Bait';
import GamePlane from '../objects/GamePlane';
// import Wave from '../objects/Wave';
import Shark from '../objects/Shark';
import Jellyfish from '../objects/Jellyfish';
import Blowfish from '../objects/Blowfish';

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
        sharkList: Array<Shark>;
        jellyList: Array<Jellyfish>;
        blowList: Array<Blowfish>;
        center: number;
        score: number;
        numBait: number;
        fishSpeed: number;
        hasBait: boolean;
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
            sharkList: [],
            jellyList: [],
            blowList: [],
            center: 0,
            score: 0,
            numBait: 3,
            fishSpeed: 2,
            hasBait: true,
        };

        // Set background to a nice color
        if (this.state.timeOfDay == 'night') {
            this.background = new Color(0x060a1c);
        }

        // Add meshes to scene
        const plane = new GamePlane(this);
        // const wave = new Wave(this, loadManager);
        const turtle = new Turtle(this, loadManager);
        const boat = new Boat(this, loadManager);
        const rod = new Rod(this, loadManager);
        const cat = new Cat(this, loadManager);
        const reel = new Reel(this);
        const hook = new Hook(this, loadManager);
        const bait = new Bait(this, loadManager);
        const lights = new BasicLights();
        this.add(lights, boat, turtle, rod, cat, hook, plane, reel, bait);

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

    spawnJelly(): void {
        // console.log('turtle spawned!');
        const jellyfish = new Jellyfish(this, undefined);
        this.state.jellyList.push(jellyfish);
        this.add(jellyfish);
    }

    spawnShark(): void {
        const shark = new Shark(this);
        this.state.sharkList.push(shark);
        this.add(shark);
    }

    spawnBlowfish(): void {
        // console.log('fish spawned!');
        const blow = new Blowfish(this);
        this.state.blowList.push(blow);
        this.add(blow);
    }

    spawnBait(): void {
        let oldBait = this.getObjectByName('bait');
        if (oldBait != null) {
            this.remove(oldBait);
        }
        this.state.hasBait = true;
        let newBait = new Bait(this, undefined);
        let hook = this.getObjectByName('hook');
        let newPos = hook?.position;
        if (newPos != null) {
            newBait.position.set(newPos.x, newPos?.y - 0.2, newPos.z);
        }
        this.add(newBait);
    }

    update(timeStamp: number): void {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        this.updateSpawners(timeStamp);

        // randomly generate fish at each time step
        // let randomNum = random(0, 1500);
        // if (randomNum < 8) {
        //     this.spawnFish();
        // } else if (randomNum < 10 && this.state.sharkList.length < 1) {
        //     this.spawnShark();
        // } else if (randomNum < 12 && this.state.blowList.length < 3) {
        //     this.spawnBlowfish();
        // }
        // // generate more jellyfish as the player's score gets higher?
        // else if (randomNum < 13 * (1 + this.state.score / 150)) {
        //     this.spawnJelly();
        // }

        // REMOVE THINGS OFF SCREEN
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
            if (
                turtle.state.active &&
                turtle.position.z > this.state.center + 2
            ) {
                turtle.state.active = false;
                this.removeFromUpdateList(turtle);
                this.remove(turtle);
            }
        }
        // if shark has passed "out of view", then stop updating + remove from GUI
        for (let shark of this.state.sharkList) {
            if (shark.position.z > this.state.center + 2) {
                let index = this.state.sharkList.indexOf(shark);
                this.state.sharkList.splice(index, 1);
                this.removeFromUpdateList(shark);
                this.remove(shark);
            }
        }
        // if jellyfish has passed "out of view", then stop updating + remove from GUI
        for (let jelly of this.state.jellyList) {
            if (jelly.position.z > this.state.center + 2) {
                let index = this.state.jellyList.indexOf(jelly);
                this.state.jellyList.splice(index, 1);
                this.removeFromUpdateList(jelly);
                this.remove(jelly);
            }
        }
        // if blowfish has passed "out of view", then stop updating + remove from GUI
        for (let blow of this.state.blowList) {
            if (blow.position.z > this.state.center + 2) {
                let index = this.state.blowList.indexOf(blow);
                this.state.blowList.splice(index, 1);
                this.removeFromUpdateList(blow);
                this.remove(blow);
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
