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
import {
    handlePointerMove,
    handleCharacterControls,
    handleCollisions,
    handleMouseDown,
} from './js/handlers.ts';

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
const clock = new Clock();

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

// Add renderer to main application screen
const app = document.getElementById('app')!;
app.appendChild(renderer.domElement);

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

window.addEventListener(
    'pointermove',
    (event) => handlePointerMove(event, pointer),
    false
);
window.addEventListener('mousedown', (event) => handleMouseDown(event, scene), false);

// Render loop
const onAnimationFrameHandler = () => {
    // raycaster.setFromCamera(pointer, camera);

    // console.log(pointer);
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(clock.getDelta());
    handleCharacterControls(scene, pointer, raycaster, camera);
    handleCollisions(scene);
    updateScore(scene.state.score, scene.state.bait);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    // find right edge of screen in 3D coordinates
    scene.state.center = visibleWidthAtZDepth(0, camera) / 2;
};

// used from
// https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
const visibleHeightAtZDepth = (depth: number, camera: PerspectiveCamera) => {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.x;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = (camera.fov * Math.PI) / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

const visibleWidthAtZDepth = (depth: number, camera: PerspectiveCamera) => {
    const height = visibleHeightAtZDepth(depth, camera);
    return height * camera.aspect;
};

windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

// Update score on screen
function updateScore(newScore: number, newBait: number) {
    const score = newScore;
    let scoreDisplay = document.getElementById('scoreElement');
    if(scoreDisplay != null) {
        scoreDisplay.textContent = `Fish caught: ${score}`;
    }

    const bait = newBait;
    let baitDisplay = document.getElementById('baitCount');
    if(baitDisplay != null) {
        baitDisplay.textContent = `Bait remaining: ${bait}`;
    }
  }  

  // switch from start to app 
  document.getElementById('start-button')!.addEventListener('click', () => {
    document.getElementById('app')!.style.display = 'initial';
    document.getElementById('start-screen')!.style.display = 'none';
    document.getElementById('end-screen')!.style.display = 'none';
    onAnimationFrameHandler();
});

// switch to end game screen
document.getElementById('end-button')!.addEventListener('click', () => {
    // document.getElementById('app')!.style.display = 'none';
    // document.getElementById('start-screen')!.style.display = 'initial';
    // document.getElementById('end-screen')!.style.display = 'none';
    location.reload();
});