/**
 * a triangle class to create triangles for the background
 */
class tri {
    constructor() {
        // x coordinate for the traingle
        this.x = random(0, width);
        // y coordinate for the triangle
        this.y = random(height + 10, height + 400);
        // speed of the traingle to go up
        this.ySpeed = random(2, 8);
        var d = [-80, 80, 90, -70, 93, -85];
        this.d1 = random(-80, 80);
        this.d2 = random(-80, 80);
    }

    // a function that makes traingle appear to fall against gravity
    fall() {
        this.y -= this.ySpeed;
        if (this.y < -100) {
            this.y = random(height + 10, height + 400);
        }
    }

    // print the traingle on to the canvas
    show() {
        fill("#9fa8da");
        stroke("#9fa8da"); // setting stroke and fill to blue color (material)
        triangle(
            this.x,
            this.y,
            this.x + this.d1,
            this.y + this.d1,
            this.x + this.d2,
            this.y - this.d2
        );
    }
}
// collection of traingles
var ts = [];

// keep track of the animation
var start_animation = true;

// start or stop animation using the toggle
function toggleAnimation() {
    start_animation = !start_animation;
}

// sets up the canvas first
function setup() {
    // create a canvas as big as canvas in the html
    var canvas = createCanvas(
        Number($("#canvas").width()),
        Number($("#canvas").height())
    );
    // stick the p5 canvas to the div element of the html to view it as background
    canvas.parent("canvas");
    // create 50 triangles because why not
    for (var i = 0; i < 50; i++) {
        ts.push(new tri()); // create traingles and store them in the collection (array)
    }
}

// start to draw the triangles
function draw() {
    if (start_animation) {
        background("#3f51b5");
        for (var t = 0; t < ts.length; t++) {
            ts[t].fall();
            ts[t].show();
        }
    }
}
