var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
//sets canvas height and width
canvas.width = 480;
canvas.height = 770;

gravity = 0.5;
pipeSpeed = 4;
pipeWidth = 300;
pipeGap = 200;
yVel = 0;
jumpSpeed = 10;
paused = false;
StartDistance = 1000;
notStarted = true;
Score = 0;
frames = 0;
gameOver = false;

//Image importing
var imgBackground = new Image();
var imgForground = new Image();
var imgFlappy = new Image();
var imgPipeUp = new Image();
var imgPipeDown = new Image();
imgBackground.src = "./images/background.png";
imgForground.src = "./images/foreground.png";
imgFlappy.src = "./images/flappy.png";
imgPipeUp.src = "./images/pipe_up.png";
imgPipeDown.src = "./images/pipe_down.png";

//loads animation frames
var imgFlappy1 = new Image();
var imgFlappy2 = new Image();
var imgFlappy3 = new Image();
imgFlappy1.src = "./images/flappy.png";
imgFlappy2.src = "./images/flappy2.png";
imgFlappy3.src = "./images/flappy3.png";
var flappyFrames = [imgFlappy1,imgFlappy2,imgFlappy3];

var imgExplosion1 = new Image()
imgExplosion1.src = "./images/explosion1.png";
var imgExplosion2 = new Image()
imgExplosion2.src = "./images/explosion2.png";
var imgExplosion3 = new Image()
imgExplosion3.src = "./images/explosion3.png";
var imgExplosion4 = new Image()
imgExplosion4.src = "./images/explosion4.png";
var imgExplosion5 = new Image()
imgExplosion5.src = "./images/explosion5.png";
var imgExplosion6 = new Image()
imgExplosion6.src = "./images/explosion6.png";
var explosionFrames = [imgExplosion1, imgExplosion2, imgExplosion3, imgExplosion4, imgExplosion5, imgExplosion6];

window.addEventListener('keydown', function (e) {
	//console.log(e.key);
	if(e.key == " " && !paused && !gameOver){
		yVel = -jumpSpeed;
		playEffect("sndFlap",Math.random()+1.5);
		notStarted = false;
	}

	if(e.key == "Escape" && !gameOver){
		paused = !paused;
		playEffect("sndPause",2);
	}
})

window.addEventListener('click', function (e) {
	if(!paused && !gameOver){
		yVel = -jumpSpeed; 
		playEffect("sndFlap",Math.random()+1.5);
		notStarted = false;
	}
})

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

		//testCubes(this);
	}

	this.sin = function () {
		//for when the game hasn't started yet, idle animation essentially
		this.y = 385 + Math.sin(frames/5)*10; //385 is the center of the canvas vertically
	}

	this.update = function () {
		//assigned randomly
		this.y += yVel;
		yVel += gravity;
		if (yVel > 20) {
			yVel = 20;
		}
		if (yVel => 0){
			//the range of yVel is between 0 -> 20
			//we want rotation to be in the range -0.1 -> 0.3
			//this.rotation = yVel/20*0.3; //this is the linear version 
			//0 -> 0.3 looks like (x/20)^2*0.3
			//-0.1 -> 0.3 looks like ((x/20)^2*0.4)-0.1
			this.rotation = (Math.pow((yVel/20),3)*0.4)-0.1; //this is the smoothed version
			//console.log("rotation: " + this.rotation);
			//console.log("yvel: " + yVel);

			this.Left = this.x - imgFlappy.width/2;
			this.Right = this.x + imgFlappy.width/2;
			this.Top = this.y - imgFlappy.height/2;
			this.Bottom = this.y + imgFlappy.height/2;
		}
	}
}

function Pipe(x,y) {
	this.x = x;
	this.y = y;
	this.midpoint = canvas.height/2;

	this.Left = 0;
	this.Right = 0;
	this.Top = 0;
	this.Bottom = 0;

	this.draw = function  () {
		//draw image
		sinOffset = Math.sin(this.y*10)*80; //80 is the magnitude of the sinOffset, 10 is the speed 
		yMid = -imgPipeDown.height/5;
		pipeUpY = yMid +sinOffset;
		pipeDownY = yMid + imgPipeDown.height + pipeGap + sinOffset;
		ctx.drawImage(imgPipeUp, this.x, pipeUpY);
		ctx.drawImage(imgPipeDown, this.x, pipeDownY);

		this.Bottom = pipeDownY;
		this.Top = pipeUpY + imgPipeUp.height;
		//testCubes(this);
	}

	this.update = function () {
		this.x -= pipeSpeed;
		if(this.x < -pipeWidth){
			this.x = pipeWidth*2; //resets pipes that have fallen behind the player
			this.y = Score/5 + Math.random(); //gets a new y offset
		}

		if(this.x == (flappy.x - 48)){
			Score += 1;
			playEffect("sndPoint",Math.random()/2+0.8);
		}

		this.Left = this.x;
		this.Right = this.x + imgPipeDown.width;
	}
}

function testCubes(thisThing) {
	ctx.fillStyle = "yellow";
	ctx.fillRect(thisThing.Left, thisThing.Top, 10, 10);
	ctx.fillStyle = "blue";
	ctx.fillRect(thisThing.Right, thisThing.Bottom, 10, 10);
}

function Background(image, parralaxSpeed){
	this.image = image;
	this.parralaxSpeed = parralaxSpeed;
	this.x = -this.image.width*2;
	this.y = 770 - this.image.height;
	this.loaded = false;

	this.forceLoad = function () {
		if((this.y == 770) && !this.loaded){
			this.x = -this.image.width*2;
			this.y = 770 - this.image.height;
		}else{
			this.loaded = true;
		}
	}
	
	this.draw = function () {
		for (i = 0; i < 5; i++) { 
			ctx.drawImage(this.image, this.x +(this.image.width*i), this.y);
		}
	}
	
	this.update = function () {
		this.x -= pipeSpeed*this.parralaxSpeed;
		if(this.x <= -this.image.width*3){
			this.x = 0;
		}
	}
}

function playEffect(ElementID,playbackSpeed){
	const origAudio = document.getElementById(ElementID);
	const newAudio = origAudio.cloneNode();
	newAudio.playbackRate = playbackSpeed;
	newAudio.play();
}

function drawScore(){
	ctx.font = "36px pixelfont";
	ctx.fillStyle = "#D7E894";
	ctx.textAlign = "center";
	ctx.fillText(Score,canvas.width/2,40);
}

function checkCollision() {
	for (var i = pipes.length - 1; i >= 0; i--) {
		// (------------------------horizontal--------------------------) && (------------------------Vertical----------------------------)
		if(!gameOver && (flappy.Right > pipes[i].Left && flappy.Left < pipes[i].Right && (flappy.Top < pipes[i].Top || flappy.Bottom > pipes[i].Bottom))){
			// ctx.fillStyle = "Red";
			// ctx.fillRect(0,0,10,10);
			gameOver = true;
			playEffect("sndOver",0.8);
		}
	}
}

function animate(){
	d = new Date();
	imgFlappy = flappyFrames[Math.round(Math.sin(((d.getUTCMilliseconds()% 100)/100)))];
}

function drawPipes(){
	for (var i = pipes.length - 1; i >= 0; i--) {
		pipes[i].draw();
	}
}
function updatePipes(){
	for (var i = pipes.length - 1; i >= 0; i--) {
		pipes[i].update();
	}
}

var flappy = new Bird(100, 385, 0);
var backgrnd = new Background(imgBackground, 0.1);
var forgrnd = new Background(imgForground, 0.7);
var pipes = []
pipes[0] = new Pipe(StartDistance + pipeWidth, Score/5 + Math.random());
pipes[1] = new Pipe(StartDistance + pipeWidth * 2, Score/5 + Math.random());
pipes[2] = new Pipe(StartDistance + pipeWidth * 3, Score/5 + Math.random());
explosionFrame = 0.0;

function loop() {
	requestAnimationFrame(loop);
	frames += 1;
	//this stuff is done regardless of game state
	//clears canvas every frame
	ctx.clearRect(0, 0, innerWidth, innerHeight);
	backgrnd.draw();
	backgrnd.forceLoad();
	forgrnd.draw();
	forgrnd.forceLoad();
	drawPipes();
	drawScore();

	//this is done if the game is not paused... duh
	if (notStarted){
		flappy.draw();
		flappy.sin();
		backgrnd.update();
		forgrnd.update();
		animate();
		writeStartingTips();
	}
	else if(gameOver){
		if(explosionFrame < 5){
			explosionFrame = explosionFrame + (1/5);
			ctx.drawImage(explosionFrames[Math.floor(explosionFrame)],flappy.x-65,flappy.y-65,130,130);
		}
		writePleaseRefresh();
	}
	else if(!paused){
		flappy.draw();
		flappy.update();
		backgrnd.update();
		forgrnd.update();
		updatePipes();
		animate();
		checkCollision();
	}else{
		flappy.draw();
		writePauseTips();
	}
}

loop();

function writePauseTips() {
	ctx.font = "24px pixelfont";
	ctx.fillStyle = "#D7E894";
	ctx.textAlign = "center";
	ctx.fillText("Press Escape to Unpause", canvas.width / 2, canvas.height / 4);
}

function writePleaseRefresh() {
	ctx.font = "24px pixelfont";
	ctx.fillStyle = "#D7E894";
	ctx.textAlign = "center";
	ctx.fillText("Refresh the page", canvas.width / 2, canvas.height / 4);
	ctx.fillText("to try again. (F5)", canvas.width / 2, canvas.height / 3.5);
}

function writeStartingTips() {
	ctx.font = "24px pixelfont";
	ctx.fillStyle = "#D7E894";
	ctx.textAlign = "center";
	ctx.fillText("Left mouse button", canvas.width / 2, canvas.height / 4);
	ctx.fillText("or spacebar to flap.", canvas.width / 2, canvas.height / 3.5);
}

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

// function Cube(x,y){
//     this.x = x;
//     this.y = y;
//     this.size = 30;

//     this.Left = this.x -this.size;
//     this.Right = this.x + this.size;
//     this.Bottom = this.x + this.size;
//     this.Top = this.x - this.size;

//     this.draw = function () {
//         ctx.fillRect(this.x - (this.size/2),this.y - (this.size/2),this.size,this.size);
//     }
// }