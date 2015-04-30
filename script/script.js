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
};