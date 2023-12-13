import * as THREE from 'three';
import * as pages from './pages.js';
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    Clock,
    LoadingManager,
    Raycaster,
    Vector2,
    Plane,
    ArrowHelper,
    Box3,
} from 'three';

// handle user controls input
export function handleKeyDown(
    event: { key: string },
    keypress: { [x: string]: boolean }
) {
    if (event.key == 'ArrowUp') keypress['up'] = true;
    if (event.key == 'ArrowDown') keypress['down'] = true;
}
// terminate the action caused by user controls input
export function handleKeyUp(
    event: { key: string },
    keypress: { [x: string]: boolean }
) {
    if (event.key == 'ArrowUp') keypress['up'] = false;
    if (event.key == 'ArrowDown') keypress['down'] = false;
}
// handle user click: drop the fish
export function handleMouseDown(
    event: MouseEvent,
    scene: any) {
    let hook = scene.getObjectByName('hook');
    // CHANGE Y POS to wherever we want the ocean to be 
    if (hook.position.y > 3 && hook.state.fish) {
        let fish = hook.state.fish;
        // get rid of fish
        scene.removeFromUpdateList(fish);
        scene.remove(fish);
        scene.state.score += 1;
        hook.state.fish = undefined;
        
        // spin turtle every 10 fish hehe
        if(scene.state.score % 10 == 0) {
            let turtle = scene.getObjectByName('turtle');
            turtle.spin();
        }
    } // drop the fish if you click under sea level
    else if(hook.position.y < 3 && hook.state.fish) {
        let fish = hook.state.fish;
        //fish swims away faster
        fish.rotateX(Math.PI/2);
        fish.state.speed = 4;
        fish.state.active = true;
        hook.state.fish = undefined;
    }
}
// handle user mouse movement
export function handlePointerMove(
    event: MouseEvent,
    pointer: { x: number; y: number }
) {
    // console.log(window.innerWidth)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// move the hook and line in response to user input
export function handleCharacterControls(
    scene: { add: (arg0: any) => any; getObjectByName: (arg0: any) => any },
    pointer: Vector2,
    raycaster: Raycaster,
    camera: any
) {
    let hook = scene.getObjectByName('hook');
    let reel = scene.getObjectByName('reel');
    let gamePlane = scene.getObjectByName('gamePlane');
    let y_intersection;

    gamePlane.updateMatrixWorld();

    // To see the rays casted from the point of the mouse, uncomment this
    // scene.add(
    //     new ArrowHelper(
    //         raycaster.ray.direction,
    //         raycaster.ray.origin,
    //         20,
    //         0x00ff00
    //     )
    // );

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObject(gamePlane);

    if (intersects.length > 0) {
        y_intersection = intersects[0].point.y;
        // don't let hook go above start point
        if (y_intersection < 5.8) {
            reel.changeLength(y_intersection);
            hook.changeHook(y_intersection);
            if (hook.state.fish) {
                hook.state.fish.position.y = y_intersection - 1;
            }
        }
    }
}

// THIS is throwing error for some reason, commented out for now oops
// handle switching between screen states such as menu, game, game over, mute, and pause states
// export function handleScreens(
//     event: { key: string },
//     screens: { [x: string]: boolean },
//     document: {
//         getElementById: (arg0: string) => {
//             (): any;
//             new (): any;
//             pause: { (): void; new (): any };
//         };
//     },
//     canvas: any,
//     reel: any,
//     scene: { getObjectByName: (arg0: any) => any },
//     menuCanvas: any,
//     sounds: any,
//     score: any
// ) {
//     // quit: game -> ending
//     if (event.key == 'q' && !screens['ending'] && !screens['menu']) {
//         screens['menu'] = false;
//         screens['pause'] = false;
//         screens['ending'] = true;
//         pages.quit(document, score);
//         document.getElementById('audio').pause();
//     }
//     // restart: ending -> menu
//     else if (event.key == ' ' && screens['ending']) {
//         let hook = scene.getObjectByName(reel);
//         hook.null();
//         screens['ending'] = false;
//         screens['pause'] = false;
//         screens['menu'] = true;
//         pages.init_page(document, menuCanvas);
//     }
//     // start: menu -> game
//     else if (event.key == ' ' && screens['menu']) {
//         screens['menu'] = false;
//         pages.start(document, canvas);
//         // buffer = false;

//         // ADD SOUNDS
//         // sounds['whirring'].play()
//         // document.getElementById('audio').play()
//     }
//     // unpause: pause -> game
//     else if (event.key == ' ' && screens['pause']) {
//         screens['pause'] = false;
//         // sounds['whirring'].setVolume(0.4);
//         // document.getElementById('audio').volume = 1;
//         let pause = document.getElementById('pause');
//         // pause.classList.add('invisible');
//     }
//     // pause: game -> pause
//     else if (event.key == ' ' && !screens['ending']) {
//         screens['pause'] = true;
//         // sounds['whirring'].setVolume(0.1);
//         // document.getElementById('audio').volume = 0.5;
//         let pause = document.getElementById('pause');
//         // pause.classList.remove('invisible');
//     }
// }

// handle collisions with sea creatures
export function handleCollisions(
    // document: any,
    scene: any
    // reel: any,
    // screens: any,
    // sounds: any,
    // score: any,
    // camera: any
) {
    let hook = scene.getObjectByName('hook');
    if (hook && !hook.state.fish) {
        let hookBox = new Box3().setFromObject(hook);
        for (let fish of scene.state.fishList) {
            let fishBox = new Box3().setFromObject(fish);
            const intersection = hookBox.intersectsBox(fishBox);
            if (intersection) {
                let index = scene.state.fishList.indexOf(fish);
                fish.state.active = false;
                scene.state.fishList.splice(index, 1);

                hook.state.fish = fish;
                fish.translateZ(0.7);
                fish.position.z = 0;
                // console.log(fish.position);
                fish.rotateX(-Math.PI / 2);
            }
        }
    } // if we have a fish on the hook and hit an obstacle
    else if (hook && hook.state.fish) { 
        let fish = hook.state.fish;
        let fishBox = new Box3().setFromObject(fish);
        for (let turtle of scene.state.obstacleList) {
            let turtleBox = new Box3().setFromObject(turtle);
            const intersection = fishBox.intersectsBox(turtleBox);
            if (intersection) {
                fish.rotateX(Math.PI/2);
                fish.state.speed = 4;
                fish.state.active = true;
                hook.state.fish = undefined;
            }
        }
        
    }
    // give each object a bounding box: https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
    // store all creatures on screen in an array
    // loop through array of "onScreen" objs
    // check if any obj bounding box collides with the hook / line bounding boxes
    // IF line collides with crab & still have life -- reduce bait by 1
    // IF line collides with crab & no life -- end game
    // pseudo code -- IF hook collide with fish & no fish already on line -- rotate fish 90 degrees and attach to hook
    // IF hook collides with non-fish & fish already on line -- fish "swims away" (fast speed)
    // let hook = scene.getObjectByName(reel);
    // if (interp.y > obj.position.y) {
    //     let fillScreen = document.getElementById('fillScreen');
    //     fillScreen.classList.add('death');
    //     setTimeout(function() {
    //         fillScreen.classList.remove('death');
    //     }, 3000);
    //     screens['ending'] = true;
    //     pages.quit(document, score);
    // }
}

// // update score counter on the top left corner of game screen
// export function updateScore(document, score) {
//     let scoreCounter = document.getElementById('score');
//     scoreCounter.innerHTML = 'Score: '.concat(score != "Infinity" ? score : "∞");
// }
