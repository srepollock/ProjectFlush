zebra.ready(function() {
	var canvas = new zebra.ui.zCanvas("can2");
    var toilet = new zebra.ui.ImagePan("./pics/pic2.png");
    var play = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/PlayButton.png"));
    var inst = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/InstructionsButton.png"));
    play.bind(function() {
        window.alert("Play Pressed");
    });
    inst.bind(function() {
    window.alert("Instructions Pressed");
    });
    canvas.setBorder(zebra.ui.borders.plain);
    canvas.root.setLayout(new zebra.layout.BorderLayout(8));
    // Read documentation for the first page, but this is just showing
    // how the page renders the buttons in order of when they are written
    canvas.root.add(zebra.layout.CENTER, toilet);
    canvas.root.add(zebra.layout.BOTTOM, new zebra.ui.Button("Loads bottom up in panel"));
    canvas.root.add(zebra.layout.BOTTOM, inst);
    canvas.root.add(zebra.layout.BOTTOM, new zebra.ui.Button("Showing how things load"));
    canvas.root.add(zebra.layout.BOTTOM, play);
    canvas.root.add(zebra.layout.BOTTOM, new zebra.ui.Button("Something Cool"));
});