import { Group, AnimationMixer, Clock, LoadingManager } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './fish/scene.gltf?url';

class Fish extends Group {
    state: {
        mixer: AnimationMixer;
        clock: Clock;
    };
    constructor(parent: SeedScene) {
        // Call parent Group() constructor
        super();

        // Init state

        // Load object
        const loader = new GLTFLoader();
        this.state = {
            mixer: new AnimationMixer(),
            clock: new Clock(),
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
        this.position.y = 1;
        this.position.z = 0;
        let scaleFactor = 7;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        this.state.mixer.update(delta);
    }
}

export default Fish;
