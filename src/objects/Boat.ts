import { Group, LoadingManager, Clock } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './boat_lowpoly.glb?url';

class Boat extends Group {
    state: {
        clock: Clock;
        original_y: number;
        saved: number;
    };
    constructor(parent: SeedScene, loadManager: LoadingManager) {
        // Call parent Group() constructor
        super();
        // Init state
        this.state = {
            clock: new Clock(),
            original_y: 2,
            saved: 0,
        };
        // Load object
        const loader = new GLTFLoader(loadManager);

        this.name = 'boat';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.position.y = 2;
        this.position.z = 3;
        this.scale.set(0.01, 0.01, 0.01);
    }
    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        this.state.saved += delta * 2;
        let sine_offset = Math.sin(this.state.saved)/8;
        this.position.y = this.state.original_y + sine_offset;
        delta = timeStamp;
    }
}

export default Boat;
