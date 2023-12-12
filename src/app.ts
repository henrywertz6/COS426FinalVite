/**
 * app.ts
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    Clock,
    LoadingManager,
    Raycaster,
    Vector2,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import SeaScene from './scenes/SeaScene';

// Initialize core ThreeJS components
const manager = new LoadingManager();
manager.onStart = function () {
    console.log('loading starting');
};
manager.onLoad = function () {
    console.log('loading complete');
};
const scene = new SeaScene(manager);
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.fov = 45;
camera.position.set(80, 10, 0);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = '0'; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Raycaster setup
const raycaster = new Raycaster();
const pointer = new Vector2();

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp: number) => {
    raycaster.setFromCamera(pointer, camera);
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
const pointerMoveHandler = (event: MouseEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 + 1;
};
window.addEventListener('pointermove', pointerMoveHandler, false);
