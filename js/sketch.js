class tri {
    constructor() {
      this.x = random(0, width);
      this.y = random(height + 10, height + 400);
      this.ySpeed = random(2, 8);
      var d = [-80, 80, 90, -70, 93, -85]
      this.d1 = random(-80, 80);
      this.d2 = random(-80, 80);
    }
    
    fall() {
      this.y -= this.ySpeed;
      if(this.y < -100) {
        this.y = random(height + 10, height + 400);
      }
    }
    
    show() {
      fill("#9fa8da");
      stroke("#9fa8da");
      triangle(this.x, this.y, this.x + this.d1, this.y + this.d1, this.x + this.d2, this.y - this.d2);
    }
  }
  var ts = []
  var start_animation = true;

  function toggleAnimation() {
      start_animation = !start_animation;
  }

  function setup() {
    var canvas = createCanvas(Number($('#canvas').width()) , Number($('#canvas').height()));
    canvas.parent('canvas');
    for(var i = 0; i < 50; i++) {
      ts.push(new tri());
    }
   
  }
  
  function draw() {
    if(start_animation) {
        background("#3f51b5");
        for(var t = 0; t < ts.length; t++) {
          ts[t].fall();
          ts[t].show();
        }
    }
  }