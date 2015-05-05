zebra.ready(function() {
	
          var canvas = new zebra.ui.zCanvas(320, 480);
          canvas.root.setLayout(new zebra.layout.BorderLayout(8));
          canvas.root.add(zebra.layout.CENTER, new zebra.ui.TextArea())
          canvas.root.add(zebra.layout.BOTTOM, new zebra.ui.Button(new zebra.ui.ImagePan("./pics/PlayButton.png")));
        
        });