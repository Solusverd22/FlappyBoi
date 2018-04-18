var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
//sets canvas height and width
canvas.width = 480;
canvas.height = 770;

gravity = 0.8;
pipeSpeed = 4;
pipeWidth = 400;
yVel = 0;
jumpSpeed = 14;

var imgFlappy = new Image();
var imgPipeUp = new Image();
var imgPipeDown = new Image();
imgFlappy.src = "./images/flappy.png";
imgPipeUp.src = "./images/pipe_up.png";
imgPipeDown.src = "./images/pipe_down.png";

window.addEventListener('keydown',
    function (e) {
        //console.log(e.key);
        if(e.key == " "){
            yVel = -jumpSpeed;
        }
    })

window.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouseBoi.x = e.clientX - rect.left,
    mouseBoi.y = e.clientY - rect.top;
});

window.addEventListener('click', function (e) {yVel = -jumpSpeed})

function Cube(x,y){
    this.x = x;
    this.y = y;
    this.size = 30;

    this.Left = this.x -this.size;
    this.Right = this.x + this.size;
    this.Bottom = this.x + this.size;
    this.Top = this.x - this.size;

    this.draw = function () {
        ctx.fillRect(this.x - (this.size/2),this.y - (this.size/2),this.size,this.size);
    }
}

function Bird(x, y, rotation) {
    this.x = x;
    this.y = y;

    this.rotation = rotation;

    this.Left = this.x - imgFlappy.width/2;
    this.Right = this.x + imgFlappy.width/2;
    this.Top = this.y - imgFlappy.height/2;
    this.Bottom = this.y + imgFlappy.height/2;

    this.draw = function () {
        //draw image
        //ctx.fillRect(this.x,this.y,imgFlappy.width,imgFlappy.height); //debug rect
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((Math.PI * this.rotation)); // rotates as it falls
        //ctx.fillRect(0,0,imgFlappy.width,imgFlappy.height);   //debug rect
        ctx.drawImage(imgFlappy,-imgFlappy.width/2,-imgFlappy.height/2);
        ctx.restore();
    }

    this.update = function () {
        //assigned randomly
        this.y += yVel;
        yVel += gravity;
        if (yVel > 20) {
            yVel = 20;
        }
        if (yVel => 0){
            this.rotation = yVel/60; //the rotation should be between 0-0.3 as it represents PI*rotation radians
            //console.log("rotation: " + this.rotation);
            //console.log("yvel: " + yVel);
        }
    }
}

function Pipe(x,y) {
    this.x = x;
    this.y = y;

    this.Left = this.x - imgPipeDown.width/2;
    this.Right = this.x + imgPipeDown.width/2;
    this.Top = this.y - imgPipeDown.height/2;
    this.Bottom = this.y + imgPipeDown.height/2;

    this.draw = function  () {
        //draw image
        ctx.drawImage(imgPipeUp, this.x, -imgPipeDown.height * this.y);
        ctx.drawImage(imgPipeDown, this.x, canvas.height - (imgPipeDown.height * this.y ));
    }

    this.update = function () {
        //assigned randomly
        this.x -= pipeSpeed;
        this.draw();
    }
}

function managePipes() {
    for (var i = pipes.length - 1; i >= 0; i--) { //the for loop allows interaction with each pipe seperately
        if(pipes[i].x < -pipeWidth){
            pipes[i].x = pipeWidth*2; //this if   moves pipes that have fallen behind infront of the player
        }
        pipes[i].update();
        checkCollision(i);
    }
}

function checkCollision(i) {
    if(!(pipes[i].Left > flappy.Right
        || pipes[i].Right < flappy.Left
        || pipes[i].Top > flappy.Bottom
        || pipes[i].Bottom < flappy.Top)){
            console.log("hit");
        }
}

function genericCollision() {
    if(!(mouseBoi.Left > flappy.Right
        || mouseBoi.Right < flappy.Left
        || mouseBoi.Top > flappy.Bottom
        || mouseBoi.Bottom < flappy.Top)){
            console.log("g hit");
        }
}

var flappy = new Bird(100, 400, 0);
var mouseBoi = new Cube(400,400);

var pipes = []
pipes[0] = new Pipe(pipeWidth, Math.random());
pipes[1] = new Pipe(pipeWidth * 2, Math.random());
pipes[2] = new Pipe(pipeWidth * 3, Math.random());


function loop() {
    requestAnimationFrame(loop);
    //clears canvas every frame
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    flappy.draw();
    flappy.update();
    //mouseBoi.draw();  
    managePipes();
    genericCollision();
}

loop();


////three quads
//c.fillRect(100, 100, 100, 100);
//c.fillStyle = 'blue';
//c.fillRect(400, 100, 100, 200);
//c.fillRect(300, 300, 100, 100);
//console.log(canvas);

////line
//c.beginPath();
//c.moveTo(50, 300);
//c.lineTo(300, 100);
//c.strokeStyle = 'green';
//c.stroke();

//for (var i = 0; i < 10; i++) {
//    c.beginPath();
//    c.arc(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 30, 0, Math.PI * 2, false);
//    c.strokeStyle = 'lightblue';
//    c.stroke();
//}