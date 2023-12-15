import { Group, AnimationMixer, Clock, LoadingManager } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './fish/scene.gltf?url';

class Fish extends Group {
    state: {
        mixer: AnimationMixer | undefined;
        clock: Clock;
        speed: number;
        active: boolean;
        escape: boolean;
        directionGoing: string;
    };
    constructor(parent: SeedScene) {
        // Call parent Group() constructor
        super();

        // Init state

        const loader = new GLTFLoader();
        this.state = {
            mixer: undefined,
            clock: new Clock(),
            speed: parent.state.fishSpeed,
            active: true,
            escape: false,
            directionGoing: 'left',
        };
        this.name = 'fish';
        loader.load(MODEL, (gltf) => {
            this.state.mixer = new AnimationMixer(gltf.scene);
            let action = this.state.mixer.clipAction(gltf.animations[0]);
            action.play();
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.position.y = Math.floor(Math.random() * 9) - 8;
        let chooseSide = Math.random();
        if (chooseSide < 0.5) {
            this.state.directionGoing = 'right';
            this.position.z = parent.state.center;
            this.rotateY(Math.PI);
        } else {
            this.position.z = -parent.state.center;
        }

        let scaleFactor = 7;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        if (this.state.active) {
            if (this.state.mixer) {
                this.state.mixer.update(delta);
            }
            this.translateZ(delta * this.state.speed);
            // this.position.y = Math.sin(this.position.z);
        }
    }
}

export default Fish;
