CosmicEvo = function() {
  this.svgConf = [];
  this.scrollBarSize = { width: 0, height: 0 };
  this.svgScale = 1;
  this.svgMoveables = [];
  this.timing = 0;
};

CosmicEvo.prototype.constructor = CosmicEvo;

CosmicEvo.prototype.detectScrollBarSize = function() {
  var scrollDiv = document.createElement("div");
  scrollDiv.className = "scrollbar-measure";
  document.body.appendChild(scrollDiv);

  this.scrollBarSize.width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  this.scrollBarSize.height = scrollDiv.offsetHeight - scrollDiv.clientHeight;
  
  document.body.removeChild(scrollDiv);
};

CosmicEvo.prototype.initSvgConf = function() {
  this.svgConf = [
    {
      "name" : "test1",
      "id" : "test1",
      "x" : 0, "y" : 0,
      "width" : 1000, "height" : 7000,
      "background" : true
    },
    {
      "name" : "logo1",
      "id" : "logo1",
      "x" : 10, "y" : 10,
      "width" : 200, "height" : 200
    },
    {
      "name" : "char1",
      "id" : "char1",
      "x" : 1000 / 3 - 50, "y" : 250,
      "width" : 100, "height" : 100
    },
    {
      "name" : "char1",
      "id" : "char2",
      "x" : 1000 / 2 - 50, "y" : 250,
      "width" : 100, "height" : 100,
      "moveable" : true,
      "timing" : [
        { "t" : 0, "x" : 1000 / 2 - 50, "y" : 250 },
        { "t" : 500, "x" : 1000 / 2 - 50, "y" : 500 },
      ]
    },
    {
      "name" : "char1",
      "id" : "char3",
      "x" : 1000 / 1.5 - 50, "y" : 250,
      "width" : 100, "height" : 100
    }
  ];
};

CosmicEvo.prototype.setSvgs = function() {
  for (var i = 0; i < this.svgConf.length; i++) {
    $("body").append(
      '<object id="'+this.svgConf[i].id+
      '" type="image/svg+xml" data="svg/'+this.svgConf[i].name+'.svg" width="'+this.svgConf[i].width+'" height="'+this.svgConf[i].height+
      '" style="position: absolute; top: '+this.svgConf[i].y * this.svgScale+'; left: '+this.svgConf[i].x * this.svgScale+'"> </object>'
    );
    if (this.svgConf[i].moveable == true) {
      this.svgMoveables.push(
        { "elem" : $("#"+this.svgConf[i].id), "timing" : this.svgConf[i].timing }
      );
    }
    if (this.svgConf[i].background == true) {
      var svg = $("#"+this.svgConf[i].id);
      var w = svg.attr('width').replace('px', '');
      var h = svg.attr('height').replace('px', '');
      var wI = parseInt(w);
      var hI = parseInt(h);
      
      if (wI < hI) {
        var wN = wI + ($(window).width() - wI);
        var sP = (1 / wI) * wN;
        wI = wI * sP;
        hI = hI * sP;
        if (hI > $(window).height()) {
          wN = wI - this.scrollBarSize.width;
          var nsP = (1 / wI) * wN;
          wI = wN;
          hI = hI * nsP;
        }
        var w = svg.attr('width').replace('px', '');
        this.svgScale = (1 / w) * wN;
      } else {
        var hN = hI + ($(window).height() - hI);
        var sP = (1 / hI) * hN;
        wI = wI * sP;
        hI = hI * sP;
        if (wI > $(window).width()) {
          hN = hI - this.scrollBarSize.height;
          var nsP = (1 / hI) * hN;
          wI = wI * nsP;
          hI = hN;
        }
        var h = svg.attr('height').replace('px', '');
        this.svgScale = (1 / h) * hN;
      }
      
      svg.attr({
        width: wI,
        height: hI,
        viewBox: [0, 0, w, h].join(' '),
        preserveAspectRatio: 'xMidYMid meet'
      });
      
    } else {
      var svg = $("#"+this.svgConf[i].id);
      var w = svg.attr('width').replace('px', '');
      var h = svg.attr('height').replace('px', '');

      svg.attr({
        width: w * this.svgScale,
        height: h * this.svgScale,
        viewBox: [0, 0, w, h].join(' '),
        preserveAspectRatio: 'xMidYMid meet'
      });
    }
  }
};

CosmicEvo.prototype.svgScroll = function(scrollDiff, direction) {
  if (scrollDiff > 0) {
    for (var i = 0; i < this.svgMoveables.length; i++) {
    
      var preTiming = null, nextTiming = null;
      var firstTiming = false, lastTiming = false;
      for (var j = 0; j < this.svgMoveables[i].timing.length; j++) {
        if (this.svgMoveables[i].timing[j].t <= this.timing) {
          preTiming = this.svgMoveables[i].timing[j];
        }
        if (this.svgMoveables[i].timing[j].t >= this.timing) {
          nextTiming = this.svgMoveables[i].timing[j];
          if (preTiming !== null || preTiming.t == nextTiming.t) {
            preTiming = this.svgMoveables[i].timing[j-1];
          }
        }
      }
      if (nextTiming === null) {
        preTiming = this.svgMoveables[i].timing[this.svgMoveables[i].timing.length-2];
        nextTiming = this.svgMoveables[i].timing[this.svgMoveables[i].timing.length-1];
      }
      if (nextTiming.t == this.svgMoveables[i].timing[this.svgMoveables[i].timing.length-1].t) 
        lastTiming = true;
      if (preTiming === null) {
        preTiming = this.svgMoveables[i].timing[0];
        nextTiming = this.svgMoveables[i].timing[1];
      }
      if (preTiming.t == this.svgMoveables[i].timing[0].t) 
        firstTiming = true;
      
      if ((this.timing >= preTiming.t && direction > 0 && this.timing <= nextTiming.t) ||
          (this.timing > preTiming.t && this.timing < nextTiming.t) ||
          (this.timing >= preTiming.t && this.timing <= nextTiming.t && direction < 0)) {
        
        var newTiming = Math.round(
          this.timing + direction * ((1 / (nextTiming.y - preTiming.y)) * (scrollDiff / this.svgScale)) * (nextTiming.t - preTiming.t)
        );
        if (newTiming > nextTiming.t) {
          newTiming = nextTiming.t;
        } else if (newTiming < preTiming.t) {
          newTiming = preTiming.t;
        }

        var newDistanceY = Math.round(
          ((1 / (nextTiming.t - preTiming.t)) * (newTiming - this.timing)) * this.svgScale * (nextTiming.y - preTiming.y)
        );
        this.svgMoveables[i].elem.css("top", parseInt(this.svgMoveables[i].elem.css("top").replace("px", "")) + newDistanceY);

        this.timing = newTiming;
      }
    }
  }
};

CosmicEvo.prototype.registerScrollHandler = function() {
  var lastScrollTop = 0, delta = 1;
  var scope = this;
  $(window).scroll(function() {
     var nowScrollTop = $(this).scrollTop();
     if (Math.abs(lastScrollTop - nowScrollTop) >= delta){
       if (nowScrollTop > lastScrollTop) {
         // down
         scope.svgScroll(Math.abs(lastScrollTop - nowScrollTop), 1);
       } else {
         // up
         scope.svgScroll(Math.abs(lastScrollTop - nowScrollTop), -1);
       }
       lastScrollTop = nowScrollTop;
     }
  });

};

$(function(){
  var ce = new CosmicEvo();
  ce.detectScrollBarSize();
  ce.initSvgConf();
  ce.setSvgs();
  ce.registerScrollHandler();
});
