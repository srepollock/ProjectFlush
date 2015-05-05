zebra.ready(function() {
        var canvas = new zebra.ui.zCanvas("can");
        canvas.setBorder(zebra.ui.borders.plain);
        canvas.root.setLayout(new zebra.layout.BorderLayout(8));
        var toilet = new zebra.ui.ImagePan("./pics/pic2.png");
        canvas.root.add(zebra.layout.CENTER, toilet);
        var play = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/PlayButton.png"));
        var inst = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/InstructionsButton.png"));
        canvas.root.add(zebra.layout.BOTTOM, play);
        canvas.root.add(zebra.layout.BOTTOM, inst);
    });