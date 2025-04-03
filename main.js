const WHITE = 0;
const PINK = 1;
const BROWN = 2;

const MIN_AMP = 0.1;
const MAX_AMP = 0.4;

const DURATION = 3600;  // Noise duration in seconds, after one hour it turns off

let noiseObj;
let types = ['white', 'pink', 'brown'];
let currentType = PINK;
let isPlaying = false;
let noSleep;
let toggleSleep = true;

function toggleNoise() {
    // Start / Stop the noise at each touch
    isPlaying = (isPlaying) ? false : true;

    // Change type of noise at each start up
    if(isPlaying) {
        currentType = (currentType + 1) % types.length;
        noiseObj.setType(types[currentType]);
        noiseObj.start();
    } else {
        noiseObj.stop();
    }

    if (toggleSleep) {
        noSleep.enable();
        toggleSleep = false;
    }
}

// On PC handler
function mousePressed() {
    toggleNoise();
}

// On Mobile handler
function touchStarted() {
    toggleNoise();
}


function setup() {
    createCanvas(windowWidth, windowHeight);

    noiseObj = new p5.Noise(types[currentType]);
    noiseObj.amp(MIN_AMP);

    noSleep = new NoSleep();

    if(isPlaying) {
        noiseObj.start();
    }

    // Set text properties
    textSize(22);
    fill('grey');
}

function draw() {
    background(0); 
    if ((millis() / 1000) <= DURATION) {
        // Let s draw the waves function: https://www.desmos.com/calculator/rigtehaq9u
        let mapValue = exp(sin(0.01 * frameCount)) - exp(1)/2;
        let currentAmp = map(mapValue, -1, 1, MIN_AMP, MAX_AMP);

        // Change volume every frame
        noiseObj.amp(currentAmp);

        if (isPlaying) {
            text("Noise: " + types[currentType], 6, 20);
        } else {
            text("Paused", 6, 20);
        }
    } else {
        // Timer elapsed -> turn it off
        text("Stopped", 6, 20);
        noiseObj.stop();
        noLoop();
    }
}