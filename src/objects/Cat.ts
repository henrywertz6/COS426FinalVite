import { Group, AnimationMixer, Clock, LoadingManager } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './toon_cat_free/scene.gltf?url';

class Cat extends Group {
    state: {
        mixer: AnimationMixer;
        clock: Clock;
        speed: number;
        original_y: number;
        saved: number;
    };
    constructor(parent: SeedScene, loadManager: LoadingManager) {
        // Call parent Group() constructor
        super();

        // Init state

        // Load object
        const loader = new GLTFLoader(loadManager);
        this.state = {
            mixer: new AnimationMixer(this),
            clock: new Clock(),
            speed: 2,
            original_y: 0,
            saved: 0,
        };
        this.name = 'cat';
        loader.load(MODEL, (gltf) => {
            this.state.mixer = new AnimationMixer(gltf.scene);
            let action = this.state.mixer.clipAction(gltf.animations[0]);
            action.play();
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        let scaleFactor = 0.005;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);
        parent.addToUpdateList(this);
        this.translateZ(2.5);
        this.translateY(3);
        this.rotateY((3 * Math.PI) / 4);
        this.state.original_y = this.position.y;
    }

    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        this.state.mixer.update(delta / 4);
        this.state.saved += delta * 2;
        let sine_offset = Math.sin(this.state.saved)/8;
        this.position.y = this.state.original_y + sine_offset;
    }
}

export default Cat;
