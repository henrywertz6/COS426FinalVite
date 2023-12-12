import START from "../start.html"
// import FOOTER from "../footer.html"
// import END from "../ending.html"
// import INSTRUCTIONS from "../instructions.html";
// import PAUSE from "../pause.html"
// import MESSAGE from "../message.html"


// idea from https://github.com/efyang/portal-0.5/blob/main/src/app.js
// https://github.com/efyang/portal-0.5/blob/main/src/instructions.html
// adapted from "Glider" project https://github.com/harveyw24/Glider/blob/main/src/js/pages.js

// initialize menu/start screen
export function init_page(document, menuCanvas) {
    document.body.innerHTML = '';
    document.body.appendChild(menuCanvas);
    let menu = document.createElement('div');
    menu.id = 'menu';
    menu.innerHTML = START;
    document.body.appendChild(menu)

    let footer = document.createElement('div');
    footer.id = 'footer';
    footer.innerHTML = FOOTER;
    document.body.appendChild(footer)

    let audio = document.createElement('audio');
    // audio.setAttribute('src', 'https://raw.githubusercontent.com/harveyw24/Glider/main/src/sounds/menu.wav');
    audio.id = 'audio';
    audio.loop = true;
    document.body.appendChild(audio)
}


// render game over screen
export function quit(document, score) {
    let ending = document.createElement('div');
    ending.id = 'ending';
    ending.innerHTML = END;
    document.body.appendChild(ending)

    let finalScore = document.getElementById('finalScore');
    finalScore.innerHTML = 'Score: '.concat(score != "Infinity" ? score : "∞");

    // change scores! 
    let scoreComment = document.getElementById('scoreComment');
    if (score < 5) scoreComment.innerHTML = ''
    else if (score < 15) scoreComment.innerHTML = ''
    else if (score < 30) scoreComment.innerHTML = ''
    else if (score < 45) scoreComment.innerHTML = ''
    else if (score < 60) scoreComment.innerHTML = ''
    else if (score < 75) scoreComment.innerHTML = ''
    else if (score < 100) scoreComment.innerHTML = ''
    else if (score < 150) scoreComment.innerHTML = ''
    else if (score < 200) scoreComment.innerHTML = ''
    else if (score < 250) scoreComment.innerHTML = ''
    else scoreComment.innerHTML = ''

    document.getElementById('score').remove();
    document.getElementById("canvas").remove();
    document.getElementById('instructions').remove();
    document.getElementById('pause').remove();
}

// render game screen
export function start(document, canvas) {
    document.getElementById('footer').remove();

    document.getElementById("menu").remove();
    document.getElementById('menuCanvas').remove()
    document.body.appendChild(canvas);

    let scoreCounter = document.createElement('div');
    scoreCounter.id = 'score';
    scoreCounter.classList.add('audioFont')

    let reminders = document.createElement('div');
    reminders.id = 'reminders';
    reminders.innerHTML = INSTRUCTIONS;
    reminders.prepend(scoreCounter)
    document.body.appendChild(reminders)

    let fillScreen = document.createElement('div');
    fillScreen.id = 'fillScreen';
    fillScreen.style.pointerEvents = "none";
    document.body.appendChild(fillScreen);

    let pause = document.createElement('div');
    pause.id = 'pause';
    pause.style.pointerEvents = 'none';
    pause.innerHTML = PAUSE;
    pause.classList.add('invisible')
    document.body.appendChild(pause)
}

export function init_fonts(document) {
    let titleFont = document.createElement('link');
    titleFont.id = 'titleFont'
    titleFont.rel = "stylesheet";
    titleFont.href = "https://fonts.googleapis.com/css?family=Audiowide";
    document.head.appendChild(titleFont)

    let font = document.createElement('link');
    font.id = 'font'
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css?family=Radio+Canada";
    document.head.appendChild(font)
}