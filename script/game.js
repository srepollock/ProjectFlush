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
document.onkeydown = doKeyDown;

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
var achievementSound = new Audio();
achievementSound.src = "./sound/achievement.wav";
var timeLowSound = new Audio();
timeLowSound.src = "./sound/timeLow.wav";


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
var hintButtonGraphic = new Image();
hintButtonGraphic.src="./pics/hintButton.png";
var lowerBackgroundGraphic = new Image();
lowerBackgroundGraphic.src="./pics/lowerBackground.png";
var speakerGraphic = new Image();
speakerGraphic.src = "./pics/speaker.png";
var mutedGraphic = new Image();
mutedGraphic.src = "./pics/crossSpeaker.png";
var windowGraphic = new Image();
windowGraphic.src = "./pics/messageWindow.png";
var pauseGraphic = new Image();
pauseGraphic.src = "./pics/pause.png";
var pausedTextGraphic = new Image();
pausedTextGraphic.src = "./pics/paused.png";
var achievementsWindowGraphic = new Image();
achievementsWindowGraphic.src = "./pics/achievementsWindow.png";
var checkMarkGraphic = new Image();
checkMarkGraphic.src = "./pics/checkMark.png";
var trophyGraphic = new Image();
trophyGraphic.src = "./pics/achievement.png";

var imgSize = 16;/*pixel width and height of tiles*/
var fingerGraphicDown = false;

//coordinates of hint button
var hintButtonX = canvas.width*0.82;
var hintButtonY = canvas.height-30;
var hintCost = 20;

var muteButtonX = canvas.width*0.90;
var muteButtonY = 10;
var isMuted = false;

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

//Players x,y position on the tileMap
var playerPositionx;
var playerPositiony;

var gameLevel = 1;
var score = 0;

//setting up game timing
var timerVar=setInterval(function(){timerFunction()},1000);
var timeLeft = 0;
var startingGameTime = 180;
var bonusTimer = 100;//bonus level completion points, decremented one per second
var showMapPause =0;//pause timer at the beginning of each level so no accidental solution skips

//Some boolean variables to determine which screen and where in the game the player is at
var isMenuScreen = true;
var isGameScreen = false;
var isGameOver = false;
var controlVisualVisible = true;
var isAchievementMenu = false;

//Which browser the user is using
var userBrowser = "Unknown";

//achievements
var firstLevelAchievement = false;
var firstPlayAchievement = false;
var firstHintAchievement = false;
var fifthLevelAchievement = false;

//Codes for keys to be ignored by page navigation.
var movementKeyArray=new Array(33,34,35,36,37,38,39,40);

//variables for achievement messages to be displayed.
var messages = new Array(4);
var isShowingMessage = false;

var isPaused = false;


var nameInput = false;

/*
	Function to start the game.  called from html when the page is finished loading.
*/
function pageLoaded(){
	checkBrowser();
	loadCookie();
	
	//Tells the page to not scroll on keys used for movement in game
	$(document).keydown(function(e) {
		var key = e.which;
		if($.inArray(key,movementKeyArray) > -1) {
			e.preventDefault();
			return false;
		}
		return true;
	});
	context.fillStyle="#41ADFF";
	context.fillRect( 0 , 0 , canvas.width, canvas.height );/*Clearing canvas*/
	context.drawImage(menuScreenGraphic, canvas.width/2-menuScreenGraphic.width/2, 0);
	context.drawImage(playButtonGraphic, (canvas.width/2)-(playButtonGraphic.width/2), canvas.height*0.75);
}

/*
	Initializes a new game.
*/
function startGame(){
	isGameScreen = true;
	isMenuScreen = false;
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
	//xy offsets so that the map is centered in the canvas
	offsetx = (canvas.width/2)-(width*imgSize)/2;
	offsety = (canvas.height/2)-(height*imgSize)/2;
	
	//Drawing coloured background, and then setting draw colour back to black.
	context.fillStyle="#D1FFF0";
	context.fillRect( 0 , 0 , canvas.width, canvas.height );/*Clearing canvas*/	
	context.fillStyle="#000000";
	
	
	for(var i=0; i<height; i++){
		for(var j=0; j<width; j++){
			
			//If they can see the whole map, or the position is located directly next to the player.
			if(!limitedSight||
			((j>=playerPositionx-1&&j<=playerPositionx+1
			&&i>=playerPositiony-1&&i<=playerPositiony+1)&&!isPaused)){
				
				if(map[j][i]=='.'){/*Wall*/
					context.drawImage(wall, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
				} else if(map[j][i]=='P'&&solutionVisible){/*Path*/
					context.drawImage(path, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
				}else {/*Ground*/
					context.drawImage(floor, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
				}
				
				if(j==playerPositionx&&i==playerPositiony)/*player*/
					context.drawImage(character, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
					
				if(j==targetx&&i==targety)/*toilet (maze end)*/
					context.drawImage(toiletGraphic, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
				
				if(showDistances)/*showing movement distance from the player to this tile*/
					context.fillText(distanceMap[j][i], offsetx+j*imgSize, offsety+(i+1)*imgSize);
					
			}else{
				//if it isnt a tile the player can see, draw a black square.
				context.drawImage(darkSquareGraphic, offsetx+j*imgSize, offsety+i*imgSize, imgSize, imgSize);
			}
			
			if(isPaused)context.drawImage(pausedTextGraphic, canvas.width/2-pausedTextGraphic.width/2, canvas.height/2-pausedTextGraphic.height/2);
			
			//Drawing lower background panel
			context.drawImage(lowerBackgroundGraphic, 0, canvas.height-40, canvas.width, 40);
			//Drawing hint button
			context.drawImage(hintButtonGraphic, hintButtonX, hintButtonY, 50, 20);
			//Drawing mute button
			if(isMuted){
				context.drawImage(mutedGraphic, muteButtonX, muteButtonY);
			}else{
				context.drawImage(speakerGraphic, muteButtonX, muteButtonY);
			}
			
			//Drawing upper buttons
			context.drawImage(trophyGraphic, muteButtonX-20, muteButtonY);
			context.drawImage(pauseGraphic, muteButtonX-40, muteButtonY);
			
			//Drawing guide graphics for first level
			if(gameLevel==1){
				context.drawImage(leftArrowGraphic, 10, (canvas.height/2)-(leftArrowGraphic.height/2));
				context.drawImage(rightArrowGraphic, canvas.width-10-rightArrowGraphic.width, (canvas.height/2)-(rightArrowGraphic.height/2));			
				context.drawImage(upArrowGraphic, (canvas.width/2)-(upArrowGraphic.width/2), 10);
				context.drawImage(downArrowGraphic, (canvas.width/2)-(downArrowGraphic.width/2), canvas.height-40-downArrowGraphic.height);
			}		
			//Text portion of guide graphics
			if(controlVisualVisible){
				context.font = "17px Arial";
				context.fillText("Memorize this path to the toilet", offsetx-32, offsety-12);
				context.fillText("Then retrace it as fast as you can!", offsetx-50, offsety+width*imgSize+16);
				
				if(fingerGraphicDown){/*Checking if the finger graphic is up or down*/
					context.drawImage(fingerGraphic, canvas.width-10-rightArrowGraphic.width, (canvas.height/2)-(rightArrowGraphic.height/2));
				}else{
					context.drawImage(fingerGraphic, canvas.width-10-rightArrowGraphic.width, (canvas.height/2)-(rightArrowGraphic.height/2)-20);
				}
			}
			
			//Drawing graphic for achievement menu window
			if(isAchievementMenu){
				context.drawImage(achievementsWindowGraphic, canvas.width/2-achievementsWindowGraphic.width/2, canvas.height/2-achievementsWindowGraphic.height/2);				
				if(firstPlayAchievement)context.drawImage(checkMarkGraphic, canvas.width/2-achievementsWindowGraphic.width/2+20, canvas.height/2-achievementsWindowGraphic.height/2+44);
				if(firstLevelAchievement)context.drawImage(checkMarkGraphic, canvas.width/2-achievementsWindowGraphic.width/2+20, canvas.height/2-achievementsWindowGraphic.height/2+74);
				if(firstHintAchievement)context.drawImage(checkMarkGraphic, canvas.width/2-achievementsWindowGraphic.width/2+20, canvas.height/2-achievementsWindowGraphic.height/2+104);
				if(fifthLevelAchievement)context.drawImage(checkMarkGraphic, canvas.width/2-achievementsWindowGraphic.width/2+20, canvas.height/2-achievementsWindowGraphic.height/2+136);
			}
			
			//draw achievement window if its currently being displayed
			if(isShowingMessage)displayAchievement();
		}
	}
	//prints score and time at the bottom of the screen
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
	maps out the distance in moves to every possible position in the map from the start position.
	the steps are saved in the 2d array called distance map.
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

/*
	Finalizes the pathfinding, drawing a path along the shortest movements to get to the end.
	Starts at the passed position and follows the path of least steps back to the beginning
*/
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
				if(pathFound===true){//once it finds true it is passed back through the stack marking the path to the exit
					map[curx][cury]='P';
					return true;
				}
			}
		}
	}
	return false;
}

/*
	Flips visibility of the map solution.
*/
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

/**
	Function for handling mouse events.
**/
function doMouseDown(event){
	var x = event.pageX-canvas.offsetLeft;
	var y = event.pageY-canvas.offsetTop;
	
	if(isShowingMessage){
		isShowingMessage=false;
		drawMaze();
		return;
	}
	
	if(isAchievementMenu){
		isAchievementMenu=false;
		isPaused=false;
		drawMaze();
		return;
	}
	
	if(!isMenuScreen){
	

	controlVisualVisible=false;
	if(!isGameOver&&showMapPause==0){
	
	if(buttonPressed(x,y))return;
	
	if(!isPaused){
	
	if(solutionVisible)solutionVisibility();
	
	//Checks which quadrant of the screen the mouse click was in
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
	}
	}else{//if there was a click, but it is in the menu screen, start game
		startGame();
		isMenuScreen = false;
		if(firstPlayAchievement==false)gainAchievement(1);
	}
}

/**
	Movement functions.  Pretty self explanatory.
	wrote specific commends only for moveDown, is same for all other move functions.
**/
function moveDown(){
	if(map[playerPositionx][playerPositiony+1]!='.'){//If desired position is not a wall  . = wall 
		if(map[playerPositionx][playerPositiony+1]=='P'){ //If desired position is on the path
			if(userBrowser!="Unknown")moveSound.currentTime=0; //If not using an unknown browser, or IE
			if(!isMuted)moveSound.play();
		}else{//else play bad move sound
			if(!isMuted)badMoveSound.play();
		}
		playerPositiony++;//move down
		if(!onPath()){//if not on path after move, teleport back to start
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}else{//else, trying to move to a wall.  play wall collision sound
		wallSound.currentTime=0;
		if(!isMuted)wallSound.play();
	}
	checkForExit()//check if they have reached the exit
	drawMaze();
}
function moveUp(){
	if(map[playerPositionx][playerPositiony-1]!='.'){
		if(map[playerPositionx][playerPositiony-1]=='P'){
			if(userBrowser!="Unknown")moveSound.currentTime=0;
			if(!isMuted)moveSound.play();
		}else{
			if(!isMuted)badMoveSound.play();
		}
		playerPositiony--;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}else{
		wallSound.currentTime=0;
		if(!isMuted)wallSound.play();
	}
	checkForExit()
	drawMaze();
}
function moveRight(){
	if(map[playerPositionx+1][playerPositiony]!='.'){
		if(map[playerPositionx+1][playerPositiony]=='P'){
			if(userBrowser!="Unknown")moveSound.currentTime=0;
			if(!isMuted)moveSound.play();
		}else{
			if(!isMuted)badMoveSound.play();
		}
		playerPositionx++;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}else{
		wallSound.currentTime=0;
		if(!isMuted)wallSound.play();
	}
	checkForExit()
	drawMaze();
}
function moveLeft(){
	if(map[playerPositionx-1][playerPositiony]!='.'){
		if(map[playerPositionx-1][playerPositiony]=='P'){
			if(userBrowser!="Unknown")moveSound.currentTime=0;
			if(!isMuted)moveSound.play();
		}else{
			if(!isMuted)badMoveSound.play();
		}		
		playerPositionx--;
		if(!onPath()){
			playerPositionx=startx;
			playerPositiony=starty;
		}
	}else{
		wallSound.currentTime=0;
		if(!isMuted)wallSound.play();
	}
	checkForExit()
	drawMaze();
}

/*
	Checks if the player is on the exit tile
	if so, generates the next level
*/
function checkForExit(){
	if(playerPositionx==targetx&&playerPositiony==targety){
		if(!isMuted)levelComplete.play();
		score+=100+bonusTimer;
		
		//Gives you achievement for beating first level if you dont already have it.
		if(gameLevel==1&&firstLevelAchievement==false)gainAchievement(0);
		
		if(gameLevel==5&&fifthLevelAchievement==false)gainAchievement(3);
		
		gameLevel++;

		if(parseInt(width)+2<=24&&parseInt(height)+2<=24&&gameLevel%2==0){//if map is under max size, increase size
			width+=2;
			height+=2;
			if(canvas.width-(imgSize*width)<70){//if map is getting too big, resize tiles.
				imgSize = (canvas.width-70)/width;
			}
		}
		//setting up next level.
		showMapPause = 1;
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
	Ended up being the final print function.
**/
function testingOutput(){
	context.font = "17px Arial";
	var output = "Level: "+gameLevel+"  Score: "+score+"  Time: "+timeLeft;
	context.fillText(output, 10, canvas.height-20);
}

/*
	Function to randomize exit position at the beginning of each level
*/
function randomizeExit(){
	targetx = Math.floor(Math.random() * (width/2))+width/2-1;//picks random position for exit on the further half of the level
	targety = Math.floor(Math.random() * (height/2))+height/2-1;
	
	if(map[targetx][targety]=="."){//if desired ending is a wall, check the four adjacent directions until you find a legal space
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
	randomizeExit();//if a legal space is not found, try again
	}
}

/*
	Checks that tile is on pathfinding path
*/
function onPath(){
	return map[playerPositionx][playerPositiony]=='P';
}

/*
	Takes care of all the count downs and anything that triggers on time.
*/
function timerFunction(){
	fingerGraphicDown=!fingerGraphicDown;/*moving the finger up or down*/
	if(showMapPause>0)showMapPause--;
	if(isGameScreen){
	if(timeLeft>0){
	if(!controlVisualVisible&&!isShowingMessage&&!isPaused){//if game is in a state where the clock is ticking
		if(!isMuted&&timeLeft<=10)timeLowSound.play();
		timeLeft--;
		if(bonusTimer>0)bonusTimer--;
	}
	drawMaze();
	}else if (!isGameOver){//time is up, cause a game over
		if(!isMuted)gameOverSound.play();
		isGameOver=true;
		drawGameOver();
		nameInput = true;
		sendphp();
	}
	}
}

/*
	Draws game over screen to canvas
*/
function drawGameOver(){
	context.clearRect ( 0 , 0 , canvas.width, canvas.height );/*Clearing canvas*/
	context.drawImage(gameOverGraphic, (canvas.width/2)-82, (canvas.width/2)-154);
	testingOutput();//print final score
}

/*
	Sends the score to the database for the leaderboard.
*/
function sendphp() {
	//when game is over, nameInput will true.
    if (nameInput) {
        var name = prompt("Enter your name:", "Player");
		//only post the values when player input the name.
        if(name != null){
            var req;
            if(window.XMLHttpRequest){
                req = new XMLHttpRequest();
            }else{ //IE version
                req = new ActiveXObject("Microsoft.XMLHTTP");
            }
            req.open("POST", "leader.php" ,true);
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            req.send("name=" + name + "&score=" + score + "&level=" + gameLevel);
        }
		//time interval for updating database
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

/*
	Checks which browser the user is using.  keeps as Unknown if it isn't one listed, such as IE.
*/
function checkBrowser(){
	var browserInfo = navigator.userAgent;
	if(browserInfo.indexOf("Firefox")!=-1)userBrowser="Firefox";
	if(browserInfo.indexOf("Chrome")!=-1)userBrowser="Chrome";
	if(browserInfo.indexOf("Safari")!=-1)userBrowser="Safari";
}

/*
	Loads and extracts variables from stored cookie
*/
function loadCookie(){
	var cookieString = document.cookie; //Stick cookie in a string
	
	if(cookieString==""){//if no cookie, create a new one
		//alert("Empty cookie");
		saveCookie();
	}
	
	//check if the cookie string contains firstLevelAchievement = true and set the current variable to true if true
	if(cookieString.indexOf("firstLevelAchievement=true")!=-1){
		firstLevelAchievement = true;
		//alert("first level achievement loaded true.");
	}
	//check if the cookie string contains firstPlayAchievement = true and set the current variable to true if true
	if(cookieString.indexOf("firstPlayAchievement=true")!=-1){
		firstPlayAchievement = true;
		//alert("first play achievement loaded true.");
	}
	//check if the cookie string contains firstHintAchievement = true and set the current variable to true if true
	if(cookieString.indexOf("firstHintAchievement=true")!=-1){
		firstHintAchievement = true;
		//alert("first hint achievement loaded true.");
	}
	//check if the cookie string contains fifthLevelAchievement = true and set the current variable to true if true
	if(cookieString.indexOf("fifthLevelAchievement=true")!=-1){
		fifthLevelAchievement = true;
		//alert("fifth level achievement loaded true.");
	}
}

/*
	Saves achievements to the game cookie
*/
function saveCookie(){
	var expiration = new Date();
	expiration.setFullYear(expiration.getFullYear()+2);//setting cookie expiration from current time
	document.cookie="firstLevelAchievement="+firstLevelAchievement+"; expires="+expiration.toGMTString();
	document.cookie="firstPlayAchievement="+firstPlayAchievement+"; expires="+expiration.toGMTString();
	document.cookie="firstHintAchievement= "+firstHintAchievement+"; expires="+expiration.toGMTString();
	document.cookie="fifthLevelAchievement= "+fifthLevelAchievement+"; expires="+expiration.toGMTString();
}

/*
	Gain an achievement by number passed: 0=first level, 1=first play, 2=first use of hint button
*/
function gainAchievement(achievementNum){
	switch(achievementNum){
		case 0:
		firstLevelAchievement=true;
		drawMaze();
		messages[0] = "     First level";
		messages[1] = "   achievement";
		messages[2] = "     unlocked!";
		isShowingMessage=true;
		if(!isMuted)achievementSound.play();
		drawMaze();
		saveCookie();
		break;
		
		case 1:
		firstPlayAchievement=true;
		drawMaze();
		messages[0] = "     First play";
		messages[1] = "   achievement";
		messages[2] = "     unlocked!";
		isShowingMessage=true;
		if(!isMuted)achievementSound.play();
		drawMaze();
		saveCookie();
		break;
		
		case 2:
		firstHintAchievement=true;
		drawMaze();
		messages[0] = "     First hint";
		messages[1] = "   achievement";
		messages[2] = "     unlocked!";
		isShowingMessage=true;
		if(!isMuted)achievementSound.play();
		drawMaze();
		saveCookie();
		break;
		
		case 3:
		fifthLevelAchievement=true;
		drawMaze();
		messages[0] = "     Fifth level";
		messages[1] = "   achievement";
		messages[2] = "     unlocked!";
		isShowingMessage=true;
		if(!isMuted)achievementSound.play();
		drawMaze();
		saveCookie();
		break;
	}
}

/*
	Function for handling keyboard movement.
*/
function doKeyDown(event){
	
	if(!isMenuScreen){
	controlVisualVisible=false;
	if(!isGameOver&&showMapPause==0&&!isShowingMessage&&!isPaused){
	
	
	if(solutionVisible)solutionVisibility();

	event = event || window.event;
	
	
	if (event.keyCode == '38') {//up
        moveUp();
    }
    else if (event.keyCode == '40') {//down
		moveDown();
    }
    else if (event.keyCode == '37') {//left
       moveLeft();
    }
    else if (event.keyCode == '39') {//right
       moveRight();
    }
	}
	}else{
		startGame();
		isMenuScreen = false;
	}
}

/*
	Takes x and y parameters of where the mouse was clicked
	checks if position clicked is in bounds of any on screen buttons
*/
function buttonPressed(x,y){
	/*checking if the hint button was pressed*/
	if(x>hintButtonX&&x<hintButtonX+hintButtonGraphic.width
		&&y>hintButtonY&&y<hintButtonY+hintButtonGraphic.height&&!isPaused){
		if(!solutionVisible&&limitedSight){
			solutionVisible=true;
			limitedSight=false;
			if(firstHintAchievement==false)gainAchievement(2);
			/*minuses the hint cost from the time left.  sets it to 0 if it would be negative.*/
			if(timeLeft-hintCost<0)timeLeft=0;
			else timeLeft-=hintCost;
			drawMaze();
		}
		return true;//if button is pressed, return so that it isn't registered as a movement click.
	}
	
	/*Checking if mute button was pressed*/
	if(x>muteButtonX&&x<muteButtonX+speakerGraphic.width
		&&y>muteButtonY&&y<muteButtonY+speakerGraphic.height){
		isMuted=!isMuted;
		drawMaze();
		return true;
	}
	
	/*Checking if achievements button was pressed*/
	if(x>muteButtonX-20&&x<muteButtonX+trophyGraphic.width
		&&y>muteButtonY&&y<muteButtonY+trophyGraphic.height){
		isPaused=true;
		isAchievementMenu=true;
		drawMaze();
		return true;
	}
	
	/*Checking if pause button was pressed*/
	if(x>muteButtonX-40&&x<muteButtonX+pauseGraphic.width
		&&y>muteButtonY&&y<muteButtonY+pauseGraphic.height){
		isPaused=!isPaused;
		limitedSight=true;
		solutionVisible=false;
		drawMaze();
		return true;
	}
}

/*
	Draws a window with text on screen.
*/
function displayAchievement(){
	context.drawImage(windowGraphic, canvas.width/2-windowGraphic.width/2, canvas.height/2-windowGraphic.height/2);
	for(var i=0; i<4; i++){
		if(messages[i]!=undefined)context.fillText(messages[i], (canvas.width/2-windowGraphic.width/2)+12, (canvas.height/2-windowGraphic.height/2)+50+(i*20));
	}
}