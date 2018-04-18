var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
//sets canvas height and width
canvas.width = 480;
canvas.height = 770;

gravity = 0.3;
pipeSpeed = 4;
yVel = 0;
var imgFlappy = new Image();
var imgPipeUp = new Image();
var imgPipeDown = new Image();
imgFlappy.src = "./images/flappy.png";
imgPipeUp.src = "./images/pipe_up.png";
imgPipeDown.src = "./images/pipe_down.png";

window.addEventListener('keydown',
    function (e) {
        console.log(e);
        if(e.keyCode = 32){
            yVel = - 8;
        }
    })

function Bird(x, y, rotation) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;

    this.draw = function () {
        //draw image
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(yVel * Math.PI); // rotates as it falls
        ctx.drawImage(imgFlappy,0,0);
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
            this.rotation = yVel / 20;
            console.log(this.rotation);
        }
    }
}

function Pipe(x,y) {
    this.x = x;
    this.y = y;

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
    };
}

var flappy = new Bird(100, 400, 0);
var pipes = []
pipes[0] = new Pipe(pipeWidth, Math.random());
pipes[1] = new Pipe(pipeWidth * 2, Math.random());
pipes[2] = new Pipe(pipeWidth * 3, Math.random());


function animate() {
    requestAnimationFrame(animate);
    //clears canvas every frame
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    flappy.draw();
    flappy.update();   
    managePipes();

}

animate();


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