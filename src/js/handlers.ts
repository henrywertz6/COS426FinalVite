import * as THREE from "three";
import * as pages from "./pages.js"
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    Clock,
    LoadingManager,
    Raycaster,
    Vector2,
    Plane
} from 'three';

// handle user controls input
export function handleKeyDown(event: { key: string; }, keypress: { [x: string]: boolean; }) {
    if (event.key == "ArrowUp") keypress['up'] = true;
    if (event.key == "ArrowDown") keypress['down'] = true;
}
// terminate the action caused by user controls input
export function handleKeyUp(event: { key: string; }, keypress: { [x: string]: boolean; }) {
    if (event.key == "ArrowUp") keypress['up'] = false;
    if (event.key == "ArrowDown") keypress['down'] = false;
}

// handle user mouse movement
export function handlePointerMove(event: MouseEvent, pointer: {x: number, y: number}) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 + 1;
}

// move the hook and line in response to user input
export function handleCharacterControls(scene: { getObjectByName: (arg0: any) => any; }, pointer: Vector2, raycaster: Raycaster, camera: any) {
    let hook = scene.getObjectByName('hook');
    // let reel = scene.getObjectByName('reel');
    let gamePlane = scene.getObjectByName('plane');
    // console.log(gamePlane);
    let y_intersection;

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObject(hook, false );
    // console.log(intersects);

    if ( intersects.length > 0 ) {
        console.log("INTERSECTS");
        y_intersection = intersects[0].point.y;
        // console.log(y_intersection);

        // if ( INTERSECTED != intersects[ 0 ].object ) {

        //     if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        //     INTERSECTED = intersects[ 0 ].object;
        //     INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        //     INTERSECTED.material.emissive.setHex( 0xff0000 );

        // }

    } 

    // renderer.render( scene, camera );

    // // move up as long as not above sea level (say 20 CHANGE)
    // if (keypress['up'] && hook.position.y < 20) {
    //     hook.position.y += speedLevel;
    // }
    // // move down as long as not at sea floor (saying -20 CHANGE)
    // if (keypress['down'] && hook.position.y > -20) {
    //     hook.position.y -= speedLevel;
    // }
}

// handle switching between screen states such as menu, game, game over, mute, and pause states
// export function handleScreens(event: { key: string; }, screens: { [x: string]: boolean; }, document: { getElementById: (arg0: string) => { (): any; new(): any; pause: { (): void; new(): any; }; }; }, canvas: any, reel: any, scene: { getObjectByName: (arg0: any) => any; }, menuCanvas: any, sounds: any, score: any) {
//     // quit: game -> ending
//     if (event.key == 'q' && !screens['ending'] && !screens['menu']) {
//         screens['menu'] = false;
//         screens['pause'] = false;
//         screens['ending'] = true;
//         pages.quit(document, score);
//         document.getElementById('audio').pause();
//     }
//     // restart: ending -> menu
//     else if (event.key == " " && screens["ending"]) {
//         let hook = scene.getObjectByName(reel);
//         hook.null()
//         screens["ending"] = false;
//         screens['pause'] = false;
//         screens['menu'] = true;
//         pages.init_page(document, menuCanvas)
//     }
//     // start: menu -> game
//     else if (event.key == " " && screens["menu"]) {
//         screens["menu"] = false;
//         pages.start(document, canvas);
//         // buffer = false;

//         // ADD SOUNDS
//         // sounds['whirring'].play()
//         // document.getElementById('audio').play()
//     }
//     // unpause: pause -> game
//     else if (event.key == " " && screens["pause"]) {
//         screens["pause"] = false;
//         // sounds['whirring'].setVolume(0.4);
//         // document.getElementById('audio').volume = 1;
//         let pause = document.getElementById("pause");
//         // pause.classList.add('invisible');
//     }
//     // pause: game -> pause
//     else if (event.key == " " && !screens["ending"]) {
//         screens["pause"] = true;
//         // sounds['whirring'].setVolume(0.1);
//         // document.getElementById('audio').volume = 0.5;
//         let pause = document.getElementById("pause");
//         // pause.classList.remove('invisible');
//     }
// }

// handle collisions with sea creatures
export function handleCollisions(document: any, scene: any, reel: any, screens: any, sounds: any, score: any, camera: any) {

    // give each object a bounding box: https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
    // store all creatures on screen in an array
    // loop through array of "onScreen" objs
    // check if any obj bounding box collides with the hook / line bounding boxes

    // IF line collides with crab & still have life -- reduce bait by 1
    // IF line collides with crab & no life -- end game 

    // pseudo code -- IF hook collide with fish & no fish already on line -- rotate fish 90 degrees and attach to hook
    // map "ON_HOOK" state to true?
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
