import { Group, LoadingManager } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';
import Fish from '../objects/Fish';

// Import flower model as a URL using Vite's syntax
import MODEL from './fish_hook.glb?url';

class Hook extends Group {
    state: {
        fishHooked: boolean;
        fish: Fish | undefined;
    };
    constructor(parent: SeedScene, loadManager?: LoadingManager) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            fishHooked: false,
            fish: undefined,
        };
        // Load object
        const loader = new GLTFLoader(loadManager);

        this.name = 'hook';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.position.y = 5.5;
        this.position.z = 0;
        this.rotation.y = -1;
        this.scale.set(0.002, 0.002, 0.002);
    }
    changeHook(y: number): void {
        this.position.y = y - 0.4;
    }
    update(timeStamp: number): void {
        timeStamp = timeStamp;
    }
}

export default Hook;
