import * as THREE from "three";
import * as pages from "./pages.js"

// handle user controls input
export function handleKeyDown(event, keypress) {
    if (event.key == "ArrowUp") keypress['up'] = true;
    if (event.key == "ArrowDown") keypress['down'] = true;
}

// terminate the action caused by user controls input
export function handleKeyUp(event, keypress) {
    if (event.key == "ArrowUp") keypress['up'] = false;
    if (event.key == "ArrowDown") keypress['down'] = false;
}

// move the hook in response to user input
export function handleCharacterControls(scene, keypress, reel, camera, speedLevel) {
    let hook = scene.getObjectByName(reel);

    // move up as long as not above sea level (say 20 CHANGE)
    if (keypress['up'] && hook.position.y < 20) {
        hook.position.y += speedLevel;
    }
    // move down as long as not at sea floor (saying -20 CHANGE)
    if (keypress['down'] && hook.position.y > -20) {
        hook.position.y -= speedLevel;
    }
}

// handle switching between screen states such as menu, game, game over, mute, and pause states
export function handleScreens(event, screens, document, canvas, reel, scene, menuCanvas, sounds, score) {
    // quit: game -> ending
    if (event.key == 'q' && !screens['ending'] && !screens['menu']) {
        screens['menu'] = false;
        screens['pause'] = false;
        screens['ending'] = true;
        pages.quit(document, score);
        document.getElementById('audio').pause();
    }
    // restart: ending -> menu
    else if (event.key == " " && screens["ending"]) {
        let hook = scene.getObjectByName(reel);
        hook.null()
        screens["ending"] = false;
        screens['pause'] = false;
        screens['menu'] = true;
        pages.init_page(document, menuCanvas)
    }
    // start: menu -> game
    else if (event.key == " " && screens["menu"]) {
        screens["menu"] = false;
        pages.start(document, canvas);
        buffer = false;

        // ADD SOUNDS
        // sounds['whirring'].play()
        // document.getElementById('audio').play()
    }
    // unpause: pause -> game
    else if (event.key == " " && screens["pause"]) {
        screens["pause"] = false;
        // sounds['whirring'].setVolume(0.4);
        // document.getElementById('audio').volume = 1;
        let pause = document.getElementById("pause");
        pause.classList.add('invisible');
    }
    // pause: game -> pause
    else if (event.key == " " && !screens["ending"]) {
        screens["pause"] = true;
        // sounds['whirring'].setVolume(0.1);
        // document.getElementById('audio').volume = 0.5;
        let pause = document.getElementById("pause");
        pause.classList.remove('invisible');
    }
}

// handle collisions with sea creatures
export function handleCollisions(document, scene, reel, screens, sounds, score, camera) {

    // give each object a bounding box: https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
    // store all creatures on screen in an array
    // loop through array of "onScreen" objs
    // check if any obj bounding box collides with the hook / line bounding boxes

    // IF line collides with crab & still have life -- reduce bait by 1
    // IF line collides with crab & no life -- end game 

    // pseudo code -- IF hook collide with fish & no fish already on line -- rotate fish 90 degrees and attach to hook
    // map "ON_HOOK" state to true?
    // IF hook collides with anything & fish already on line -- rotate fish & fish "swims away" (fast speed)

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
