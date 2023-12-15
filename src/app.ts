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
    AudioListener,
    AudioLoader,
    Audio
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
    document.getElementById('loading-screen')!.style.display = 'flexx';
    console.log('loading starting');
};
manager.onLoad = function () {
    document.getElementById('loading-screen')!.style.display = 'none';
    console.log('loading complete');
};
const camera = new PerspectiveCamera();
let mode = 'light';
let scene = new SeaScene(manager, mode);
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
window.addEventListener('mousedown', (event) => handleMouseDown(event, scene, sounds, playSound), false);

// --------RENDERING -----------------------------------------
let currApp = false;
// rendering loop (outside so we can pause it)
const renderScene = () => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(clock.getDelta());
    handleCharacterControls(scene, pointer, raycaster, camera);
    handleCollisions(scene, sounds, playSound);
    updateScore(scene.state.score, scene.state.numBait);
    if (scene.state.numBait === 0) {
        endGame(scene.state.score);
    }
};
// Render loop
const onAnimationFrameHandler = () => {
    if (currApp) {
        // console.log(pointer);
        renderScene();
        window.requestAnimationFrame(onAnimationFrameHandler);
    }
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Function to reset the render loop
const resetRenderLoop = (mode: string) => {
    scene = new SeaScene(manager, mode);
    windowResizeHandler();
    
    onAnimationFrameHandler();
};

// --------RESIZING -----------------------------------------

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


// --------IN GAME -----------------------------------------

// switch to end game screen
function endGame(finalScore: number) {
    let message = document.getElementById('gameMessage');
    if(message != null) {
        if(finalScore < 10) {
            message.textContent = `Just a small fish in a big ocean. Keep fishing!`;
        }
        else if(finalScore < 20) {
            message.textContent = `Reel it in, cat angler! You're on the prowl.`;
        }
        else if(finalScore < 30) {
            message.textContent = `Cat-tastic! The ocean applauds.`;
        }
        else if(finalScore < 40) {
            message.textContent = `Pawsitively great! Keep swimming upstream.`;  
        }
        else if(finalScore < 50) {
            message.textContent = `Fin-tastic performance! You're casting a purr-fect line.`;
        }
        else if(finalScore < 60) {
            message.textContent = `Fur-bulous fishing! You're mastering the currents.`;
        }
        else if(finalScore < 70) {
            message.textContent = `Masterful meow-mentum! You're reeling in victories.`;
        }
        else if(finalScore < 80) {
            message.textContent = `Legendary fisher-cat! You're ruling the deep blue.`;
        }
        else if(finalScore < 90) {
            message.textContent = `Fishing purr-fection! The ocean bows to your feline prowess.`;
        }
        else if(finalScore < 100) {
            message.textContent = `Whiskers of the deep! You're a true sea-faring champion.`;
        }
        else {
            message.textContent = `Beyond the nine lives! You've surpassed even the most daring fish feats.`;
        }
    }

    let score = document.getElementById('score');
    if(score != null) {
        score.textContent = `Total fish caught: ${finalScore}`;
    }
    backgroundMusic.stop();
    document.getElementById('app')!.style.display = 'none';
    document.getElementById('end-screen')!.style.display = 'initial';
}

// restock bait! 
  document.getElementById('bait-button')!.addEventListener('click', () => {
    if(playSound){
        sounds['refillBait'].play();
    }
    scene.spawnBait();
});

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

    let hasBait = scene.state.hasBait;
    let baitButton = document.getElementById('bait-button');
    if(baitButton != null) {
    if(!hasBait) {
            baitButton.style.display = 'block';
        }
    else {
        baitButton.style.display = 'none';
    }
    }
  }  
  
// -------------- AUDIO ------------------------
// globals vars for sound
const sounds: { [key: string]: Audio } = {};
let backgroundMusic : Audio;
let playSound = true;

    // to toggle background music
    const music = document.getElementById('background_music') as HTMLInputElement;
    // Add an event listener to the checkbox
    music!.addEventListener('change', () => {
        if(music.checked) {
            backgroundMusic.play();
        }
        else {
            backgroundMusic.stop();
        }        
    });

    // to toggle sound effects
    const soundFX = document.getElementById('sound_effects') as HTMLInputElement;
    // Add an event listener to the checkbox
    soundFX!.addEventListener('change', () => {
        if(soundFX.checked){
            playSound = true;
        }
        else {
            playSound = false;
        }
    });

    // meow when space
    document.addEventListener('keydown', function(event) {
        if (event.key === ' ') { 
            sounds['meow'].play(); 
        }
      });
// --------SWITCH SCREENS -----------------------------------------

  // switch from start to app 
  document.getElementById('start-button')!.addEventListener('click', () => {

    // INITIALIZE AUDIO
    const listener = new AudioListener();
    const audioLoader = new AudioLoader();
    backgroundMusic = new Audio(listener);
    // ADD OUR BACKGROUND MUSIC
    // not explosions lol . this is for testing :D
    audioLoader.load('https://audio.jukehost.co.uk/Au0hzLKqJTt0aM0krXkmt8jT2TkwcDto', (buffer) => {
    backgroundMusic.setBuffer(buffer);
    backgroundMusic.setLoop(true);
    backgroundMusic.setVolume(0.1); // Adjust the volume as needed
    backgroundMusic.play();
    })
    // ADD OUR SOUND FX
    const meow = new Audio(listener);
    const shock = new Audio(listener);
    const reelFish = new Audio(listener);
    const refillBait = new Audio(listener);
    const collision = new Audio(listener);
    const turtleSpin = new Audio(listener);
    const sharkSound = new Audio(listener);
    const newBait = new Audio(listener);

    sounds['meow'] = meow;
    sounds['shock'] = shock;
    sounds['reelFish'] = reelFish;
    sounds['refillBait'] = refillBait;
    sounds['collision'] = collision;
    sounds['turtleSpin'] = turtleSpin;
    sounds['sharkSound'] = sharkSound;
    sounds['newBait'] = newBait;
    // SUB IN OUR SOUND
    audioLoader.load('https://audio.jukehost.co.uk/sdoBgQ57rIUNlhb9ZdIktnUcXdrHnaxr', function(buffer) {
        meow.setBuffer(buffer);
        meow.setLoop(false);
        meow.setVolume(0.3);
    });
    audioLoader.load('https://audio.jukehost.co.uk/NUFqeBjUGIA5NotTuiYiH5JKk8UEDiwH', function(buffer) {
        shock.setBuffer(buffer);
        shock.setLoop(false);
        shock.setVolume(0.4);
    });
    audioLoader.load('https://audio.jukehost.co.uk/rWZEhatzec95WalcEwJ5FoEYBmmzgAup', function(buffer) {
        reelFish.setBuffer(buffer);
        reelFish.setLoop(false);
        reelFish.setVolume(0.3);
    });
    audioLoader.load('https://audio.jukehost.co.uk/zfVNGVgtseWLWN8eCaNcefoEo01FNkGI', function(buffer) {
        refillBait.setBuffer(buffer);
        refillBait.setLoop(false);
        refillBait.setVolume(0.4);
    });
    audioLoader.load('https://audio.jukehost.co.uk/11LSwQN5rii9pZKJ7waueW50acDePEgP', function(buffer) {
        collision.setBuffer(buffer);
        collision.setLoop(false);
        collision.setVolume(0.4);
    });
    audioLoader.load('https://raw.githubusercontent.com/harveyw24/Glider/main/src/sounds/explosion.wav', function(buffer) {
        turtleSpin.setBuffer(buffer);
        turtleSpin.setLoop(false);
        turtleSpin.setVolume(0.4);
    });
    audioLoader.load('https://audio.jukehost.co.uk/TKy5VdkY9PdWoF4yQeJS7aB9tQoOK4Nt', function(buffer) {
        sharkSound.setBuffer(buffer);
        sharkSound.setLoop(false);
        sharkSound.setVolume(0.4);
    });
    audioLoader.load('https://audio.jukehost.co.uk/qYWNBNV7aMm2KjRTrVQtB5HeajwaT07M', function(buffer) {
        newBait.setBuffer(buffer);
        newBait.setLoop(false);
        newBait.setVolume(0.2);
    });

    // Get radio buttons
    var nightModeRadio = document.getElementById('night-mode') as HTMLInputElement;
    if (nightModeRadio != null && nightModeRadio.checked) {
        mode = 'night';
        resetRenderLoop(mode);
    }

    // NON-audio things
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
    resetRenderLoop(mode);
    document.getElementById('app')!.style.display = 'initial';
    document.getElementById('start-screen')!.style.display = 'none';
    document.getElementById('end-screen')!.style.display = 'none';
    onAnimationFrameHandler();
});