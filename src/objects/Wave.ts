// import { Group, AnimationMixer, Clock, LoadingManager } from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import SeedScene from '../scenes/SeaScene';

// // Import flower model as a URL using Vite's syntax
// import MODEL from './ocean_wave_sim/scene.gltf?url'

// class Wave extends Group {
//     state: {
//         gui: dat.GUI;
//         mixer: AnimationMixer;
//         clock: Clock;
//         speed: number;
//     };
//     constructor(parent: SeedScene, loadManager: LoadingManager) {
//         // Call parent Group() constructor
//         super();

//         // Init state
//         this.state = {
//             gui: parent.state.gui,
//             mixer: new AnimationMixer(this),
//             clock: new Clock(),
//             speed: 2,
//         };
//         // Load object
//         const loader = new GLTFLoader(loadManager);

//         this.name = 'wave';
//         loader.load(MODEL, (gltf) => {
//             this.state.mixer = new AnimationMixer(gltf.scene);
//             let action = this.state.mixer.clipAction(gltf.animations[0]);
//             action.play();
//             this.add(gltf.scene);
//         });

//         // Add self to parent's update list
//         parent.addToUpdateList(this);

//         this.position.y = 2;
//         this.position.z = 0;
//         this.position.x = -10;
//         this.scale.set(0.5, 0.5, 0.5);
//     }
//     update(timeStamp: number): void {
//         let delta = this.state.clock.getDelta();
//         this.state.mixer.update(delta / 4);
//     }
// }

// export default Wave;
