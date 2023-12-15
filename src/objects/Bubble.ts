import {
    Group,
    AnimationMixer,
    Clock,
    SphereGeometry,
    Mesh,
    MeshBasicMaterial,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './sphere/scene.gltf?url';

class Bubble extends Group {
    state: {
        sphere: Mesh;
        clock: Clock;
        speed: number;
        active: boolean;
        original_z: number;
    };
    constructor(parent: SeedScene) {
        // Call parent Group() constructor
        super();

        // Init state
        const geometry = new SphereGeometry(0.2, 32, 15);
        const material = new MeshBasicMaterial({
            color: 0xadd8e6,
            opacity: 0.7,
            transparent: true,
        });
        const sphere = new Mesh(geometry, material);
        // sphere.material.opacity = 0.8;
        // sphere.material.transparent = true;

        //scene.add( sphere );
        this.position.z = Math.floor(
            Math.random() * parent.state.center * 2 - parent.state.center
        );
        this.state = {
            sphere: sphere,
            clock: new Clock(),
            speed: 2,
            active: true,
            original_z: this.position.z,
        };
        this.name = 'bubble';

        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.position.y = -parent.state.center;

        this.position.x = Math.floor(-Math.random() * parent.state.center);
        this.add(this.state.sphere);
    }

    update(timeStamp: number): void {
        let delta = this.state.clock.getDelta();
        if (this.state.active) {
            this.translateY(delta * this.state.speed);
            let sine_offset = Math.sin(this.position.y);
            this.position.z = this.state.original_z + sine_offset;
        }
    }
}

export default Bubble;
