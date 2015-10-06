// init controller
var controller = new ScrollMagic.Controller();

// create a scene
new ScrollMagic.Scene({
        trigger: "#trigger1",
        duration: 100,  // the scene should last for a scroll distance of 100px
        offset: 50      // start this scene after scrolling for 50px
    })
    .setTween("#animate1", 0.5, { backgroundColor: "green", scale: 2.5 })
    .addIndicators({name: "1 (duration: 0)"})
    .addTo(controller);