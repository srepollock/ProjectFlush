// $('body').dblclick(function (e){
// 	e.preventDefault();
// });

/*
	Canvas to draw the game on.
*/
var canvas = document.getElementById("canGame");
var context = canvas.getContext("2d");
//Sets the canvas to listen to the mouse button clicks.
canvas.addEventListener("mousedown", doMouseDown, true);

//Creates sound files for use.
var moveSound = new Audio();
moveSound.src = "./sound/move.wav";
var badMoveSound = new Audio();
badMoveSound.src = "./sound/badMoveSound.wav";
var levelComplete = new Audio();
levelComplete.src = "./sound/levelComplete.mp3";
var gameOverSound = new Audio();
gameOverSound.src = "./sound/gameOverSound.wav";
var wallSound = new Audio();
wallSound.src = "./sound/wall.wav";

//Sets screen width
var SCREENWIDTH = canvas.width;
var SCREENHEIGHT = canvas.height;

//Array that the maze is kept within
var map;
//A map of all move distances from the starting point
var distanceMap;

//Sets up the images for the game.
var wall = new Image();
wall.src="./pics/wall.png";
var floor = new Image();
floor.src="./pics/floor.png";
var path = new Image();
path.src="./pics/path.png";
var character = new Image();
character.src="./pics/character.png";
var gameOverGraphic = new Image();
gameOverGraphic.src="./pics/gameOver.png";
var leftArrowGraphic = new Image();
leftArrowGraphic.src="./pics/arrowLeft.png";
var rightArrowGraphic = new Image();
rightArrowGraphic.src="./pics/arrowRight.png";
var upArrowGraphic = new Image();
upArrowGraphic.src="./pics/arrowUp.png";
var downArrowGraphic = new Image();
downArrowGraphic.src="./pics/arrowDown.png";
var fingerGraphic = new Image();
fingerGraphic.src="./pics/finger.png";
var toiletGraphic = new Image();
toiletGraphic.src="./pics/toilet.png";
var darkSquareGraphic = new Image();
darkSquareGraphic.src="./pics/darkSquare.png";
var menuScreenGraphic = new Image();
menuScreenGraphic.src="./pics/pic2.png";
var playButtonGraphic = new Image();
playButtonGraphic.src="./pics/PlayButton.png";
var imgSize = 16;/*pixel width and height of tiles*/
var fingerGraphicDown = false;

//Displays the solution at the beginning of the game.
var solutionVisible = true;
//3x3 Grid for the character to see the grid from.
var limitedSight = true;
//Shows how many steps are to the solution.
var showDistances = false;

var initialWidth = 10;
var initialHeight = 10;
var width = initialWidth;/*Maze width in tiles*/
var height = initialHeight;/*Maze width in tiles*/

var offsetx;/*offset for drawing the maze to keep it centered*/
var offsety;

var targetx;/*Pathfinding target's x coordinate*/
var targety;/*Pathfinding target's y coordinate*/

var startx=1;/*Starting point x coordinate*/
var starty=1;/*Starting point y coordinate*/

var playerPositionx;
var playerPositiony;

var gameLevel = 1;
var score = 0;

var timerVar=setInterval(function(){timerFunction()},1000);
var timeLeft = 0;
var startingGameTime = 180;
var bonusTimer = 100;
var showMapPause =0;

var isMenuScreen = true;
var isInstructionScreen = false;
var isGameScreen = false;
var isGameOver = false;
var controlVisualVisible = true;

var nameInput = false;
function pageLoaded(){
	context.drawImage(menuScreenGraphic, 0, 0);
	context.drawImage(playButtonGraphic, (canvas.width/2)-(playButtonGraphic.width/2), canvas.height*0.75);
}

/*Initializes a new game.*/
function startGame(){
	isGameScreen = true;
	isMenuScreen = false;
	isInstructionScreen = false;
	gameLevel=1;
	score=0;
	timeLeft=startingGameTime;
	bonusTimer=100;	
	width = initialHeight;
	height = initialWidth;
	drawGraphics();	
	generateMap();	
	randomizeExit();
	doPathfinding();
	solutionVisible=true;
	limitedSight=false;
	drawMaze();
	isGameOver=false;
}

/**Initializes the map and prints initial tiles to the screen**/
function drawGraphics(){
	
	playerPositionx=startx;/*Initializing player position*/
	playerPositiony=starty;
	
	map=new Array(width);/*Creating first dimension of the array*/
	distanceMap=new Array(width);
	
	/*Setting up second dimension of two dimensional array.*/
	for(var j=0; j<width; j++){
		map[j]= new Array(height);
		distanceMap[j] = new Array(height);
	}
	
	/*Initiating all spaces as walls, and all distances as invalid.*/
	for(var i=0; i<height; i++){
		for(j=0; j<width; j++){
			map[j][i]='.';
			distanceMap[j][i]=-1;
		}
	}
	drawMaze();
}

/**
Starts the maze generating algorithm and then prints the map to the screen
**/
function generateMap(){
	drawSpot(1,1,Math.floor(Math.random() * 4));
	drawMaze();
}

/**
Runs pathfinding algorithm to find the shortest path to the desired space.
**/
function doPathfinding(){
	findPath(startx,starty,1);/*Finds all the distance to each point on the map from the starting point*/
	finalPath(targetx, targety);/*Creates the final path from the desired point back to the starting point*/
	drawMaze();
}

/**
Draws the current maze tiles to the canvas
**/
function drawMaze(){
	offsetx = (canvas.width/2)-(width*imgSize)/2;
	offsety = (canvas.height/2)-(height*imgSize)/2;
	context.clearRect ( 0 , 0 , canvas.width, canvas.height );/*Clearing canvas*/
	for(var i=0; i<height; i++){
		for(var j=0; j<width; j++){
			if(!limitedSight||
			(j>=playerPositionx-1&&j<=playerPositionx+1
			&&i>=playerPositiony-1&&i<=playerPositiony+1)){
				if(map[j][i]=='.'){/*Wall*/
					context.drawImage(wall, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
				} else if(map[j][i]=='P'&&solutionVisible){/*Path*/
					context.drawImage(path, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
				}else {/*Ground*/
					context.drawImage(floor, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
				}
				if(j==playerPositionx&&i==playerPositiony)
					context.drawImage(character, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
				if(j==targetx&&i==targety)
					context.drawImage(toiletGraphic, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
				if(showDistances)
					context.fillText(distanceMap[j][i], offsetx+j*imgSize, offsety+(i+1)*imgSize);
			}else{
				context.drawImage(darkSquareGraphic, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
			}
			
			if(gameLevel==1){
				context.drawImage(leftArrowGraphic, 10, (canvas.height/2)-(leftArrowGraphic.height/2));
				context.drawImage(rightArrowGraphic, canvas.width-10-rightArrowGraphic.width, (canvas.height/2)-(rightArrowGraphic.height/2));			
				context.drawImage(upArrowGraphic, (canvas.width/2)-(upArrowGraphic.width/2), 10);
				context.drawImage(downArrowGraphic, (canvas.width/2)-(downArrowGraphic.width/2), canvas.height-40-downArrowGraphic.height);
			}			
			if(controlVisualVisible){
				context.font = "17px Arial";
				context.fillText("Memorize the path to the toilet", offsetx-32, offsety-12);
				context.fillText("Then retrace the path as fast as you can!", offsetx-72, offsety+width*imgSize+16);
				
				if(fingerGraphicDown){/*Checking if the finger graphic is up or town*/
					context.drawImage(fingerGraphic, canvas.width-10-rightArrowGraphic.width, (canvas.height/2)-(rightArrowGraphic.height/2));
				}else{
					context.drawImage(fingerGraphic, canvas.width-10-rightArrowGraphic.width, (canvas.height/2)-(rightArrowGraphic.height/2)-20);
				}
			}
		}
	}
	testingOutput();
}



/**
Checks that the passed position is clear on all sides except the side it came from.
**/
function checkSpot(x, y, curx, cury){
	
	if(map[x][y]=='#')return false;/*if the spot is already a floor*/
	if(x===0||y===0)return false;/*if its one of two the edges of the map*/
	if(x==width-1||y==height-1)return false; /*if its one of the other two edges of the map*/
	
	for(var i=y-1; i<=y+1; i++){
		for(var j=x-1; j<=x+1; j++){
			if(j!=curx&&i!=cury){/*makes sure its not seeing the previous floor*/
				if(map[j][i]=='#')return false;/*if theres a floor in any space around, do not draw*/
			}
		}
	}
	return true;/*space not touching any floor*/
}



/**
prevDir: previous direction.  This makes it more likely to draw straight for a while instead of constantly turning
	
Takes in the above, and makes the current position a floor(rather than a wall)
**/
function drawSpot(x, y, prevDir){
	var turn;
	var dir; /*direction map is drawing*/
	
	map[x][y]='#'; /*sets this spot to a floor*/
	turn = Math.floor(Math.random() * 2); /*random 0 or 1, for whether it is turning left or right*/
	
	/*uncomment these if you want it to draw step by step and print each time*/
	/*printMap(map);*/
	/*usleep(100000);*/
	
	
	if(Math.floor(Math.random() * 2) == 1){/*50% chance to change direction*/
		dir = Math.floor(Math.random() * 4);/*randomly assigns one of the four possible directions*/
	}else{
		dir = prevDir;/*if direction isnt changed, set to previous direction.*/
	}
	
	
	/*checks if desired direction is available, and if it is calls this function on that spot, else turns to the next possible spot*/
	for(var i=0; i<4; i++){
		switch(dir){
			case 0:
				if(checkSpot(x, y-1, x,y))drawSpot(x, y-1, dir);
				break;
			case 1:
				if(checkSpot(x, y+1, x,y))drawSpot(x, y+1, dir);
				break;
			case 2:
				if(checkSpot(x-1, y, x,y))drawSpot(x-1, y, dir);
				break;
			case 3:
				if(checkSpot(x+1, y, x,y))drawSpot(x+1, y, dir);
				break;
		}
		
		
		if(turn){ /*checks which rotation direction*/
			dir--;/*turns that direction*/
			if(dir<0)dir=3; /*if turns past zero, puts back at 4*/
		}else{
			dir++;
			if(dir>3)dir=0;
		}
	}
	/*if all spots have been attempted, function ends and is taken off the stack.  goes back to last function call to try and branch from there*/
}



/**
Finds path to the exit of the map
**/
function findPath(curx, cury, count){
	
	map[curx][cury] = 'P';
	distanceMap[curx][cury] = count;	
	
	count++;	
	
	for (var i=0; i<4; i++){
		switch(i){
			case 0:
				if(map[curx-1][cury]=='#'||(distanceMap[curx-1][cury]>count-1&&distanceMap[curx-1][cury]>=0)){
					findPath(curx-1, cury, count);
				}
				break;
			case 1:
				if(map[curx+1][cury]=='#'||(distanceMap[curx+1][cury]>count-1&&distanceMap[curx+1][cury]>=0)){
					findPath(curx+1, cury, count);
				}
				break;
			case 2:
				if(map[curx][cury-1]=='#'||(distanceMap[curx][cury-1]>count-1&&distanceMap[curx][cury-1]>=0)){
					findPath(curx, cury-1, count);
				}
				break;
			case 3:
				if(map[curx][cury+1]=='#'||(distanceMap[curx][cury+1]>count-1&&distanceMap[curx][cury+1]>=0)){
					findPath(curx, cury+1, count);
				}
				break;
		}
	}
	map[curx][cury] = 'C';
}

function finalPath(curx, cury){
	var comparex;
	var comparey;
	
	var pathFound;
	
	if(curx==startx&&cury==starty){
		map[curx][cury]='P';
		return true;
	}
	
	for(var i=0; i<4; i++){
		switch(i){
			case 0:
				comparex=parseInt(curx)-1;
				comparey=cury;
				break;
			case 1:
				comparex=parseInt(curx)+1;
				comparey=cury;
				break;
			case 2:
				comparex=curx;
				comparey=parseInt(cury)-1;
				break;
			case 3:
				comparex=curx;
				comparey=parseInt(cury)+1;
				break;
		}
		
		if(distanceMap[comparex][comparey]>0){
			if(distanceMap[comparex][comparey]<distanceMap[curx][cury]){
				pathFound = finalPath(parseInt(comparex), parseInt(comparey));
				if(pathFound===true){
					map[curx][cury]='P';
					return true;
				}
			}
		}
	}
	return false;
}

function solutionVisibility(){
	if(solutionVisible){
		solutionVisible=false;
		limitedSight=true;
	}else{
		solutionVisible=true;
		limitedSight=false;
	}
	drawMaze();
}

function doMouseDown(event){
	if(!isMenuScreen){
	controlVisualVisible=false;
	if(!isGameOver&&showMapPause==0){
	var x = event.pageX-canvas.offsetLeft;
	var y = event.pageY-canvas.offsetTop;
	
	if(solutionVisible)solutionVisibility();

	if(x>SCREENWIDTH/2
	&&y>(SCREENHEIGHT/2)-(x-(SCREENWIDTH/2))
	&&y<(SCREENHEIGHT/2)+(x-(SCREENWIDTH/2))){
		moveRight();
	}else if(x<SCREENWIDTH/2
	&&y>(SCREENHEIGHT/2)-((SCREENWIDTH/2)-x)
	&&y<(SCREENHEIGHT/2)+((SCREENWIDTH/2)-x)){
		moveLeft();
	} else if(y>SCREENHEIGHT/2){
		moveDown();
	} else if(y<SCREENHEIGHT/2){
		moveUp();
	}
	}
	}else{
		startGame();
		isMenuScreen = false;
	}
}

/**
Movement functions.  Pretty self explanatory.
**/
function moveDown(){
	if(map[playerPositionx][playerPositiony+1]!='.'){
		if(map[playerPositionx][playerPositiony+1]=='P'){
			moveSound.currentTime=0;
			moveSound.play();
		}else{
			badMoveSound.play();
		}
		playerPositiony++;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}else{
		wallSound.currentTime=0;
		wallSound.play();
	}
	checkForExit()
	drawMaze();
}
function moveUp(){
	if(map[playerPositionx][playerPositiony-1]!='.'){
		if(map[playerPositionx][playerPositiony-1]=='P'){
			moveSound.currentTime=0;
			moveSound.play();
		}else{
			badMoveSound.play();
		}
		playerPositiony--;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}else{
		wallSound.currentTime=0;
		wallSound.play();
	}
	checkForExit()
	drawMaze();
}
function moveRight(){
	if(map[playerPositionx+1][playerPositiony]!='.'){
		if(map[playerPositionx+1][playerPositiony]=='P'){
			moveSound.currentTime=0;
			moveSound.play();
		}else{
			badMoveSound.play();
		}
		playerPositionx++;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}else{
		wallSound.currentTime=0;
		wallSound.play();
	}
	checkForExit()
	drawMaze();
}
function moveLeft(){
	if(map[playerPositionx-1][playerPositiony]!='.'){
		if(map[playerPositionx-1][playerPositiony]=='P'){
			moveSound.currentTime=0;
			moveSound.play();
		}else{
			badMoveSound.play();
		}		
		playerPositionx--;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}else{
		wallSound.currentTime=0;
		wallSound.play();
	}
	checkForExit()
	drawMaze();
}

function checkForExit(){
	if(playerPositionx==targetx&&playerPositiony==targety){
		levelComplete.play();
		score+=100+bonusTimer;
		gameLevel++;
		if(parseInt(width)+2<=24&&parseInt(height)+2<=24&&gameLevel%2==0){
			width+=2;
			height+=2;
			if(canvas.width-(imgSize*width)<70){
				imgSize = (canvas.width-70)/width;
			}
		}
		showMapPause = 2;
		drawGraphics();
		generateMap();
		randomizeExit();
		doPathfinding();
		solutionVisibility();
		testingOutput();
	}
}

/**
just a function for printing out info prior to the ui
**/
function testingOutput(){
	context.font = "17px Arial";
	var output = "Level: "+gameLevel+"  Score: "+score+"  Time: "+timeLeft;
	context.fillText(output, 10, canvas.height-20);
}


function randomizeExit(){
	targetx = Math.floor(Math.random() * (width/2))+width/2-1;
	targety = Math.floor(Math.random() * (height/2))+height/2-1;
	
	if(map[targetx][targety]=="."){
	for(var i=0; i<4; i++){
		switch(i){
			case 0:
				if(map[targetx+1][targety]!="."){
					targetx+=1;
					return;
				}
				break;
			case 1:
				if(map[targetx-1][targety]!="."){
					targetx-=1;
					return;
				}
				break;
			case 2:
				if(map[targetx][targety+1]!="."){
					targety+=1;
					return;
				}
				break;
			case 3:
				if(map[targetx][targety-1]!="."){
					targety-=1;
					return;
				}
				break;
		}
	}
	randomizeExit();
	}
}

function onPath(){
	return map[playerPositionx][playerPositiony]=='P';
}

function timerFunction(){
	fingerGraphicDown=!fingerGraphicDown;/*moving the finger up or down*/
	if(showMapPause>0)showMapPause--;
	if(isGameScreen){
	if(timeLeft>0){
	if(!controlVisualVisible){
		timeLeft--;
		if(bonusTimer>0)bonusTimer--;
	}
	drawMaze();
	}else if (!isGameOver){
		gameOverSound.play();
		isGameOver=true;
		drawGameOver();
		nameInput = true;
		sendphp();
	}
	}
}

function drawGameOver(){
	context.clearRect ( 0 , 0 , canvas.width, canvas.height );/*Clearing canvas*/
	context.drawImage(gameOverGraphic, (canvas.width/2)-82, (canvas.width/2)-154);
	testingOutput();
}


function sendphp() {
    if (nameInput) {
        var name = prompt("Enter your name:", "Player");
        if(name != null){
            var req;
            if(window.XMLHttpRequest){
                req = new XMLHttpRequest();
            }else{
                req = new ActiveXObject("Microsoft.XMLHTTP");
            }

            req.onreadystatechange = function (e) {
                if (req.readyState == 4) {
                //    alert(req.responseText + "success.    name:"+name+", score: "+score+", level: "+gameLevel);
                } else {
                //    alert("Error loading page." + req.readyState);
                }
            }
        

            req.open("POST", "leader.php" ,true);

            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            req.send("name=" + name + "&score=" + score + "&level=" + gameLevel);

            
        
        }
        setTimeout(function () { location.href = "./leader.php"; }, 500);
        nameInput = false; 
    }

}

/*
This code fixed the double tap function on mobile devices
src=http://stackoverflow.com/questions/10614481/disable-double-tap-zoom-option-in-browser-on-touch-devices
*/
(function($) {
  $.fn.nodoubletapzoom = function() {
      $(this).bind('touchstart', function preventZoom(e) {
        var t2 = e.timeStamp
          , t1 = $(this).data('lastTouch') || t2
          , dt = t2 - t1
          , fingers = e.originalEvent.touches.length;
        $(this).data('lastTouch', t2);
        if (!dt || dt > 500 || fingers > 1) return; // not double-tap

        e.preventDefault(); // double tap - prevent the zoom
        // also synthesize click events we just swallowed up
        $(this).trigger('click').trigger('click');
      });
  };
})(jQuery);
