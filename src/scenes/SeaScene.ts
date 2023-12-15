import { Scene, Color, LoadingManager, FogExp2 } from 'three';

import BasicLightsNight from '../lights/BasicLightsNight';
import BasicLights from '../lights/BasicLights';
import Turtle from '../objects/Turtle';
import Boat from '../objects/Boat';
import Rod from '../objects/Rod';
import Bubble from '../objects/Bubble';
import Fish from '../objects/Fish';
import Cat from '../objects/Cat';
import Cloud from '../objects/Cloud';
import Reel from '../objects/Reel';
import Hook from '../objects/Hook';
import Bait from '../objects/Bait';
import GamePlane from '../objects/GamePlane';
import Sky from '../objects/Sky';
import Ocean from '../objects/Ocean';
import Shark from '../objects/Shark';
import Jellyfish from '../objects/Jellyfish';
import Blowfish from '../objects/Blowfish';
import SwimTurtle from '../objects/SwimTurtle';
import ExtraBait from '../objects/ExtraBait';

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
        rotationSpeed: number;
        updateList: UpdateChild[];
        spawnFish: () => void;
        bubbleList: Array<Bubble>;
        fishList: Array<Fish>;
        obstacleList: Array<SwimTurtle>;
        cloudList: Array<Cloud>;
        sharkList: Array<Shark>;
        jellyList: Array<Jellyfish>;
        blowList: Array<Blowfish>;
        bonusBait: Array<ExtraBait>;
        center: number;
        score: number;
        numBait: number;
        fishSpeed: number;
        hasBait: boolean;
        stage: number;
        elapsedTime: number;
        spawnIntervals: { [key: string]: number };
        spawnTimers: { [key: string]: number };
        timeOfDay: string;
        spawnSet: Set<string>;
    };

    constructor(loadManager: LoadingManager, mode: string) {
        // Call parent Scene() constructor
        super();
        // Init state
        this.state = {
            rotationSpeed: 0,
            updateList: [],
            spawnFish: () => this.spawnFish(),
            bubbleList: [],
            fishList: [],
            obstacleList: [],
            cloudList: [],
            sharkList: [],
            jellyList: [],
            blowList: [],
            bonusBait: [],
            center: 0,
            score: 0,
            numBait: 3,
            fishSpeed: 4,
            hasBait: true,
            stage: 0,
            elapsedTime: 0,
            spawnIntervals: {
                fish: 3,
                pufferfish: 5.5,
                shark: 18,
                jellyfish: 4,
                turtle: 6,
                bait: 15,
            },
            spawnTimers: {
                fish: 0,
                pufferfish: 0,
                shark: 0,
                jellyfish: 0,
                turtle: 0,
                bubble: 0,
                bait: 0,
            },
            timeOfDay: mode,
            spawnSet: new Set(),
        };
        this.state.spawnSet.add('fish');
        let lights = new BasicLights();
        // Set background to a nice color
        if (this.state.timeOfDay == 'night') {
            this.background = new Color(0x060a1c);
            lights = new BasicLightsNight();
        } else {
            this.background = new Color(0x0059b3);
        }
        this.fog = new FogExp2(0x161e57, 0.01);
        // Add meshes to scene
        const plane = new GamePlane();
        const ocean = new Ocean(this.state.timeOfDay != 'night');
        const sky = new Sky(this.state.timeOfDay != 'night');
        const turtle = new Turtle(this, loadManager);
        const boat = new Boat(this, loadManager);
        const rod = new Rod(this, loadManager);
        const cat = new Cat(this, loadManager);
        const reel = new Reel(this);
        const hook = new Hook(this, loadManager);
        const bait = new Bait(this, loadManager);
        this.add(
            lights,
            boat,
            turtle,
            rod,
            cat,
            hook,
            plane,
            reel,
            bait,
            ocean,
            sky
        );
    }

    addToUpdateList(object: UpdateChild): void {
        this.state.updateList.push(object);
    }

    removeFromUpdateList(object: UpdateChild): void {
        const index = this.state.updateList.indexOf(object);
        this.state.updateList.splice(index, 1);
    }
    spawnCloud(): void {
        const cloud = new Cloud(this);
        this.state.cloudList.push(cloud);
        this.add(cloud);
    }

    spawnBubble(): void {
        const bubble = new Bubble(this);
        this.state.bubbleList.push(bubble);
        this.add(bubble);
    }

    spawnFish(): void {
        // console.log('fish spawned!');
        const fish = new Fish(this);
        this.state.fishList.push(fish);
        this.add(fish);
    }

    spawnTurtle(): void {
        // console.log('turtle spawned!');
        const turtle = new SwimTurtle(this, undefined);
        this.state.obstacleList.push(turtle);
        this.add(turtle);
    }

    spawnJelly(): void {
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

    spawnBonusBait(): void {
        const bait = new ExtraBait(this);
        this.state.bonusBait.push(bait);
        this.add(bait);
    }

    updateSpawners(deltaTime: number): void {
        this.state.elapsedTime += deltaTime;

        if (this.state.elapsedTime >= this.getStageDuration()) {
            this.advanceToNextStage();
        }
        for (const objectType of this.state.spawnSet) {
            if (
                this.state.spawnTimers[objectType] >=
                this.state.spawnIntervals[objectType]
            ) {
                this.spawnObject(objectType);
                this.state.spawnTimers[objectType] = 0;
            } else {
                this.state.spawnTimers[objectType] += deltaTime;
            }
        }
    }

    getStageDuration(): number {
        switch (this.state.stage) {
            case 0:
                return 10;
            case 1:
                return 15;
            case 2:
                return 20;
            case 3:
                return 20;
            case 4:
                return 20;
            case 5:
                return 20;
            default:
                return 0;
        }
    }
    spawnObject(objectType: string): void {
        if (objectType == 'fish') {
            this.spawnFish();
        } else if (objectType == 'pufferfish') {
            this.spawnBlowfish();
        } else if (objectType == 'jellyfish') {
            this.spawnJelly();
        } else if (objectType == 'shark') {
            this.spawnShark();
        } else if (objectType == 'turtle') {
            this.spawnTurtle();
        } else if (objectType == 'bonusbait') {
            this.spawnBonusBait();
        }
    }
    advanceToNextStage() {
        this.state.stage++;
        this.state.elapsedTime = 0;

        switch (this.state.stage) {
            case 1:
                this.state.spawnSet.add('pufferfish');
                this.state.spawnIntervals['fish'] = 3;
                break;
            case 2:
                this.state.spawnSet.delete('pufferfish');
                this.state.spawnSet.add('shark');
                this.state.spawnIntervals['fish'] = 2;
                break;
            case 3:
                this.state.spawnSet.delete('shark');
                this.state.spawnSet.add('turtle');
                this.state.spawnSet.add('jellyfish');
                break;
            case 4:
                this.state.fishSpeed = 8;
                this.state.spawnSet.add('bonusbait');
                this.state.spawnSet.add('pufferfish');
                this.state.spawnSet.add('shark');
                break;
        }
    }
    update(timeStamp: number): void {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;
        this.updateSpawners(timeStamp);
        // randomly generate fish at each time step
        let randomNum = random(0, 1500);
        if (randomNum < 8) {
            this.spawnBubble();
            this.spawnCloud();
        }

        // REMOVE THINGS OFF SCREEN
        // if bubble is out of view
        for (let bubble of this.state.bubbleList) {
            if (bubble.state.active && bubble.position.y > 2.2) {
                bubble.state.active = false;
                this.removeFromUpdateList(bubble);
                this.remove(bubble);
            }
        }

        // if cloud is out of view
        for (let cloud of this.state.cloudList) {
            if (
                cloud.state.active &&
                cloud.position.z < -this.state.center - 10
            ) {
                cloud.state.active = false;
                this.removeFromUpdateList(cloud);
                this.remove(cloud);
            }
        }
        // if fish has passed "out of view", then stop updating + remove from GUI
        for (let fish of this.state.fishList) {
            if (fish.state.directionGoing == 'left') {
                if (
                    fish.state.active &&
                    fish.position.z > this.state.center + 2
                ) {
                    fish.state.active = false;
                    this.removeFromUpdateList(fish);
                    this.remove(fish);
                }
            } else {
                if (
                    fish.state.active &&
                    fish.position.z < -this.state.center - 2
                ) {
                    fish.state.active = false;
                    this.removeFromUpdateList(fish);
                    this.remove(fish);
                }
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
            if (!shark.state.approach) {
                if (shark.position.z > this.state.center + 8) {
                    let index = this.state.sharkList.indexOf(shark);
                    this.state.sharkList.splice(index, 1);
                    this.removeFromUpdateList(shark);
                    this.remove(shark);
                }
            } else {
                if (shark.position.z < -this.state.center * 6 - 12) {
                    shark.position.x = 0;
                    shark.position.y = Math.floor(Math.random() * 9) - 8;
                    shark.state.speed = 7;
                    shark.rotateY(Math.PI);
                    shark.state.approach = false;
                }
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
        // if extra bait has passed "out of view", then stop updating + remove from GUI
        for (let extraBait of this.state.bonusBait) {
            if (extraBait.position.z > this.state.center + 2) {
                let index = this.state.bonusBait.indexOf(extraBait);
                this.state.bonusBait.splice(index, 1);
                this.removeFromUpdateList(extraBait);
                this.remove(extraBait);
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
