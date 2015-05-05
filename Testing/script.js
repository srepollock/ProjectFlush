zebra.ready(function() {
    // creates a canvas to put the ui on
    var canvas = new zebra.ui.zCanvas('can');
    // image for the background
    var toilet = new zebra.ui.ImagePan('./pics/pic2.png');
    // play button
    var play = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/PlayButton.png"));
    // instructions button
    var inst = new zebra.ui.Button(new zebra.ui.ImagePan("./pics/InstructionsButton.png"));
    // basic functionality
    // *later on need to add sounds to this
    play.bind(function() {
        window.alert("Play Pressed");
    });
    inst.bind(function() {
        window.alert("Instructions Pressed");
    });
    // sets a bland border around the canvas
    canvas.setBorder(zebra.ui.borders.plain);
    // Sets the layout to have TOP, CENTER, LEFT, RIGHT, BOTTOM
    canvas.root.setLayout(new zebra.layout.BorderLayout(8));
    canvas.root.add(zebra.layout.CENTER, toilet);
    // Creates a new panel with a new layout inside it called a FlowLayout
    // This is just to easily flow the buttons onto the page
    var botP = new zebra.ui.Panel(new zebra.layout.FlowLayout(
        zebra.layout.CENTER, zebra.layout.BOTTOM, zebra.layout.VERTICAL, 2));
    // Adds the buttons to the panel
    botP.add(play);
    botP.add(inst);
    // Adds the panel to the page
    canvas.root.add(zebra.layout.BOTTOM, botP);
});