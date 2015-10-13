/* global ScrollMagic */
var CosmicEvo = function(controller) {
  $.ajaxSetup( { "async": false } );
  var locationPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1);
  this.svgConf = $.getJSON(locationPath + 'data/svg.conf.json').responseJSON;

  this.svgScale = 1;
  this.svgMoveables = [];
  
  this.controller = controller; // scroll magic lib controller
};

CosmicEvo.prototype.constructor = CosmicEvo;

CosmicEvo.prototype.detectScrollBarSize = function() {
  var scrollBarSize = { width: 0, height: 0 };
  var scrollDiv = $("<div></div>");
  scrollDiv.addClass("scrollbar-measure");
  $("body").append(scrollDiv);
  scrollBarSize.width = scrollDiv[0].offsetWidth - scrollDiv[0].clientWidth;
  scrollBarSize.height = scrollDiv[0].offsetHeight - scrollDiv[0].clientHeight;
  $(".scrollbar-measure").remove();
  return scrollBarSize;
};

CosmicEvo.prototype.initSvgScaleByBg = function(bgSvg) {
  var scrollBarSize = this.detectScrollBarSize();

  var w = bgSvg.attr('width').replace('px', '');
  var h = bgSvg.attr('height').replace('px', '');
  var wI = parseInt(w);
  var hI = parseInt(h);

  if (wI < hI) {
    var w = bgSvg.attr('width').replace('px', '');
    var wN = wI + ($(window).width() - wI);
    var sP = (1 / wI) * wN;
    wI = wI * sP;
    hI = hI * sP;
    if (hI > $(window).height()) {
      wN = wI - scrollBarSize.width;
      var nsP = (1 / wI) * wN;
      wI = wN;
      hI = hI * nsP;
    }
    this.svgScale = (1 / w) * wN;
  } else {
    var h = bgSvg.attr('height').replace('px', '');
    var hN = hI + ($(window).height() - hI);
    var sP = (1 / hI) * hN;
    wI = wI * sP;
    hI = hI * sP;
    if (wI > $(window).width()) {
      hN = hI - scrollBarSize.height;
      var nsP = (1 / hI) * hN;
      wI = wI * nsP;
      hI = hN;
    }
    this.svgScale = (1 / h) * hN;
  }
  
  bgSvg.attr({
    width: wI,
    height: hI,
    viewBox: [0, 0, w, h].join(' '),
    preserveAspectRatio: 'xMidYMid meet'
  });
  
  return true;
};

CosmicEvo.prototype.setBgSvgs = function() {
  for (var i = 0; i < this.svgConf.backgrounds.length; i++) {
    this.setSvg(this.svgConf.backgrounds[i]);
  }
  if (i > 0) 
    this.initSvgScaleByBg($("#"+this.svgConf.backgrounds[0].id));
}

CosmicEvo.prototype.setSvg = function(svg) {
  $("body").append(
    '<object id="'+svg.id+
    '" type="image/svg+xml" data="svg/'+svg.name+
    '.svg" width="'+svg.width+'" height="'+svg.height+
    '" style="position: absolute; top: '+svg.y * this.svgScale+
    '; left: '+svg.x * this.svgScale+'"> </object>'
  );
  if (svg.moveable === true) {
    this.svgMoveables.push(
      { "svg": svg, "elem" : $("#"+svg.id), "timing" : svg.timing }
    );
    for (var j = 0; j < svg.timing.length; j++) {
      if (j == 0 || j == svg.timing.length-1) {
        var colorClass = "";
        if (j == 0) {
          colorClass = " green";
        } else {
          colorClass = " red";
        }
        $("body").append('<div class="trigger '+colorClass+'" id="trigger_'+svg.id+'" style="position: absolute; top: '+
          svg.timing[j].x * this.svgScale +'px">trigger_'+svg.id+'</div>');
      }
    }
  }
  var svgSelection = $("#"+svg.id);
  var w = parseInt(svgSelection.attr('width').replace('px', ''));
  var h = parseInt(svgSelection.attr('height').replace('px', ''));
  svgSelection.attr({
    width: w * this.svgScale,
    height: h * this.svgScale,
    viewBox: [0, 0, w, h].join(' '),
    preserveAspectRatio: 'xMidYMid meet'
  });
};

CosmicEvo.prototype.setSvgs = function() {
  for (var i = 0; i < this.svgConf.items.length; i++) {
    this.setSvg(this.svgConf.items[i]);
  }
};

CosmicEvo.prototype.setTweens = function(){ 
  for (var i = 0; i < this.svgMoveables.length; i++) {
    var ma =  this.svgMoveables[i];
    
    var scene = new ScrollMagic.Scene({
      trigger: "#trigger_"+ma.svg.id,
      duration: 1000 * this.svgScale, 
      offset: ma.svg.y * this.svgScale
    });

    for (var j = 1; j < ma.timing.length; j++) {
      var timing = ma.timing[j];
      scene.setTween(
        "#"+ma.svg.id, timing.t, 
        { x: timing.x * this.svgScale, y: timing.y * this.svgScale}
      );
      scene.addIndicators({name: i+" (duration: "+timing.t+"})"});
      scene.addTo(this.controller);
    }
  }
};