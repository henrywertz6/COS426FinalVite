import { Group } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { AnimationMixer } from 'three/src/animation/AnimationMixer.js';
import { Clock } from 'three';
// Import land model as a URL using Vite's syntax
import MODEL from './SportyGranny.fbx?url';
import ANIMATION from './HipHopDancing.fbx?url';
import SeedScene from '../scenes/SeedScene';

class Granny extends Group {
    mixer: AnimationMixer;
    clock: Clock;
    constructor(parent: SeedScene) {
        // Call parent Group() constructor
        super();

        const loader = new FBXLoader();

        this.name = 'granny';
        this.mixer = new AnimationMixer();
        this.clock = new Clock();
        parent.addToUpdateList(this);

        loader.load(MODEL, (fbx) => {
            fbx.scale.setScalar(0.01);
            const anim = new FBXLoader();
            this.mixer = new AnimationMixer(fbx);
            anim.load(ANIMATION, (anim) => {
                const idle = this.mixer.clipAction(anim.animations[0]);
                idle.play();
            });
            this.add(fbx);
        });
    }

    update(timeStamp: number): void {
        let delta = this.clock.getDelta();
        this.mixer.update(delta);
    }
}

export default Granny;
