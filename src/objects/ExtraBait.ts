import { Group, Clock, LoadingManager } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';

// Import earthworm model as a URL using Vite's syntax
import MODEL from './worm2/worm2.gltf?url';

class ExtraBait extends Group {
    state: {
        clock: Clock;
        speed: number;
        active: boolean;
    };
    constructor(parent: SeedScene, loadManager?: LoadingManager) {
        // Call parent Group() constructor
        super();

        // Init state

        // Load object
        const loader = new GLTFLoader(loadManager);
        this.state = {
            clock: new Clock(),
            speed: 2,
            active: true,
        };
        this.name = 'extrabait';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.position.y = Math.floor(Math.random() * 9) - 8;
        this.position.z = -parent.state.center;
        this.scale.set(0.08, 0.08, 0.08);
    }

    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        this.translateZ(delta * this.state.speed);
        this.position.y = 0.5 * Math.sin(0.25 * this.position.z) - 3;
        delta = timeStamp;
    }
}

export default ExtraBait;
