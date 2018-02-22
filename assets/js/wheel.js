var wheel = (function() { "use strict"; var _ = {

  /**
   * Content Object.
   * @type {jQuery Element}
   */
  contentObject: null,

  /**
   * Slider Thumb Object.
   * @type {jQuery Element}
   */
  sliderThumbObject: null,

  /**
   * Make Mouse Point.
   * @param {number float} x x.
   * @param {number float} y y.
   * @return {Hash} point {x: {number float}, y: {number float}}.
   */
  mousePointMaker: function(x, y) { return {x: parseFloat(x), y: parseFloat(y)}; },

  /**
   * Get Point X Value.
   * @param {Hash} point { x: {number float}, y: {number float} }.
   * @return {number float} x.
   */
  mousePointX: function(point) { return parseFloat(point['x']); },

  /**
   * Get Point Y Value.
   * @param {Hash} point { x: {number float}, y: {number float} }.
   * @return {number float} y.
   */
  mousePointY: function(point) { return parseFloat(point['y']); },

  /* Define lPoint.x < rPoint.x */
  kMousePointLittleX: "-x",
  /* Define lPoint.y < rPoint.y */
  kMousePointLittleY: "-y",
  /* Define lPoint == rPoint */
  kMousePointSame:    " 0",
  /* Define lPoint.x > rPoint.x */
  kMousePointLargeX:  "+x",
  /* Define lPoint.y > rPoint.y */
  kMousePointLargeY:  "+y",

  /**
   * Get Point X Value.
   * @param {Hash} lPoint { x: {number float}, y: {number float} }.
   * @param {Hash} rPoint { x: {number float}, y: {number float} }.
   * @return {number int} -1: little, 0: same, 1: large.
   */
  mousePointCompare: function(lPoint, rPoint) {
    var lx = _.mousePointX(lPoint),
        ly = _.mousePointY(lPoint),
        rx = _.mousePointX(rPoint),
        ry = _.mousePointY(rPoint);
    if (lx < rx) { return _.kMousePointLittleX; }
    if (ly < ry) { return _.kMousePointLittleY; }
    if (lx == rx && ly == ry) { return _.kMousePointSame; }
    if (lx > rx) { return _.kMousePointLargeX; }
    if (ly > ry) { return _.kMousePointLargeY; }
  },

  /**
   * Mouse Point.
   * @param {Jquery Element String} target "#/./element".
   * @param {Hash} point { x: {number float}, y: {number float} }.
   * @return {object} object.
   */
  buildMousePosition: function(target, point) {
    var mousePosition = new Object();
    mousePosition.target = target;
    mousePosition.point = point;
    mousePosition.isInside = function() {
      //x的值相对于文档的左边缘。y的值相对于文档的上边缘
      //x,y是全局变量;
      //判断鼠标是否在某DIV中
      var $target = $(this.target),//获取你想要的DIV
          y1 = $target.offset().top,  //div上面两个的点的y值
          y2 = y1 + $target.outerHeight(),//div下面两个点的y值
          x1 = $target.offset().left,  //div左边两个的点的x值
          x2 = x1 + $target.outerWidth();  //div右边两个点的x的值

      // console.log(" x1:" + x1 + "," + "y1:" + y1);
      // console.log(" x2:" + x2 + "," + "y2:" + y2);

      var x  = _.mousePointX(this.point),
          y  = _.mousePointY(this.point);
      // console.log(" x:" + x + "," + "y:" + y);
      if ( x < x1 || x > x2 || y < y1 || y > y2 ) {
          return false;
      } else {
          return true;
      };

    };

    return mousePosition;
    // return null;
  },

  /**
   * Mouse Point.
   * @param {Jquery Element String} target "#/./element".
   * @return {object} object.
   */
   buildInfinityMousePosition: function(target) { return _.buildMousePosition(target, _.mousePointMaker(Infinity, Infinity)); },

  /**
   * Previous Mouse Position.
   * @type {Object}
   */
  previousPosition: null,

  /**
   * Current Mouse Position.
   * @type {Object}
   */
  currentPosition: null,

  /**
   * Bind Mouse Wheel.
   * @type {bool}
   */
  isMouseEnter: false,

  /**
   * Wheel Show.
   * @type {bool}
   */
  isWheelShow: false,

  /** (wheel base from : https://www.cnblogs.com/jone-chen/p/5416781.html )
   * Creates a wheel listener.
   * @param {JQuery Element String} parentBox Content Wrapper.
   * @param {JQuery Element String} contentBox Content Box.
   * @param {JQuery Element String} sliderBar Slider Bar Wrapper.
   * @param {JQuery Element String} sliderBarSpace Slider Bar Thumb.
   * @param {number float} contentOffset Content Offset.
   */
  createListener: function(parentBox, contentBox, sliderBar, sliderBarSpace, contentOffset) {

    _.contentObject = $(contentBox);
    _.sliderThumbObject = $(sliderBar + " " + sliderBarSpace);

    var box_Height = $(parentBox).outerHeight();
  	var content_Height = $(contentBox).outerHeight() + contentOffset;
  	var bar_Height = $(sliderBar).outerHeight();
  	var isMouseDown = false;
  	var distance = 0,
        previousDistance = distance;

    if (content_Height <= box_Height) {
      _.isWheelShow = false;
      $(sliderBar).css('display', 'none');
      return;
    } else {
      _.isWheelShow = true;
      $(sliderBar).css('display', 'block');
    }

  	//滚动条初始高度；
  	var n = box_Height / content_Height * bar_Height;
  	$(sliderBar + " " + sliderBarSpace).css("height", n)
  	$(sliderBar).mousedown(down);
  	$(window).mousemove(move);
  	$(window).mouseup(up);

  	function down(event) {
  		isMouseDown = true;
  	}

  	function move(event) {
  		event.preventDefault();
  		distance = event.pageY - $(sliderBar).offset().top;
  		if (isMouseDown == true) {
  			scroll(distance)
  		}
  	}

  	function up() {
  		isMouseDown = false;
  	}

    $(parentBox).on({
      mouseenter: function() {
        // distance = previousDistance;
        // _.sliderThumbObject.css("top", distance);
      },
      mouseleave: function() {
        // previousDistance = distance;
      },
    });

  	// 滚轮事件；
    var type = "mousewheel";
    if (document.mozFullScreen !== undefined) { type = "DOMMouseScroll"; }

  	$(parentBox).on(type, function(event) {
      return; // 没有修复问题，先停用功能
  		event.preventDefault();
      // console.log(event.originalEvent.wheelDelta);
      var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta / 120 : -(event.originalEvent.detail || 0) / 3;
      // console.log(delta);
  		// delta > 0 ? 'Up' : 'Down';
  		distance = $(sliderBar + " " + sliderBarSpace).offset().top - $(parentBox).offset().top;
  		delta > 0 ? distance -= 10 : distance += 10;
  		scroll(distance);
  	});

  	function scroll(distance) {
  		if (distance < 0) {
  			distance = 0;
  		} else if (distance > bar_Height - $(sliderBar + " " + sliderBarSpace).outerHeight()) {
  			distance = bar_Height - $(sliderBar + " " + sliderBarSpace).outerHeight();
  		}
  		$(sliderBar + " " + sliderBarSpace).css("top", distance);
  			// 滚动距离 = 滑块移动距离 ÷ 窗口高度 x 页面长度
  			// var roat = distance / (bar_Height - $(sliderBar + " " + sliderBarSpace).outerHeight())
  			// var scroll_distance = parseInt(roat * (content_Height - box_Height))
  		var scroll_distance = parseInt(distance / box_Height * content_Height)
  		$(contentBox).css("margin-top", -scroll_distance)
  	}

  },

  /**
  * Reset Contents Position.
  */
  reset: function() {
    if (_.contentObject != null) { _.contentObject.css("margin-top", 0); }
    if (_.sliderThumbObject != null) { _.sliderThumbObject.css("top", 0); }
  },

}; return _; })();

// (https://github.com/bxcn/umd/blob/master/umdjs/returnExports.js)
// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return wheel;
}));


(function($) {

  $.fn.codeWheel = function() {

  };

})(jQuery);
