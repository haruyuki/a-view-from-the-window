var rotateAmount = 0;  // How much the canvas has rotated
var stars = [];  // Array of stars on the canvas
var clouds = [];  // Array of clouds on the canvas
var moonRadius = 200;
var moonCraters = [];  // Array of craters on the moon
var timeRotation = 0;  // What 'time' the canvas is at
var grassVariation;  // A variable for how tall the grass is
var enableAutoMove = 0;
var baseAutoMove = 0.25;
var extraAutoMove = 0;
var enableClouds = 1;

function Star(size, x, y) {  // Function to create a star
    this.size = size;  // The size of the star
    this.x = x;
    this.y = y;
    return this;
}

var Background = {  // Types of background colours at different times
    sunrise: "#ff8c00",
    day: "#7ec0ee",
    sunset: "#fd5e53",
    night: "#003366"
};

var Grass = {
    sunrise: "#66cd00",
    day: "#7fff00",
    sunset: "#004f00",
    night: "#9db68c"
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    noStroke();

    grassVariation = random(150, 250);  // Generate a random height for the grass patch

    var longestEdge = max(windowWidth, windowHeight);
    for (var _ = 0; _ < 3500; _++) {  // Create 3000 stars
        stars.push(new Star(
            2,
            random(-longestEdge, longestEdge * 2),
            random(-longestEdge, longestEdge)));
    }

    for (var _ = 0; _ < 30; _++) {  // Create 30 clouds
        clouds.push([random(0, windowWidth), random(0, windowHeight - grassVariation)]);  // [RandomX, RandomY]
    }

    for (var _ = 0; _ < 20; _++) {  // Create 20 moon craters
        var placementX;
        var placementY;
        var craterSize = random(10, 30);
        var centreDistance = random(0, moonRadius/2 - craterSize);  // So the crater won't be placed outside the moon
        var placementAngle = random(0, 360);
        var placementAngleCalcuation = placementAngle % 90;

        if (placementAngle >= 0 && placementAngle <= 90) {
            placementX = centreDistance * sin(placementAngleCalcuation);
            placementY = -centreDistance * cos(placementAngleCalcuation);
        } else if (placementAngle > 90 && placementAngle <= 180) {
            placementX = centreDistance * sin(90 - (placementAngleCalcuation));
            placementY = centreDistance * cos(90 - (placementAngleCalcuation));
        } else if (placementAngle > 180 && placementAngle <= 270) {
            placementX = -centreDistance * sin(placementAngleCalcuation);
            placementY = centreDistance * cos(placementAngleCalcuation);
        } else {
            placementX = -centreDistance * sin(90 - (placementAngleCalcuation));
            placementY = -centreDistance * cos(90 - (placementAngleCalcuation));
        }
        moonCraters.push([placementX, placementY, craterSize]);
    }
}

function draw() {
    var currentTimeRotation = abs(timeRotation) % 360;

    if ((currentTimeRotation >= 0 && currentTimeRotation <= 22) || (currentTimeRotation > 338 && currentTimeRotation <= 359)) {
        background(Background.sunrise);
    } else if (currentTimeRotation > 22 && currentTimeRotation <= 158) {
        background(Background.day);
    } else if (currentTimeRotation > 159 && currentTimeRotation <= 202) {
        background(Background.sunset);
    } else {
        background(Background.night);
    }

    translate(windowWidth, windowHeight);  // Place the centre of the canvas at the bottom right corner
    rotate(rotateAmount);
    // --------------------------------

    if (currentTimeRotation > 159 && currentTimeRotation <= 359) {
        stars.forEach(function(star) {
            drawStar(star);
        });
    }

    fill("#FDB813");
    sunXPos = -windowWidth / 2 - (windowWidth / 2 / 2);
    circle(sunXPos, -100, 200);

    moonXPos = windowWidth / 2 + (windowWidth / 2 / 2);
    drawMoon(moonXPos, -100);

    // --------------------------------
    rotate(-rotateAmount);
    translate(-windowWidth, -windowHeight); // Revert canvas centre to draw clouds, grass and window

    if (enableClouds) {  // If user enabled clouds
        clouds.forEach(function(cloud) {
            drawCloud(cloud[0], cloud[1]);
            if (cloud[0] > windowWidth) {
                cloud[0] = -200;
                cloud[1] = random(0, windowHeight);
            } else {
                cloud[0] += 0.5;
            }
        });
    }

    if ((currentTimeRotation >= 0 && currentTimeRotation <= 22) || (currentTimeRotation > 338 && currentTimeRotation <= 359)) {
        fill(Grass.sunrise);
    } else if (currentTimeRotation > 22 && currentTimeRotation <= 158) {
        fill(Grass.day);
    } else if (currentTimeRotation > 158 && currentTimeRotation <= 202) {
        fill(Grass.sunset);
    } else {
        fill(Grass.night);
    }
    rect(0, windowHeight - grassVariation, windowWidth, grassVariation);

    if (enableAutoMove) {
        rotateAmount += baseAutoMove + extraAutoMove;
        timeRotation += baseAutoMove + extraAutoMove;
    } else {
        extraAutoMove = 0;
    }
    // you can keep this `drawWindow()` function call in your final sketch
    drawWindow();
}

function drawWindow() {
    // start with a "push" so that we can go back to the current drawing state
    // (e.g. fill/stroke colour) at the end of the function
    push();
    fill(80);
    noStroke();

    // the width (and height) of the window "edge"
    var edge = 50;

    // draw the background "walls"
    rect(0, 0, edge, height);
    rect(0, 0, width, edge);
    rect(0, height - edge, width, edge);
    rect(width - edge, 0, edge, height);

    // now draw the window (including bars & sill)
    stroke(130, 82, 1);
    noFill();
    strokeWeight(10);
    rect(edge, edge, width - edge * 2, height - edge * 2);
    line(edge, height / 2, width - edge, height / 2);
    line(width / 2, edge, width / 2, height - edge);
    fill(150, 92, 1);
    rect(0 + edge / 2, height - edge * 1.5, width - edge, edge / 2);

    // pop drawing context back to original state (i.e. when `push()` was called)
    pop();
}

function drawStar(star) {
    fill(255);
    circle(star.x, star.y, star.size);
}

function drawCloud(x, y) {
    fill(255);
    var variable = 30;
    circle(x, y, variable);
    circle(x + 200, y, variable);
    rect(x, y - variable/2, 200, variable);
}

function drawMoon(x, y) {
    fill("#f1eeb9");
    circle(x, y, moonRadius);
    fill("#e1db6c");
    moonCraters.forEach(function(crater) {
        circle(x + crater[0], y + crater[1], crater[2]);
    });
}

function mouseWheel(event) {
    rotateAmount += event.delta;
    timeRotation += event.delta;
    //move the square according to the vertical scroll amount
    //uncomment to block page scrolling
    return false;
}

function keyTyped() {
    if (key === " ") {
        enableAutoMove = 1 ^ enableAutoMove;
    }
    if (key === "=") {
        extraAutoMove += 0.2;
    }
    if (key === "-") {
        if (extraAutoMove > 0) {
            extraAutoMove -= 0.2;
        } else {
            extraAutoMove = 0;
        }
    }
    if (key === "c") {
        enableClouds = 1 ^ enableClouds;
    }
}