import { Group, LoadingManager, Clock } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './low_poly_shark/scene.gltf?url';

class Shark extends Group {
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
            speed: 1.5,
            active: true,
        };
        // Load object
        const loader = new GLTFLoader(loadManager);

        this.name = 'shark';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        // shark big and scary
        this.scale.set(3, 3, 3);
        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.position.z = -parent.state.center * 1.2;
        this.position.y = Math.floor(Math.random() * 9) - 8;
    }

    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        this.translateZ(delta * this.state.speed);
    }
}

export default Shark;
