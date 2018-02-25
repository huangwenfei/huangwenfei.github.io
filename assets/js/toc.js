/*!
 * toc - jQuery Table of Contents Plugin
 * v0.3.2
 * http://projects.jga.me/toc/
 * copyright Greg Allen 2014
 * MIT License
*/
/*!
 * smooth-scroller - Javascript lib to handle smooth scrolling
 * v0.1.2
 * https://github.com/firstandthird/smooth-scroller
 * copyright First+Third 2014
 * MIT License
*/
//smooth-scroller.js

(function($) {
  $.fn.smoothScroller = function(options) {
    options = $.extend({}, $.fn.smoothScroller.defaults, options);
    var el = $(this);

    $(options.scrollEl).animate({
      scrollTop: el.offset().top - $(options.scrollEl).offset().top - options.offset
    }, options.speed, options.ease, function() {
      var hash = el.attr('id');

      if(hash.length) {
        if(history.pushState) {
          history.pushState(null, null, '#' + hash);
        } else {
          document.location.hash = hash;
        }
      }

      el.trigger('smoothScrollerComplete');
    });

    return this;
  };

  $.fn.smoothScroller.defaults = {
    speed: 400,
    ease: 'swing',
    scrollEl: 'body,html',
    offset: 0
  };

  $('body').on('click', '[data-smoothscroller]', function(e) {
    e.preventDefault();
    var href = $(this).attr('href');

    if(href.indexOf('#') === 0) {
      $(href).smoothScroller();
    }
  });
}(jQuery));

(function($) {

var verboseIdCache = {};

$.fn.toc = function(options) {
  var self = this;
  var opts = $.extend({}, jQuery.fn.toc.defaults, options);

  var container = $(opts.container);
  var headings = $(opts.selectors, container);
  var headingOffsets = [];
  var activeClassName = opts.activeClass;

  var _scrollTo = function(e, callback) {
    if (opts.smoothScrolling && typeof opts.smoothScrolling === 'function') {
      e.preventDefault();
      var elScrollTo = $(e.target).attr('href');

      opts.smoothScrolling(elScrollTo, opts, callback);
    }
    $('li', self).removeClass(activeClassName);
    $(e.target).parent().addClass(activeClassName);
  };

  //highlight on scroll
  var timeout;
  var highlightOnScroll = function(e) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
      var top = $(window).scrollTop(),
        highlighted, closest = Number.MAX_VALUE, index = 0;

      for (var i = 0, c = headingOffsets.length; i < c; i++) {
        var currentClosest = Math.abs(headingOffsets[i] - top);
        if (currentClosest < closest) {
          index = i;
          closest = currentClosest;
        }
      }

      $('li', self).removeClass(activeClassName);
      highlighted = $('li:eq('+ index +')', self).addClass(activeClassName);
      // console.log(highlighted.html());
      opts.onHighlight(highlighted);
    }, 50);
  };
  if (opts.highlightOnScroll) {
    $(window).on('scroll', highlightOnScroll);
    highlightOnScroll();
  }

  // headingsArray
  var level = function(heading) {
    return heading.tagName.toLowerCase().split("h")[1];
  };

  var _deep = function(previousLevel, currentLevel) {
    return (parseInt(currentLevel) - parseInt(previousLevel));
  };

  var buildNode = function(parent, heading, childrend) {
    var node = new Object();
    node.parent = parent; // node
    node.heading = heading; // <hx />
    node.childrend = childrend; // Node Array / null
    return node;
  };

  var printNode = function(node) {
    var _null = function(x) { return (x == null) ? "null" : x; };
    console.log(_null(node.parent));
    console.log(_null(node.heading));
    console.log(_null(node.childrend));
  };

  var _headingNodes = function() {

    var nodeList = [];
        previousNode = null;

    headings.each(function(idx, heading) {

      if (idx == 0) {
        var node = buildNode(null, heading, null);
        previousNode = node;
        nodeList.push(node);
      } else {

        // console.log(heading);

        var previousLevel = level(previousNode.heading);
            currentLevel  = level(heading);
            levelDeep     = _deep(previousLevel, currentLevel);

        if (levelDeep == 0) {
          // console.log("same");
          var node = buildNode(null, heading, null);
          var parent = previousNode.parent;
          if (parent == null) {
            nodeList.push(node);
          } else {
            node.parent = parent;
            if (parent.childrend == null) { parent.childrend = []; }
            parent.childrend.push(node);
          }
        } else if (levelDeep > 0) {
          // console.log("up");
          var node = buildNode(previousNode, heading, null);
          var parent = previousNode.parent;
          if (previousNode.childrend == null) { previousNode.childrend = []; }
          node.parent.childrend.push(node);
        } else if (levelDeep < 0) {
          // console.log("low");
          var deep = Math.abs(levelDeep);
          var node = buildNode(null, heading, null);
          var upperParent = previousNode;
          for (var i = 0; i < deep; i++) {
            upperParent = upperParent.parent;
            if (upperParent == null || (level(upperParent.heading) == currentLevel)) { break; }
          }
          var parent = upperParent.parent;
          if (parent == null) {
            nodeList.push(node);
          } else {
            node.parent = parent;
            if (previousNode.childrend == null) { previousNode.childrend = []; }
            parent.childrend.push(node);
          }
        }

        previousNode = node;

      }

    });

    return nodeList;

  };

  var _updateOffsets = function(heading) {
    headingOffsets.push($(heading).offset().top - opts.highlightOffset);
  };

  var _addAnchor = function(i, heading) {
    if(heading.id !== anchorName) {
      var anchorName = opts.anchorName(i, heading, opts.prefix);
      $('<span/>').attr('id', anchorName).insertBefore($(heading));
    }
  };

  var buildListItem = function(el, idx, heading) {

    _updateOffsets(heading);
    _addAnchor(idx, heading);

    var $h = $(heading);
    var anchorName = opts.anchorName(idx, heading, opts.prefix);

    var a = $('<a/>')
      .text(opts.headerText(idx, heading, $h))
      .attr('href', '#' + anchorName)
      .on('click', function(e) {
        // console.log(e);
        $(window).off('scroll', highlightOnScroll);
        _scrollTo(e, function() {
          $(window).on('scroll', highlightOnScroll);
        });
        el.trigger('selected', $(this).attr('href'));
      });

    var li = $('<li/>')
      .addClass(opts.itemClass(idx, heading, $h, opts.prefix))
      .append(a);

    return li;

  };

  function _buildSubChilds(el, node, subType) {

    var subUl = $(subType);

    $(node.childrend).each(function(subIdx, subNode) {
      var subChild = buildListItem(el, subIdx, subNode.heading);
      if (subNode.childrend != null) { subChild.append(_buildSubChilds(el, subNode, subType)); }
      subUl.append(subChild);
    });

    return subUl;

  };

  return this.each(function() {
    //build TOC
    var el = $(this);
    var ul = $(opts.listType);

    var nodeList = $(_headingNodes());
    // console.log(nodeList);

    var subType = opts.listType;

    nodeList.each(function(idx, node) {

      var child = buildListItem(el, idx, node.heading);
      if (node.childrend != null) { child.append(_buildSubChilds(el, node, subType)); }
      ul.append(child);

    });

    ul.addClass(opts.listTypeClassName);
    el.append(ul);
    // console.log(ul);

  });
};

jQuery.fn.toc.defaults = {
  container: 'body',
  listType: '<ul/>',
  listTypeClassName: 'section-nav',
  selectors: 'h1,h2,h3',
  smoothScrolling: function(target, options, callback) {
    $(target).smoothScroller({
      offset: options.scrollToOffset
    }).on('smoothScrollerComplete', function() {
      callback();
    });
  },
  smoothScrollerCompleteCallBack: function() {},
  scrollToOffset: 0,
  prefix: 'toc',
  activeClass: 'toc-active',
  onHighlight: function() {},
  highlightOnScroll: true,
  highlightOffset: 100,
  anchorName: function(i, heading, prefix) {
    if(heading.id.length) {
      return heading.id;
    }

    var candidateId = $(heading).text().replace(/[^a-z0-9]/ig, ' ').replace(/\s+/g, '-').toLowerCase();
    if (verboseIdCache[candidateId]) {
      var j = 2;

      while(verboseIdCache[candidateId + j]) {
        j++;
      }
      candidateId = candidateId + '-' + j;

    }
    verboseIdCache[candidateId] = true;

    return prefix + '-' + candidateId;
  },
  headerText: function(i, heading, $heading) {
    return $heading.text();
  },
  itemClass: function(i, heading, $heading, prefix) {
    return "toc-entry" + " " + prefix + "-" + $heading[0].tagName.toLowerCase();
  }

};

})(jQuery);
