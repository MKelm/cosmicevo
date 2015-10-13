/* global ScrollMagic */
/* global CosmicEvo */
$(document).ready(function() {
    
    // init controller
    var controller = new ScrollMagic.Controller();
        
    var ce = new CosmicEvo(controller);
    ce.setBgSvgs();
    ce.setSvgs();
    ce.setTweens();
    
});