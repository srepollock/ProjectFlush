zebra.ready(function() {
	// creates a canvas to put the ui on
	var can = new zebra.ui.zCanvas("canMid");
	// image for the background
	var toilet = new zebra.ui.ImagePan("./pics/pic2.png");
	// play button
	var play = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/PlayButton.png"));
	// instructions button
	var inst = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/InstructionsButton.png"));
	// leaderboards button
	var lead = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/LeaderboardsButton.png"));
	// basic functionality
	// *later on need to add sounds to this
	play.bind(function() {
		window.location.href = "game.html";
	});
	inst.bind(function() {
		window.alert("Instructions Pressed");
	});
	lead.bind(function() {
		window.location.href = "leader.html";
	})
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
	botP.add(lead);
	// Adds the panel to the page
	can.root.add(zebra.layout.BOTTOM, botP);
});
