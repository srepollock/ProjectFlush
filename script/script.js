function changeGame(){
	var pic = document.getElementById('startImage');
	pic.src = "pics/RushToFlush-Main-320x480.png";
	pic.id = "mainGame";
	pic.className = "";
	var btn = document.getElementById('start');
	btn.parentNode.removeChild(btn);
};