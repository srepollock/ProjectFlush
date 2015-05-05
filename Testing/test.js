zebra.ready(function() {
	var canvas = new zebra.ui.zCanvas("can2");
    var toilet = new zebra.ui.ImagePan("./pics/pic2.png");
    var play = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/PlayButton.png"));
    var inst = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/InstructionsButton.png"));
    canvas.setBorder(zebra.ui.borders.plain);
    canvas.root.setLayout(new zebra.layout.BorderLayout(8));
    canvas.root.add(zebra.layout.CENTER, toilet);
    canvas.root.add(zebra.layout.BOTTOM, play);
    canvas.root.add(zebra.layout.BOTTOM, inst);
});