import { Group, LoadingManager } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './fishing_rod/scene.gltf?url';

class Rod extends Group {
    constructor(parent: SeedScene, loadManager: LoadingManager) {
        // Call parent Group() constructor
        super();

        // Init state

        // Load object
        const loader = new GLTFLoader(loadManager);

        this.name = 'rod';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.position.y = 3;
        this.position.z = 2;
        this.rotation.x = -0.62;
        this.scale.set(0.01, 0.01, 0.01);
    }

    update(timeStamp: number): void {}
}

export default Rod;
