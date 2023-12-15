import { Group, LoadingManager, Clock } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './clouds/scene.gltf?url';

class Cloud extends Group {
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
            speed: 1,
            active: true,
        };
        // Load object
        const loader = new GLTFLoader(loadManager);

        this.name = 'cloud';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        // Add self to parent's update list
        this.scale.set(0.005, 0.005, 0.005);
        parent.addToUpdateList(this);
        this.position.z = parent.state.center * 1.8;
        this.position.y = 5 + Math.floor(Math.random() * 6);
        this.position.x = -3 - Math.floor(Math.random() * 6);
    }

    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        this.translateZ(-delta * this.state.speed);
    }
}

export default Cloud;
