import { Group, LoadingManager, Vector2, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

import SeedScene from '../scenes/SeaSceneNight';

// Import flower model as a URL using Vite's syntax
import MODEL from './boat_lowpoly.glb?url';

class Boat extends Group {
    state: {
        gui: dat.GUI;
        spin: () => void;
        twirl: number;
    };
    constructor(parent: SeedScene, loadManager: LoadingManager) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            spin: () => this.spin(), // or this.spin.bind(this)
            twirl: 0,
        };
        // Load object
        const loader = new GLTFLoader(loadManager);

        this.name = 'boat';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);

        this.state.gui.add(this.state, 'spin');
        this.position.y = 2;
        this.position.z = 3;
        this.scale.set(0.01, 0.01, 0.01);
    }
    spin(): void {
        // Add a simple twirl
        this.state.twirl += 6 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }
    update(timeStamp: number): void {
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }

        // TWEEN.update();
    }
}

export default Boat;
