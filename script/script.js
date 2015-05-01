function changeGame(){
	var pic = document.getElementById('startImage');
	pic.src = "pics/RushToFlush-Main-320x480.png";
	pic.id = "mainGame";
	pic.className = "";
	var btn = document.getElementById('start');
	btn.onclick = showControls;
	btn.innerHTML = "Next";
};
function showControls(){
	var pic = document.getElementById('mainGame');
	pic.src = "pics/RushToFlush-Controls-320x480.png";
	pic.id = "controls";
	var btn = document.getElementById('start');
	btn.onclick = showInstructions;
};
function showInstructions(){
	var pic = document.getElementById('controls');
	pic.src = "pics/RushToFlush-Instructions-320x480.png";
	pic.id = "instructions";
	var btn = document.getElementById('start');
	btn.onclick = showSolution;
};
function showSolution(){
	var pic = document.getElementById('instructions');
	pic.src = "pics/RushToFlush-Solution-320x480.png";
	pic.id = "solution";
	var btn = document.getElementById('start');
	btn.onclick = showGame;
};
function showGame(){
	var pic = document.getElementById('solution');
	pic.src = "pics/RushToFlush-Game-320x480.png";
	pic.id = "game";
	var btn = document.getElementById('start');
	btn.onclick = showEnd;
};
function showEnd(){
	var pic = document.getElementById('game');
	pic.src = "pics/RushToFlush-GameOver-320x480.png";
	pic.id = "end";
	var btn = document.getElementById('start');
	pic.id = "startImage";
	btn.onclick = changeGame;
};