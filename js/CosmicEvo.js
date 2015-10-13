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

CosmicEvo.prototype.detectSvgScale = function() {
  var scrollBarSize = this.detectScrollBarSize();
  var svg = null;
  for (var i = 0; i < this.svgConf.length; i++) {
    if (this.svgConf[i].background == true) {
      svg = $("#"+this.svgConf[i].id);
      break;
    }
  }
  if (svg === null)
    return false;
  
  var w = svg.attr('width').replace('px', '');
  var h = svg.attr('height').replace('px', '');
  var wI = parseInt(w);
  var hI = parseInt(h);

  if (wI < hI) {
    var w = svg.attr('width').replace('px', '');
    var wN = wI + ($(window).width() - wI);
    var sP = (1 / wI) * wN;
    wI = wI * sP;
    hI = hI * sP;
    if (hI > $(window).height()) {
      wN = wI - this.scrollBarSize.width;
    }
    this.svgScale = (1 / w) * wN;
  } else {
    var h = svg.attr('height').replace('px', '');
    var hN = hI + ($(window).height() - hI);
    var sP = (1 / hI) * hN;
    wI = wI * sP;
    hI = hI * sP;
    if (wI > $(window).width()) {
      hN = hI - this.scrollBarSize.height;
    }
    this.svgScale = (1 / h) * hN;
  }
  
  return true;
};

CosmicEvo.prototype.setSvgs = function() {
  for (var i = 0; i < this.svgConf.length; i++) {
    $("body").append(
      '<object id="'+this.svgConf[i].id+
      '" type="image/svg+xml" data="svg/'+this.svgConf[i].name+
      '.svg" width="'+this.svgConf[i].width+'" height="'+this.svgConf[i].height+
      '" style="position: absolute; top: '+this.svgConf[i].y * this.svgScale+
      '; left: '+this.svgConf[i].x * this.svgScale+'"> </object>'
    );
    if (this.svgConf[i].moveable == true) {
      this.svgMoveables.push(
        { "elem" : $("#"+this.svgConf[i].id), "timing" : this.svgConf[i].timing }
      );
    }
    var svg = $("#"+this.svgConf[i].id);
    var w = parseInt(svg.attr('width').replace('px', ''));
    var h = parseInt(svg.attr('height').replace('px', ''));
    svg.attr({
      width: w * this.svgScale,
      height: h * this.svgScale,
      viewBox: [0, 0, w, h].join(' '),
      preserveAspectRatio: 'xMidYMid meet'
    });
  }
};

CosmicEvo.prototype.setTweens = function() {
  for (var i = 0; i < this.svgMoveables.length; i++) {
    /*new ScrollMagic.Scene({
          trigger: "#"+this.svgConf[i].id,
          duration: 100,  // the scene should last for a scroll distance of 100px
          offset: 50      // start this scene after scrolling for 50px
      })
      .setTween("#animate1", 0.5, { backgroundColor: "#ccc", scale: 2.5 })
      .addIndicators({name: "1 (duration: 100)"})
      .addTo(controller); */
  }
};