import { Group, Clock, LoadingManager, Mesh, MeshStandardMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';

// Import earthworm model as a URL using Vite's syntax
import MODEL from './low_poly_earthworm/scene.gltf?url';

class Bait extends Group {
    state: {
        clock: Clock;
        speed: number;
        active: boolean;
    };
    constructor(parent: SeedScene, loadManager: LoadingManager) {
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
        this.name = 'bait';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        this.traverse(function (child) {
            if (child instanceof Mesh) {
                if (child.material instanceof MeshStandardMaterial) {
                    // Use 'as MeshStandardMaterial' to assert the type
                    const material = child.material as THREE.MeshStandardMaterial;
                    material.color.setHex(0xFFC0CB); // Set your desired color
                }
            }
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.position.y = 5.5;
        this.position.z = 0;
        this.rotation.y = -1;
        this.scale.set(0.06, 0.06, 0.06);
    }
    changeBait(y: number): void {
        this.position.y = y - 0.6;
    }
    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();

        if (!this.state.active) {
            this.translateY(-delta * this.state.speed); // Adjust the speed and direction by modifying the coefficient (2 in this case)
            this.position.z = (Math.sin(this.position.y)); 
        } 
    }
}

export default Bait;