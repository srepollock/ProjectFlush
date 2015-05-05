zebra.ready(function() {
        var canvas = new zebra.ui.zCanvas("can");
        var toilet = new zebra.ui.ImagePan("./pics/pic2.png");
        var play = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/PlayButton.png"));
        var inst = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/InstructionsButton.png"));
        canvas.setBorder(zebra.ui.borders.plain);
        canvas.root.setLayout(new zebra.layout.BorderLayout(8));
        canvas.root.add(zebra.layout.CENTER, toilet);
        var botP = new zebra.ui.Panel(new zebra.layout.FlowLayout(
            zebra.layout.CENTER, zebra.layout.BOTTOM, zebra.layout.VERTICAL, 2));
        botP.add(play);
        botP.add(inst);
        canvas.root.add(zebra.layout.BOTTOM, botP);
    });