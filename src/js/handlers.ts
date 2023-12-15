import {
    Raycaster,
    Vector2,
    Box3,
} from 'three';
import Hook from '../objects/Hook';

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
    scene: any,
    sounds: any,
    playSound: boolean
) {
    event = event;
    let hook = scene.getObjectByName('hook');
    // CHANGE Y POS to wherever we want the ocean to be
    if (hook.position.y > 3 && hook.state.fish) {
        let fish = hook.state.fish;
        // get rid of fish
        scene.removeFromUpdateList(fish);
        scene.remove(fish);
        scene.state.score += 1;
        hook.state.fish = undefined;

        // increase fish speed and spin turtle every 10 fish
        if (scene.state.score % 10 == 0) {
            scene.state.fishSpeed += 0.3;
            let turtle = scene.getObjectByName('turtle');
            turtle.spin();
            if (playSound) {
                sounds['turtleSpin'].play();
            }
        } else {
            if (playSound) {
                sounds['reelFish'].play();
            }
        }
    } // drop the fish if you click under sea level
    else if (hook.position.y < 3 && hook.state.fish) {
        let fish = hook.state.fish;
        //fish swims away faster
        fish.rotateX(Math.PI / 2);
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
    let bait = scene.getObjectByName('bait');
    let reel = scene.getObjectByName('reel');
    let gamePlane = scene.getObjectByName('gamePlane');
    let y_intersection;

    gamePlane.updateMatrixWorld();

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObject(gamePlane);

    if (intersects.length > 0) {
        y_intersection = intersects[0].point.y;
        // don't let hook go above start point
        if (y_intersection < 5.8) {
            reel.changeLength(y_intersection);
            hook.changeHook(y_intersection);
            if (bait.state.active) {
                bait.changeBait(y_intersection);
            }
            if (hook.state.fish) {
                hook.state.fish.position.y = y_intersection - 1;
            }
        }
    }
}

function fishCollision(hook: Hook, sounds: any, playSound: boolean) {
    if (playSound) {
        sounds['collision'].play();
    }
    if (hook.state.fish != null) {
        hook.state.fish.rotateX(Math.PI / 2);
        hook.state.fish.state.speed = 4;
        hook.state.fish.state.active = true;
        hook.state.fish = undefined;
    }
}

// handle collisions with sea creatures
export function handleCollisions(
    scene: any,
    sounds: any,
    playSound: boolean
) {
    let hook = scene.getObjectByName('hook');
    let reel = scene.getObjectByName('reel');
    let bait = scene.getObjectByName('bait');

    // if find extra bait, add life
    if(hook && reel) {
        for (let extraBait of scene.state.bonusBait) {
            let hookBox = new Box3().setFromObject(hook);
            let baitBox = new Box3().setFromObject(extraBait);
            const intHook = hookBox.intersectsBox(baitBox);
                if (intHook) {
                    scene.state.numBait += 1;
                    let index = scene.state.bonusBait.indexOf(extraBait);
                    scene.state.bonusBait.splice(index, 1);
                    scene.removeFromUpdateList(extraBait);
                    scene.remove(extraBait);
                    if (playSound) {
                        sounds['newBait'].play();
                    }
                }
            }
        }

    // jellyfish collisions only happen when we have bait on the hook
    if (hook && reel && scene.state.hasBait) {
        // if we hit a jellyfish at any time!
        let hookBox = new Box3().setFromObject(hook);
        let reelBox = new Box3().setFromObject(reel);
        for (let jelly of scene.state.jellyList) {
            // only lets jellies hit one time
            if (jelly.state.active) {
                let jellyBox = new Box3().setFromObject(jelly);
                const intHook = hookBox.intersectsBox(jellyBox);
                const intReel = reelBox.intersectsBox(jellyBox);
                if (intHook || intReel) {
                    jelly.state.active = false;
                    // shock reel and get rid of one bait
                    scene.state.numBait -= 1;
                    jelly.state.speed = 7;
                    bait.state.active = false;
                    scene.state.hasBait = false;
                    if (playSound) {
                        sounds['shock'].play();
                    }

                    // get rid of fish if on hook when jelly hit
                    if (hook.state.fish) {
                        hook.state.fish.rotateX(Math.PI / 2);
                        hook.state.fish.state.speed = 4;
                        hook.state.fish.state.active = true;
                        hook.state.fish = undefined;
                    }
                }
            }
        }
        for (let shark of scene.state.sharkList) {
            // only lets shark hit one time
            if (shark.state.active) {
                let sharkBox = new Box3().setFromObject(shark);
                const intHook = hookBox.intersectsBox(sharkBox);
                const intReel = reelBox.intersectsBox(sharkBox);
                if (intHook || intReel) {
                    shark.state.active = false;
                    // shock reel and get rid of one bait
                    scene.state.numBait -= 1;
                    shark.state.speed = 7;
                    bait.state.active = false;
                    scene.state.hasBait = false;
                    if (playSound) {
                        sounds['sharkSound'].play();
                    }

                    // get rid of fish if on hook when jelly hit
                    if (hook.state.fish) {
                        hook.state.fish.rotateX(Math.PI / 2);
                        hook.state.fish.state.speed = 4;
                        hook.state.fish.state.active = true;
                        hook.state.fish = undefined;
                    }
                }
            }
        }
    }
    // if no fish on hook yet but we have bait, we can catch a fish
    if (hook && !hook.state.fish && scene.state.hasBait) {
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
                fishCollision(hook, sounds, playSound);
            }
        }
        for (let shark of scene.state.sharkList) {
            let sharkBox = new Box3().setFromObject(shark);
            const intersection = fishBox.intersectsBox(sharkBox);
            if (intersection) {
                fishCollision(hook, sounds, playSound);
            }
        }
        for (let blow of scene.state.blowList) {
            let blowBox = new Box3().setFromObject(blow);
            const intersection = fishBox.intersectsBox(blowBox);
            if (intersection) {
                fishCollision(hook, sounds, playSound);
            }
        }
    }
}
