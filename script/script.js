var someCan;
zebra.ready(function() {
                    // creates a canvas to put the ui on
                    var can = new zebra.ui.zCanvas("canMid");
                    someCan = can;
                    // image for the background
                    var toilet = new zebra.ui.ImagePan("./pics/pic2.png");
                    // play button
                    var play = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/PlayButton.png"));
                    // instructions button
                    var inst = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/InstructionsButton.png"));
                    // basic functionality
                    // *later on need to add sounds to this
                    play.bind(function() {
                        create();
                    });
                    inst.bind(function() {
                        window.alert("Instructions Pressed");
                    });
                    // sets a bland border around the canvas
                    can.setBorder(zebra.ui.borders.plain);
                    // Sets the layout to have TOP, CENTER, LEFT, RIGHT, BOTTOM
                    can.root.setLayout(new zebra.layout.BorderLayout(8));
                    can.root.add(zebra.layout.CENTER, toilet);
                    // Creates a new panel with a new layout inside it called a FlowLayout
                    // This is just to easily flow the buttons onto the page
                    var botP = new zebra.ui.Panel(new zebra.layout.FlowLayout(
                        zebra.layout.CENTER, zebra.layout.BOTTOM, zebra.layout.VERTICAL, 2));
                    // Adds the buttons to the panel
                    botP.add(play);
                    botP.add(inst);
                    // Adds the panel to the page
                    can.root.add(zebra.layout.BOTTOM, botP);
                });

var canvas = document.getElementById("canGame");
var context = canvas.getContext("2d");
canvas.addEventListener("mousedown", doMouseDown, true);

var moveSound = new Audio();
moveSound.src = "./sound/move.wav";
var badMoveSound = new Audio();
badMoveSound.src = "./sound/badMoveSound.wav";
var levelComplete = new Audio();
levelComplete.src = "./sound/levelComplete.wav";

var SCREENWIDTH = canvas.width;
var SCREENHEIGHT = canvas.height;

var map;/*Array that the maze is kept within*/
var distanceMap;/*A map of all move distances from the starting point*/

var wall = new Image();
wall.src="./pics/wall.png";
var floor = new Image();
floor.src="./pics/floor.png";
var path = new Image();
path.src="./pics/path.png";
var character = new Image();
character.src="./pics/character.png";
var imgSize = 16;/*pixel width and height of tiles*/

var solutionVisible = true;
var limitedSight = true;
var showDistances = false;

var width;/*Maze width in tiles*/
var height;/*Maze width in tiles*/

var targetx;/*Pathfinding target's x coordinate*/
var targety;/*Pathfinding target's y coordinate*/

var startx=1;/*Starting point x coordinate*/
var starty=1;/*Starting point y coordinate*/

var playerPositionx;
var playerPositiony;

/**Initializes the map and prints initial tiles to the screen**/
function drawGraphics(){
	width = document.getElementById("widthInput").value;/*Grabbing height and width from the html input fields*/
	height = document.getElementById("heightInput").value;
	
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
	targetx = document.getElementById("targetXInput").value;/*Grabbing target coordinates from html input fields*/
	targety = document.getElementById("targetYInput").value;
	findPath(startx,starty,1);/*Finds all the distance to each point on the map from the starting point*/
	finalPath(targetx, targety);/*Creates the final path from the desired point back to the starting point*/
	drawMaze();
}

/**
Draws the current maze tiles to the canvas
**/
function drawMaze(){
	context.clearRect ( 0 , 0 , canvas.width, canvas.height );/*Clearing canvas*/
	for(var i=0; i<height; i++){
		for(var j=0; j<width; j++){
			if(!limitedSight||
			(j>=playerPositionx-1&&j<=playerPositionx+1
			&&i>=playerPositiony-1&&i<=playerPositiony+1)){
				if(map[j][i]=='.'){/*Wall*/
					context.drawImage(wall, j*imgSize, i*imgSize, imgSize, imgSize);
				} else if(map[j][i]=='P'&&solutionVisible){/*Path*/
					context.drawImage(path, j*imgSize, i*imgSize, imgSize, imgSize);
				}else {/*Ground*/
					context.drawImage(floor, j*imgSize, i*imgSize, imgSize, imgSize);
				}
				if(j==playerPositionx&&i==playerPositiony)
					context.drawImage(character, j*imgSize, i*imgSize, imgSize, imgSize);
				if(showDistances)
					context.fillText(distanceMap[j][i], j*imgSize, (i+1)*imgSize);
			}else{
				context.drawImage(wall, j*imgSize, i*imgSize, imgSize, imgSize);
			}
		}
	}
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
	var x = event.pageX;
	var y = event.pageY-177;

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

/**
Movement functions.  Pretty self explanatory.
**/
function moveDown(){
	if(map[playerPositionx][playerPositiony+1]!='.'){
		if(map[playerPositionx][playerPositiony+1]=='P'){
			moveSound.play();
		}else{
			badMoveSound.play();
		}
		playerPositiony++;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}
	checkForExit()
	drawMaze();
}
function moveUp(){
	if(map[playerPositionx][playerPositiony-1]!='.'){
		if(map[playerPositionx][playerPositiony-1]=='P'){
			moveSound.play();
		}else{
			badMoveSound.play();
		}
		playerPositiony--;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}
	checkForExit()
	drawMaze();
}
function moveRight(){
	if(map[playerPositionx+1][playerPositiony]!='.'){
		if(map[playerPositionx+1][playerPositiony]=='P'){
			moveSound.play();
		}else{
			badMoveSound.play();
		}
		playerPositionx++;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}
	checkForExit()
	drawMaze();
}
function moveLeft(){
	if(map[playerPositionx-1][playerPositiony]!='.'){
		if(map[playerPositionx-1][playerPositiony]=='P'){
			moveSound.play();
		}else{
			badMoveSound.play();
		}		
		playerPositionx--;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}
	checkForExit()
	drawMaze();
}

function checkForExit(){
	if(playerPositionx==targetx&&playerPositiony==targety){
		levelComplete.play();
		if(parseInt(width)+2<=24&&parseInt(height)+2<=24){
			document.getElementById("widthInput").value=parseInt(width)+2;
			document.getElementById("heightInput").value=parseInt(height)+2;
		}
		drawGraphics();
		generateMap();
		randomizeExit();		
		document.getElementById("targetXInput").value=parseInt(targetx);
		document.getElementById("targetYInput").value=parseInt(targety);
		doPathfinding();
	}
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
	}
}

function onPath(){
	return map[playerPositionx][playerPositiony]=='P';
}

function create(){
	drawGraphics();
	generateMap();
	doPathfinding();
}

function showCanvas(){
	if(someCan.style.visibility=='visible'){
		canvas.style.visibility='visible';
		someCan.style.visibility='hidden';
	}else{
		canvas.style.visibility='hidden';
		someCan.style.visibility='visible';
	}
}