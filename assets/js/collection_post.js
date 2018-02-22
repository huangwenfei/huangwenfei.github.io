
var collectionPost = (function() { "use strict"; var _ = {

  /* Globals Settings */
  options: null,

  /* Start Link Settings */
  start: null,

  /* End Link Settings */
  end: null,

  /* Previous Link Settings */
  previous: null,

  /* Next Link Settings */
  next: null,

  /* Center Link Settings */
  center: null,

  /* Total Count Label Settings */
  totalCount: null,

  /**
   * Static Key
   */
  linkEnum: {
    kLinkFixPagelink: 'pageLink',
    kLinkFixCurrent : 'currentLink',
    kLinkFixNormal  : 'normalLink',
    kLinkFixStart   : 'startLinkButton',
    kLinkFixEnd     : 'endLinkButton',
    kLinkFixPrevious: 'previousLinkButton',
    kLinkFixNext    : 'nextLinkButton',
  },

  optionsEnum: {
    kOptionsGlobal    : 'global',
    kOptionsStart     : 'start',
    kOptionsEnd       : 'end',
    kOptionsPrevious  : 'previous',
    kOptionsNext      : 'next',
    kOptionsCenter    : 'center',
    kOptionsTotalCount: 'totalCount',
  },

  /**
   * Pagination Current Page Index.
   * @type {int Number}
   */
  currentPageNumber: 1,

  /**
   * Pagination Start Page Index.
   * @type {int Number}
   */
  startPageIndex: 1,

  /**
   * Create Row Id.
   * @param {int number} idx index.
   * @return {String} row-idx.
   */
  pageRowId: function(idx) { return 'row'+'-'+idx; },

  /**
   * Create Page Button Id.
   * @param {String} pageString text.
   * @return {String} page-pageString.
   */
  pageId: function(pageString) { return 'page'+'-'+pageString; },

  /**
   * userSettings Merge.
   * @param {optionsEnum} optionsKey key.
   * @return {Hash Object} Hash.
   */
  userSettingsMerge: function(optionsKey) {
    var self              = _,
        opsEnum           = self.optionsEnum,
        globalDefault     = self.defaultSettings_globalDefaults,
        startDefault      = self.defaultSettings_startDefaults,
        endDefault        = self.defaultSettings_endDefaults,
        previousDefault   = self.defaultSettings_previousDefaults,
        nextDefault       = self.defaultSettings_nextDefaults,
        centerDefault     = self.defaultSettings_centerDefaults,
        totalCountDefault = self.defaultSettings_totalCountDefaults;
    switch (optionsKey) {
      case opsEnum.kOptionsGlobal     : { return (self.options    == null) ? globalDefault      : $.extend({}, globalDefault, self.options);        }
      case opsEnum.kOptionsStart      : { return (self.start      == null) ? startDefault       : $.extend({}, startDefault, self.start);           }
      case opsEnum.kOptionsEnd        : { return (self.end        == null) ? endDefault         : $.extend({}, endDefault, self.end);               }
      case opsEnum.kOptionsPrevious   : { return (self.previous   == null) ? previousDefault    : $.extend({}, previousDefault, self.previous);     }
      case opsEnum.kOptionsNext       : { return (self.next       == null) ? nextDefault        : $.extend({}, nextDefault, self.next);             }
      case opsEnum.kOptionsCenter     : { return (self.center     == null) ? centerDefault      : $.extend({}, centerDefault, self.center);         }
      case opsEnum.kOptionsTotalCount : { return (self.totalCount == null) ? totalCountDefault  : $.extend({}, totalCountDefault, self.totalCount); }
      default: { return {}; }
    }
  },

  /**
   * Create Row Id.
   * @param {String} pageString text.
   * @return {String} page-pageString.
   */
  createRowIds: function() {
    var self = _,
        $settings = self.userSettingsMerge(self.optionsEnum.kOptionsGlobal);
    if ($settings.pageCount > 1) {
      $($settings.postListRowSelector).css('display', 'none');
      $($settings.postListRowSelector).each(function(idx, row) {
        if (idx < $settings.pageRows) { $(row).css('display', 'block'); }
        $(row).attr('id', self.pageRowId(idx));
        // console.log(row);
      });
    }
  },

  buildPagination: function() {

    var self          = _,
        opsEnum       = self.optionsEnum,
        $settings     = self.userSettingsMerge(opsEnum.kOptionsGlobal);

        // console.log($settings);

    var pageItems = $settings.pageItems,
        pageCount = $settings.pageCount,
        normalLinkClassName  = $settings.normalLinkClassName,
        currentLinkClassName = $settings.currentLinkClassName,
        pageLinkClassName    = $settings.pageLinkClassName,
        currentPageNumber    = self.currentPageNumber;

    var linkList           = $settings.link,
        linkListLinkItem   = $settings.aLink,
        linkListNormalItem = $settings.spanLink;

    var $startSetting    = self.userSettingsMerge(opsEnum.kOptionsStart),
        $previousSetting = self.userSettingsMerge(opsEnum.kOptionsPrevious),
        $centerSetting   = self.userSettingsMerge(opsEnum.kOptionsCenter),
        $nextSetting     = self.userSettingsMerge(opsEnum.kOptionsNext),
        $endSetting      = self.userSettingsMerge(opsEnum.kOptionsEnd),
        $countSetting    = self.userSettingsMerge(opsEnum.kOptionsTotalCount);

    if (pageCount > 1) {
      var pagination      = $($settings.pagination).addClass($settings.paginationClassName),
          paginationLinks = $($settings.paginationLinks).addClass($settings.paginationLinksClassName);
      // Start Page
      paginationLinks.append(createStartButton());
      // Previous Page
      paginationLinks.append(createPreviousButton());
      // Center Pages
      paginationLinks.append(createCenterPagesButton());
      // Next Page
      paginationLinks.append(createNextButton());
      // End Page
      paginationLinks.append(createEndButton());
      // Page Count
      paginationLinks.append(createPageCountButton());
      pagination.append(paginationLinks);
      // console.log(pagination);
      $($settings.postPagination).append(pagination);
      // console.log($($settings.postPagination));
    }

    // Start Page
    function createStartButton() {
      var link  = $(linkList).addClass($startSetting.parentLinkClassName),
          // aLink = $(linkListLinkItem).addClass(normalLinkClassName); // For Off Start End button [start] [end]
          aLink = $(linkListLinkItem).addClass(pageLinkClassName);
      // console.log(linkList);
      aLink.attr('id', self.pageId($startSetting.id));
      aLink.html($startSetting.text);
      link.append(aLink);
      // console.log(link);
      return link;
    };
    // Previous Page
    function createPreviousButton() {
      var link  = $(linkList).addClass($previousSetting.parentLinkClassName),
          aLink = $(linkListLinkItem).addClass(normalLinkClassName),
          icon  = $($previousSetting.text);
      aLink.attr('id', self.pageId($previousSetting.id));
      aLink.append(icon);
      link.append(aLink);
      return link;
    };
    // Center Pages
    function createCenterPagesButton() {
      var link = $(linkList).addClass($centerSetting.parentLinkClassName);
      for (var page = 1; page <= pageCount; page++) {
        var aLink = $(linkListLinkItem).html(page).attr('id', self.pageId(page));
        if (page == currentPageNumber) {
          aLink.addClass(currentLinkClassName);
        } else {
          aLink.addClass(pageLinkClassName);
        }
        link.append(aLink);
      }
      return link;
    };
    // Next Page
    function createNextButton() {
      var link  = $(linkList).addClass($nextSetting.parentLinkClassName),
          aLink = $(linkListLinkItem).addClass(pageLinkClassName),
          icon  = $($nextSetting.text);
      aLink.attr('id', self.pageId($nextSetting.id));
      aLink.append(icon);
      link.append(aLink);
      return link;
    };
    // End Page
    function createEndButton() {
      var link  = $(linkList).addClass($endSetting.parentLinkClassName),
          aLink = $(linkListLinkItem).addClass(pageLinkClassName);
      aLink.attr('id', self.pageId($endSetting.id));
      // aLink.attr('href', '{{ page.url | relative_url }}');
      aLink.html($endSetting.text);
      link.append(aLink);
      return link;
    };
    // Page Count
    function createPageCountButton() {
      var link  = $(linkList).addClass($countSetting.parentLinkClassName),
          spanCurrent = $(linkListNormalItem).addClass($countSetting.spanLinkClassName),
          spanSep = $(linkListNormalItem).addClass($countSetting.spanLinkClassName),
          spanTotal = $(linkListNormalItem).addClass($countSetting.spanLinkClassName);

      spanCurrent.html('1');
      spanSep.html('/');
      spanTotal.html(pageCount.toString());

      $('<span>第</span>').appendTo(link);
      spanCurrent.appendTo(link);
      $('<span>页</span>').appendTo(link);
      spanSep.appendTo(link);
      $('<span>共</span>').appendTo(link);
      spanTotal.appendTo(link);
      $('<span>页</span>').appendTo(link);

      return link;
    };

    // Listener

    // Just For Judge ...
    var $linkEnumKey     = self.linkEnum,
        kLinkFixPagelink = $linkEnumKey.kLinkFixPagelink,
        kLinkFixCurrent  = $linkEnumKey.kLinkFixCurrent,
        kLinkFixNormal   = $linkEnumKey.kLinkFixNormal;

    var kLinkFixStart    = $linkEnumKey.kLinkFixStart,
        kLinkFixEnd      = $linkEnumKey.kLinkFixEnd,
        kLinkFixPrevious = $linkEnumKey.kLinkFixPrevious,
        kLinkFixNext     = $linkEnumKey.kLinkFixNext;

    var startPage        = self.startPageIndex;

    var fixCurrentPageLink = function(ops) {
      var $target = $('#' + self.pageId(currentPageNumber));
      if (ops == kLinkFixPagelink) {
        $target.removeClass(currentLinkClassName);
        $target.addClass(pageLinkClassName);
        $target.on('click', pagelinkClick);
      } else if (ops == kLinkFixCurrent) {
        $target.removeClass(pageLinkClassName);
        $target.addClass(currentLinkClassName);
        $target.off('click');
      }
    };
    var fixNormalPageLink = function(target_ops, normal_pagelink_ops) {
      var $target = $('#' + self.pageId(target_ops));
      if (normal_pagelink_ops == kLinkFixNormal) {
        $target.removeClass(pageLinkClassName);
        $target.addClass(normalLinkClassName);
        $target.off('click');
      } else if (normal_pagelink_ops == kLinkFixPagelink) {
        $target.removeClass(normalLinkClassName);
        $target.addClass(pageLinkClassName);
        $target.on('click', pagelinkClick);
      }
    };

    var fixStartEndPageLink = function(ops) {
      if (ops == kLinkFixStart) {
        // For Off Start End button [start]
        // fixNormalPageLink($startSetting.id, kLinkFixNormal);
        // fixNormalPageLink($endSetting.id, kLinkFixPagelink); [end]
        fixNormalPageLink($previousSetting.id, kLinkFixNormal);
        fixNormalPageLink($nextSetting.id, kLinkFixPagelink);
      } else if (ops == kLinkFixEnd) {
        // For Off Start End button [start]
        // fixNormalPageLink($endSetting.id, kLinkFixNormal);
        // fixNormalPageLink($startSetting.id, kLinkFixPagelink); [end]
        fixNormalPageLink($nextSetting.id, kLinkFixNormal);
        fixNormalPageLink($previousSetting.id, kLinkFixPagelink);
      }
    };

    var fixPreviousNextPageLink = function(ops) {
      var breakPoint = (ops == kLinkFixPrevious) ? startPage : pageCount,
          startEnd   = (breakPoint == startPage) ? kLinkFixStart : kLinkFixEnd;
      if (currentPageNumber == breakPoint) {
      // if (currentPageNumber <= breakPoint || currentPageNumber >= breakPoint) {
        fixStartEndPageLink(startEnd);
      } else {
        var id = (ops == kLinkFixPrevious) ? $previousSetting.id : $nextSetting.id ;
        fixNormalPageLink(ops, kLinkFixPagelink);
      }
    };

    var pageRows  = $settings.pageRows,
        rowsCount = $settings.rowsCount;

    var offset   = pageRows,
        startIdx = 0;

    var fixStartIdx = function() { startIdx = (currentPageNumber - 1) * pageRows; },
        fixOffset   = function() {
          if (currentPageNumber == startPage) { offset = pageRows; }
          if (currentPageNumber == pageCount) { offset = (rowsCount - startIdx); }
        };

    var pagelinkClick = function() {

      // For Test
      // var content = this.innerText;
      // console.log(this.className + content);
      // console.log($(this).attr('id'));

      $($settings.postListRowSelector).css('display', 'none'); // 全部隐藏

      fixCurrentPageLink(kLinkFixPagelink);

      switch ($(this).attr('id')) {
        case self.pageId($startSetting.id): { // page1 [row0 - row(pageRows)]
          // console.log('start');
          currentPageNumber = startPage;
          fixStartEndPageLink(kLinkFixStart);
          fixStartIdx();
          fixOffset();
          break;
        }
        case self.pageId($previousSetting.id): {
          // console.log('previous');
          currentPageNumber -= 1;
          if (currentPageNumber < startPage) { currentPageNumber = startPage; }
          fixPreviousNextPageLink(kLinkFixPrevious);
          fixStartIdx();
          fixOffset();
          break;
        }
        case self.pageId($nextSetting.id): {
          // console.log('next');
          currentPageNumber += 1;
          if (currentPageNumber > pageCount) { currentPageNumber = pageCount; }
          fixPreviousNextPageLink(kLinkFixNext);
          fixStartIdx();
          fixOffset();
          break;
        }
        case self.pageId($endSetting.id): {
          // console.log('end');
          currentPageNumber = pageCount;
          fixStartEndPageLink(kLinkFixEnd);
          fixStartIdx();
          fixOffset();
          break;
        }
        // 中间的数值换页
        default: {
          // console.log('center');
          currentPageNumber = parseInt(this.innerText);
          if (currentPageNumber == startPage) { fixStartEndPageLink(kLinkFixStart); }
          if (currentPageNumber == pageCount) { fixStartEndPageLink(kLinkFixEnd); }
          fixStartIdx();
          fixOffset();
        }
      }

      // 修改选中
      fixCurrentPageLink(kLinkFixCurrent);

      // 显示选中页
      // console.log('currentPageNumber:' + currentPageNumber);
      // console.log('startIdx:' + startIdx);
      // console.log('offset:' + offset);
      for (var i = startIdx; i < (startIdx + offset); i++) {
        $('#' + self.pageRowId(i)).css('display', 'block');
        // console.log($('#' + self.pageRowId(i)));
      }

      scrollTo(0, 0);

    };

    $('.' + pageLinkClassName).on('click', pagelinkClick);

  },

  defaultSettings_globalDefaults: {

    /**
     * Options Settings
     */
     /**
      * Post List Content Row Object Selector.
      * @type {jQuery Element String}
      */
     postListRowSelector: '.row',
     /**
      * Post List Pagination Content Object Selector.
      * @type {jQuery Element String}
      */
     postPagination: '#post-pagination',

     /**
      * Post List Rows Count.
      * @type {int Number}
      */
     pageRows: 0,

     /**
      * Post List Page Items.
      * @type {int Number}
      */
     pageItems: 0,

     /**
      * Post List Page Count.
      * @type {int Number}
      */
     pageCount: 0,

     /**
      * Post List Page Row Count.
      * @type {int Number}
      */
     rowsCount: 0,

     /**
      * Pagination Container.
      * @type {JQuery Object String}
      */
     pagination: '<div/>',

     /**
      * Pagination Container Class Name.
      * @type {String}
      */
     paginationClassName: 'pagination',

     /**
      * Pagination Links Container.
      * @type {JQuery Object String}
      */
     paginationLinks: '<ol/>',

     /**
      * Pagination Links Container Class Name.
      * @type {String}
      */
     paginationLinksClassName: 'page-links',

    /**
     * Pagination Links Sub Link Buttons Setting.
     */
     /**
      * Pagination Links Normal Link Class Name.
      * @type {String}
      */
     normalLinkClassName: 'normal',

     /**
      * Pagination Links Current Link Class Name.
      * @type {String}
      */
     currentLinkClassName: 'current',

     /**
      * Pagination Links Page Link Class Name.{ default }
      * @type {String}
      */
     pageLinkClassName: 'page-link',

     /**
      * Pagination Links Page Link Container,
      * @type {String}
      */
     link: '<li/>',

     /**
      * Pagination Links Page Link Link,
      * @type {String}
      */
     aLink: '<a/>',

     /**
      * Pagination Links Page Link Label,
      * @type {String}
      */
     spanLink: '<span/>',
  },

  defaultSettings_startDefaults: {
    /**
     * Pagination Links Sub Link Start Button.
     */
     /**
      * Pagination Links Page Link Link Parent Class Name,
      * @type {String}
      */
     parentLinkClassName: 'num-start-end',
     /**
      * Pagination Links Page Link Link id,
      * @type {String}
      */
     id: 'start',
     /**
      * Pagination Links Page Link Link Text,
      * @type {String}
      */
     text: '首页',
  },

  defaultSettings_endDefaults: {
    /**
     * Pagination Links Sub Link End Button.
     */
     /**
      * Pagination Links Page Link Link Parent Class Name,
      * @type {String}
      */
     parentLinkClassName: 'num-start-end',
     /**
      * Pagination Links Page Link Link id,
      * @type {String}
      */
     id: 'end',
     /**
      * Pagination Links Page Link Link Text,
      * @type {String}
      */
     text: '末页',

  },

  defaultSettings_previousDefaults: {
    /**
     * Pagination Links Sub Link Previous Button.
     */
     /**
      * Pagination Links Page Link Link Parent Class Name,
      * @type {String}
      */
     parentLinkClassName: 'page-previous-next',
     /**
      * Pagination Links Page Link Link id,
      * @type {String}
      */
     id: 'previous',
     /**
      * Pagination Links Page Link Link Text,
      * @type {String}
      */
     text: '<i class="iconfont icon-previous-page"><i/>',

  },

  defaultSettings_nextDefaults: {
    /**
     * Pagination Links Sub Link Next Button.
     */
     /**
      * Pagination Links Page Link Link Parent Class Name,
      * @type {String}
      */
     parentLinkClassName: 'page-previous-next',
     /**
      * Pagination Links Page Link Link id,
      * @type {String}
      */
     id: 'next',
     /**
      * Pagination Links Page Link Link Text,
      * @type {String}
      */
     text: '<i class="iconfont icon-next-page"><i/>',

  },

  defaultSettings_centerDefaults: {
    /**
     * Pagination Links Sub Link Center Page Indice.
     */
     /**
      * Pagination Links Page Link Link Parent Class Name,
      * @type {String}
      */
     parentLinkClassName: 'page-center',

  },

  defaultSettings_totalCountDefaults: {
    /**
     * Pagination Links Sub Link Count Label.
     */
     /**
      * Pagination Links Page Link Link Parent Class Name,
      * @type {String}
      */
     parentLinkClassName: 'page-total',
     /**
      * Pagination Links Page Link Link Span Class Name,
      * @type {String}
      */
     spanLinkClassName: 'page-number',
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
    return collectionPost;
}));
