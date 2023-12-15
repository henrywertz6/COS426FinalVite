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
        approach: boolean;
    };
    constructor(parent: SeedScene, loadManager?: LoadingManager) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            clock: new Clock(),
            speed: 10,
            active: true,
            approach: true,
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
        this.position.z = parent.state.center * 6;
        this.position.x = -65;
        this.position.y = -40;
        this.rotateY(Math.PI);
    }

    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        this.translateZ(delta * this.state.speed);
        if (this.state.approach == true) {
            this.position.y = 0.5 * Math.sin(0.25 * this.position.z) - 16;
        } else {
            this.position.y = 0.5 * Math.sin(0.25 * this.position.z) - 3;
        }
        delta = timeStamp;
    }
}

export default Shark;
