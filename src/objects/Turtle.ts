import { Group, LoadingManager, Clock } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

import SeedScene from '../scenes/SeaScene';

// Import flower model as a URL using Vite's syntax
import MODEL from './cool_turtle/scene.gltf?url';

class Turtle extends Group {
    state: {
        spin: () => void;
        twirl: number;
        clock: Clock;
        speed: number;
        obstacle?: boolean;
        active: boolean;
        original_y: number;
        saved: number;
    };
    constructor(
        parent: SeedScene,
        loadManager?: LoadingManager,
        isObstacle?: boolean
    ) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            spin: () => this.spin(), // or this.spin.bind(this)
            twirl: 0,
            clock: new Clock(),
            speed: 2,
            obstacle: isObstacle,
            active: true,
            original_y: 2,
            saved: 0,
        };
        // Load object
        const loader = new GLTFLoader(loadManager);

        this.name = 'turtle';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        if (isObstacle) {
            // Add self to parent's update list
            parent.addToUpdateList(this);
            this.position.y = Math.floor(Math.random() * 9) - 8;
            this.position.z = -parent.state.center;
        } else {
            // Add self to parent's update list
            parent.addToUpdateList(this);
            this.translateZ(4);
            this.translateY(3.3);
            this.translateX(0.6);
            this.rotateY(Math.PI / 2);
        }
        this.state.original_y = this.position.y;
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
        let delta = this.state.clock.getDelta();
        this.state.saved += delta * 2;
        let sine_offset = Math.sin(this.state.saved)/8;
        this.position.y = this.state.original_y + sine_offset;
        delta = timeStamp;
    }
}

export default Turtle;
