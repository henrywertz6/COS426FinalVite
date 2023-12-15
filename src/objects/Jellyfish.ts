import { Group, LoadingManager, Clock } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './simple_jellyfish/scene.gltf?url';

class Jellyfish extends Group {
    state: {
        clock: Clock;
        speed: number;
        active: boolean;
    };
    constructor(parent: SeedScene, loadManager?: LoadingManager) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            clock: new Clock(),
            speed: 3,
            active: true,
        };
        // Load object
        const loader = new GLTFLoader(loadManager);

        this.name = 'jellyfish';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        // Add self to parent's update list
        this.scale.set(0.005, 0.005, 0.005);
        parent.addToUpdateList(this);
        this.position.z = -parent.state.center * 1.2;
        this.position.y = Math.floor(Math.random() * 8) - 7;
    }

    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        this.translateZ(delta * this.state.speed);
        delta = timeStamp;
    }
}

export default Jellyfish;
