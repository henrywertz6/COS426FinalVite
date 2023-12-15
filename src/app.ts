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

import SeaScene from './scenes/SeaSceneNight.ts';
import {
    handlePointerMove,
    handleCharacterControls,
    handleCollisions,
    handleMouseDown,
} from './js/handlers.ts';

// Initialize core ThreeJS components
const manager = new LoadingManager();
manager.onStart = function () {
    document.getElementById('loading-screen')!.style.display = 'none';
    console.log('loading starting');
};
manager.onLoad = function () {
    document.getElementById('loading-screen')!.style.display = 'none';
    console.log('loading complete');
};
let scene = new SeaScene(manager);
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
window.addEventListener(
    'mousedown',
    (event) => handleMouseDown(event, scene),
    false
);

let currApp = false;

// Define a function for rendering logic
const renderScene = () => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(clock.getDelta());
    handleCharacterControls(scene, pointer, raycaster, camera);
    handleCollisions(scene);
    updateScore(scene.state.score, scene.state.numBait);
    if (scene.state.numBait === 0) {
        endGame(scene.state.score);
    }
};

// Render loop
const onAnimationFrameHandler = () => {
    // raycaster.setFromCamera(pointer, camera);

    if (currApp) {
        // console.log(pointer);
        renderScene();
        window.requestAnimationFrame(onAnimationFrameHandler);
    }

    // if(currApp) {
    //     // console.log(pointer);
    //     controls.update();
    //     renderer.render(scene, camera);
    //     scene.update && scene.update(clock.getDelta());
    //     handleCharacterControls(scene, pointer, raycaster, camera);
    //     handleCollisions(scene);
    //     updateScore(scene.state.score, scene.state.numBait);
    //     if(scene.state.numBait == 0) {
    //         endGame(scene.state.score);
    //     }
    //     window.requestAnimationFrame(onAnimationFrameHandler);
    // }
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Function to reset the render loop
const resetRenderLoop = () => {
    scene = new SeaScene(manager);
    windowResizeHandler();

    onAnimationFrameHandler();
};

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

// switch to end game screen
function endGame(finalScore: number) {
    let score = document.getElementById('score');
    if (score != null) {
        score.textContent = `Total fish caught: ${finalScore}`;
    }

    document.getElementById('app')!.style.display = 'none';
    document.getElementById('end-screen')!.style.display = 'initial';
}

// Update score on screen
function updateScore(newScore: number, newBait: number) {
    const score = newScore;
    let scoreDisplay = document.getElementById('scoreElement');
    if (scoreDisplay != null) {
        scoreDisplay.textContent = `Fish caught: ${score}`;
    }

    const bait = newBait;
    let baitDisplay = document.getElementById('baitCount');
    if (baitDisplay != null) {
        baitDisplay.textContent = `Bait remaining: ${bait}`;
    }
}

// to toggle background music
const music = document.getElementById('background_music') as HTMLInputElement;
// Add an event listener to the checkbox
music!.addEventListener('change', () => {
    // CREATE FUNC IN HANDLER that mutes/enables background music
    // pass through music.checked (true = music)
});
// to toggle background music
const soundFX = document.getElementById('sound_effects') as HTMLInputElement;
// Add an event listener to the checkbox
soundFX!.addEventListener('change', () => {
    // CREATE FUNC IN HANDLER that mutes/enables sound
    // pass through soundFX.checked (true = sound effects)
});

// switch from start to app
document.getElementById('start-button')!.addEventListener('click', () => {
    currApp = true;
    document.getElementById('app')!.style.display = 'initial';
    document.getElementById('start-screen')!.style.display = 'none';
    document.getElementById('end-screen')!.style.display = 'none';
    onAnimationFrameHandler();
});

// switch from app to pause
// FIX TO WHERE animation pauses when the game is paused
document.getElementById('pause-button')!.addEventListener('click', () => {
    currApp = false;
    document.getElementById('app')!.style.display = 'none';
    document.getElementById('pause-screen')!.style.display = 'initial';
});

// switch from pause to app
document.getElementById('resume-button')!.addEventListener('click', () => {
    currApp = true;
    document.getElementById('app')!.style.display = 'initial';
    document.getElementById('pause-screen')!.style.display = 'none';
    onAnimationFrameHandler();
});

// switch from pause to app
document.getElementById('play-again')!.addEventListener('click', () => {
    resetRenderLoop();

    document.getElementById('app')!.style.display = 'initial';
    document.getElementById('start-screen')!.style.display = 'none';
    document.getElementById('end-screen')!.style.display = 'none';
    onAnimationFrameHandler();
});
