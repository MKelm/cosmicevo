CosmicEvo = function() {
  $.ajaxSetup( { "async": false } );
  var locationPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1);
  this.svgConf = $.getJSON(locationPath + 'data/svg.conf.json').responseJSON;

  this.scrollBarSize = { width: 0, height: 0 };
  this.svgScale = 1;
  this.svgMoveables = [];

  this.timing = 0;
  this.getCurrentTiming();
};

CosmicEvo.prototype.constructor = CosmicEvo;

CosmicEvo.prototype.getCurrentTiming = function() {
  var scope = this;
  $(window).one('scroll', function() {
    scope.timing = $(this).scrollTop() / scope.svgScale;
    console.log(scope.timing, $(this).scrollTop(), scope.svgScale);
    scope.svgScroll(scope.timing * scope.svgScale, 1);
  });
};

CosmicEvo.prototype.detectScrollBarSize = function() {
  var scrollDiv = $("<div></div>");
  scrollDiv.addClass("scrollbar-measure");
  $("body").append(scrollDiv);
  this.scrollBarSize.width = scrollDiv[0].offsetWidth - scrollDiv[0].clientWidth;
  this.scrollBarSize.height = scrollDiv[0].offsetHeight - scrollDiv[0].clientHeight;
  $(".scrollbar-measure").remove();
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
    var newTiming = -1;
    for (var i = 0; i < this.svgMoveables.length; i++) {

      var preTiming = null, nextTiming = null;
      if (direction > 0) { // forward
        for (var j = 0; j < this.svgMoveables[i].timing.length - 1; j++) {
          if (this.svgMoveables[i].timing[j].t <= this.timing && this.svgMoveables[i].timing[j+1].t > this.timing) {
            preTiming = this.svgMoveables[i].timing[j];
            nextTiming = this.svgMoveables[i].timing[j+1];
            break;
          }
        }
      } else { // backward
        for (var j = this.svgMoveables[i].timing.length - 1; j > 0; j--) {
          if (this.svgMoveables[i].timing[j].t >= this.timing && this.svgMoveables[i].timing[j-1].t < this.timing) {
            preTiming = this.svgMoveables[i].timing[j-1];
            nextTiming = this.svgMoveables[i].timing[j];
            break;
          }
        }
      }

      if (preTiming !== null && nextTiming !== null) {
        if (i == 1) {
          console.log(this.timing, preTiming.t, nextTiming.t);
        }

        if ((this.timing >= preTiming.t && direction > 0 && this.timing <= nextTiming.t) ||
            (this.timing > preTiming.t && this.timing < nextTiming.t) ||
            (this.timing >= preTiming.t && this.timing <= nextTiming.t && direction < 0)) {

          var d = Math.sqrt(
            Math.pow(nextTiming.y - preTiming.y, 2) + Math.pow(nextTiming.x - preTiming.x, 2)
          );

          newTiming = Math.round(
            this.timing + direction * ((1 / d) * (scrollDiff / this.svgScale)) * (nextTiming.t - preTiming.t)
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

          var newDistanceX = Math.round(
            ((1 / (nextTiming.t - preTiming.t)) * (newTiming - this.timing)) * this.svgScale * (nextTiming.x - preTiming.x)
          );
          this.svgMoveables[i].elem.css("left", parseInt(this.svgMoveables[i].elem.css("left").replace("px", "")) + newDistanceX);
        }
      }
    }
    if (newTiming > -1) {
      this.timing = newTiming;
    }
  }
};

CosmicEvo.prototype.registerScrollHandler = function() {
  var lastScrollTop = 0, delta = 1;
  var scope = this;
  $(window).scroll(function() {
     var nowScrollTop = $(this).scrollTop();
     if (Math.abs(lastScrollTop - nowScrollTop) >= delta) {
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

$(document).ready(function(){
  var ce = new CosmicEvo();
  ce.detectScrollBarSize();
  ce.setSvgs();
  ce.registerScrollHandler();
});
