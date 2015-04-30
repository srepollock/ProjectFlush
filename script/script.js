function changeGame(){
	var pic = document.getElementById('startImage');
	pic.src = "pics/RushToFlush-Main-320x480.png";
	pic.id = "mainGame";
	pic.className = "";
	pic.onclick = "showSolution()";
	var btn = document.getElementById('start');
	btn.onclick = showSolution;
	btn.innerHTML = "Next";
};
function showSolution(){
	var pic = document.getElementById('mainGame');
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
	pic.id = "startImage";
	btn.onclick = changeGame;
}