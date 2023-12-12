import { Group, LoadingManager } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './fish_hook/scene.gltf?url';

class Hook extends Group {
    constructor(parent: SeedScene, loadManager: LoadingManager) {
        // Call parent Group() constructor
        super();

        // Init state

        // Load object
        const loader = new GLTFLoader(loadManager);

        this.name = 'hook';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.position.y = 5.5;
        this.position.z = 0.17;
        this.rotation.y = -1;
        this.scale.set(0.002, 0.002, 0.002);
    }

    update(timeStamp: number): void {}
}

export default Hook;
