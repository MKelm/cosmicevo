/* global ScrollMagic */
/* global CosmicEvo */
$(document).ready(function() {
    
    // init controller
    var controller = new ScrollMagic.Controller();
    
    // create a scene
    /*new ScrollMagic.Scene({
            trigger: "#trigger1",
            duration: 100,  // the scene should last for a scroll distance of 100px
            offset: 50      // start this scene after scrolling for 50px
        })
        .setTween("#animate1", 0.5, { backgroundColor: "#ccc", scale: 2.5 })
        .addIndicators({name: "1 (duration: 100)"})
        .addTo(controller);
        
    new ScrollMagic.Scene({
            trigger: "#trigger2",
            duration: 100,  // the scene should last for a scroll distance of 100px
            offset: 200      // start this scene after scrolling for 50px
        })
        .setTween("#animate1", 0.5, { backgroundColor: "#222", scale: 1 })
        .addIndicators({name: "2 (duration: 100)"})
        .addTo(controller);*/
        
    var ce = new CosmicEvo(controller);
    ce.setSvgs();
    ce.detectSvgScale();
    ce.setSvgs();
    ce.setTweens();
    
});