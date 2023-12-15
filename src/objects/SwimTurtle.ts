import { Group, LoadingManager, Clock } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './swim_turtle/scene.gltf?url';

class SwimTurtle extends Group {
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
            speed: 2,
            active: true,
        };
        // Load object
        const loader = new GLTFLoader(loadManager);

        this.name = 'swim_turtle';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        this.scale.set(3.5, 3.5, 3.5);
        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.position.y = Math.floor(Math.random() * 8) - 7;
        this.position.z = -parent.state.center * 1.4;
    }
    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        this.translateZ(delta * this.state.speed);
        delta = timeStamp;
    }
}

export default SwimTurtle;
