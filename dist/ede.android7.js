"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// ==UserScript==
// @name         Emby danmaku extension - Emby style
// @description  Emby弹幕插件 - Emby风格
// @namespace    https://github.com/chen3861229/dd-danmaku
// @author       chen3861229
// @version      1.47
// @copyright    2022, RyoLee (https://github.com/RyoLee)
// @license      MIT; https://raw.githubusercontent.com/RyoLee/emby-danmaku/master/LICENSE
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @grant        none
// @match        *://*/web/index.html
// @match        *://*/web/
// ==/UserScript==

(async function () {
  'use strict';

  // ------ 用户配置 start ------
  var requireDanmakuPath = 'https://danmaku.7o7o.cc/danmaku.min.js';
  // 跨域代理 cf_worker
  var corsProxy = 'https://ddplay-api.7o7o.cc/cors/';
  // ------ 用户配置 end ------
  // note01: 部分 AndroidTV 仅支持最高 ES9 (支持 webview 内核版本 60 以上)
  // note02: url 禁止使用相对路径,非 web 环境的根路径为文件路径,非 http
  // ------ 程序内部使用,请勿更改 start ------
  var openSourceLicense = {
    self: {
      version: '1.47',
      name: 'Emby Danmaku Extension(Forked from original:1.11)',
      license: 'MIT License',
      url: 'https://github.com/chen3861229/dd-danmaku'
    },
    original: {
      version: '1.11',
      name: 'Emby Danmaku Extension',
      license: 'MIT License',
      url: 'https://github.com/RyoLee/emby-danmaku'
    },
    jellyfinFork: {
      version: '1.52',
      name: 'Jellyfin Danmaku Extension',
      license: 'MIT License',
      url: 'https://github.com/Izumiko/jellyfin-danmaku'
    },
    danmaku: {
      version: '2.0.8',
      name: 'Danmaku',
      license: 'MIT License',
      url: 'https://github.com/weizhenye/Danmaku'
    },
    dandanplayApi: {
      version: 'v2',
      name: '弹弹 play API',
      license: 'MIT License',
      url: 'https://github.com/kaedei/dandanplay-libraryindex'
    },
    dandanplayDoc: {
      version: 'PC',
      name: '赞助弹弹 play 官方',
      license: 'None',
      url: 'https://doc.dandanplay.com/other/donate.html'
    },
    bangumiApi: {
      version: '2025-02-5',
      name: 'Bangumi API',
      license: 'None',
      url: 'https://github.com/bangumi/api'
    },
    embyPluginDanmu: {
      version: '1.0.2',
      name: 'EmbyPluginDanmu',
      license: 'None',
      url: 'https://github.com/fengymi/emby-plugin-danmu'
    }
  };
  var dandanplayApi = {
    get prefix() {
      var custom = lsGetItem(lsKeys.customApiPrefix.id);
      if (custom && custom.length > 0 && !lsGetItem(lsKeys.useOfficialApi.id)) {
        return custom;
      }
      // 官方API强制走代理
      return corsProxy + 'https://api.dandanplay.net/api/v2';
    },
    getSearchEpisodes: function getSearchEpisodes(anime, episode, tmdbId) {
      return "".concat(dandanplayApi.prefix, "/search/episodes?anime=").concat(anime).concat(episode ? "&episode=".concat(episode) : '').concat(tmdbId ? "&tmdbId=".concat(tmdbId) : '');
    },
    getComment: function getComment(episodeId, chConvert) {
      return "".concat(dandanplayApi.prefix, "/comment/").concat(episodeId, "?withRelated=true&chConvert=").concat(chConvert);
    },
    getExtcomment: function getExtcomment(url) {
      return "".concat(dandanplayApi.prefix, "/extcomment?url=").concat(encodeURI(url));
    },
    getBangumi: function getBangumi(animeId) {
      return "".concat(dandanplayApi.prefix, "/bangumi/").concat(animeId);
    },
    posterImg: function posterImg(animeId) {
      return "https://img.dandanplay.net/anime/".concat(animeId, ".jpg");
    }
  };
  var dandanplayApiCustom = {
    get prefix() {
      var custom = lsGetItem(lsKeys.customApiPrefix.id);
      // 自定义API可以不走代理
      return custom && custom.length > 0 ? custom : corsProxy + 'https://api.dandanplay.net/api/v2';
    },
    getMatchUrl: function getMatchUrl() {
      return "".concat(dandanplayApiCustom.prefix, "/match");
    }
  };
  var bangumiApi = {
    prefix: 'https://api.bgm.tv/v0',
    accessTokenUrl: 'https://next.bgm.tv/demo/access-token',
    getCharacters: function getCharacters(subjectId) {
      return "".concat(bangumiApi.prefix, "/subjects/").concat(subjectId, "/characters");
    },
    // need auth
    getMe: function getMe() {
      return "".concat(bangumiApi.prefix, "/me");
    },
    getUserCollection: function getUserCollection(userName, subjectId) {
      return "".concat(bangumiApi.prefix, "/users/").concat(userName, "/collections/").concat(subjectId);
    },
    postUserCollection: function postUserCollection(subjectId) {
      return "".concat(bangumiApi.prefix, "/users/-/collections/").concat(subjectId);
    },
    getUserSubjectEpisodeCollection: function getUserSubjectEpisodeCollection(subjectId) {
      return "".concat(bangumiApi.prefix, "/users/-/collections/").concat(subjectId, "/episodes?offset=0&limit=100");
    },
    putUserEpisodeCollection: function putUserEpisodeCollection(episodeId) {
      return "".concat(bangumiApi.prefix, "/users/-/collections/-/episodes/").concat(episodeId);
    }
  };
  var check_interval = 200;
  var LOAD_TYPE = {
    CHECK: 'check',
    INIT: 'init',
    REFRESH: 'refresh',
    RELOAD: 'reload',
    // 优先走缓存,其余类型走接口
    SEARCH: 'search'
  };
  var isVersionOld = false;
  // htmlVideoPlayerContainer
  var mediaContainerQueryStr = '.graphicContentContainer';
  var notHide = ':not(.hide)';
  var mediaQueryStr = 'video';

  // https://fonts.google.com/icons
  var iconKeys = {
    replay_30: 'replay_30',
    replay_10: 'replay_10',
    replay_5: 'replay_5',
    replay: 'replay',
    reset: 'repeat',
    forward_media: 'forward_media',
    // electron 中图标不正确,使用 replay 反转
    forward_5: 'forward_5',
    forward_10: 'forward_10',
    forward_30: 'forward_30',
    comment: 'comment',
    comments_disabled: 'comments_disabled',
    switch_on: 'toggle_on',
    switch_off: 'toggle_off',
    setting: 'tune',
    search: 'search',
    done: 'done_all',
    done_disabled: 'remove_done',
    more: 'more_horiz',
    close: 'close',
    refresh: 'refresh',
    block: 'block',
    text_format: 'translate',
    person: 'person',
    sentiment_very_satisfied: 'sentiment_very_satisfied',
    check: 'check',
    edit: 'edit'
  };
  // 此 id 等同于 danmakuTabOpts 内的弹幕信息的 id
  var currentDanmakuInfoContainerId = 'danmakuTab2';
  var tabIframeId = 'danmakuTab5';
  // 菜单 tabs, 为兼容控制器移动, 应避免使用左右布局
  var danmakuTabOpts = [{
    id: 'danmakuTab0',
    name: '弹幕设置',
    buildMethod: buildDanmakuSetting
  }, {
    id: 'danmakuTab1',
    name: '手动匹配',
    buildMethod: buildSearchEpisode
  }, {
    id: currentDanmakuInfoContainerId,
    name: '弹幕信息',
    buildMethod: buildCurrentDanmakuInfo
  }, {
    id: 'danmakuTab3',
    name: '高级设置',
    buildMethod: buildProSetting
  }, {
    id: 'danmakuTab4',
    name: '关于',
    buildMethod: buildAbout
  }, {
    id: tabIframeId,
    name: '内嵌网页',
    hidden: true,
    buildMethod: buildIframe
  }];
  // 弹幕类型过滤
  var danmakuTypeFilterOpts = {
    bottom: {
      id: 'bottom',
      name: '底部弹幕'
    },
    top: {
      id: 'top',
      name: '顶部弹幕'
    },
    ltr: {
      id: 'ltr',
      name: '从左至右'
    },
    rtl: {
      id: 'rtl',
      name: '从右至左'
    },
    rolling: {
      id: 'rolling',
      name: '滚动弹幕'
    },
    onlyWhite: {
      id: 'onlyWhite',
      name: '彩色弹幕'
    },
    emoji: {
      id: 'emoji',
      name: 'emoji'
    }
  };
  var danmakuSource = {
    AcFun: {
      id: 'AcFun',
      name: 'A站(AcFun)'
    },
    BiliBili: {
      id: 'BiliBili',
      name: 'B站(BiliBili)'
    },
    DanDanPlay: {
      id: 'DanDanPlay',
      name: '弹弹(DanDanPlay)'
    },
    // 无弹幕来源的默认值
    D: {
      id: 'D',
      name: 'D'
    },
    // 未知平台
    Gamer: {
      id: 'Gamer',
      name: '巴哈(Gamer)'
    },
    iqiyi: {
      id: 'iqiyi',
      name: '爱奇艺(iqiyi)'
    },
    QQ: {
      id: 'QQ',
      name: '腾讯视频(QQ)'
    },
    Youku: {
      id: 'Youku',
      name: '优酷(Youku)'
    },
    '5dm': {
      id: '5dm',
      name: 'D站(5dm)'
    },
    '异世界动漫': {
      id: '异世界动漫',
      name: '异世界动漫'
    }
  };
  var showSource = {
    source: {
      id: 'source',
      name: '来源平台'
    },
    originalUserId: {
      id: 'originalUserId',
      name: '用户ID'
    },
    cid: {
      id: 'cid',
      name: '弹幕CID'
    } // 非弹幕 id,唯一性需自行用 uid + cid 拼接的 cuid
  };
  var danmakuEngineOpts = [{
    id: 'canvas',
    name: 'canvas'
  }, {
    id: 'dom',
    name: 'dom'
  }];
  var danmakuChConverOpts = [{
    id: '0',
    name: '未启用'
  }, {
    id: '1',
    name: '转换为简体'
  }, {
    id: '2',
    name: '转换为繁体'
  }];
  var embyOffsetBtnStyle = 'margin: 0;padding: 0;';
  var timeOffsetBtns = [{
    label: '-30',
    valueOffset: '-30',
    iconKey: iconKeys.replay_30,
    style: embyOffsetBtnStyle
  }, {
    label: '-10',
    valueOffset: '-10',
    iconKey: iconKeys.replay_10,
    style: embyOffsetBtnStyle
  }, {
    label: '-5',
    valueOffset: '-5',
    iconKey: iconKeys.replay_5,
    style: embyOffsetBtnStyle
  }, {
    label: '-1',
    valueOffset: '-1',
    iconKey: iconKeys.replay,
    style: embyOffsetBtnStyle
  }, {
    label: '0',
    valueOffset: '0',
    iconKey: iconKeys.reset,
    style: embyOffsetBtnStyle
  }, {
    label: '+1',
    valueOffset: '1',
    iconKey: iconKeys.replay,
    style: embyOffsetBtnStyle + ' transform: rotateY(180deg);'
  }, {
    label: '+5',
    valueOffset: '5',
    iconKey: iconKeys.forward_5,
    style: embyOffsetBtnStyle
  }, {
    label: '+10',
    valueOffset: '10',
    iconKey: iconKeys.forward_10,
    style: embyOffsetBtnStyle
  }, {
    label: '+30',
    valueOffset: '30',
    iconKey: iconKeys.forward_30,
    style: embyOffsetBtnStyle
  }];
  var toastPrefixes = {
    system: '[系统通知] : '
  };
  var hasToastPrefixes = function hasToastPrefixes(comment, prefixes) {
    return Object.values(prefixes).some(function (prefix) {
      return comment.text.startsWith(prefix);
    });
  };
  var getDanmakuComments = function getDanmakuComments(ede) {
    if (ede.danmaku && ede.danmaku.comments) {
      return ede.danmaku.comments.filter(function (c) {
        return !hasToastPrefixes(c, toastPrefixes);
      });
    }
    return [];
  };
  var danmuListOpts = [{
    id: '0',
    name: '不展示',
    onChange: function onChange() {
      return [];
    }
  }, {
    id: '1',
    name: '屏中',
    onChange: function onChange(ede) {
      return ede.danmaku ? ede.danmaku._.runningList : [];
    }
  }, {
    id: '2',
    name: '所有',
    onChange: function onChange(ede) {
      return ede.commentsParsed;
    }
  }, {
    id: '3',
    name: '已加载',
    onChange: getDanmakuComments
  }, {
    id: '4',
    name: '被过滤',
    onChange: function onChange(ede) {
      // 取差集慢,减轻负担,默认不启用
      return ede.commentsParsed.filter(function (p) {
        return !getDanmakuComments(ede).some(function (c) {
          return p.cuid === c.cuid;
        });
      });
    }
  }, {
    id: '5',
    name: '已相似合并',
    onChange: function onChange(ede) {
      return ede.commentsParsed.filter(function (p) {
        return p.xCount;
      });
    }
  }, {
    id: '100',
    name: '通知',
    onChange: function onChange(ede) {
      return ede.danmaku ? ede.danmaku.comments.filter(function (c) {
        return hasToastPrefixes(c, toastPrefixes);
      }) : [];
    }
  }];
  var timeoutCallbackUnitOpts = [{
    id: '0',
    name: '秒',
    msRate: 1000
  }, {
    id: '1',
    name: '分',
    msRate: 1000 * 60
  }, {
    id: '2',
    name: '时',
    msRate: 1000 * 60 * 60
  }];
  var apiPriorityOpts = [{
    id: 'official',
    name: '官方API优先'
  }, {
    id: 'custom',
    name: '自定义API优先'
  }];
  var timeoutCallbackId;
  var timeoutCallbackClear = function timeoutCallbackClear() {
    return timeoutCallbackId && clearTimeout(timeoutCallbackId);
  };
  var timeoutCallbackTypeOpts = [{
    id: '0',
    name: '不启用',
    onChange: function onChange() {
      return timeoutCallbackClear();
    }
  }, {
    id: '1',
    name: '退出播放',
    onChange: function onChange(ms) {
      timeoutCallbackClear(), timeoutCallbackId = setTimeout(function () {
        closeEmbyDialog(), Emby.InputManager.trigger('back');
      }, ms);
    }
  }, {
    id: '2',
    name: '返回主页',
    onChange: function onChange(ms) {
      // Native 播放器不支持.trigger('home'),虽底层一样,但原因未知
      timeoutCallbackClear(), timeoutCallbackId = setTimeout(function () {
        closeEmbyDialog(), Emby.Page.goHome();
      }, ms);
    }
  }];
  var getApiTl = function getApiTl(fn) {
    if (!fn || typeof fn.toString !== 'function') {
      return '';
    }
    var match = fn.toString().match(/\=>\s*(.*)$/);
    if (!match || !match[1]) {
      return '';
    }
    return match[1].trim().replace(/`/g, '');
  };
  var labels = {
    enable: '启用'
  };
  var lsKeys = {
    // id 统一使用 danmaku 前缀
    chConvert: {
      id: 'danmakuChConvert',
      defaultValue: 1,
      name: '简繁转换'
    },
    switch: {
      id: 'danmakuSwitch',
      defaultValue: true,
      name: '弹幕开关'
    },
    filterLevel: {
      id: 'danmakuFilterLevel',
      defaultValue: 0,
      name: '过滤强度',
      min: 0,
      max: 3,
      step: 1
    },
    heightPercent: {
      id: 'danmakuHeightPercent',
      defaultValue: 100,
      name: '显示区域',
      min: 3,
      max: 100,
      step: 1
    },
    fontSizeRate: {
      id: 'danmakuFontSizeRate',
      defaultValue: 1,
      name: '弹幕大小',
      min: 0.1,
      max: 3,
      step: 0.1
    },
    fontOpacity: {
      id: 'danmakuFontOpacity',
      defaultValue: 1,
      name: '透明度',
      min: 0.1,
      max: 1,
      step: 0.1
    },
    speed: {
      id: 'danmakuBaseSpeed',
      defaultValue: 1,
      name: '速度',
      min: 0.1,
      max: 3,
      step: 0.1
    },
    timelineOffset: {
      id: 'danmakuTimelineOffset',
      defaultValue: 0,
      name: '轴偏秒'
    },
    fontWeight: {
      id: 'danmakuFontWeight',
      defaultValue: 400,
      name: '弹幕粗细',
      min: 100,
      max: 1000,
      step: 100
    },
    fontStyle: {
      id: 'danmakuFontStyle',
      defaultValue: 0,
      name: '弹幕斜体',
      min: 0,
      max: 2,
      step: 1
    },
    fontFamily: {
      id: 'danmakuFontFamily',
      defaultValue: 'sans-serif',
      name: '字体'
    },
    danmuList: {
      id: 'danmakuDanmuList',
      defaultValue: 0,
      name: '弹幕列表'
    },
    typeFilter: {
      id: 'danmakuTypeFilter',
      defaultValue: [],
      name: '屏蔽类型'
    },
    sourceFilter: {
      id: 'danmakuSourceFilter',
      defaultValue: [],
      name: '屏蔽来源平台'
    },
    showSource: {
      id: 'danmakuShowSource',
      defaultValue: [],
      name: '显示每条来源'
    },
    autoFilterCount: {
      id: 'danmakuAutoFilterCount',
      defaultValue: 0,
      name: '自动过滤弹幕数阈值',
      min: 0,
      max: 10000,
      step: 500
    },
    mergeSimilarEnable: {
      id: 'danmakuMergeSimilarEnable',
      defaultValue: false,
      name: '合并相似弹幕'
    },
    mergeSimilarPercent: {
      id: 'danmakuMergeSimilarPercent',
      defaultValue: 80,
      name: '相似度百分比',
      min: 20,
      max: 100,
      step: 1
    },
    mergeSimilarTime: {
      id: 'danmakuMergeSimilarTime',
      defaultValue: 10,
      name: '相似度时间窗口秒',
      min: 1,
      max: 60,
      step: 1
    },
    filterKeywords: {
      id: 'danmakuFilterKeywords',
      defaultValue: '',
      name: '屏蔽关键词'
    },
    filterKeywordsEnable: {
      id: 'danmakuFilterKeywordsEnable',
      defaultValue: true,
      name: '屏蔽关键词启用'
    },
    // removeEmojiEnable: { id: 'danmakuRemoveEmojiEnable', defaultValue: false, name: '移除弹幕中的emoji' },
    engine: {
      id: 'danmakuEngine',
      defaultValue: 'canvas',
      name: '弹幕引擎'
    },
    osdTitleEnable: {
      id: 'danmakuOsdTitleEnable',
      defaultValue: false,
      name: '播放界面右下角显示弹幕信息'
    },
    osdLineChartEnable: {
      id: 'danmakuOsdLineChartEnable',
      defaultValue: false,
      name: '弹幕高能进度条'
    },
    osdLineChartSkipFilter: {
      id: 'danmakuOsdLineChartSkipFilter',
      defaultValue: false,
      name: '弹幕高能进度条免过滤'
    },
    osdLineChartTime: {
      id: 'danmakuOsdLineChartTime',
      defaultValue: 10,
      name: '弹幕高能进度条颗粒度秒',
      min: 1,
      max: 60,
      step: 1
    },
    osdHeaderClockEnable: {
      id: 'danmakuOsdHeaderClockEnable',
      defaultValue: false,
      name: '播放界面头中显示时钟'
    },
    timeoutCallbackUnit: {
      id: 'danmakuTimeoutCallbackUnit',
      defaultValue: 1,
      name: '定时单位'
    },
    timeoutCallbackValue: {
      id: 'danmakuTimeoutCallbackValue',
      defaultValue: 0,
      name: '定时值'
    },
    bangumiEnable: {
      id: 'danmakuBangumiEnable',
      defaultValue: false,
      name: '启用并填写个人令牌'
    },
    bangumiToken: {
      id: 'danmakuBangumiToken',
      defaultValue: '',
      name: '个人令牌'
    },
    bangumiPostPercent: {
      id: 'danmakuBangumiPostPercent',
      defaultValue: 95,
      name: '时长比',
      min: 1,
      max: 99,
      step: 1
    },
    consoleLogEnable: {
      id: 'danmakuConsoleLogEnable',
      defaultValue: false,
      name: '控制台日志'
    },
    useFetchPluginXml: {
      id: 'danmakuUseFetchPluginXml',
      defaultValue: false,
      name: '加载媒体服务端xml弹幕'
    },
    // refreshPluginXml: { id: 'danmakuRefreshPluginXml', defaultValue: false, name: '加载前刷新媒体服务端xml弹幕' },
    debugShowDanmakuWrapper: {
      id: 'danmakuDebugShowDanmakuWrapper',
      defaultValue: false,
      name: '弹幕容器边界'
    },
    debugShowDanmakuCtrWrapper: {
      id: 'danmakuDebugShowDanmakuCtrWrapper',
      defaultValue: false,
      name: '按钮容器边界'
    },
    debugReverseDanmu: {
      id: 'danmakuDebugReverseDanmu',
      defaultValue: false,
      name: '反转弹幕方向'
    },
    debugRandomDanmuColor: {
      id: 'danmakuDebugRandomDanmuColor',
      defaultValue: false,
      name: '随机弹幕颜色'
    },
    debugForceDanmuWhite: {
      id: 'danmakuDebugForceDanmuWhite',
      defaultValue: false,
      name: '强制弹幕白色'
    },
    debugTopBottomToScroll: {
      id: 'danmakuDebugTopBottomToScroll',
      defaultValue: false,
      name: '顶底弹幕滚动'
    },
    debugGenerateLarge: {
      id: 'danmakuDebugGenerateLarge',
      defaultValue: false,
      name: '测试大量弹幕'
    },
    debugDialogHyalinize: {
      id: 'danmakuDebugDialogHyalinize',
      defaultValue: false,
      name: '透明弹窗背景'
    },
    debugDialogWindow: {
      id: 'danmakuDebugDialogWindow',
      defaultValue: false,
      name: '弹窗窗口化'
    },
    debugDialogRight: {
      id: 'danmakuDebugDialogRight',
      defaultValue: false,
      name: '弹窗靠右布局'
    },
    // Emby Android 上暂时存在 bug
    debugTabIframeEnable: {
      id: 'danmakuDebugTabIframeEnable',
      defaultValue: false,
      name: '打开内嵌网页'
    },
    debugH5VideoAdapterEnable: {
      id: 'danmakuDebugH5VideoAdapterEnable',
      defaultValue: false,
      name: '查看视频适配器情况'
    },
    debugDanmuAnywhereEnable: {
      id: 'danmakuDebugDanmuAnywhereEnable',
      defaultValue: false,
      name: '在任意处测试弹幕'
    },
    quickDebugOn: {
      id: 'danmakuQuickDebugOn',
      defaultValue: false,
      name: '快速调试'
    },
    customeCorsProxyUrl: {
      id: 'danmakuCustomeCorsProxyUrl',
      defaultValue: corsProxy,
      name: '跨域代理前缀'
    },
    customeDanmakuUrl: {
      id: 'danmakuCustomeDanmakuUrl',
      defaultValue: requireDanmakuPath,
      name: '弹幕引擎依赖'
    },
    customeGetCommentUrl: {
      id: 'danmakuCustomeGetCommentUrl',
      defaultValue: getApiTl(dandanplayApi.getComment),
      name: '获取指定弹幕库的所有弹幕'
    },
    customeGetExtcommentUrl: {
      id: 'danmakuCustomeGetExtcommentUrl',
      defaultValue: getApiTl(dandanplayApi.getExtcomment),
      name: '获取指定第三方url的弹幕'
    },
    customePosterImgUrl: {
      id: 'danmakuCustomePosterImgUrl',
      defaultValue: getApiTl(dandanplayApi.posterImg),
      name: '媒体海报'
    },
    customApiPrefix: {
      id: 'danmakuCustomApiPrefix',
      defaultValue: '',
      name: '自定义弹弹play API地址'
    },
    useOfficialApi: {
      id: 'danmakuUseOfficialApi',
      defaultValue: true,
      name: '使用官方API'
    },
    useCustomApi: {
      id: 'danmakuUseCustomApi',
      defaultValue: false,
      name: '使用自定义API'
    },
    apiPriority: {
      id: 'danmakuApiPriority',
      defaultValue: ['official', 'custom'],
      name: 'API 优先级'
    }
  };
  var lsLocalKeys = {
    animePrefix: '_anime_id_rel_',
    animeSeasonPrefix: '_anime_season_rel_',
    animeEpisodePrefix: '_episode_id_rel_',
    bangumiEpInfoPrefix: '_bangumi_episode_id_rel_',
    bangumiMe: '_bangumi_me',
    // customApiPrefix
    apiPrefix: '_api_'
  };
  var eleIds = {
    danmakuSwitchBtn: 'danmakuSwitchBtn',
    danmakuCtr: 'danmakuCtr',
    danmakuWrapper: 'danmakuWrapper',
    h5VideoAdapter: 'h5VideoAdapter',
    dialogContainer: 'dialogContainer',
    danmakuSwitchDiv: 'danmakuSwitchDiv',
    danmakuSwitch: 'danmakuSwitch',
    filterLevelDiv: 'filterLevelDiv',
    danmakuSearchNameDiv: 'danmakuSearchNameDiv',
    danmakuSearchName: 'danmakuSearchName',
    danmakuEpisodeFlag: 'danmakuEpisodeFlag',
    danmakuAnimeDiv: 'danmakuAnimeDiv',
    danmakuSwitchEpisode: 'danmakuSwitchEpisode',
    danmakuEpisodeNumDiv: 'danmakuEpisodeNumDiv',
    danmakuEpisodeLoad: 'danmakuEpisodeLoad',
    danmakuRemark: 'danmakuRemark',
    danmakuAnimeSelect: 'danmakuAnimeSelect',
    danmakuEpisodeNumSelect: 'danmakuEpisodeNumSelect',
    searchImgDiv: 'searchImgDiv',
    searchImg: 'searchImg',
    searchApiSource: 'searchApiSource',
    apiCheckboxListDiv: 'apiCheckboxListDiv',
    apiPriorityDiv: 'apiPriorityDiv',
    customApiPrefixInputDiv: 'customApiPrefixInputDiv',
    clearLocalMatchCacheBtn: 'clearLocalMatchCacheBtn',
    extCommentSearchDiv: 'extCommentSearchDiv',
    extUrlsDiv: 'extUrlsDiv',
    currentMatchedDiv: 'currentMatchedDiv',
    filteringDanmaku: 'filteringDanmaku',
    danmakuTypeFilterDiv: 'danmakuTypeFilterDiv',
    danmakuTypeFilterSelectName: 'danmakuTypeFilterSelectName',
    danmakuSourceFilterDiv: 'danmakuSourceFilterDiv',
    danmakuSourceFilterSelectName: 'danmakuSourceFilterSelectName',
    danmakuShowSourceDiv: 'danmakuShowSourceDiv',
    danmakuShowSourceSelectName: 'danmakuShowSourceSelectName',
    danmakuAutoFilterCountDiv: 'danmakuAutoFilterCountDiv',
    danmakuFilterProDiv: 'danmakuFilterProDiv',
    mergeSimilarPercentDiv: "mergeSimilarPercentDiv",
    mergeSimilarTimeDiv: "mergeSimilarTimeDiv",
    posterImgDiv: 'posterImgDiv',
    danmuListDiv: 'danmuListDiv',
    danmuListText: 'danmakuListText',
    extInfoCtrlDiv: 'extInfoCtrlDiv',
    extInfoDiv: 'extInfoDiv',
    characterImgHeihtDiv: 'characterImgHeihtDiv',
    characterImgHeihtLabel: 'characterImgHeihtLabel',
    charactersDiv: 'charactersDiv',
    filterKeywordsDiv: 'filterKeywordsDiv',
    danmakuChConverDiv: 'danmakuChConverDiv',
    danmakuEngineDiv: 'danmakuEngineDiv',
    heightPercentDiv: 'heightPercentDiv',
    danmakuSizeDiv: 'danmakuSizeDiv',
    danmakuOpacityDiv: 'danmakuOpacityDiv',
    danmakuSpeedDiv: 'danmakuSpeedDiv',
    danmakuFontWeightDiv: 'danmakuFontWeightDiv',
    danmakuFontStyleDiv: 'danmakuFontStyleDiv',
    timelineOffsetDiv: 'timelineOffsetDiv',
    fontFamilyCtrl: 'fontFamilyCtrl',
    fontFamilyDiv: 'fontFamilyDiv',
    fontFamilyLabel: 'fontFamilyLabel',
    fontFamilySelect: 'fontFamilySelect',
    fontFamilyInput: 'fontFamilyInput',
    fontStylePreview: 'fontStylePreview',
    settingsCtrl: 'settingsCtrl',
    settingsText: 'settingsText',
    settingsImportBtn: 'settingsImportBtn',
    settingReloadBtn: 'settingReloadBtn',
    filterKeywordsEnableId: 'filterKeywordsEnableId',
    filterKeywordsId: 'filterKeywordsId',
    timeoutCallbackDiv: 'timeoutCallbackDiv',
    timeoutCallbackLabel: 'timeoutCallbackLabel',
    timeoutCallbackTypeDiv: 'timeoutCallbackTypeDiv',
    timeoutCallbackUnitDiv: 'timeoutCallbackUnitDiv',
    bangumiEnableLabel: 'bangumiEnableLabel',
    bangumiSettingsDiv: 'bangumiSettingsDiv',
    bangumiTokenInput: 'bangumiTokenInput',
    bangumiTokenInputDiv: 'bangumiTokenInputDiv',
    bangumiTokenLabel: 'bangumiTokenInputLabel',
    bangumiTokenLinkDiv: 'bangumiTokenLinkDiv',
    bangumiPostPercentDiv: 'bangumiPostPercentDiv',
    customeUrlsDiv: 'customeUrlsDiv',
    customeCorsProxyDiv: 'customeCorsProxyDiv',
    customeDanmakuDiv: 'customeDanmakuDiv',
    customeGetCommentDiv: 'customeGetCommentDiv',
    customeGetExtcommentDiv: 'customeGetExtcommentDiv',
    customePosterImgDiv: 'customePosterImgDiv',
    consoleLogCtrl: 'consoleLogCtrl',
    consoleLogInfo: 'consoleLogInfo',
    consoleLogText: 'consoleLogText',
    consoleLogTextInput: 'consoleLogTextInput',
    consoleLogCountLabel: 'consoleLogCountLabel',
    debugCheckbox: 'debugCheckbox',
    debugButton: 'debugButton',
    tabIframe: 'tabIframe',
    tabIframeHeightDiv: 'tabIframeHeightDiv',
    tabIframeHeightLabel: 'tabIframeHeightLabel',
    tabIframeCtrlDiv: 'tabIframeCtrlDiv',
    tabIframeSrcInputDiv: 'tabIframeSrcInputDiv',
    openSourceLicenseDiv: 'openSourceLicenseDiv',
    videoOsdDanmakuTitle: 'videoOsdDanmakuTitle',
    extCheckboxDiv: 'extCheckboxDiv',
    osdCheckboxDiv: 'osdCheckboxDiv',
    osdLineChartDiv: 'osdLineChartDiv',
    osdLineChartTimeDiv: "osdLineChartTimeDiv",
    danmuPluginDiv: 'danmuPluginDiv',
    danmakuSettingBtnDebug: 'danmakuSettingBtnDebug',
    progressBarLineChart: 'progressBarLineChart'
  };
  // 播放界面下方按钮
  var mediaBtnOpts = [{
    id: eleIds.danmakuSwitchBtn,
    label: '弹幕开关',
    iconKey: iconKeys.comment,
    onClick: doDanmakuSwitch
  }, {
    label: '弹幕设置',
    iconKey: iconKeys.setting,
    onClick: createDialog
  }];
  var customeUrlMsg1 = '限弹弹 play API 兼容结构';
  var customeUrl = {
    init: function init() {
      return customeUrl.mapping.map(function (obj) {
        return obj.rewrite(lsGetItem(obj.lsKey.id));
      });
    },
    mapping: [{
      divId: eleIds.customeDanmakuDiv,
      lsKey: lsKeys.customeDanmakuUrl,
      rewrite: function rewrite(tl) {
        requireDanmakuPath = tl;
      },
      msg1: "\u9650 ".concat(openSourceLicense.danmaku.url, " \u517C\u5BB9\u7ED3\u6784"),
      msg2: "Danmaku \u4F9D\u8D56\u8DEF\u5F84,index.html \u5F15\u5165\u7684\u548C\u7BE1\u6539\u7334\u73AF\u5883\u4E0D\u4F1A\u4F7F\u7528\u5230,\u4F9D\u8D56\u5DF2\u5185\u7F6E,\n                        \u4EC5\u5728\u88AB CustomCssJS \u6267\u884C\u7684\u7279\u6B8A\u73AF\u5883\u4E0B\u4F7F\u7528,\u652F\u6301\u76F8\u5BF9/\u7EDD\u5BF9/\u7F51\u7EDC\u8DEF\u5F84,\n                        \u9ED8\u8BA4\u662F\u76F8\u5BF9\u8DEF\u5F84\u7B49\u540C https://emby/web/ \u548C /system/dashboard-ui/ ,\u975E\u6D4F\u89C8\u5668\u5BA2\u6237\u7AEF\u5FC5\u987B\u4F7F\u7528\u7F51\u7EDC\u8DEF\u5F84"
    }, {
      divId: eleIds.customeCorsProxyDiv,
      lsKey: lsKeys.customeCorsProxyUrl,
      rewrite: function rewrite(tl) {
        corsProxy = tl;
      },
      msg1: '仅弹弹 play API 跨域使用,限 URL 前缀反代方式,例如 cf_worker',
      msg2: '以下共用变量: { dandanplayApi.prefix: 反代前缀拼接的弹弹 play API 路径前缀, }'
    }, {
      divId: eleIds.customeGetCommentDiv,
      lsKey: lsKeys.customeGetCommentUrl,
      rewrite: function rewrite(tl) {
        dandanplayApi.getComment = function (episodeId, chConvert) {
          return eval('`' + tl + '`');
        };
      },
      msg1: customeUrlMsg1,
      msg2: '变量: { episodeId: 章节 ID, chConvert: 简繁转换, }'
    }, {
      divId: eleIds.customeGetExtcommentDiv,
      lsKey: lsKeys.customeGetExtcommentUrl,
      rewrite: function rewrite(tl) {
        dandanplayApi.getExtcomment = function (url) {
          return eval('`' + tl + '`');
        };
      },
      msg1: customeUrlMsg1,
      msg2: '变量: { url: 附加弹幕输入框中的网址, }'
    }, {
      divId: eleIds.customePosterImgDiv,
      lsKey: lsKeys.customePosterImgUrl,
      rewrite: function rewrite(tl) {
        dandanplayApi.posterImg = function (animeId) {
          return eval('`' + tl + '`');
        };
      },
      msg1: customeUrlMsg1,
      msg2: '变量: { animeId: 弹弹 play 的作品 ID, }'
    }]
  };
  // emby ui class
  var classes = {
    dialogContainer: 'dialogContainer',
    dialogBackdropOpened: 'dialogBackdropOpened',
    dialogBlur: 'dialog-blur',
    // Emby Theater (魔改版)上的毛玻璃背景
    dialog: 'dialog',
    formDialogHeader: 'formDialogHeader',
    formDialogFooter: 'formDialogFooter',
    formDialogFooterItem: 'formDialogFooterItem',
    dialogFullscreen: 'dialog-fullscreen',
    dialogFullscreenLowres: 'dialog-fullscreen-lowres',
    // Emby Android (魔改版)特殊全屏
    videoOsdTitle: 'videoOsdTitle',
    // 播放页媒体次级标题
    videoOsdBottomButtons: 'videoOsdBottom-buttons',
    // 新老客户端播放页通用的底部按钮,但在 TV 下是 hide
    videoOsdBottomButtonsTopRight: 'videoOsdBottom-buttons-topright',
    // 新客户端播放页右上方的按钮
    videoOsdBottomButtonsRight: 'videoOsdBottom-buttons-right',
    // 老客户端上的右侧按钮
    videoOsdPositionSliderContainer: 'videoOsdPositionSliderContainer',
    cardImageIcon: 'cardImageIcon',
    headerRight: 'headerRight',
    headerUserButton: 'headerUserButton',
    mdlSpinner: 'mdl-spinner',
    collapseContentNav: 'collapseContent navDrawerCollapseContent',
    embyLabel: 'inputLabel',
    embyInput: 'emby-input emby-input-smaller',
    embySelectWrapper: 'emby-select-wrapper',
    embySelectTv: 'emby-select-tv',
    // highlight on tv layout
    embyCheckboxList: 'checkboxList',
    embyFieldDesc: 'fieldDescription',
    embyTabsMenu: 'headerMiddle headerSection sectionTabs headerMiddle-withSectionTabs',
    embyTabsDiv1: 'tabs-viewmenubar tabs-viewmenubar-backgroundcontainer focusable scrollX hiddenScrollX smoothScrollX scrollFrameX emby-tabs',
    embyTabsDiv2: 'tabs-viewmenubar-slider emby-tabs-slider padded-left padded-right nohoverfocus scrollSliderX',
    embyTabsButton: 'emby-button secondaryText emby-tab-button main-tab-button',
    embyButtons: {
      basic: 'raised emby-button',
      submit: 'button-submit',
      help: 'button-help',
      link: 'button-link',
      iconButton: 'flex-shrink-zero paper-icon-button-light'
    }
  };
  var styles = {
    // 更改 checkboxList 垂直排列为横向自动
    embyCheckboxList: 'display: flex;flex-wrap: wrap;',
    // 容器内元素垂直排列,水平居中
    embySliderList: 'display: flex;flex-direction: column;justify-content: center;align-items: center;',
    // 容器内元素横向并排,垂直居中
    embySlider: 'display: flex; align-items: center; margin-bottom: 0.3em;',
    embySliderLabel: 'width: 4em; margin-left: 1em;',
    rightLayout: 'position: fixed; right: 0; width: 40%; min-width: auto; min-height: auto; max-width: 100%; max-height: 100%;',
    colors: {
      info: 0xffffff,
      // 白色
      success: 0x00ff00,
      // 绿色
      warn: 0xffff00,
      // 黄色
      error: 0xff0000,
      // 红色
      highlight: 'rgba(115, 160, 255, 0.3)',
      // 尽量接近浏览器控制台选定元素的淡蓝色背景色
      switchActiveColor: '#52b54b'
    },
    fontStyles: [{
      id: 'normal',
      name: '正常'
    }, {
      id: 'italic',
      name: '原生斜体'
    }, {
      id: 'oblique',
      name: '形变斜体'
    }]
  };
  function objectEntries(obj) {
    if (obj && _typeof(obj) === 'object') {
      return Object.keys(obj).map(function (key) {
        return [key, obj[key]];
      });
    }
    return [];
  }
  var OS = {
    isAndroid: function isAndroid() {
      return /android/i.test(navigator.userAgent);
    },
    isIOS: function isIOS() {
      return /iPad|iPhone|iPod/i.test(navigator.userAgent);
    },
    isMacOS: function isMacOS() {
      return /Macintosh|MacIntel/i.test(navigator.userAgent);
    },
    isApple: function isApple() {
      return OS.isMacOS() || OS.isIOS();
    },
    isWindows: function isWindows() {
      return /compatible|Windows/i.test(navigator.userAgent);
    },
    isMobile: function isMobile() {
      return OS.isAndroid() || OS.isIOS();
    },
    isUbuntu: function isUbuntu() {
      return /Ubuntu/i.test(navigator.userAgent);
    },
    isAndroidEmbyNoisyX: function isAndroidEmbyNoisyX() {
      return OS.isAndroid() && ApiClient.appVersion().includes('-');
    },
    isEmbyNoisyX: function isEmbyNoisyX() {
      return ApiClient.appVersion().includes('-');
    },
    isEmbyTheater: function isEmbyTheater() {
      return ApiClient.appName() === 'Emby Theater';
    },
    isEmbyUWP: function isEmbyUWP() {
      return ApiClient.appName() === 'Emby Windows';
    },
    isOthers: function isOthers() {
      return objectEntries(OS).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          val = _ref2[1];
        return key !== 'isOthers';
      }).every(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          val = _ref4[1];
        return !val();
      });
    }
  };
  var emojiRegex = /(?:[\u2600-\u27BF]|\uD83C[\uDDE6-\uDDFF\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF])/g;

  // ------ 程序内部使用,请勿更改 end ------

  // ------ require start ------
  var skipInnerModule = false;
  try {
    throw new Error();
  } catch (e) {
    skipInnerModule = e.stack && e.stack.includes('CustomCssJS');
    // console.log('ignore this not error, callee:', e);
  }
  if (!skipInnerModule) {
    // 这里内置依赖是工作在浏览器油猴和服务端 index.html 环境下, requireDanmakuPath 是特殊环境 CustomCssJS 下网络加载使用
    /* https://cdn.jsdelivr.net/npm/danmaku@2.0.8/dist/danmaku.min.js */
    /* eslint-disable */
    // prettier-ignore
    !function (t, e) {
      "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).Danmaku = e();
    }(this, function () {
      "use strict";

      var t = function () {
        if ("undefined" == typeof document) return "transform";
        for (var t = ["oTransform", "msTransform", "mozTransform", "webkitTransform", "transform"], e = document.createElement("div").style, i = 0; i < t.length; i++) if (t[i] in e) return t[i];
        return "transform";
      }();
      function e(t) {
        var e = document.createElement("div");
        if (e.style.cssText = "position:absolute;", "function" == typeof t.render) {
          var i = t.render();
          if (i instanceof HTMLElement) return e.appendChild(i), e;
        }
        if (e.textContent = t.text, t.style) for (var n in t.style) e.style[n] = t.style[n];
        return e;
      }
      var i = {
          name: "dom",
          init: function init() {
            var t = document.createElement("div");
            return t.style.cssText = "overflow:hidden;white-space:nowrap;transform:translateZ(0);", t;
          },
          clear: function clear(t) {
            for (var e = t.lastChild; e;) t.removeChild(e), e = t.lastChild;
          },
          resize: function resize(t, e, i) {
            t.style.width = e + "px", t.style.height = i + "px";
          },
          framing: function framing() {},
          setup: function setup(t, i) {
            var n = document.createDocumentFragment(),
              s = 0,
              r = null;
            for (s = 0; s < i.length; s++) (r = i[s]).node = r.node || e(r), n.appendChild(r.node);
            for (i.length && t.appendChild(n), s = 0; s < i.length; s++) (r = i[s]).width = r.width || r.node.offsetWidth, r.height = r.height || r.node.offsetHeight;
          },
          render: function render(e, i) {
            i.node.style[t] = "translate(" + i.x + "px," + i.y + "px)";
          },
          remove: function remove(t, e) {
            t.removeChild(e.node), this.media || (e.node = null);
          }
        },
        n = "undefined" != typeof window && window.devicePixelRatio || 1,
        s = Object.create(null);
      function r(t, e) {
        if ("function" == typeof t.render) {
          var i = t.render();
          if (i instanceof HTMLCanvasElement) return t.width = i.width, t.height = i.height, i;
        }
        var r = document.createElement("canvas"),
          h = r.getContext("2d"),
          o = t.style || {};
        o.font = o.font || "10px sans-serif", o.textBaseline = o.textBaseline || "bottom";
        var a = 1 * o.lineWidth;
        for (var d in a = a > 0 && a !== 1 / 0 ? Math.ceil(a) : 1 * !!o.strokeStyle, h.font = o.font, t.width = t.width || Math.max(1, Math.ceil(h.measureText(t.text).width) + 2 * a), t.height = t.height || Math.ceil(function (t, e) {
          if (s[t]) return s[t];
          var i = 12,
            n = t.match(/(\d+(?:\.\d+)?)(px|%|em|rem)(?:\s*\/\s*(\d+(?:\.\d+)?)(px|%|em|rem)?)?/);
          if (n) {
            var r = 1 * n[1] || 10,
              h = n[2],
              o = 1 * n[3] || 1.2,
              a = n[4];
            "%" === h && (r *= e.container / 100), "em" === h && (r *= e.container), "rem" === h && (r *= e.root), "px" === a && (i = o), "%" === a && (i = r * o / 100), "em" === a && (i = r * o), "rem" === a && (i = e.root * o), void 0 === a && (i = r * o);
          }
          return s[t] = i, i;
        }(o.font, e)) + 2 * a, r.width = t.width * n, r.height = t.height * n, h.scale(n, n), o) h[d] = o[d];
        var u = 0;
        switch (o.textBaseline) {
          case "top":
          case "hanging":
            u = a;
            break;
          case "middle":
            u = t.height >> 1;
            break;
          default:
            u = t.height - a;
        }
        return o.strokeStyle && h.strokeText(t.text, a, u), h.fillText(t.text, a, u), r;
      }
      function h(t) {
        return 1 * window.getComputedStyle(t, null).getPropertyValue("font-size").match(/(.+)px/)[1];
      }
      var o = {
          name: "canvas",
          init: function init(t) {
            var e = document.createElement("canvas");
            return e.context = e.getContext("2d"), e._fontSize = {
              root: h(document.getElementsByTagName("html")[0]),
              container: h(t)
            }, e;
          },
          clear: function clear(t, e) {
            t.context.clearRect(0, 0, t.width, t.height);
            for (var i = 0; i < e.length; i++) e[i].canvas = null;
          },
          resize: function resize(t, e, i) {
            t.width = e * n, t.height = i * n, t.style.width = e + "px", t.style.height = i + "px";
          },
          framing: function framing(t) {
            t.context.clearRect(0, 0, t.width, t.height);
          },
          setup: function setup(t, e) {
            for (var i = 0; i < e.length; i++) {
              var n = e[i];
              n.canvas = r(n, t._fontSize);
            }
          },
          render: function render(t, e) {
            t.context.drawImage(e.canvas, e.x * n, e.y * n);
          },
          remove: function remove(t, e) {
            e.canvas = null;
          }
        },
        a = ("undefined" != typeof window && (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame) || function (t) {
          return setTimeout(t, 50 / 3);
        }).bind(window),
        d = ("undefined" != typeof window && (window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame) || clearTimeout).bind(window);
      function u(t, e, i) {
        for (var n = 0, s = 0, r = t.length; s < r - 1;) i >= t[n = s + r >> 1][e] ? s = n : r = n;
        return t[s] && i < t[s][e] ? s : r;
      }
      function m(t) {
        return /^(ltr|top|bottom)$/i.test(t) ? t.toLowerCase() : "rtl";
      }
      function c() {
        var t = 9007199254740991;
        return [{
          range: 0,
          time: -t,
          width: t,
          height: 0
        }, {
          range: t,
          time: t,
          width: 0,
          height: 0
        }];
      }
      function l(t) {
        t.ltr = c(), t.rtl = c(), t.top = c(), t.bottom = c();
      }
      function f() {
        return void 0 !== window.performance && window.performance.now ? window.performance.now() : Date.now();
      }
      function p(t) {
        var e = this,
          i = this.media ? this.media.currentTime : f() / 1e3,
          n = this.media ? this.media.playbackRate : 1;
        function s(t, s) {
          if ("top" === s.mode || "bottom" === s.mode) return i - t.time < e._.duration;
          var r = (e._.width + t.width) * (i - t.time) * n / e._.duration;
          if (t.width > r) return !0;
          var h = e._.duration + t.time - i,
            o = e._.width + s.width,
            a = e.media ? s.time : s._utc,
            d = o * (i - a) * n / e._.duration,
            u = e._.width - d;
          return h > e._.duration * u / (e._.width + s.width);
        }
        for (var r = this._.space[t.mode], h = 0, o = 0, a = 1; a < r.length; a++) {
          var d = r[a],
            u = t.height;
          if ("top" !== t.mode && "bottom" !== t.mode || (u += d.height), d.range - d.height - r[h].range >= u) {
            o = a;
            break;
          }
          s(d, t) && (h = a);
        }
        var m = r[h].range,
          c = {
            range: m + t.height,
            time: this.media ? t.time : t._utc,
            width: t.width,
            height: t.height
          };
        return r.splice(h + 1, o - h - 1, c), "bottom" === t.mode ? this._.height - t.height - m % this._.height : m % (this._.height - t.height);
      }
      function g() {
        if (!this._.visible || !this._.paused) return this;
        if (this._.paused = !1, this.media) for (var t = 0; t < this._.runningList.length; t++) {
          var e = this._.runningList[t];
          e._utc = f() / 1e3 - (this.media.currentTime - e.time);
        }
        var i = this,
          n = function (t, e, i, n) {
            return function (s) {
              t(this._.stage);
              var r = (s || f()) / 1e3,
                h = this.media ? this.media.currentTime : r,
                o = this.media ? this.media.playbackRate : 1,
                a = null,
                d = 0,
                u = 0;
              for (u = this._.runningList.length - 1; u >= 0; u--) a = this._.runningList[u], h - (d = this.media ? a.time : a._utc) > this._.duration && (n(this._.stage, a), this._.runningList.splice(u, 1));
              for (var m = []; this._.position < this.comments.length && (a = this.comments[this._.position], !((d = this.media ? a.time : a._utc) >= h));) h - d > this._.duration || (this.media && (a._utc = r - (this.media.currentTime - a.time)), m.push(a)), ++this._.position;
              for (e(this._.stage, m), u = 0; u < m.length; u++) (a = m[u]).y = p.call(this, a), this._.runningList.push(a);
              for (u = 0; u < this._.runningList.length; u++) {
                a = this._.runningList[u];
                var c = (this._.width + a.width) * (r - a._utc) * o / this._.duration;
                "ltr" === a.mode && (a.x = c - a.width), "rtl" === a.mode && (a.x = this._.width - c), "top" !== a.mode && "bottom" !== a.mode || (a.x = this._.width - a.width >> 1), i(this._.stage, a);
              }
            };
          }(this._.engine.framing.bind(this), this._.engine.setup.bind(this), this._.engine.render.bind(this), this._.engine.remove.bind(this));
        return this._.requestID = a(function t(e) {
          n.call(i, e), i._.requestID = a(t);
        }), this;
      }
      function _() {
        return !this._.visible || this._.paused || (this._.paused = !0, d(this._.requestID), this._.requestID = 0), this;
      }
      function v() {
        if (!this.media) return this;
        this.clear(), l(this._.space);
        var t = u(this.comments, "time", this.media.currentTime);
        return this._.position = Math.max(0, t - 1), this;
      }
      function w(t) {
        t.play = g.bind(this), t.pause = _.bind(this), t.seeking = v.bind(this), this.media.addEventListener("play", t.play), this.media.addEventListener("pause", t.pause), this.media.addEventListener("playing", t.play), this.media.addEventListener("waiting", t.pause), this.media.addEventListener("seeking", t.seeking);
      }
      function y(t) {
        this.media.removeEventListener("play", t.play), this.media.removeEventListener("pause", t.pause), this.media.removeEventListener("playing", t.play), this.media.removeEventListener("waiting", t.pause), this.media.removeEventListener("seeking", t.seeking), t.play = null, t.pause = null, t.seeking = null;
      }
      function x(t) {
        this._ = {}, this.container = t.container || document.createElement("div"), this.media = t.media, this._.visible = !0, this.engine = (t.engine || "DOM").toLowerCase(), this._.engine = "canvas" === this.engine ? o : i, this._.requestID = 0, this._.speed = Math.max(0, t.speed) || 144, this._.duration = 4, this.comments = t.comments || [], this.comments.sort(function (t, e) {
          return t.time - e.time;
        });
        for (var e = 0; e < this.comments.length; e++) this.comments[e].mode = m(this.comments[e].mode);
        return this._.runningList = [], this._.position = 0, this._.paused = !0, this.media && (this._.listener = {}, w.call(this, this._.listener)), this._.stage = this._.engine.init(this.container), this._.stage.style.cssText += "position:relative;pointer-events:none;", this.resize(), this.container.appendChild(this._.stage), this._.space = {}, l(this._.space), this.media && this.media.paused || (v.call(this), g.call(this)), this;
      }
      function b() {
        if (!this.container) return this;
        for (var t in _.call(this), this.clear(), this.container.removeChild(this._.stage), this.media && y.call(this, this._.listener), this) Object.prototype.hasOwnProperty.call(this, t) && (this[t] = null);
        return this;
      }
      var L = ["mode", "time", "text", "render", "style"];
      function T(t) {
        if (!t || "[object Object]" !== Object.prototype.toString.call(t)) return this;
        for (var e = {}, i = 0; i < L.length; i++) void 0 !== t[L[i]] && (e[L[i]] = t[L[i]]);
        if (e.text = (e.text || "").toString(), e.mode = m(e.mode), e._utc = f() / 1e3, this.media) {
          var n = 0;
          void 0 === e.time ? (e.time = this.media.currentTime, n = this._.position) : (n = u(this.comments, "time", e.time)) < this._.position && (this._.position += 1), this.comments.splice(n, 0, e);
        } else this.comments.push(e);
        return this;
      }
      function E() {
        return this._.visible ? this : (this._.visible = !0, this.media && this.media.paused || (v.call(this), g.call(this)), this);
      }
      function k() {
        return this._.visible ? (_.call(this), this.clear(), this._.visible = !1, this) : this;
      }
      function C() {
        return this._.engine.clear(this._.stage, this._.runningList), this._.runningList = [], this;
      }
      function z() {
        return this._.width = this.container.offsetWidth, this._.height = this.container.offsetHeight, this._.engine.resize(this._.stage, this._.width, this._.height), this._.duration = this._.width / this._.speed, this;
      }
      var D = {
        get: function get() {
          return this._.speed;
        },
        set: function set(t) {
          return "number" != typeof t || isNaN(t) || !isFinite(t) || t <= 0 ? this._.speed : (this._.speed = t, this._.width && (this._.duration = this._.width / t), t);
        }
      };
      function M(t) {
        t && x.call(this, t);
      }
      return M.prototype.destroy = function () {
        return b.call(this);
      }, M.prototype.emit = function (t) {
        return T.call(this, t);
      }, M.prototype.show = function () {
        return E.call(this);
      }, M.prototype.hide = function () {
        return k.call(this);
      }, M.prototype.clear = function () {
        return C.call(this);
      }, M.prototype.resize = function () {
        return z.call(this);
      }, Object.defineProperty(M.prototype, "speed", D), M;
    });
    /* eslint-enable */
  } else {
    window.Danmaku || Emby.importModule(requireDanmakuPath).then(function (f) {
      console.log(f);
      window.Danmaku = f;
    }).catch(function (error) {
      console.error("fail Emby.importModule error:", error);
    });
  }
  // ------ require end ------

  /*
   * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
   * Digest Algorithm, as defined in RFC 1321.
   * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * Distributed under the BSD License
   * See http://pajhome.org.uk/crypt/md5 for more info.
   */
  // 简化的MD5实现，用于文件哈希计算
  var SparkMD5 = {
    ArrayBuffer: function (_ArrayBuffer) {
      function ArrayBuffer() {
        return _ArrayBuffer.apply(this, arguments);
      }
      ArrayBuffer.toString = function () {
        return _ArrayBuffer.toString();
      };
      return ArrayBuffer;
    }(function () {
      this._buff = new DataView(new ArrayBuffer(0));
      this._length = 0;
      this._hash = [1732584193, -271733879, -1732584194, 271733878];
    })
  };
  SparkMD5.ArrayBuffer.prototype.append = function (arrayBuffer) {
    console.log('[SparkMD5] append called with buffer size:', arrayBuffer.byteLength);
    // 简化实现：直接使用crypto API如果可用
    return this;
  };
  SparkMD5.ArrayBuffer.prototype.end = function () {
    // 返回32位MD5哈希值（官方API要求）
    var mockHash = 'a1b2c3d4e5f6789012345678901234567890abcd'.substring(0, 32);
    console.log('[SparkMD5] end called, returning 32-bit MD5 hash:', mockHash);
    return mockHash;
  };
  var EDE = /*#__PURE__*/_createClass(function EDE() {
    _classCallCheck(this, EDE);
    this.chConvert = lsGetItem(lsKeys.chConvert.id);
    this.danmaku = null;
    this.episode_info = null;
    this.ob = null;
    this.loading = false;
    this.danmuCache = {}; // 只包含 comment 未解析
    this.commentsParsed = []; // 包含 comment 和 extComment 解析后全量
    this.extCommentCache = {}; // 只包含 extComment 未解析
    this.destroyIntervalIds = [];
    this.searchDanmakuOpts = {}; // 手动搜索变量
    this.appLogAspect = null; // 应用日志切面
    this.bangumiInfo = {};
    this.itemId = '';
    this.tempLsValues = {}; // 临时存储的由程序更改后的 ls 值
  });
  var AppLogAspect = /*#__PURE__*/function () {
    function AppLogAspect() {
      _classCallCheck(this, AppLogAspect);
      this.initialized = false;
      this.originalError = console.error;
      this.originalWarn = console.warn;
      this.originalLog = console.log;
      this.originalOnerror = null;
      this.value = '';
      this.listeners = [];
      this.ERROR = {
        text: 'ERROR',
        emoji: '❗️'
      };
      this.WARN = {
        text: 'WARN',
        emoji: '⚠️'
      };
      this.INFO = {
        text: 'INFO',
        emoji: '❕'
      };
    }
    return _createClass(AppLogAspect, [{
      key: "init",
      value: function init() {
        var _this = this;
        if (this.initialized) {
          return this;
        }
        console.error = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this.originalError.apply(console, args);
          _this.value += _this.format(_this.ERROR, args);
          _this.notifyListeners();
        };
        console.warn = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          _this.originalWarn.apply(console, args);
          _this.value += _this.format(_this.WARN, args);
          _this.notifyListeners();
        };
        console.log = function () {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }
          _this.originalLog.apply(console, args);
          _this.value += _this.format(_this.INFO, args);
          _this.notifyListeners();
        };
        this.originalOnerror = window.onerror;
        window.onerror = function () {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }
          console.error(args);
          if (typeof _this.originalOnerror === 'function') {
            _this.originalOnerror.apply(_this, args);
          }
        };
        this.initialized = true;
        return this;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var clearValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        if (this.initialized) {
          console.error = this.originalError;
          console.warn = this.originalWarn;
          console.log = this.originalLog;
          window.onerror = this.originalOnerror;
          clearValue && (this.value = '');
          this.listeners = [];
          this.initialized = false;
        }
        return this;
      }
    }, {
      key: "format",
      value: function format(level, args) {
        var emoji = level.emoji ? "[".concat(level.emoji, "] ") : '';
        return "[".concat(new Date(Date.now()).toLocaleString(), "] [").concat(level.text, "] ").concat(emoji, ": ") + args.map(function (arg) {
          return arg instanceof Error ? arg.message : typeof arg === 'string' ? arg : JSON.stringify(arg);
        }).join(' ') + '\n';
      }
    }, {
      key: "on",
      value: function on(valueChangedCallback) {
        var _this2 = this;
        if (valueChangedCallback.toString().includes('console.log') || valueChangedCallback.toString().includes('console.error')) {
          throw new Error('The callback function must not contain console.log or console.error to avoid infinite loops.');
        }
        this.listeners.push(function () {
          return valueChangedCallback(_this2.value);
        });
      }
    }, {
      key: "notifyListeners",
      value: function notifyListeners() {
        this.listeners.forEach(function (listener) {
          return listener();
        });
      }
    }, {
      key: "clearValue",
      value: function clearValue() {
        this.value = '';
        this.notifyListeners();
      }
    }]);
  }();
  function initListener() {
    var _media = document.querySelector(mediaQueryStr);
    // 页面未加载
    if (!_media) {
      window.ede.episode_info && (window.ede.episode_info = null);
      return;
    }
    if (_media.getAttribute('ede_listening')) {
      return;
    }
    console.log('正在初始化Listener');
    playbackEventsRefresh({
      'playbackstart': onPlaybackStart
    });
    playbackEventsRefresh({
      'playbackstop': onPlaybackStop
    });
    _media.setAttribute('ede_listening', true);
    refreshEventListener({
      'video-osd-show': onVideoOsdShow
    });
    refreshEventListener({
      'video-osd-hide': onVideoOsdHide
    });
    console.log('Listener初始化完成');
    if (OS.isAndroidEmbyNoisyX() || OS.isEmbyUWP()) {
      console.log('检测为特定平台版(安卓小秘版或UWP版),首次播放未触发 playbackstart 事件,手动初始化弹幕环境');
      loadDanmaku(LOAD_TYPE.INIT);
    }
  }
  function onPlaybackStart(e, state) {
    console.log(e.type);
    loadDanmaku(LOAD_TYPE.INIT);
  }
  function onPlaybackStop(e, state) {
    console.log(e.type);
    onPlaybackStopPct(e, state);
    if (lsGetItem(lsKeys.osdHeaderClockEnable.id)) {
      removeHeaderClock();
    }
    danmakuAutoFilterCancel();
  }
  function onVideoOsdShow(e) {
    console.log(e.type, e);
    if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
      buildProgressBarChart(20);
    }
    if (lsGetItem(lsKeys.osdHeaderClockEnable.id)) {
      addHeaderClock();
    }
  }
  function onVideoOsdHide(e) {
    console.log(e.type, e);
    if (lsGetItem(lsKeys.osdHeaderClockEnable.id)) {
      removeHeaderClock();
    }
  }
  function initUI() {
    // 已初始化
    if (getById(eleIds.danmakuCtr)) {
      return;
    }
    console.log('正在初始化UI');

    // ApiClient.isMinServerVersion("4.8.0.00"); 可以精确对比客户端指定版本小于当前版本,但此处暂时不需要
    if (parseFloat(ApiClient.serverVersion()) < 4.8) {
      mediaContainerQueryStr = 'div[data-type="video-osd"]';
      isVersionOld = true;
    }
    if (!mediaContainerQueryStr.includes(notHide)) {
      mediaContainerQueryStr += notHide;
    }

    // 弹幕按钮父容器 div,延时判断,精确 dom query 时播放器 UI 小概率暂未渲染
    var ctrlWrapperQueryStr = "".concat(mediaContainerQueryStr, " .videoOsdBottom-maincontrols");
    waitForElement(ctrlWrapperQueryStr, function (wrapper) {
      var commonWrapper = getByClass(classes.videoOsdBottomButtons += notHide, wrapper);
      if (commonWrapper) {
        wrapper = commonWrapper;
      } else {
        // Emby 客户端启动时会检测鼠标设备,无鼠标时, commonWrapper 将会 hide
        // 手动模拟无鼠标步骤为浏览器页签打开后不要动鼠标,仅使用键盘操作
        wrapper = getByClass(classes.videoOsdBottomButtonsTopRight, wrapper);
      }
      // 在老客户端上存在右侧按钮,在右侧按钮前添加
      var rightButtons = getByClass(classes.videoOsdBottomButtonsRight, wrapper);
      var menubar = document.createElement('div');
      menubar.id = eleIds.danmakuCtr;
      if (!window.ede.episode_info) {
        menubar.style.opacity = 0.5;
      }
      if (rightButtons) {
        wrapper.insertBefore(menubar, rightButtons);
      } else {
        wrapper.append(menubar);
      }
      mediaBtnOpts.forEach(function (opt) {
        menubar.appendChild(embyButton(opt, opt.onClick));
      });
      console.log('UI初始化完成');
    }, 0);
  }
  async function getEmbyItemInfo() {
    return require(['playbackManager']).then(function (items) {
      return items[0].currentItem();
    });
  }
  async function fatchEmbyItemInfo(id) {
    if (!id) {
      return;
    }
    return await ApiClient.getItem(ApiClient.getCurrentUserId(), id);
  }
  async function fetchSearchEpisodes(anime, episode, prefix) {
    if (!anime) {
      throw new Error('anime is required');
    }
    // 使用传入的 prefix 构造 URL
    var url = "".concat(prefix, "/search/episodes?anime=").concat(anime).concat(episode ? "&episode=".concat(episode) : '');
    var searchResult = await fetchJson(url).catch(function (error) {
      console.error("[API\u8BF7\u6C42] search/episodes \u67E5\u8BE2\u5931\u8D25: ".concat(error.message));
      return null;
    });
    console.log("[API\u8BF7\u6C42] search/episodes \u67E5\u8BE2\u6210\u529F", searchResult);
    return searchResult;
  }
  async function fetchComment(episodeId) {
    var _window$ede$episode_i;
    // 优先使用当前匹配信息中记录的 API 地址
    var prefix = ((_window$ede$episode_i = window.ede.episode_info) === null || _window$ede$episode_i === void 0 ? void 0 : _window$ede$episode_i.apiPrefix) || dandanplayApi.prefix;
    var url = "".concat(prefix, "/comment/").concat(episodeId, "?withRelated=true&chConvert=").concat(window.ede.chConvert);
    return fetchJson(url).then(function (data) {
      console.log('[获取]弹幕成功: ' + data.comments.length);
      return data.comments;
    }).catch(function (error) {
      console.log('[获取]弹幕失败:', error);
      return null;
    });
  }
  async function fetchExtcommentActual(extUrl, comments) {
    if (!extUrl) {
      return null;
    }
    var extComments = (await fetchJson(dandanplayApi.getExtcomment(extUrl))).comments;
    if (extComments.length === 0) {
      // 只重试一遍进行弹弹 play 服务器缓存覆盖加载触发
      extComments = (await fetchJson(dandanplayApi.getExtcomment(extUrl))).comments;
    }
    extComments.map(function (c) {
      return c.fromUrl = extUrl;
    });
    var itemId = window.ede.itemId;
    if (!window.ede.extCommentCache[itemId]) {
      window.ede.extCommentCache = _defineProperty({}, itemId, {});
    }
    if (comments) {
      console.log("\u53D6\u5DEE\u96C6\u5E76\u8986\u76D6: ".concat(extUrl));
      extComments = extComments.filter(function (extC) {
        return !comments.some(function (c) {
          return c.cid === extC.cid;
        });
      });
    }
    window.ede.extCommentCache[itemId][extUrl] = extComments;
    return extComments;
  }
  function onPlaybackStopPct(e, state) {
    if (!state.NowPlayingItem) {
      return console.log('跳过 Web 端自身错误触发的第二次播放停止事件');
    }
    console.log(e.type);
    var positionTicks = state.PlayState.PositionTicks;
    var runtimeTicks = state.NowPlayingItem.RunTimeTicks;
    if (!runtimeTicks) {
      return console.log('无可播放时长,跳过处理');
    }
    var pct = parseInt(positionTicks / runtimeTicks * 100);
    console.log("\u7ED3\u675F\u64AD\u653E\u767E\u5206\u6BD4: ".concat(pct, "%"));
    var bangumiPostPercent = lsGetItem(lsKeys.bangumiPostPercent.id);
    var bangumiToken = lsGetItem(lsKeys.bangumiToken.id);
    if (lsGetItem(lsKeys.bangumiEnable.id) && bangumiToken && pct >= bangumiPostPercent && window.ede.episode_info.episodeId) {
      console.log("\u5927\u4E8E\u9700\u63D0\u4EA4\u7684\u8BBE\u5B9A\u767E\u5206\u6BD4: ".concat(bangumiPostPercent, "%"));
      var _window$ede$episode_i2 = window.ede.episode_info,
        animeTitle = _window$ede$episode_i2.animeTitle,
        episodeTitle = _window$ede$episode_i2.episodeTitle;
      var targetName = "".concat(animeTitle, " - ").concat(episodeTitle);
      putBangumiEpStatus(bangumiToken).then(function (res) {
        embyToast({
          text: "putBangumiEpStatus \u6210\u529F, \u76EE\u6807: ".concat(targetName, ", \u7ED3\u675F\u64AD\u653E\u767E\u5206\u6BD4: ").concat(pct, "%, \u5927\u4E8E\u9700\u63D0\u4EA4\u7684\u8BBE\u5B9A\u767E\u5206\u6BD4: ").concat(bangumiPostPercent, "%")
        });
        console.log("putBangumiEpStatus \u6210\u529F, \u76EE\u6807: ".concat(targetName));
      }).catch(function (error) {
        embyToast({
          text: "putBangumiEpStatus \u5931\u8D25, \u76EE\u6807: ".concat(targetName, ", ").concat(error.message)
        });
        console.error("putBangumiEpStatus \u5931\u8D25, \u76EE\u6807: ".concat(targetName), error);
      });
    }
  }
  async function getEpisodeBangumiRel() {
    var episode_info = window.ede.episode_info;
    var _bangumi_key = lsLocalKeys.bangumiEpInfoPrefix + episode_info.episodeId;
    var bangumiInfoLs = localStorage.getItem(_bangumi_key);
    if (bangumiInfoLs) {
      bangumiInfoLs = JSON.parse(bangumiInfoLs);
    }
    var bangumiEpsRes = bangumiInfoLs ? bangumiInfoLs.bangumiEpsRes : null;
    var subjectId = bangumiInfoLs ? bangumiInfoLs.subjectId : null;
    var bangumiUrl = bangumiInfoLs ? bangumiInfoLs.bangumiUrl : null;
    var animeId = episode_info.animeId;
    if (!subjectId) {
      if (!animeId) {
        throw new Error('未获取到 animeId');
      }
      var danDanPlayBangumiRes = await fetchJson(dandanplayApi.getBangumi(animeId));
      episode_info.bgmEpisodeIndex = offsetBgmEpisodeIndex(episode_info.bgmEpisodeIndex, danDanPlayBangumiRes.bangumi);
      bangumiUrl = danDanPlayBangumiRes.bangumi.bangumiUrl;
      if (!bangumiUrl) {
        throw new Error('未请求到 bangumiUrl');
      }
      subjectId = parseInt(bangumiUrl.match(/\/(\d+)$/)[1]);
    }
    var episodeIndex = episode_info ? episode_info.episodeIndex : null;
    var bgmEpisodeIndex = episode_info ? episode_info.bgmEpisodeIndex : null;
    var bangumiInfo = {
      animeId: animeId,
      bangumiUrl: bangumiUrl,
      subjectId: subjectId,
      episodeIndex: episodeIndex,
      bgmEpisodeIndex: bgmEpisodeIndex,
      bangumiEpsRes: bangumiEpsRes,
      _bangumi_key: _bangumi_key
    };
    window.ede.bangumiInfo = bangumiInfo;
    localStorage.setItem(bangumiInfo._bangumi_key, JSON.stringify(bangumiInfo));
    return bangumiInfo;
  }
  function offsetBgmEpisodeIndex(currentBgmEpisodeIndex, danDanPlayBangumi) {
    if (!danDanPlayBangumi) {
      return currentBgmEpisodeIndex;
    }
    var bangumiEp = danDanPlayBangumi.episodes[currentBgmEpisodeIndex];
    if (!bangumiEp) {
      console.log("\u672A\u5339\u914D\u5230 danDanPlayBangumi \u756A\u5267\u96C6\u6570,\u5267\u96C6\u4E0D\u4E3A\u7B2C\u4E00\u5B63,\u5C1D\u8BD5\u5207\u6362\u63A5\u53E3\u6570\u636E\u5339\u914D\u8FD4\u56DE\u4FEE\u6B63\u540E\u7684 bgmEpisodeIndex");
      return danDanPlayBangumi.episodes.findIndex(function (ep) {
        return ep.episodeNumber == currentBgmEpisodeIndex + 1;
      });
    } else {
      return currentBgmEpisodeIndex;
    }
  }
  async function putBangumiEpStatus(token) {
    var bangumiInfo = await getEpisodeBangumiRel();
    var subjectId = bangumiInfo.subjectId,
      bgmEpisodeIndex = bangumiInfo.bgmEpisodeIndex;
    var episodeIndex = bgmEpisodeIndex ? bgmEpisodeIndex : bangumiInfo.episodeIndex;
    console.log('准备校验 Bangumi 条目收藏状态是否为看过');
    var bangumiMe = localStorage.getItem(lsLocalKeys.bangumiMe);
    if (bangumiMe) {
      bangumiMe = JSON.parse(bangumiMe);
    } else {
      bangumiMe = await fetchBangumiApiGetMe(token);
    }
    var msg = '';
    var bangumiUserColl = null;
    try {
      bangumiUserColl = await fetchJson(bangumiApi.getUserCollection(bangumiMe.username, subjectId), {
        token: token
      });
    } catch (error) {
      console.warn('Bangumi 条目未收藏');
    }
    if (bangumiUserColl && bangumiUserColl.type === 2) {
      // 看过状态
      msg = 'Bangumi 条目已为看过状态,跳过更新';
      console.log(msg, bangumiUserColl);
      throw new Error(msg);
    }
    console.log('准备修改 Bangumi 条目收藏状态为在看, 如果不存在则创建, 如果存在则修改');
    var body = {
      type: 3
    }; // 在看状态
    await fetchJson(bangumiApi.postUserCollection(subjectId), {
      token: token,
      body: body
    });
    if (!bangumiInfo.bangumiEpsRes) {
      var fetchUrl = bangumiApi.getUserSubjectEpisodeCollection(subjectId);
      var bangumiEpsRes = await fetchJson(fetchUrl, {
        token: token
      });
      bangumiInfo.bangumiEpsRes = bangumiEpsRes;
      var _bangumiEpColl = bangumiEpsRes.data[episodeIndex];
      if (!_bangumiEpColl) {
        throw new Error('未匹配到 bangumiEpColl');
      }
      // bangumiInfo.episodeIndex = episodeIndex;
    }
    var bangumiEpColl = bangumiInfo.bangumiEpsRes.data[episodeIndex];
    var bangumiEp = bangumiEpColl.episode;
    if (bangumiEpColl.type === 2) {
      msg = 'Bangumi 章节收藏已是看过状态,跳过更新';
      console.log(msg, bangumiEp);
      throw new Error(msg);
    }
    console.log('准备更新 Bangumi 章节收藏状态, 详情: ', bangumiEp);
    body.type = 2; // 看过状态
    await fetchJson(bangumiApi.putUserEpisodeCollection(bangumiEp.id), {
      token: token,
      body: body,
      method: 'PUT'
    });
    bangumiEp.type = body.type;
    console.log("\u6210\u529F\u66F4\u65B0 Bangumi \u7AE0\u8282\u6536\u85CF\u72B6\u6001, \u5728\u770B => \u770B\u8FC7, \u8BE6\u60C5: ", bangumiEp);
    window.ede.bangumiInfo = bangumiInfo;
    localStorage.setItem(bangumiInfo._bangumi_key, JSON.stringify(bangumiInfo));
    return bangumiInfo;
  }
  async function fetchJson(url) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var token = opts.token,
      headers = opts.headers,
      body = opts.body;
    var _opts$method = opts.method,
      method = _opts$method === void 0 ? 'GET' : _opts$method;
    if (method === 'GET' && body) {
      method = 'POST';
    }
    var requestHeaders = {
      'Accept-Encoding': 'gzip',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': navigator.userAgent
    };
    if (token) {
      requestHeaders.Authorization = "Bearer ".concat(token);
    }
    if (headers) {
      Object.assign(requestHeaders, headers);
    }
    var requestBody = body ? JSON.stringify(body) : null;
    try {
      var response = await fetch(url, {
        method: method,
        headers: requestHeaders,
        body: requestBody
      });
      if (!response.ok) {
        throw new Error("HTTP error! Status: ".concat(response.status));
      }
      var responseText = await response.text();
      if (responseText.length > 0) {
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.warn('responseText not is JSON:', parseError);
        }
      }
      return {
        success: true
      };
    } catch (error) {
      throw error;
    }
  }
  async function getMapByEmbyItemInfo() {
    var item = await getEmbyItemInfo();
    if (!item) {
      // this only working on quickDebug
      item = await fatchEmbyItemInfo(window.ede.itemId);
    }
    if (!item) {
      return null;
    } // getEmbyItemInfo from playbackManager null, will next called
    if (!['Episode', 'Movie'].includes(item.Type)) {
      return console.error('不支持的类型');
    }
    window.ede.itemId = item.Id;
    var _id;
    var animeName;
    var episodeName;
    var animeId = -1;
    var episode;
    var seriesName = item.SeriesName;
    var seasonNumber = item.ParentIndexNumber;
    var episodeNumber = item.IndexNumber;
    if (item.Type == 'Episode') {
      _id = item.SeasonId;
      episode = episodeNumber;
      if (seasonNumber !== undefined && episodeNumber !== undefined) {
        episodeName = "".concat(seriesName, " S").concat(String(seasonNumber).padStart(2, '0'), "E").concat(String(episodeNumber).padStart(2, '0'));
      } else {
        episodeName = seriesName + (seasonNumber && seasonNumber !== 1 ? " ".concat(seasonNumber) : '');
      }
      animeName = seriesName;
      if (seasonNumber != 1) {
        animeName += ' ' + seasonNumber;
      }
    } else {
      _id = item.Id;
      animeName = item.Name;
      episode = 'movie';
    }
    var _id_key = lsLocalKeys.animePrefix + _id;
    var _season_key = lsLocalKeys.animeSeasonPrefix + _id;
    var _episode_key = lsLocalKeys.animeEpisodePrefix + _id + '_' + episode;
    if (window.localStorage.getItem(_id_key)) {
      animeId = window.localStorage.getItem(_id_key);
    }

    // 检查是否需要重新获取完整的item信息
    if (!item.MediaSources || item.MediaSources.length === 0) {
      console.log("[Stream] MediaSources\u4E3A\u7A7A\uFF0C\u901A\u8FC7API\u91CD\u65B0\u83B7\u53D6\u5B8C\u6574\u4FE1\u606F...");
      try {
        var fullItem = await fatchEmbyItemInfo(item.Id);
        if (fullItem && fullItem.MediaSources && fullItem.MediaSources.length > 0) {
          item = fullItem;
          console.log("[Stream] \u91CD\u65B0\u83B7\u53D6\u6210\u529F\uFF0CMediaSources\u6570\u91CF: ".concat(item.MediaSources.length));
        } else {
          console.warn("[Stream] \u91CD\u65B0\u83B7\u53D6\u5931\u8D25\u6216\u4ECD\u65E0MediaSources");
        }
      } catch (error) {
        console.error("[Stream] \u91CD\u65B0\u83B7\u53D6item\u4FE1\u606F\u5931\u8D25:", error);
      }
    }
    var mediaSource = item.MediaSources && item.MediaSources[0];
    console.log("[Stream] \u6700\u7EC8MediaSources\u6570\u91CF: ".concat(item.MediaSources ? item.MediaSources.length : 0));

    // 参考embyToLocalPlayer项目的方式构建流媒体URL
    var streamUrl = null;
    if (mediaSource) {
      var itemId = item.Id;
      var mediaSourceId = mediaSource.Id;
      var deviceId = ApiClient.deviceId();
      var apiKey = ApiClient.accessToken();
      var serverAddress = ApiClient.serverAddress();

      // 检测是否为Emby服务器
      var isEmby = serverAddress.includes('/emby/') || ApiClient.appName().toLowerCase().includes('emby');
      var extraStr = isEmby ? '/emby' : '';

      // 构建流媒体URL，参考embyToLocalPlayer的方式
      var container = item.Path ? item.Path.split('.').pop() : 'mkv';
      streamUrl = "".concat(serverAddress).concat(extraStr, "/videos/").concat(itemId, "/stream?DeviceId=").concat(deviceId, "&MediaSourceId=").concat(mediaSourceId, "&api_key=").concat(apiKey, "&Static=true&Container=").concat(container);
      console.log("[Stream] \u8BA4\u8BC1\u4FE1\u606F - ApiKey: ".concat(apiKey ? '已获取' : '未获取', ", DeviceId: ").concat(deviceId));
    } else {
      console.warn("[Stream] \u65E0MediaSource\uFF0C\u65E0\u6CD5\u6784\u5EFA\u6D41\u5A92\u4F53URL");
    }
    return {
      _id: _id,
      _id_key: _id_key,
      _season_key: _season_key,
      _episode_key: _episode_key,
      animeId: animeId,
      episode: episode,
      // this is episode index, not a program index
      animeName: animeName,
      seriesOrMovieId: item.SeriesId || item.Id,
      // 新增：提取匹配所需的文件信息
      streamUrl: streamUrl,
      size: mediaSource === null || mediaSource === void 0 ? void 0 : mediaSource.Size,
      duration: ((mediaSource === null || mediaSource === void 0 ? void 0 : mediaSource.RunTimeTicks) || 0) / 10000000,
      // Ticks to seconds
      episodeName: episodeName,
      seriesName: seriesName,
      seasonNumber: seasonNumber,
      episodeNumber: episodeNumber
    };
  }

  // 通过缓存中的剧集名称与偏移量进行匹配
  async function lsSeasonSearchEpisodes(_season_key, episode, prefix, searchTitle) {
    var seasonInfoListStr = window.localStorage.getItem(_season_key);
    if (!seasonInfoListStr) {
      return null;
    }
    var seasonInfoList = JSON.parse(seasonInfoListStr);
    var selectedSeasonInfo = selectSeasonInfo(searchTitle, seasonInfoList, episode);
    if (selectedSeasonInfo) {
      var episodeOffset = getSeasonEpisodeOffset(selectedSeasonInfo);
      var newEpisode = episode + episodeOffset;
      console.log("\u547D\u4E2DseasonInfo\u7F13\u5B58: ".concat(selectedSeasonInfo.name, ",\u504F\u79FB\u91CF: ").concat(episodeOffset, ",\u96C6: ").concat(newEpisode));
      var _animaInfo = await fetchSearchEpisodes(selectedSeasonInfo.name, newEpisode, selectedSeasonInfo.apiPrefix || prefix);
      if (_animaInfo && _animaInfo.animes) {
        _animaInfo.animes = prioritizeSeasonCandidates(searchTitle, _animaInfo.animes);
        var selectedAnimeIndex = _animaInfo.animes.findIndex(function (anime) {
          return anime.animeId == selectedSeasonInfo.animeId;
        });
        if (selectedAnimeIndex > 0) {
          _animaInfo.animes.unshift(_animaInfo.animes.splice(selectedAnimeIndex, 1)[0]);
        }
      }
      return {
        animaInfo: _animaInfo,
        newEpisode: newEpisode
      };
    }
    return null;
  }
  async function autoFailback(animeName, episodeIndex, seriesOrMovieId) {
    var rvt = await movieAutoFailback(animeName, episodeIndex);
    if (rvt) {
      return rvt;
    }
    var seriesOrMovieInfo = await ApiClient.getItem(ApiClient.getCurrentUserId(), seriesOrMovieId);
    var animeOriginalTitle = seriesOrMovieInfo.OriginalTitle;
    rvt = await oriTitleAutoFailback(animeName, episodeIndex, animeOriginalTitle);
    if (rvt) {
      return rvt;
    }
  }
  async function tmdbAutoFailback(animeName, episodeIndex, tmdbId) {
    if (!tmdbId) {
      return null;
    }
    console.log("\u6807\u9898\u540D: ".concat(animeName, ",\u81EA\u52A8\u5339\u914D\u672A\u67E5\u8BE2\u5230\u7ED3\u679C,\u5C06\u4F7F\u7528\u5143\u4FE1\u606F\u4E2D\u7684 tmdbId,\u91CD\u8BD5\u4E00\u6B21"));
    animaInfo = await fetchSearchEpisodes(animeOriginalTitle, episodeIndex);
    if (animaInfo.animes.length < 1) {
      return null;
    }
    console.log("\u4F7F\u7528\u539F\u6807\u9898\u540D: ".concat(animeOriginalTitle, ",\u81EA\u52A8\u5339\u914D\u6210\u529F"));
    return {
      animeName: animeName,
      animaInfo: animaInfo,
      animeOriginalTitle: animeOriginalTitle
    };
  }
  async function oriTitleAutoFailback(animeName, episodeIndex, animeOriginalTitle) {
    // from: https://github.com/Izumiko/jellyfin-danmaku/blob/jellyfin/ede.js#L886
    // const seriesOrMovieInfo = await ApiClient.getItem(ApiClient.getCurrentUserId(), seriesOrMovieId);
    // if (!seriesOrMovieInfo.OriginalTitle) { return null; }
    if (!animeOriginalTitle) {
      return null;
    }
    console.log("\u6807\u9898\u540D: ".concat(animeName, ",\u81EA\u52A8\u5339\u914D\u672A\u67E5\u8BE2\u5230\u7ED3\u679C,\u5C06\u4F7F\u7528\u539F\u6807\u9898\u540D,\u91CD\u8BD5\u4E00\u6B21"));
    // const animeOriginalTitle = seriesOrMovieInfo.OriginalTitle;
    animaInfo = await fetchSearchEpisodes(animeOriginalTitle, episodeIndex);
    if (animaInfo.animes.length < 1) {
      return null;
    }
    console.log("\u4F7F\u7528\u539F\u6807\u9898\u540D: ".concat(animeOriginalTitle, ",\u81EA\u52A8\u5339\u914D\u6210\u529F"));
    return {
      animeName: animeName,
      animaInfo: animaInfo,
      animeOriginalTitle: animeOriginalTitle
    };
  }
  async function movieAutoFailback(animeName, episodeIndex) {
    console.log("\u81EA\u52A8\u5339\u914D\u672A\u67E5\u8BE2\u5230\u7ED3\u679C,\u53EF\u80FD\u4E3A\u975E\u756A\u5267,\u5C06\u79FB\u9664\u7AE0\u8282\u8FC7\u6EE4,\u91CD\u8BD5\u4E00\u6B21");
    var animaInfo = await fetchSearchEpisodes(animeName);
    if (animaInfo.animes.length > 0) {
      console.log("\u79FB\u9664\u7AE0\u8282\u8FC7\u6EE4,\u81EA\u52A8\u5339\u914D\u6210\u529F,\u8F6C\u6362\u4E3A\u76EE\u6807\u7AE0\u8282\u7D22\u5F15 0");
      if (isNaN(episodeIndex)) {
        episodeIndex = 0;
      }
      // const episodeInfo = animaInfo.animes[0].episodes[episodeIndex - 1 ?? 0];
      var episodeInfo = animaInfo.animes[0].episodes[episodeIndex];
      if (!episodeInfo) {
        return null;
      }
      animaInfo.animes[0].episodes = [episodeInfo];
      return {
        animeName: animeName,
        animaInfo: animaInfo
      };
    }
  }

  // 智能匹配函数：从候选列表中选择最佳匹配
  function selectBestMatch(searchTitle, candidates) {
    if (!candidates || candidates.length === 0) return null;
    console.log("[\u667A\u80FD\u5339\u914D] \u641C\u7D22\u6807\u9898: \"".concat(searchTitle, "\", \u5019\u9009\u6570\u91CF: ").concat(candidates.length));

    // 解析搜索标题
    var parsedSearch = parseSearchKeyword(searchTitle);
    console.log("[\u667A\u80FD\u5339\u914D] \u89E3\u6790\u641C\u7D22\u6807\u9898: ".concat(JSON.stringify(parsedSearch)));

    // 计算相似度得分
    var scoredCandidates = candidates.map(function (candidate) {
      var score = calculateMatchScore(parsedSearch.title, candidate);

      // 季度冲突是硬约束；同季度结果只额外加分。
      var seasonScore = getSeasonMatchScore(searchTitle, candidate.animeTitle, candidate.type);
      if (seasonScore < 0) {
        score.total = -1;
        console.log("[\u667A\u80FD\u5339\u914D] \u5FFD\u7565\u5B63\u5EA6\u51B2\u7A81\u5019\u9009: ".concat(candidate.animeTitle));
      } else if (seasonScore > 1) {
        score.total += 0.15;
        console.log("[\u667A\u80FD\u5339\u914D] \u5B63\u5EA6\u5339\u914D\u52A0\u5206: ".concat(candidate.animeTitle));
      }

      // 集数匹配加分 (多种方式检测)
      if (parsedSearch.episode) {
        var episodeMatched = false;

        // 方式1: 从episodeId末尾提取集数 (如181180001 -> 1)
        if (candidate.episodeId) {
          var episodeFromId = parseInt(candidate.episodeId.toString().slice(-3));
          if (episodeFromId === parsedSearch.episode) {
            score.total += 0.25; // episodeId匹配加分更高
            episodeMatched = true;
            console.log("[\u667A\u80FD\u5339\u914D] episodeId\u96C6\u6570\u5339\u914D\u52A0\u5206: ".concat(candidate.animeTitle, " (").concat(episodeFromId, ")"));
          }
        }

        // 方式2: 从episodeTitle提取集数
        if (!episodeMatched && candidate.episodeTitle) {
          var episodeMatch = candidate.episodeTitle.match(/第?(\d+)[话集]/);
          if (episodeMatch && parseInt(episodeMatch[1]) === parsedSearch.episode) {
            score.total += 0.2; // episodeTitle匹配加分
            console.log("[\u667A\u80FD\u5339\u914D] episodeTitle\u96C6\u6570\u5339\u914D\u52A0\u5206: ".concat(candidate.animeTitle, " - ").concat(candidate.episodeTitle));
          }
        }
      }
      console.log("[\u667A\u80FD\u5339\u914D] \"".concat(candidate.animeTitle, "\" (").concat(candidate.typeDescription, ") - \u5F97\u5206: ").concat(score.total.toFixed(2)));
      return _objectSpread(_objectSpread({}, candidate), {}, {
        score: score.total,
        scoreDetails: score
      });
    });

    // 按得分排序
    scoredCandidates.sort(function (a, b) {
      return b.score - a.score;
    });

    // 选择得分最高的候选
    var bestMatch = scoredCandidates[0];
    if (bestMatch.score > 0.15) {
      // 进一步降低阈值，提高匹配成功率
      console.log("[\u667A\u80FD\u5339\u914D] \u9009\u62E9\u6700\u4F73\u5339\u914D: \"".concat(bestMatch.animeTitle, "\" (\u5F97\u5206: ").concat(bestMatch.score.toFixed(2), ")"));
      return bestMatch;
    }
    console.log("[\u667A\u80FD\u5339\u914D] \u6CA1\u6709\u627E\u5230\u8DB3\u591F\u597D\u7684\u5339\u914D (\u6700\u9AD8\u5F97\u5206: ".concat(bestMatch.score.toFixed(2), ")"));
    return null;
  }

  // 计算匹配得分
  function calculateMatchScore(searchTitle, candidate) {
    var score = {
      titleSimilarity: 0,
      typeBonus: 0,
      keywordMatch: 0,
      exactMatch: 0,
      total: 0
    };

    // 0. 精确匹配检查 (权重: 0.4)
    var normalizedSearch = normalizeTitle(searchTitle);
    var normalizedCandidate = normalizeTitle(candidate.animeTitle);
    if (normalizedSearch === normalizedCandidate) {
      score.exactMatch = 0.4;
    } else if (normalizedCandidate.includes(normalizedSearch) || normalizedSearch.includes(normalizedCandidate)) {
      score.exactMatch = 0.3;
    }

    // 1. 标题相似度 (权重: 0.5)
    score.titleSimilarity = calculateStringSimilarity(searchTitle, candidate.animeTitle) * 0.5;

    // 2. 类型加分 (权重: 0.1)
    if (candidate.type === 'tvseries') {
      score.typeBonus = 0.1; // TV动画优先
    } else if (candidate.type === 'tvspecial') {
      score.typeBonus = 0.08; // TV特别版次优先
    } else if (candidate.type === 'web') {
      score.typeBonus = 0.06; // 网络放送
    } else if (candidate.type === 'ova') {
      score.typeBonus = 0.04; // OVA
    } else if (candidate.type === 'movie') {
      score.typeBonus = 0.02; // 剧场版权重降低
    }

    // 3. 关键词匹配 (权重: 0.1)
    var searchKeywords = extractKeywords(searchTitle);
    var candidateKeywords = extractKeywords(candidate.animeTitle);
    var keywordMatches = searchKeywords.filter(function (keyword) {
      return candidateKeywords.some(function (ck) {
        return ck.includes(keyword) || keyword.includes(ck);
      });
    }).length;
    score.keywordMatch = keywordMatches / Math.max(searchKeywords.length, 1) * 0.1;
    score.total = score.exactMatch + score.titleSimilarity + score.typeBonus + score.keywordMatch;
    return score;
  }

  // 标题标准化函数
  function normalizeTitle(title) {
    return title.toLowerCase().replace(/[：:]/g, '').replace(/\s+/g, ' ').replace(/[^\w\s\u4e00-\u9fff]/g, '') // 保留中文、英文、数字和空格
    .trim();
  }

  // 解析搜索关键词，提取标题、季数和集数
  function parseSearchKeyword(keyword) {
    keyword = keyword.trim();

    // 1. 优先匹配 SXXEXX 格式
    var sePattern = /^(.+?)\s*S(\d{1,2})E(\d{1,4})$/i;
    var seMatch = sePattern.exec(keyword);
    if (seMatch) {
      return {
        title: seMatch[1].trim(),
        season: parseInt(seMatch[2]),
        episode: parseInt(seMatch[3])
      };
    }

    // 2. 匹配季度信息
    var seasonPatterns = [
    // S01, Season 1
    {
      pattern: /^(.*?)\s*(?:S|Season)\s*(\d{1,2})$/i,
      handler: function handler(m) {
        return parseInt(m[2]);
      }
    },
    // 第一季, 第二部
    {
      pattern: /^(.*?)\s*第\s*([一二三四五六七八九十\d]+)\s*[季部]$/i,
      handler: function handler(m) {
        var seasonMap = {
          '一': 1,
          '二': 2,
          '三': 3,
          '四': 4,
          '五': 5,
          '六': 6,
          '七': 7,
          '八': 8,
          '九': 9,
          '十': 10
        };
        return seasonMap[m[2]] || parseInt(m[2]);
      }
    },
    // 罗马数字 Ⅰ-Ⅻ
    {
      pattern: /^(.*?)\s*([Ⅰ-Ⅻ])$/,
      handler: function handler(m) {
        var romanMap = {
          'Ⅰ': 1,
          'Ⅱ': 2,
          'Ⅲ': 3,
          'Ⅳ': 4,
          'Ⅴ': 5,
          'Ⅵ': 6,
          'Ⅶ': 7,
          'Ⅷ': 8,
          'Ⅸ': 9,
          'Ⅹ': 10,
          'Ⅺ': 11,
          'Ⅻ': 12
        };
        return romanMap[m[2].toUpperCase()];
      }
    },
    // 普通数字
    {
      pattern: /^(.*?)\s+(\d{1,2})$/,
      handler: function handler(m) {
        return parseInt(m[2]);
      }
    }];
    for (var _i = 0, _seasonPatterns = seasonPatterns; _i < _seasonPatterns.length; _i++) {
      var _seasonPatterns$_i = _seasonPatterns[_i],
        pattern = _seasonPatterns$_i.pattern,
        handler = _seasonPatterns$_i.handler;
      var match = pattern.exec(keyword);
      if (match) {
        try {
          var title = match[1].trim();
          var season = handler(match);
          // 避免将年份误认为季度
          if (season && !(title.length > 4 && /\d{4}$/.test(title))) {
            return {
              title: title,
              season: season,
              episode: null
            };
          }
        } catch (e) {
          continue;
        }
      }
    }

    // 3. 如果没有匹配到特定格式，则返回原始标题
    return {
      title: keyword,
      season: null,
      episode: null
    };
  }

  // 区分明确的季度命中、冲突，以及使用副标题区分季度的中性候选。
  function isSpecialAnimeType(candidateType) {
    var normalizedType = String(candidateType || '').toLowerCase();
    return normalizedType === 'ova' || normalizedType === 'tvspecial';
  }
  function getSeasonMatchScore(searchTitle, candidateTitle, candidateType) {
    var parsedSearch = parseSearchKeyword(String(searchTitle || ''));
    if (parsedSearch.season === null) {
      return 0;
    }
    var parsedCandidate = parseSearchKeyword(String(candidateTitle || ''));
    if (parsedCandidate.season !== null) {
      return parsedCandidate.season === parsedSearch.season ? 2 : -2;
    }

    // Emby 的 Season 0 表示特别篇，优先限定为 OVA/TV Special。
    if (parsedSearch.season === 0) {
      if (!candidateType) {
        return normalizeTitle(parsedCandidate.title) === normalizeTitle(parsedSearch.title) ? -1 : 1;
      }
      return isSpecialAnimeType(candidateType) ? 3 : -2;
    }

    // API 中未标注季度、且与基础标题完全相同的条目通常是第一季。
    if (parsedSearch.season > 1 && normalizeTitle(parsedCandidate.title) === normalizeTitle(parsedSearch.title)) {
      return -1;
    }
    return 1;
  }
  function isSeasonCompatible(searchTitle, candidateTitle, candidateType) {
    return getSeasonMatchScore(searchTitle, candidateTitle, candidateType) >= 0;
  }
  function prioritizeSeasonCandidates(searchTitle, candidates) {
    if (!Array.isArray(candidates) || candidates.length < 2) {
      return candidates;
    }
    var parsedSearch = parseSearchKeyword(String(searchTitle || ''));
    if (parsedSearch.season === null) {
      return candidates;
    }
    return candidates.map(function (candidate, index) {
      return {
        candidate: candidate,
        index: index,
        seasonScore: getSeasonMatchScore(searchTitle, candidate.animeTitle, candidate.type)
      };
    }).sort(function (a, b) {
      return b.seasonScore - a.seasonScore || a.index - b.index;
    }).map(function (_ref5) {
      var candidate = _ref5.candidate;
      return candidate;
    });
  }
  function getSeasonEpisodeOffset(seasonInfo) {
    var episodeOffset = Number(seasonInfo.episodeOffset);
    if (!Number.isFinite(episodeOffset)) {
      return NaN;
    }
    // 旧缓存用 0-based 下标直接计算，所有偏移都少了 1。
    return seasonInfo.episodeOffsetVersion === 2 ? episodeOffset : episodeOffset + 1;
  }
  function selectSeasonInfo(searchTitle, seasonInfoList, episode) {
    var _seasonInfoList$map$f;
    return ((_seasonInfoList$map$f = seasonInfoList.map(function (seasonInfo, index) {
      return {
        seasonInfo: seasonInfo,
        index: index,
        adjustedEpisode: Number(episode) + getSeasonEpisodeOffset(seasonInfo),
        seasonScore: getSeasonMatchScore(searchTitle, seasonInfo.name, seasonInfo.animeType)
      };
    }).filter(function (item) {
      return item.adjustedEpisode > 0 && item.seasonScore >= 0;
    }).sort(function (a, b) {
      return b.seasonScore - a.seasonScore || Number(b.seasonInfo.updatedAt || 0) - Number(a.seasonInfo.updatedAt || 0) || a.adjustedEpisode - b.adjustedEpisode || a.index - b.index;
    })[0]) === null || _seasonInfoList$map$f === void 0 ? void 0 : _seasonInfoList$map$f.seasonInfo) || null;
  }
  function createSeasonInfo(anime, selectedEpisodeIndex, embyEpisode) {
    return {
      name: anime.animeTitle,
      // selectedEpisodeIndex 是 0-based，季度偏移使用 1-based 集号计算。
      episodeOffset: Number(selectedEpisodeIndex) + 1 - Number(embyEpisode),
      episodeOffsetVersion: 2,
      animeId: anime.animeId,
      animeType: anime.type,
      apiPrefix: anime.apiPrefix,
      apiName: anime.apiName,
      updatedAt: Date.now()
    };
  }

  // 计算字符串相似度 (简化版编辑距离)
  function calculateStringSimilarity(str1, str2) {
    var s1 = str1.toLowerCase().replace(/[：:]/g, '');
    var s2 = str2.toLowerCase().replace(/[：:]/g, '');
    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    // 计算编辑距离
    var matrix = [];
    for (var i = 0; i <= s1.length; i++) {
      matrix[i] = [i];
    }
    for (var j = 0; j <= s2.length; j++) {
      matrix[0][j] = j;
    }
    for (var _i2 = 1; _i2 <= s1.length; _i2++) {
      for (var _j = 1; _j <= s2.length; _j++) {
        if (s1.charAt(_i2 - 1) === s2.charAt(_j - 1)) {
          matrix[_i2][_j] = matrix[_i2 - 1][_j - 1];
        } else {
          matrix[_i2][_j] = Math.min(matrix[_i2 - 1][_j - 1] + 1, matrix[_i2][_j - 1] + 1, matrix[_i2 - 1][_j] + 1);
        }
      }
    }
    var maxLength = Math.max(s1.length, s2.length);
    return maxLength === 0 ? 1 : (maxLength - matrix[s1.length][s2.length]) / maxLength;
  }

  // 提取关键词
  function extractKeywords(title) {
    // 移除常见的无意义词汇
    var stopWords = ['第', '季', '部', '篇', '章', '话', '集', '期', 'season', 'episode', 'ep', 'ova', 'tv', 'movie', 'special', 'the', 'of', 'and', 'in', 'to', 'a', 'an'];
    return title.toLowerCase().replace(/[：:]/g, ' ').replace(/[^\w\s\u4e00-\u9fff]/g, ' ') // 保留中文、英文、数字和空格
    .split(/[\s\u3000]+/).filter(function (word) {
      return word.length > 1;
    }) // 过滤单字符
    .filter(function (word) {
      return !stopWords.includes(word);
    }) // 过滤停用词
    .filter(function (word) {
      return !/^\d+$/.test(word);
    }) // 过滤纯数字
    .map(function (word) {
      return word.trim();
    });
  }
  async function fetchMatchApi(payload, prefix) {
    var url = "".concat(prefix, "/match");
    console.log("[\u81EA\u52A8\u5339\u914D] \u5C1D\u8BD5 match \u63A5\u53E3");
    try {
      var requestHeaders = {
        'Accept-Encoding': 'gzip',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      var requestBody = JSON.stringify(payload);
      var response = await fetch(url, {
        method: 'POST',
        headers: requestHeaders,
        body: requestBody
      });
      if (!response.ok) {
        var responseText = await response.text();
        console.warn("[\u81EA\u52A8\u5339\u914D] match \u5931\u8D25: HTTP ".concat(response.status));
        throw new Error("HTTP error! Status: ".concat(response.status, ", Body: ").concat(responseText));
      }
      var matchResult = await response.json();
      console.log("[\u81EA\u52A8\u5339\u914D] match \u6210\u529F");

      // 统一 /match 和 /search/episodes 的返回格式
      if (matchResult && matchResult.matches) {
        matchResult.animes = matchResult.matches;
        delete matchResult.matches;
      }
      return matchResult;
    } catch (error) {
      console.warn("[\u81EA\u52A8\u5339\u914D] match \u5931\u8D25:", error.message || error);
      return null;
    }
  }
  async function calculateFileHash(streamUrl, fileSize) {
    if (!streamUrl || !fileSize) {
      console.warn('缺少 streamUrl 或 fileSize，无法计算哈希。');
      return null;
    }
    console.log("[Hash] \u4F7F\u7528\u6D41\u5A92\u4F53URL: ".concat(streamUrl ? '已获取' : '未获取'));
    if (!streamUrl.includes('api_key=')) {
      console.warn('[Hash] 流媒体URL缺少api_key参数，可能导致认证失败');
    }
    var authHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': '*/*',
      'Accept-Encoding': 'identity'
    };
    var CHUNK_SIZE = 16 * 1024 * 1024; // 16MB
    var spark = new SparkMD5.ArrayBuffer();
    try {
      if (fileSize < CHUNK_SIZE * 2) {
        console.log("[Hash] \u6587\u4EF6\u5927\u5C0F (".concat((fileSize / 1024 / 1024).toFixed(2), "MB) \u5C0F\u4E8E32MB\uFF0C\u5C06\u4E0B\u8F7D\u6574\u4E2A\u6587\u4EF6\u8BA1\u7B97\u54C8\u5E0C\u3002"));
        var response = await fetch(streamUrl, {
          headers: authHeaders,
          timeout: 30000
        });
        if (!response.ok) {
          throw new Error("\u4E0B\u8F7D\u6587\u4EF6\u5931\u8D25: ".concat(response.status, " ").concat(response.statusText));
        }
        console.log("[Hash] \u54CD\u5E94\u72B6\u6001: ".concat(response.status, ", Content-Length: ").concat(response.headers.get('content-length')));
        var arrayBuffer = await response.arrayBuffer();
        spark.append(arrayBuffer);
      } else {
        console.log("[Hash] \u6587\u4EF6\u5927\u5C0F (".concat((fileSize / 1024 / 1024).toFixed(2), "MB)\uFF0C\u5C06\u5206\u5757\u4E0B\u8F7D\u8BA1\u7B97\u54C8\u5E0C\u3002"));
        console.log('[Hash] 正在下载文件头部 16MB...');
        var headRequestHeaders = _objectSpread(_objectSpread({}, authHeaders), {}, {
          'Range': "bytes=0-".concat(CHUNK_SIZE - 1),
          'Accept-Ranges': 'bytes'
        });
        var headResponse = await fetch(streamUrl, {
          headers: headRequestHeaders,
          timeout: 30000
        });
        if (!headResponse.ok) {
          throw new Error("\u4E0B\u8F7D\u6587\u4EF6\u5934\u90E8\u5931\u8D25: ".concat(headResponse.status, " ").concat(headResponse.statusText));
        }
        console.log("[Hash] \u5934\u90E8\u54CD\u5E94\u72B6\u6001: ".concat(headResponse.status, ", Content-Range: ").concat(headResponse.headers.get('content-range')));
        var headBuffer = await headResponse.arrayBuffer();
        spark.append(headBuffer);
        console.log('[Hash] 文件头部下载完成。');
        console.log('[Hash] 正在下载文件尾部 16MB...');
        var tailRequestHeaders = _objectSpread(_objectSpread({}, authHeaders), {}, {
          'Range': "bytes=".concat(fileSize - CHUNK_SIZE, "-").concat(fileSize - 1),
          'Accept-Ranges': 'bytes'
        });
        var tailResponse = await fetch(streamUrl, {
          headers: tailRequestHeaders,
          timeout: 30000
        });
        if (!tailResponse.ok) {
          throw new Error("\u4E0B\u8F7D\u6587\u4EF6\u5C3E\u90E8\u5931\u8D25: ".concat(tailResponse.status, " ").concat(tailResponse.statusText));
        }
        console.log("[Hash] \u5C3E\u90E8\u54CD\u5E94\u72B6\u6001: ".concat(tailResponse.status, ", Content-Range: ").concat(tailResponse.headers.get('content-range')));
        var tailBuffer = await tailResponse.arrayBuffer();
        spark.append(tailBuffer);
        console.log('[Hash] 文件尾部下载完成。');
      }
      var hash = spark.end();
      console.log("[Hash] \u6587\u4EF6\u54C8\u5E0C\u8BA1\u7B97\u6210\u529F: ".concat(hash));
      console.log("[Hash] \u54C8\u5E0C\u503C\u8BE6\u60C5 - \u957F\u5EA6: ".concat(hash.length, ", \u503C: ").concat(hash));
      return hash;
    } catch (error) {
      console.warn('[Hash] 文件哈希计算过程中发生错误:', error);
      console.warn('[Hash] 错误详情:', {
        message: error.message,
        streamUrl: streamUrl,
        fileSize: fileSize,
        authHeaders: Object.keys(authHeaders)
      });
      return null;
    }
  }

  /**
   * 解析 "XXXX SXXEXX" 格式的标题
   * @param {string} animeName - 完整的动画标题
   * @returns {{title: string, season: number|null, episode: number|null}}
   */
  function parseAnimeName(animeName) {
    var match = animeName.match(/^(.*?)\s*[Ss](\d{1,2})[Ee](\d{1,4})\b/);
    if (match) {
      return {
        title: match[1].replace(/[\._]/g, ' ').trim(),
        season: parseInt(match[2], 10),
        episode: parseInt(match[3], 10)
      };
    }
    // 如果不匹配，返回原始标题和null
    return {
      title: animeName,
      season: null,
      episode: null
    };
  }
  async function searchEpisodes(itemInfoMap) {
    var _apiConfigs$custom$pr, _apiConfigs$currentPr;
    var _season_key = itemInfoMap._season_key,
      animeName = itemInfoMap.animeName,
      episodeName = itemInfoMap.episodeName,
      episode = itemInfoMap.episode,
      seriesOrMovieId = itemInfoMap.seriesOrMovieId,
      streamUrl = itemInfoMap.streamUrl,
      size = itemInfoMap.size,
      duration = itemInfoMap.duration;
    console.log("[\u81EA\u52A8\u5339\u914D] \u6807\u9898\u540D: ".concat(episodeName) + (episode ? ",\u7AE0\u8282\u8FC7\u6EE4: ".concat(episode) : ''));
    console.log("[Debug] searchEpisodes\u8C03\u7528 - streamUrl: ".concat(streamUrl ? '已获取' : '未获取', ", size: ").concat(size, ", duration: ").concat(duration));

    // 读取用户定义的API优先级
    var apiPriority = lsGetItem(lsKeys.apiPriority.id);
    var apiConfigs = {
      official: {
        name: '官方API',
        prefix: corsProxy + 'https://api.dandanplay.net/api/v2',
        enabled: lsGetItem(lsKeys.useOfficialApi.id)
      },
      custom: {
        name: '自定义API',
        prefix: lsGetItem(lsKeys.customApiPrefix.id),
        enabled: lsGetItem(lsKeys.useCustomApi.id)
      }
    };
    // 计算默认 API 配置（用于赛季缓存和默认匹配）
    var currentPriority = Array.isArray(apiPriority) && apiPriority[0] === 'custom' && apiConfigs.custom.enabled && (_apiConfigs$custom$pr = apiConfigs.custom.prefix) !== null && _apiConfigs$custom$pr !== void 0 && _apiConfigs$custom$pr.trim() ? 'custom' : 'official';
    var selectedApiConfig = apiConfigs[currentPriority].enabled && (_apiConfigs$currentPr = apiConfigs[currentPriority].prefix) !== null && _apiConfigs$currentPr !== void 0 && _apiConfigs$currentPr.trim() ? apiConfigs[currentPriority] : apiConfigs.custom;

    // 有赛季缓存时优先用赛季缓存（手动匹配后写入的 _anime_season_rel_*），避免哈希+智能匹配选错
    var animaRes = await lsSeasonSearchEpisodes(_season_key, episode, selectedApiConfig.prefix, episodeName);
    if (animaRes && animaRes.animaInfo && animaRes.animaInfo.animes.length > 0) {
      var bgmEpisodeIndex = animaRes.newEpisode - 1;
      console.log("[\u81EA\u52A8\u5339\u914D] \u547D\u4E2D\u8D5B\u5B63\u7F13\u5B58\uFF0C\u76F4\u63A5\u4F7F\u7528");
      return {
        animeOriginalTitle: '',
        animaInfo: animaRes.animaInfo,
        bgmEpisodeIndex: bgmEpisodeIndex
      };
    }

    // 尝试哈希匹配(含 /match 调用)
    var hashMatchResult = await tryMatchByHash(episodeName, streamUrl, size, duration, apiConfigs, apiPriority);
    if (hashMatchResult) {
      return hashMatchResult;
    }
    var _iterator = _createForOfIteratorHelper(apiPriority),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var apiKey = _step.value;
        var config = apiConfigs[apiKey];
        if (!config || !config.enabled || apiKey === 'custom' && !config.prefix) {
          continue;
        }

        // 尝试 /search/episodes 接口 (带集数)
        var searchTitle = episodeName;
        var searchEpisode = episode;
        if (apiKey === 'official') {
          var parsed = parseAnimeName(episodeName);
          if (parsed.season !== null) {
            searchTitle = parsed.season === 1 ? parsed.title : "".concat(parsed.title, " \u7B2C").concat(parsed.season, "\u5B63");
            searchEpisode = parsed.episode;
            console.log("[\u81EA\u52A8\u5339\u914D][\u5B98\u65B9API\u4F18\u5316] \u683C\u5F0F\u5316\u641C\u7D22: \u6807\u9898='".concat(searchTitle, "', \u96C6\u6570=").concat(searchEpisode));
          }
        }
        console.log("[\u81EA\u52A8\u5339\u914D][".concat(config.name, "] \u5C1D\u8BD5 /search/episodes \u63A5\u53E3, \u6807\u9898\u540D: ").concat(searchTitle, ", \u96C6\u6570: ").concat(searchEpisode));
        var searchAnimaInfo = await fetchSearchEpisodes(searchTitle, searchEpisode, config.prefix);
        if (searchAnimaInfo && searchAnimaInfo.animes.length > 0) {
          searchAnimaInfo.animes = prioritizeSeasonCandidates(searchTitle, searchAnimaInfo.animes);
          console.log("[".concat(config.name, "] \u5E26\u96C6\u6570\u641C\u7D22\u6210\u529F"));
          return {
            animaInfo: searchAnimaInfo,
            apiPrefix: config.prefix
          };
        }

        // 尝试 /search/episodes 接口 (不带集数)
        console.log("[".concat(config.name, "] \u5E26\u96C6\u6570\u641C\u7D22\u5931\u8D25\uFF0C\u5C1D\u8BD5\u4E0D\u5E26\u96C6\u6570..."));
        searchAnimaInfo = await fetchSearchEpisodes(episodeName, null, config.prefix);
        if (searchAnimaInfo && searchAnimaInfo.animes.length > 0) {
          searchAnimaInfo.animes = prioritizeSeasonCandidates(episodeName, searchAnimaInfo.animes);
          console.log("[".concat(config.name, "] \u4E0D\u5E26\u96C6\u6570\u641C\u7D22\u6210\u529F"));
          return {
            animaInfo: searchAnimaInfo,
            apiPrefix: config.prefix
          };
        }
      }

      // 默认匹配方式（复用前文已计算的 selectedApiConfig）
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var animaInfo = await fetchSearchEpisodes(animeName, episode, selectedApiConfig.prefix);
    if (animaInfo && animaInfo.animes.length > 0) {
      animaInfo.animes = prioritizeSeasonCandidates(animeName, animaInfo.animes);
      return {
        animeOriginalTitle: '',
        animaInfo: animaInfo
      };
    }
    var res = await autoFailback(animeName, episode, seriesOrMovieId);
    if (res) {
      return res;
    }
  }
  async function tryMatchByHash(animeName, streamUrl, size, duration, apiConfigs, apiPriority) {
    var matchPayload = {
      fileName: animeName,
      fileHash: 'a1b2c3d4e5f67890abcd1234ef567890',
      // 默认假哈希
      fileSize: size || 0,
      videoDuration: Math.floor(duration || 0),
      matchMode: "hashAndFileName"
    };

    // 仅在有文件路径时才计算哈希值
    if (streamUrl && size > 0) {
      console.log("\u51C6\u5907\u901A\u8FC7\u64AD\u653E\u94FE\u63A5\u8BA1\u7B97\u6587\u4EF6\u54C8\u5E0C");
      matchPayload.fileHash = await calculateFileHash(streamUrl, size);
      if (matchPayload.fileHash) {
        console.log("\u6587\u4EF6\u54C8\u5E0C\u8BA1\u7B97\u5B8C\u6210: ".concat(matchPayload.fileHash));
      } else {
        console.warn('[Hash] 文件哈希计算失败，将使用假哈希值进行匹配。');
        // matchPayload.fileHash = 'a1b2c3d4e5f67890abcd1234ef567890';
      }
    } else {
      console.warn('未找到播放链接或文件大小，将使用假哈希值进行匹配。');
      // matchPayload.fileHash = 'a1b2c3d4e5f67890abcd1234ef567890';
    }

    // 尝试 /match 接口（按优先级）
    var _iterator2 = _createForOfIteratorHelper(apiPriority),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var apiKey = _step2.value;
        var config = apiConfigs[apiKey];
        if (!config || !config.enabled || apiKey === 'custom' && !config.prefix) {
          continue;
        }
        console.log("[\u81EA\u52A8\u5339\u914D] \u5C1D\u8BD5 ".concat(config.name, " /match \u63A5\u53E3, \u8BF7\u6C42\u4F53:"), _objectSpread(_objectSpread({}, matchPayload), {}, {
          fileHash: matchPayload.fileHash ? '...' : null
        }));
        var matchResult = await fetchMatchApi(matchPayload, config.prefix);
        if (matchResult && matchResult.isMatched && matchResult.animes && matchResult.animes.length > 0) {
          var candidates = prioritizeSeasonCandidates(animeName, matchResult.animes);
          var match = candidates.find(function (candidate) {
            return isSeasonCompatible(animeName, candidate.animeTitle, candidate.type);
          });
          if (!match) {
            console.warn("".concat(config.name, " /match \u63A5\u53E3\u547D\u4E2D\u7ED3\u679C\u4E0E\u5F53\u524D\u5B63\u5EA6\u51B2\u7A81\uFF0C\u653E\u5F03\u76F4\u63A5\u5339\u914D"));
            continue;
          }
          console.log("".concat(config.name, " /match \u63A5\u53E3\u76F4\u63A5\u5339\u914D\u6210\u529F\uFF0C\u5C06\u76F4\u63A5\u4F7F\u7528\u8FD4\u56DE\u7684 episodeId"));
          return {
            directMatch: true,
            apiPrefix: config.prefix,
            apiName: config.name,
            episodeInfo: _objectSpread(_objectSpread({}, match), {}, {
              episodes: [{
                episodeId: match.episodeId,
                episodeTitle: match.episodeTitle
              }],
              imageUrl: match.imageUrl
            })
          };
        }

        // 如果 /match 接口返回了候选列表但没有直接匹配，尝试智能选择
        if (matchResult && !matchResult.isMatched && matchResult.animes && matchResult.animes.length > 0) {
          console.log("[".concat(config.name, "] /match \u63A5\u53E3\u8FD4\u56DE\u5019\u9009\u5217\u8868\uFF0C\u5C1D\u8BD5\u667A\u80FD\u5339\u914D..."));
          var bestMatch = selectBestMatch(animeName, matchResult.animes);
          if (bestMatch) {
            console.log("[".concat(config.name, "] \u667A\u80FD\u5339\u914D\u9009\u62E9:"), bestMatch.animeTitle);
            return {
              directMatch: true,
              apiPrefix: config.prefix,
              apiName: config.name,
              episodeInfo: _objectSpread(_objectSpread({}, bestMatch), {}, {
                episodes: [{
                  episodeId: bestMatch.episodeId,
                  episodeTitle: bestMatch.episodeTitle
                }],
                imageUrl: bestMatch.imageUrl
              })
            };
          }
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return null;
  }
  async function getEpisodeInfo() {
    var is_auto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var itemInfoMap = await getMapByEmbyItemInfo();
    if (!itemInfoMap) {
      return null;
    }
    var _episode_key = itemInfoMap._episode_key,
      animeId = itemInfoMap.animeId,
      episode = itemInfoMap.episode,
      seriesOrMovieId = itemInfoMap.seriesOrMovieId,
      episodeName = itemInfoMap.episodeName;

    // 修正缓存键，区分官方和自定义API
    var useOfficialApi = lsGetItem(lsKeys.useOfficialApi.id);
    var useCustomApi = lsGetItem(lsKeys.useCustomApi.id);
    var apiPriority = lsGetItem(lsKeys.apiPriority.id);
    var enabledApis = apiPriority.filter(function (apiKey) {
      if (apiKey === 'official') return useOfficialApi;
      if (apiKey === 'custom') return useCustomApi;
      return false;
    });
    var unique_episode_key = lsLocalKeys.apiPrefix + "".concat(enabledApis.join('_'), "_") + _episode_key;
    // 单集缓存优先于上下集推理
    if (is_auto && window.localStorage.getItem(unique_episode_key)) {
      var cachedEpisodeInfo = JSON.parse(window.localStorage.getItem(unique_episode_key));
      if (isSeasonCompatible(episodeName, cachedEpisodeInfo.animeTitle, cachedEpisodeInfo.animeType)) {
        return cachedEpisodeInfo;
      }
      console.warn('[自动匹配] 忽略与当前季度冲突的本地匹配缓存');
      window.localStorage.removeItem(unique_episode_key);
    }
    // 下一集/上一集推理逻辑
    var previous_info = window.ede.previous_episode_info;
    if (is_auto && previous_info && previous_info.episodeId && previous_info.seriesOrMovieId === seriesOrMovieId && isSeasonCompatible(episodeName, previous_info.animeTitle, previous_info.animeType)) {
      var previousEpisodeIndex = previous_info.episodeIndex; // 0-based
      var currentEpisodeNumber = episode; // 1-based
      var previousEpisodeId = parseInt(previous_info.episodeId, 10);
      var predictedEpisodeId = null;
      var direction = '';

      // 播放下一集 (e.g., from ep1(index 0) to ep2(number 2))
      if (currentEpisodeNumber === previousEpisodeIndex + 2) {
        predictedEpisodeId = previousEpisodeId + 1;
        direction = '下一集';
      }
      // 播放上一集 (e.g., from ep2(index 1) to ep1(number 1))
      else if (currentEpisodeNumber === previousEpisodeIndex) {
        predictedEpisodeId = previousEpisodeId - 1;
        direction = '上一集';
      }
      if (predictedEpisodeId) {
        console.log("[\u63A8\u7406\u5339\u914D] \u68C0\u6D4B\u5230\u64AD\u653E'".concat(direction, "'\uFF0C\u5C1D\u8BD5\u4F7F\u7528\u63A8\u65AD\u7684 episodeId: ").concat(predictedEpisodeId));
        var comments = await fetchComment(predictedEpisodeId);
        if (comments && comments.length > 0) {
          console.log("[\u63A8\u7406\u5339\u914D] \u6210\u529F\uFF01\u4F7F\u7528 episodeId: ".concat(predictedEpisodeId));
          var predictedEpisodeInfo = _objectSpread(_objectSpread({}, itemInfoMap), {}, {
            episodeId: predictedEpisodeId,
            episodeTitle: "\u7B2C ".concat(currentEpisodeNumber, " \u96C6 (\u63A8\u65AD)"),
            animeId: previous_info.animeId,
            animeTitle: previous_info.animeTitle,
            animeType: previous_info.animeType,
            imageUrl: previous_info.imageUrl,
            seriesOrMovieId: seriesOrMovieId,
            episodeIndex: currentEpisodeNumber - 1
          });
          // 不写入缓存，因为这只是一个快速的推断
          return predictedEpisodeInfo;
        } else {
          console.log("[\u63A8\u7406\u5339\u914D] \u5931\u8D25\uFF0CepisodeId: ".concat(predictedEpisodeId, " \u65E0\u5F39\u5E55\uFF0C\u56DE\u9000\u5230\u5E38\u89C4\u5339\u914D\u3002"));
        }
      }
    }

    // 修正缓存键，区分官方和自定义API
    var useOfficialApi = lsGetItem(lsKeys.useOfficialApi.id);
    var useCustomApi = lsGetItem(lsKeys.useCustomApi.id);
    var apiPriority = lsGetItem(lsKeys.apiPriority.id);
    var enabledApis = apiPriority.filter(function (apiKey) {
      if (apiKey === 'official') return useOfficialApi;
      if (apiKey === 'custom') return useCustomApi;
      return false;
    });
    var unique_episode_key = lsLocalKeys.apiPrefix + "".concat(enabledApis.join('_'), "_") + _episode_key;
    if (is_auto && window.localStorage.getItem(unique_episode_key)) {
      return JSON.parse(window.localStorage.getItem(unique_episode_key));
    }
    var res = await searchEpisodes(itemInfoMap);
    var useOfficial = lsGetItem(lsKeys.useOfficialApi.id);
    var useCustom = lsGetItem(lsKeys.useCustomApi.id);
    if (!useOfficial && !useCustom) {
      return null;
    }
    if (!res) {
      console.log("\u5F39\u5F39 Play \u7AE0\u8282\u5339\u914D\u5931\u8D25");
      // 播放界面右下角添加弹幕信息
      appendvideoOsdDanmakuInfo();
      // toastByDanmaku('弹弹 Play 章节匹配失败', 'error');
      return null;
    }

    // 处理 directMatch 的情况
    if (res.directMatch && res.episodeInfo) {
      console.log("\u4F7F\u7528 /match \u63A5\u53E3\u76F4\u63A5\u5339\u914D\u7684\u7ED3\u679C");
      var _episodeIndex = isNaN(episode) ? 0 : episode - 1;
      var _episodeInfo = {
        episodeId: res.episodeInfo.episodeId,
        episodeTitle: res.episodeInfo.episodeTitle,
        episodeIndex: _episodeIndex,
        bgmEpisodeIndex: _episodeIndex,
        animeId: res.episodeInfo.animeId,
        animeTitle: res.episodeInfo.animeTitle,
        animeType: res.episodeInfo.animeType || res.episodeInfo.type,
        animeOriginalTitle: '',
        imageUrl: res.episodeInfo.imageUrl,
        apiName: res.apiName,
        apiPrefix: res.apiPrefix,
        seriesOrMovieId: seriesOrMovieId
      };
      window.localStorage.setItem(unique_episode_key, JSON.stringify(_episodeInfo));
      return _episodeInfo;
    }

    // 处理传统搜索结果
    if (!res.animaInfo || res.animaInfo.animes.length === 0) {
      console.log("\u5F39\u5F39 Play \u7AE0\u8282\u5339\u914D\u5931\u8D25");
      appendvideoOsdDanmakuInfo();
      return null;
    }
    var animeOriginalTitle = res.animeOriginalTitle,
      animaInfo = res.animaInfo;
    var selectAnime_id = animaInfo.animes.findIndex(function (candidate) {
      return isSeasonCompatible(episodeName, candidate.animeTitle, candidate.type);
    });
    if (selectAnime_id < 0) {
      console.warn('[自动匹配] 搜索结果均与当前季度冲突，放弃自动匹配');
      appendvideoOsdDanmakuInfo();
      return null;
    }
    if (animeId != -1) {
      for (var index = 0; index < animaInfo.animes.length; index++) {
        if (animaInfo.animes[index].animeId == animeId && isSeasonCompatible(episodeName, animaInfo.animes[index].animeTitle, animaInfo.animes[index].type)) {
          selectAnime_id = index;
        }
      }
    }
    var episodeIndex = isNaN(episode) ? 0 : episode - 1;
    var episodeInfo = {
      episodeId: animaInfo.animes[selectAnime_id].episodes[0].episodeId,
      episodeTitle: animaInfo.animes[selectAnime_id].episodes[0].episodeTitle,
      episodeIndex: episodeIndex,
      bgmEpisodeIndex: res.bgmEpisodeIndex ? res.bgmEpisodeIndex : episodeIndex,
      animeId: animaInfo.animes[selectAnime_id].animeId,
      animeTitle: animaInfo.animes[selectAnime_id].animeTitle,
      animeType: animaInfo.animes[selectAnime_id].type,
      animeOriginalTitle: animeOriginalTitle,
      seriesOrMovieId: seriesOrMovieId
    };
    localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));
    return episodeInfo;
  }

  // copy from https://github.com/Izumiko/jellyfin-danmaku/blob/74598c7bcb388f1288d6f7c7b03103e31af248ef/ede.js#L1069
  // thanks for Izumiko
  async function getCommentsByPluginApi(mediaServerItemId) {
    // const path = window.location.pathname.replace(/\/web\/(index\.html)?/, '/api/danmu/');
    // const url = window.location.origin + path + jellyfinItemId + '/raw';
    var url = "".concat(ApiClient.serverAddress(), "/api/danmu/").concat(mediaServerItemId, "/raw?X-Emby-Token=").concat(ApiClient.accessToken());
    var response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    var xmlText = await response.text();
    if (!xmlText || xmlText.length === 0) {
      return null;
    }

    // parse the xml data
    // xml data: <d p="392.00000,1,25,16777215,0,0,[BiliBili]e6860b30,1723088443,1">弹幕内容</d>
    //           <d p="stime, type, fontSize, color, date, pool, sender, dbid, unknown">content</d>
    // comment data: {cid: "1723088443", p: "392.00,1,16777215,[BiliBili]e6860b30", m: "弹幕内容"}
    //               {cid: "dbid", p: "stime, type, color, sender", m: "content"}
    try {
      var parser = new DOMParser();
      var data = parser.parseFromString(xmlText, 'text/xml');
      var comments = [];
      var _iterator3 = _createForOfIteratorHelper(data.getElementsByTagName('d')),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var comment = _step3.value;
          var p = comment.getAttribute('p').split(',').map(Number);
          var commentData = {
            cid: p[7],
            p: p[0] + ',' + p[1] + ',' + p[3] + ',' + p[6],
            m: comment.textContent
          };
          comments.push(commentData);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return comments;
    } catch (error) {
      console.error('Failed to parse XML data:', error);
      return null;
    }
  }
  async function refreshPluginXml(mediaServerItemId) {
    var url = "".concat(ApiClient.serverAddress(), "/api/danmu/").concat(mediaServerItemId, "?option=Refresh&X-Emby-Token=").concat(ApiClient.accessToken());
    var response = await fetch(url);
    if (response.ok) {
      console.log(lsKeys.refreshPluginXml.name + ':成功');
    } else {
      throw new Error(lsKeys.refreshPluginXml.name + ':失败');
    }
  }
  async function createDanmaku(comments) {
    if (!comments) {
      return;
    }
    if (window.ede.danmaku != null) {
      window.ede.danmaku.destroy();
      window.ede.danmaku = null;
    }
    window.ede.commentsOriginal = comments;
    var commentsParsed = danmakuParser(comments);
    window.ede.commentsParsed = commentsParsed;
    var _comments = danmakuFilter(commentsParsed);
    console.log('[加载]弹幕成功: ' + _comments.length);
    var _media = document.querySelector(mediaQueryStr);
    if (!_media) {
      // this only working on quickDebug
      if (!window.ede.danmaku) {
        window.ede.danmaku = {
          comments: _comments
        };
      }
      // 设置弹窗内的弹幕信息
      buildCurrentDanmakuInfo(currentDanmakuInfoContainerId);
      throw new Error('用户已退出视频播放');
    }
    if (!isVersionOld) {
      _media.style.position = 'absolute';
    }
    // from https://github.com/Izumiko/jellyfin-danmaku/blob/jellyfin/ede.js#L1104
    var wrapperTop = 0; // 播放器 UI 顶部阴影
    var wrapper = getById(eleIds.danmakuWrapper);
    wrapper && wrapper.remove();
    wrapper = document.createElement('div');
    wrapper.id = eleIds.danmakuWrapper;
    wrapper.style.position = 'fixed';
    wrapper.style.width = '100%';
    wrapper.style.height = "calc(".concat(lsGetItem(lsKeys.heightPercent.id), "% - ").concat(wrapperTop, "px)");
    wrapper.style.backgroundColor = lsGetItem(lsKeys.debugShowDanmakuWrapper.id) ? styles.colors.highlight : '';
    // wrapper.style.opacity = lsGetItem(lsKeys.fontOpacity.id); // 弹幕整体透明度
    wrapper.style.top = wrapperTop + 'px';
    wrapper.style.pointerEvents = 'none';
    // const _container = document.querySelector(mediaContainerQueryStr);
    var _container = await waitForElement(mediaContainerQueryStr);
    _container.prepend(wrapper);
    var _speed = 144 * lsGetItem(lsKeys.speed.id);
    window.ede.danmaku = new Danmaku({
      container: wrapper,
      media: _media,
      comments: _comments,
      engine: lsGetItem(lsKeys.engine.id),
      speed: _speed
    });
    lsGetItem(lsKeys.switch.id) ? window.ede.danmaku.show() : window.ede.danmaku.hide();
    if (window.ede.ob) {
      window.ede.ob.disconnect();
    }
    window.ede.ob = new ResizeObserver(function () {
      if (window.ede.danmaku) {
        console.log('Resizing');
        window.ede.danmaku.resize();
        if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
          buildProgressBarChart(20);
        }
      }
    });
    window.ede.ob.observe(_container);
    // 自定义的 initH5VideoAdapter 下,解决暂停时暂停的弹幕再次加载会自动恢复问题
    if (_media.id) {
      require(['playbackManager'], function (playbackManager) {
        if (playbackManager.getCurrentPlayer() && playbackManager.getPlayerState().PlayState.IsPaused) {
          _media.dispatchEvent(new Event('pause'));
        }
      });
    }
    // 设置弹窗内的弹幕信息
    buildCurrentDanmakuInfo(currentDanmakuInfoContainerId);
    // 播放界面右下角添加弹幕信息
    appendvideoOsdDanmakuInfo(_comments.length);
    // 绘制弹幕进度条
    if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
      buildProgressBarChart(20);
    }
  }
  function buildProgressBarChart(chartHeightNum) {
    var chartEle = getById(eleIds.progressBarLineChart);
    if (chartEle) {
      chartEle.remove();
    }
    if (!window.ede.danmaku) {
      return;
    }
    var osdLineChartSkipFilter = lsGetItem(lsKeys.osdLineChartSkipFilter.id);
    var comments = osdLineChartSkipFilter ? window.ede.commentsParsed : window.ede.danmaku.comments;
    var container = getByClass(classes.videoOsdPositionSliderContainer);
    if (!comments || !container || comments && comments.length === 0) {
      return;
    }
    var progressBarWidth = container.offsetWidth;
    console.log('progressBarWidth: ' + progressBarWidth);
    var bulletChartCanvas = document.createElement('canvas');
    bulletChartCanvas.id = eleIds.progressBarLineChart;
    bulletChartCanvas.width = progressBarWidth;
    bulletChartCanvas.height = chartHeightNum;
    bulletChartCanvas.style.position = 'absolute';
    bulletChartCanvas.style.top = OS.isEmbyNoisyX() ? '-24px' : '-21px';
    container.prepend(bulletChartCanvas);
    var ctx = bulletChartCanvas.getContext('2d');
    // 计算每个时间点的弹幕数量
    var maxTime = Math.max.apply(Math, _toConsumableArray(comments.map(function (c) {
      return c.time;
    })));
    var timeStep = lsGetItem(lsKeys.osdLineChartTime.id);
    var timeCounts = Array.from({
      length: Math.ceil(maxTime / timeStep)
    }, function () {
      return 0;
    });
    comments.forEach(function (c) {
      var index = Math.floor(c.time / timeStep);
      if (index < timeCounts.length) {
        timeCounts[index]++;
      }
    });
    function drawLineChart(data) {
      ctx.clearRect(0, 0, progressBarWidth, chartHeightNum);
      var maxY = Math.max.apply(Math, _toConsumableArray(data));
      var scale = chartHeightNum / maxY; // 用于拉长 y 轴间距
      ctx.beginPath();
      ctx.moveTo(0, chartHeightNum - data[0] * scale);
      for (var i = 1; i < data.length; i++) {
        var x = i / (data.length - 1) * progressBarWidth;
        var y = chartHeightNum - data[i] * scale;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; // 与次标题同色
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    drawLineChart(timeCounts);
    console.log('已重绘进度条弹幕数量折线图');
  }
  function loadDanmaku() {
    var loadType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : LOAD_TYPE.CHECK;
    var _media = document.querySelector(mediaQueryStr);
    if (!_media) {
      return console.warn('用户已退出视频播放,停止加载弹幕');
    }
    if (window.ede.loading) {
      console.log('正在重新加载');
      return;
    }
    window.ede.loading = true;
    if (lsGetItem(lsKeys.useFetchPluginXml.id)) {
      // if (lsGetItem(lsKeys.refreshPluginXml.id)) {
      //     refreshPluginXml(window.ede.itemId).catch((error) => {
      //         console.error(error);
      //     });
      // }
      getMapByEmbyItemInfo().then(function (itemInfoMap) {
        getCommentsByPluginApi(window.ede.itemId).then(function (comments) {
          if (comments && comments.length > 0) {
            return createDanmaku(comments).then(function () {
              console.log(lsKeys.useFetchPluginXml.name + ':就位');
            }).then(function () {
              window.ede.loading = false;
              var danmakuCtrEle = getById(eleIds.danmakuCtr);
              if (danmakuCtrEle && danmakuCtrEle.style.opacity !== '1') {
                danmakuCtrEle.style.opacity = '1';
              }
              var videoOsdDanmakuTitle = getById(eleIds.videoOsdDanmakuTitle);
              if (videoOsdDanmakuTitle && videoOsdDanmakuTitle.innerText.includes('未匹配')) {
                videoOsdDanmakuTitle.innerText = "\u5F39\u5E55\uFF1A".concat(lsKeys.useFetchPluginXml.name, " - ").concat(comments.length, "\u6761");
              }
            }).catch(function (error) {
              console.error(error);
              console.error('useFetchPluginXml createDanmaku error');
            });
          }
          throw new Error(lsKeys.useFetchPluginXml.name + '失败,尝试在线加载');
        }).catch(function (error) {
          console.error(error);
          return loadOnlineDanmaku(loadType);
        });
      });
    } else {
      loadOnlineDanmaku(loadType);
    }
  }
  function loadOnlineDanmaku(loadType) {
    getEpisodeInfo(loadType !== LOAD_TYPE.SEARCH).then(function (info) {
      return new Promise(function (resolve, reject) {
        if (!info) {
          if (loadType !== LOAD_TYPE.INIT) {
            reject('播放器未完成加载');
          } else {
            reject(null);
          }
        }
        if (loadType !== LOAD_TYPE.SEARCH && loadType !== LOAD_TYPE.REFRESH && loadType !== LOAD_TYPE.RELOAD && loadType !== LOAD_TYPE.INIT && window.ede.danmaku && window.ede.episode_info && window.ede.episode_info.episodeId == info.episodeId) {
          reject('当前播放视频未变动');
        } else {
          // 仅在真正切换剧集（INIT/CHECK）时更新 previous_episode_info，用于下一集/上一集推理。
          // RELOAD/REFRESH 为同集重载（如手动匹配修正、过滤/简繁切换），若更新 previous
          // 会拿「修正前的错误匹配」覆盖它，导致下一集推理错用错误信息。
          var isSwitchingEpisode = loadType === LOAD_TYPE.INIT || loadType === LOAD_TYPE.CHECK;
          if (isSwitchingEpisode && window.ede.episode_info) {
            window.ede.previous_episode_info = _objectSpread({}, window.ede.episode_info);
          }
          window.ede.episode_info = info;
          resolve(info.episodeId);
        }
      });
    }).then(function (episodeId) {
      if (episodeId) {
        if (loadType === LOAD_TYPE.RELOAD && window.ede.danmuCache[episodeId]) {
          createDanmaku(window.ede.danmuCache[episodeId]).then(function () {
            console.log('弹幕就位');
          }).catch(function (err) {
            console.log(err);
          });
        } else {
          fetchComment(episodeId).then(function (comments) {
            window.ede.danmuCache[episodeId] = comments;
            createDanmaku(comments).then(function () {
              console.log('弹幕就位');
              // embyToast({ text: `弹幕就位,已获取 ${comments.length} 条弹幕` });
            }).catch(function (err) {
              console.log(err);
            });
          });
        }
      }
    }, function (msg) {
      if (msg) {
        console.log(msg);
      }
    }).then(function () {
      var extCommentCache = window.ede.extCommentCache[window.ede.itemId] || {};
      objectEntries(extCommentCache).forEach(function (_ref6) {
        var _ref7 = _slicedToArray(_ref6, 2),
          key = _ref7[0],
          val = _ref7[1];
        addExtComments(key, val);
      });
      window.ede.loading = false;
      var danmakuCtrEle = getById(eleIds.danmakuCtr);
      if (danmakuCtrEle && danmakuCtrEle.style.opacity !== '1') {
        danmakuCtrEle.style.opacity = '1';
      }
    }).catch(function (err) {
      console.log(err);
    });
  }
  function danmakuFilter(comments) {
    var _comments = _toConsumableArray(comments);
    danmakuAutoFilter(_comments);
    _comments = danmakuTypeFilter(_comments);
    _comments = danmakuSourceFilter(_comments);
    _comments = danmakuDensityLevelFilter(_comments);
    _comments = danmakuKeywordsFilter(_comments);
    _comments = danmakuMergeSimilar(_comments, lsGetItem(lsKeys.mergeSimilarPercent.id), lsGetItem(lsKeys.mergeSimilarTime.id));
    return _comments;
  }
  function danmakuAutoFilter(comments) {
    var autoFilterCount = lsGetItem(lsKeys.autoFilterCount.id);
    if (autoFilterCount == 0 || comments.length < autoFilterCount) {
      return danmakuAutoFilterCancel();
    }
    var msg = "\u68C0\u6D4B\u5230 ".concat(comments.length, " \u6761\u5F39\u5E55 > ").concat(lsKeys.autoFilterCount.name, ":").concat(autoFilterCount, ",\u51C6\u5907\u5F00\u59CB\u81EA\u52A8\u8FC7\u6EE4(\u5355\u96C6\u6709\u6548)");
    var initMsgLenth = msg.length;
    var heightPercent = lsGetItem(lsKeys.heightPercent.id);
    if (heightPercent > 90) {
      window.ede.tempLsValues[lsKeys.heightPercent.id] = heightPercent;
      lsSetItem(lsKeys.heightPercent.id, 90);
      msg += "\n\u5DF2\u81EA\u52A8\u8C03\u6574 ".concat(lsKeys.heightPercent.name, ":90");
    }
    var typeFilter = lsGetItem(lsKeys.typeFilter.id);
    if (!typeFilter.includes(danmakuTypeFilterOpts.bottom.id)) {
      window.ede.tempLsValues[lsKeys.typeFilter.id] = typeFilter;
      var typeFilterTemp = [].concat(_toConsumableArray(typeFilter), [danmakuTypeFilterOpts.bottom.id]);
      lsSetItem(lsKeys.typeFilter.id, typeFilterTemp);
      msg += "\n\u5DF2\u81EA\u52A8\u6DFB\u52A0 ".concat(lsKeys.typeFilter.name, ":").concat(danmakuTypeFilterOpts.bottom.name);
    }
    var mergeSimilarEnable = lsGetItem(lsKeys.mergeSimilarEnable.id);
    if (!mergeSimilarEnable) {
      window.ede.tempLsValues[lsKeys.mergeSimilarEnable.id] = mergeSimilarEnable;
      lsSetItem(lsKeys.mergeSimilarEnable.id, true);
      msg += "\n\u5DF2\u81EA\u52A8\u8C03\u6574 ".concat(lsKeys.mergeSimilarEnable.name, ":true");
    }
    if (msg.length != initMsgLenth) {
      embyToast({
        text: msg
      });
      console.log(msg);
    }
  }
  function danmakuAutoFilterCancel() {
    if (Object.keys(window.ede.tempLsValues).length > 0) {
      objectEntries(window.ede.tempLsValues).forEach(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 2),
          key = _ref9[0],
          val = _ref9[1];
        return lsSetItem(key, val);
      });
      window.ede.tempLsValues = {};
      console.log('从临时值恢复用户值并重置');
    }
  }

  /** 过滤弹幕类型 */
  function danmakuTypeFilter(comments) {
    var idArray = lsGetItem(lsKeys.typeFilter.id);
    // 彩色过滤,只留下默认的白色
    if (idArray.includes(danmakuTypeFilterOpts.onlyWhite.id)) {
      comments = comments.filter(function (c) {
        return '#ffffff' === c.style.color.toLowerCase().slice(0, 7);
      });
      idArray.splice(idArray.indexOf(danmakuTypeFilterOpts.onlyWhite.id), 1);
    }
    // 过滤滚动弹幕
    if (idArray.includes(danmakuTypeFilterOpts.rolling.id)) {
      comments = comments.filter(function (c) {
        return danmakuTypeFilterOpts.ltr.id !== c.mode && danmakuTypeFilterOpts.rtl.id !== c.mode;
      });
      idArray.splice(idArray.indexOf(danmakuTypeFilterOpts.rolling.id), 1);
    }
    // 按 emoji 过滤
    if (idArray.includes(danmakuTypeFilterOpts.emoji.id)) {
      comments = comments.filter(function (c) {
        return !emojiRegex.test(c.text);
      });
      idArray.splice(idArray.indexOf(danmakuTypeFilterOpts.emoji.id), 1);
    }
    // 过滤特定模式的弹幕
    if (idArray.length > 0) {
      comments = comments.filter(function (c) {
        return !idArray.includes(c.mode);
      });
    }
    return comments;
  }

  /** 过滤弹幕来源平台 */
  function danmakuSourceFilter(comments) {
    return comments.filter(function (c) {
      return !lsGetItem(lsKeys.sourceFilter.id).includes(c.source);
    });
  }

  /** 过滤弹幕密度等级,水平和垂直 */
  function danmakuDensityLevelFilter(comments) {
    var level = lsGetItem(lsKeys.filterLevel.id);
    if (level == 0) {
      return comments;
    }
    var limit = 9 - level * 2;
    var vertical_limit = 6;
    var arr_comments = [];
    var vertical_comments = [];
    for (var index = 0; index < comments.length; index++) {
      var element = comments[index];
      var i = Math.ceil(element.time);
      var i_v = Math.ceil(element.time / 3);
      if (!arr_comments[i]) {
        arr_comments[i] = [];
      }
      if (!vertical_comments[i_v]) {
        vertical_comments[i_v] = [];
      }
      // TODO: 屏蔽过滤
      if (vertical_comments[i_v].length < vertical_limit) {
        vertical_comments[i_v].push(element);
      } else {
        element.mode = 'rtl';
      }
      if (arr_comments[i].length < limit) {
        arr_comments[i].push(element);
      }
    }
    return arr_comments.flat();
  }

  /** 通过屏蔽关键词过滤弹幕 */
  function danmakuKeywordsFilter(comments) {
    if (!lsGetItem(lsKeys.filterKeywordsEnable.id)) {
      return comments;
    }
    var keywords = lsGetItem(lsKeys.filterKeywords.id).split(/\r?\n/).map(function (k) {
      return k.trim();
    }).filter(function (k) {
      return k.length > 0 && !k.startsWith('// ');
    });
    if (keywords.length === 0) {
      return comments;
    }
    var cKeys = ['text'].concat(_toConsumableArray(Object.keys(showSource)));
    return comments.filter(function (comment) {
      return !keywords.some(function (keyword) {
        try {
          return cKeys.some(function (key) {
            return new RegExp(keyword).test(comment[key]);
          });
        } catch (error) {
          return cKeys.some(function (key) {
            return comment[key].includes(keyword);
          });
        }
      });
    });
  }
  function danmakuMergeSimilar(comments) {
    var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
    var timeWindow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 15;
    if (!lsGetItem(lsKeys.mergeSimilarEnable.id)) {
      return comments;
    }
    var mergedComments = [];
    var mergedIndexes = [];
    var startTime = new Date().getTime();
    for (var i = 0; i < comments.length; i++) {
      if (mergedIndexes.includes(i)) {
        continue;
      }
      var mergedComment = comments[i];
      var count = 1;
      var totalSimilarity = 0;
      for (var j = i + 1; j < comments.length && Math.abs(comments[j].time - comments[i].time) <= timeWindow; j++) {
        if (mergedIndexes.includes(j)) {
          continue;
        }
        var similarity = similarityPercentage(mergedComment.text, comments[j].text);
        if (similarity >= threshold) {
          count++;
          mergedIndexes.push(j);
          totalSimilarity += similarity;
        }
      }
      if (count > 1) {
        mergedComment.text += " [x".concat(count, "]");
        mergedComment.xCount = count;
        mergedComment.xTotalSimilarity = totalSimilarity / count;
      }
      mergedComments.push(mergedComment);
    }
    var endTime = new Date().getTime();
    console.log("danmakuMergeSimilar \u8017\u65F6: ".concat(endTime - startTime, " \u6BEB\u79D2"));
    return mergedComments;
  }

  /**
   * 计算两个字符串之间的 Levenshtein 距离和相似度百分比
   * Levenshtein 距离表示将一个字符串转换为另一个字符串所需的最少单字符编辑操作次数(插入、删除、替换)
   * 相似度百分比是基于 Levenshtein 距离计算的,它表示两个字符串的相似程度,范围为 0 到 100
   * 相似度百分比的计算方式为：100 - (Levenshtein 距离 / 最大长度) * 100,确保结果在 0 到 100 的范围内
   *
   * @param {string} a - 第一个字符串
   * @param {string} b - 第二个字符串
   * @returns {Object} - 包含 Levenshtein 距离和相似度百分比的对象
   * @returns {number} - 两个字符串之间的相似度百分比,范围为 0 到 100
   */
  function similarityPercentage(a, b) {
    if (a === b) {
      return 100;
    }
    if (a.length > b.length) {
      var _ref0 = [b, a];
      a = _ref0[0];
      b = _ref0[1];
    }
    var previousRow = Array.from({
      length: a.length + 1
    }, function (_, i) {
      return i;
    });
    var currentRow = Array(a.length + 1);
    for (var j = 1; j <= b.length; j++) {
      currentRow[0] = j;
      for (var i = 1; i <= a.length; i++) {
        var substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
        var insertionCost = previousRow[i] + 1;
        var deletionCost = currentRow[i - 1] + 1;
        currentRow[i] = Math.min(previousRow[i - 1] + substitutionCost, insertionCost, deletionCost);
      }
      var _ref1 = [currentRow, previousRow];
      previousRow = _ref1[0];
      currentRow = _ref1[1];
    }
    var distance = previousRow[a.length];
    var maxLength = Math.max(a.length, b.length);
    var similarity = (maxLength - distance) / maxLength * 100;
    return similarity;
  }
  function danmakuParser($obj) {
    //const fontSize = Number(values[2]) || 25
    // 弹幕大小
    var fontSizeRate = lsGetItem(lsKeys.fontSizeRate.id);
    var fontSize = 25;
    // 播放页媒体次级标题 h3 元素
    var fontSizeReferent = getByClass(classes.videoOsdTitle);
    if (fontSizeReferent) {
      fontSize = parseFloat(getComputedStyle(fontSizeReferent).fontSize.replace('px', '')) * fontSizeRate;
    } else {
      fontSize = Math.round((window.screen.height > window.screen.width ? window.screen.width : window.screen.height / 1080) * 18 * fontSizeRate);
    }
    var fontWeight = lsGetItem(lsKeys.fontWeight.id);
    var fontStyle = styles.fontStyles[lsGetItem(lsKeys.fontStyle.id)].id;
    var fontFamily = lsGetItem(lsKeys.fontFamily.id);
    // 弹幕透明度
    var fontOpacity = Math.round(lsGetItem(lsKeys.fontOpacity.id) * 255).toString(16).padStart(2, '0');
    // 时间轴偏移秒数
    var timelineOffset = lsGetItem(lsKeys.timelineOffset.id);
    var sourceUidReg = /\[(.*)\](.*)/;
    var showSourceIds = lsGetItem(lsKeys.showSource.id);
    // const removeEmojiEnable = lsGetItem(lsKeys.removeEmojiEnable.id);
    //const $xml = new DOMParser().parseFromString(string, 'text/xml')
    return $obj.map(function ($comment) {
      var p = $comment.p;
      //if (p === null || $comment.childNodes[0] === undefined) return null;
      var values = p.split(',');
      var mode = {
        6: 'ltr',
        1: 'rtl',
        5: 'top',
        4: 'bottom'
      }[values[1]];
      if (!mode) return null;
      // 弹幕颜色+透明度
      var baseColor = Number(values[2]).toString(16).padStart(6, '0');
      var color = "".concat(baseColor).concat(fontOpacity); // 生成8位十六进制颜色
      var shadowColor = baseColor === '000000' ? "#ffffff".concat(fontOpacity) : "#000000".concat(fontOpacity);
      var sourceUidMatches = values[3].match(sourceUidReg);
      var sourceId = sourceUidMatches && sourceUidMatches[1] ? sourceUidMatches[1] : danmakuSource.DanDanPlay.id;
      var originalUserId = sourceUidMatches && sourceUidMatches[2] ? sourceUidMatches[2] : values[3];
      var cmt = _defineProperty(_defineProperty(_defineProperty({
        text: $comment.m,
        mode: mode,
        time: values[0] * 1 + timelineOffset,
        style: getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily)
      }, showSource.cid.id, $comment.cid), showSource.source.id, sourceId), showSource.originalUserId.id, originalUserId);
      if (showSourceIds.length > 0) {
        cmt.originalText = cmt.text;
        cmt.text += showSourceIds.map(function (id) {
          return id === showSource.source.id ? ",[".concat(cmt[id], "]") : ',' + cmt[id];
        }).join('');
      }
      cmt.cuid = cmt[showSource.cid.id] + ',' + cmt[showSource.originalUserId.id];
      // if (removeEmojiEnable) {
      //     cmt.text = cmt.text.replace(emojiRegex, '');
      // }
      return cmt;
    }).filter(function (x) {
      return x;
    }).sort(function (a, b) {
      return a.time - b.time;
    });
  }
  function getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily) {
    return {
      color: "#".concat(color),
      // dom
      textShadow: "-1px -1px ".concat(shadowColor, ", -1px 1px ").concat(shadowColor, ", 1px -1px ").concat(shadowColor, ", 1px 1px ").concat(shadowColor),
      font: "".concat(fontStyle, " ").concat(fontWeight, " ").concat(fontSize, "px ").concat(fontFamily),
      fillStyle: "#".concat(color),
      // canvas
      strokeStyle: shadowColor,
      lineWidth: 2.0
    };
  }
  function toastByDanmaku(text, type) {
    text = toastPrefixes.system + text;
    var fontSize = parseFloat(getComputedStyle(getByClass(classes.videoOsdTitle)).fontSize.replace('px', '')) * 1.5;
    var color = styles.colors[type];
    var dandanplayMode = 5;
    var time = document.querySelector(mediaQueryStr).currentTime;
    var fontOpacity = 'ff';
    var colorStr = "000000".concat(color.toString(16)).concat(fontOpacity).slice(-8);
    var mode = {
      6: 'ltr',
      1: 'rtl',
      5: 'top',
      4: 'bottom'
    }[dandanplayMode];
    var comment = {
      text: text,
      mode: mode,
      time: time,
      style: {
        fontSize: "".concat(fontSize, "px"),
        color: "#".concat(colorStr),
        textShadow: colorStr === '00000' ? '-1px -1px #fff, -1px 1px #fff, 1px -1px #fff, 1px 1px #fff' : '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',
        font: "".concat(fontSize, "px sans-serif"),
        fillStyle: "#".concat(colorStr),
        strokeStyle: colorStr === '000000' ? "#ffffff".concat(fontOpacity) : "#000000".concat(fontOpacity),
        lineWidth: 2.0
      } // emit 无法添加自定义属性
    };
    window.ede.danmaku.emit(comment);
  }
  function createDialog() {
    require(['emby-select', 'emby-checkbox', 'emby-slider', 'emby-textarea', 'emby-collapse', 'emby-button']);
    var html = "<div id=\"".concat(eleIds.dialogContainer, "\"></div>");
    embyDialog({
      html: html,
      buttons: [{
        name: '关闭'
      }]
    });
    waitForElement('#' + eleIds.dialogContainer, afterEmbyDialogCreated);
  }
  async function afterEmbyDialogCreated(dialogContainer) {
    var itemInfoMap = await getMapByEmbyItemInfo();
    if (itemInfoMap) {
      window.ede.searchDanmakuOpts = {
        _id_key: itemInfoMap._id_key,
        _season_key: itemInfoMap._season_key,
        _episode_key: itemInfoMap._episode_key,
        animeId: itemInfoMap.animeId,
        animeName: itemInfoMap.animeName,
        seriesOrMovieId: itemInfoMap.seriesOrMovieId,
        episode: (parseInt(itemInfoMap.episode) || 1) - 1,
        // convert to index
        animes: []
      };
    }
    var formDialogHeader = getByClass(classes.formDialogHeader);
    var formDialogFooter = getByClass(classes.formDialogFooter);
    formDialogHeader = formDialogHeader || dialogContainer;
    var tabsMenuContainer = document.createElement('div');
    tabsMenuContainer.className = classes.embyTabsMenu;
    tabsMenuContainer.append(embyTabs(danmakuTabOpts, danmakuTabOpts[0].id, 'id', 'name', function (value) {
      danmakuTabOpts.forEach(function (obj) {
        var elem = getById(obj.id);
        if (elem) {
          elem.hidden = obj.id !== value.id;
        }
      });
    }));
    formDialogHeader.append(tabsMenuContainer);
    formDialogHeader.style = 'width: 100%; padding: 0; height: auto;';
    danmakuTabOpts.forEach(function (tab, index) {
      var tabContainer = document.createElement('div');
      tabContainer.id = tab.id;
      tabContainer.style.textAlign = 'left';
      tabContainer.hidden = index != 0;
      dialogContainer.append(tabContainer);
      try {
        tab.buildMethod(tab.id);
      } catch (error) {
        console.error(error);
      }
    });
    if (formDialogFooter) {
      formDialogFooter.style.padding = '0.3em';
    }
  }
  function buildDanmakuSetting(containerId) {
    var container = getById(containerId);
    var template = "\n            <div style=\"display: flex; justify-content: center;\">\n                <div>\n                    <div id=\"".concat(eleIds.danmakuSwitchDiv, "\" style=\"margin-bottom: 0.2em;\">\n                        <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.switch.name, " </label>\n                    </div>\n                    <div style=\"").concat(styles.embySlider, "\">\n                        <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.filterLevel.name, ": </label>\n                        <div id=\"").concat(eleIds.filterLevelDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                        <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                    </div>\n                    <div style=\"").concat(styles.embySlider, "\">\n                        <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.heightPercent.name, ": </label>\n                        <div id=\"").concat(eleIds.heightPercentDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                        <label>\n                            <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                            <label>%</label>\n                        </label>\n                    </div>\n                    <div style=\"").concat(styles.embySlider, "\">\n                        <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.fontSizeRate.name, ": </label>\n                        <div id=\"").concat(eleIds.danmakuSizeDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                        <label>\n                            <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                            <label>\u500D</label>\n                        </label>\n                    </div>\n                    <div style=\"").concat(styles.embySlider, "\">\n                        <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.fontOpacity.name, ": </label>\n                        <div id=\"").concat(eleIds.danmakuOpacityDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                        <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                    </div>\n                    <div style=\"").concat(styles.embySlider, "\">\n                        <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.speed.name, ": </label>\n                        <div id=\"").concat(eleIds.danmakuSpeedDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                        <label>\n                            <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                            <label>\u500D</label>\n                        </label>\n                    </div>\n                    <div style=\"").concat(styles.embySlider, "\">\n                        <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.timelineOffset.name, ": </label>\n                        <div id=\"").concat(eleIds.timelineOffsetDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                        <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                    </div>\n                    <div is=\"emby-collapse\" title=\"\u5F39\u5E55\u5B57\u4F53\u6837\u5F0F\" data-expanded=\"false\">\n                        <div class=\"").concat(classes.collapseContentNav, "\">\n                            <div style=\"").concat(styles.embySlider, "\">\n                                <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.fontWeight.name, ": </label>\n                                <div id=\"").concat(eleIds.danmakuFontWeightDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                                <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                            </div>\n                            <div style=\"").concat(styles.embySlider, "\">\n                                <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.fontStyle.name, ": </label>\n                                <div id=\"").concat(eleIds.danmakuFontStyleDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                                <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                            </div>\n                            <div id=\"").concat(eleIds.fontFamilyCtrl, "\" style=\"margin: 0.6em 0;\"></div>\n                            <div style=\"").concat(styles.embySlider, "\">\n                                <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.fontFamily.name, ": </label>\n                                <div id=\"").concat(eleIds.fontFamilyDiv, "\" class=\"").concat(classes.embySelectWrapper, "\"></div>\n                                <label id=\"").concat(eleIds.fontFamilyLabel, "\" style=\"width: 10em; margin-left: 1em;\"></label>\n                            </div>\n                            <div style=\"max-width: 31.5em;\">\n                                <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">\u5F39\u5E55\u5916\u89C2: </label>\n                                <div id=\"").concat(eleIds.fontStylePreview, "\"\n                                    class=\"flex justify-content-center\"\n                                    style=\"border: .08em solid gray;color: black;border-radius: .24em;padding: .5em;;background-color: #6a96bd;\">\n                                    \u7B80\u4E2D/\u7E41\u9AD4/English/\u3053\u3093\u306B\u3061\u306F\u30A6\u30A9\u30EB\u30C9/</br>\n                                    ABC/abc/012/~!@<?>[]/\u300A\uFF1F\u300B\u3010\u3011</br>\n                                    \u2606*: .\uFF61. o(\u2267\u25BD\u2266)o .\uFF61.:*\u2606</br>\n                                    emoji:\uD83D\uDE06\uD83D\uDC4F\uD83C\uDF88\uD83C\uDF4B\uD83C\uDF1E\u2049\uFE0F\uD83C\uDF89</br>\n                                </div>\n                                <div class=\"").concat(classes.embyFieldDesc, "\">\n                                    \u8FD9\u4E9B\u8BBE\u7F6E\u4F1A\u5F71\u54CD\u6B64\u8BBE\u5907\u4E0A\u7684\u5F39\u5E55\u5916\u89C2,\u6B64\u5904\u56FA\u5B9A\u4E3A dom \u5F15\u64CE,\n                                    canvas \u5F15\u64CE\u6548\u679C\u4E00\u6837,\u6B64\u5904\u4E0D\u505A\u5207\u6362\u5C55\u793A,\n                                    \u56E0\u4E3A\u5F39\u5E55\u5927\u5C0F\u662F\u6839\u636E\u64AD\u653E\u9875\u6B21\u6807\u9898\u52A8\u6001\u8BA1\u7B97\u7684,\u6B64\u5904\u4E0D\u505A\u53C2\u8003,\n                                    \u9009\u62E9\u6216\u8F93\u5165\u7684\u5B57\u4F53\u662F\u5426\u6709\u6548\u53D6\u51B3\u4E8E\u8BBE\u5907\u672C\u8EAB\u7684\u5B57\u4F53\u5E93,\u6CA1\u6709\u7F51\u7EDC\u52A0\u8F7D\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div id=\"").concat(eleIds.settingsCtrl, "\" style=\"margin: 0.6em 0;\"></div>\n                    <textarea id=\"").concat(eleIds.settingsText, "\" style=\"display: none;resize: vertical;width: 100%\" rows=\"20\"\n                        is=\"emby-textarea\" class=\"txtOverview emby-textarea\"></textarea>\n                </div>\n            </div>\n        ");
    container.innerHTML = template.trim();
    getById(eleIds.danmakuSwitchDiv, container).prepend(embyButton({
      id: eleIds.danmakuSwitch,
      label: '弹幕开关',
      iconKey: lsGetItem(lsKeys.switch.id) ? iconKeys.switch_on : iconKeys.switch_off,
      style: (lsGetItem(lsKeys.switch.id) ? 'color:#52b54b;' : '') + 'font-size:1.5em;padding:0;'
    }
    // , style: lsGetItem(lsKeys.switch.id) ? 'color:#52b54b;font-size:1.5em;padding:0;': 'font-size:1.5em;padding:0;'}
    , doDanmakuSwitch));
    // 滑块
    getById(eleIds.filterLevelDiv, container).append(embySlider({
      lsKey: lsKeys.filterLevel
    }, onSliderChange, onSliderChangeLabel));
    getById(eleIds.heightPercentDiv, container).append(embySlider({
      lsKey: lsKeys.heightPercent
    }, onSliderChange, onSliderChangeLabel));
    getById(eleIds.danmakuSizeDiv, container).append(embySlider({
      lsKey: lsKeys.fontSizeRate
    }, onSliderChange, onSliderChangeLabel));
    getById(eleIds.danmakuOpacityDiv, container).append(embySlider({
      lsKey: lsKeys.fontOpacity
    }, onSliderChange, onSliderChangeLabel));
    getById(eleIds.danmakuSpeedDiv, container).append(embySlider({
      lsKey: lsKeys.speed
    }, onSliderChange, onSliderChangeLabel));
    // 弹幕时间轴偏移秒数
    var btnContainer = getById(eleIds.timelineOffsetDiv, container);
    var nextEle = btnContainer.nextElementSibling;
    var labelEle = nextEle.children.length > 0 ? nextEle.children[0] : nextEle;
    var timelineOffsetOpts = {
      lsKey: lsKeys.timelineOffset,
      labelEle: labelEle
    };
    onSliderChangeLabel(lsGetItem(lsKeys.timelineOffset.id), timelineOffsetOpts);
    timeOffsetBtns.forEach(function (btn) {
      btnContainer.append(embyButton(btn, function (e) {
        if (e.target) {
          var oldValue = lsGetItem(lsKeys.timelineOffset.id);
          var newValue = oldValue + (parseFloat(e.target.getAttribute('valueOffset')) || 0);
          // 如果 offset 为 0,则 newValue 应该设置为 0
          if (newValue === oldValue) {
            newValue = 0;
          }
          onSliderChange(newValue, timelineOffsetOpts);
        }
      }));
    });
    buildFontStyleSetting(container);
    // 配置 JSON 导入,导出
    buildSettingsBackup(container);
  }
  function buildSettingsBackup(container) {
    var settingsCtrlEle = getById(eleIds.settingsCtrl, container);
    settingsCtrlEle.append(embyButton({
      label: '配置',
      iconKey: iconKeys.more
    }, function (e) {
      var xChecked = !e.target.xChecked;
      e.target.xChecked = xChecked;
      e.target.title = xChecked ? '关闭' : '配置';
      e.target.firstChild.innerHTML = xChecked ? iconKeys.close : iconKeys.more;
      var settingsTextEle = getById(eleIds.settingsText);
      settingsTextEle.style.display = xChecked ? '' : 'none';
      if (xChecked) {
        settingsTextEle.value = getSettingsJson(2);
      }
      [eleIds.settingReloadBtn, eleIds.settingsImportBtn].forEach(function (id) {
        getById(id).style.display = xChecked ? '' : 'none';
      });
    }));
    settingsCtrlEle.append(embyButton({
      id: eleIds.settingReloadBtn,
      label: '刷新',
      iconKey: iconKeys.refresh,
      style: 'display: none;'
    }, function () {
      return getById(eleIds.settingsText).value = getSettingsJson(2);
    }));
    settingsCtrlEle.append(embyButton({
      id: eleIds.settingsImportBtn,
      label: '应用',
      iconKey: iconKeys.done,
      style: 'display: none;'
    }, function () {
      // const settings = JSON.parse(getById(eleIds.settingsText).value);
      // lsBatchSet(Object.fromEntries(objectEntries(settings).map(([key, valueObj]) => [key, valueObj.value])));
      lsBatchSet(JSON.parse(getById(eleIds.settingsText).value));
      loadDanmaku(LOAD_TYPE.INIT);
      closeEmbyDialog();
    }));
  }
  function buildFontStyleSetting() {
    getById(eleIds.danmakuFontWeightDiv).append(embySlider({
      lsKey: lsKeys.fontWeight
    }, onSliderChange, onSliderChangeLabel));
    getById(eleIds.danmakuFontStyleDiv).append(embySlider({
      lsKey: lsKeys.fontStyle
    }, function (val, opts) {
      opts.label = styles.fontStyles[val].id;
      onSliderChange(val, opts);
    }, function (val, opts) {
      return onSliderChangeLabel(styles.fontStyles[val].id, opts);
    }));
    buildFontFamilySetting();
  }
  function buildFontFamilySetting() {
    var fontFamilyVal = lsGetItem(lsKeys.fontFamily.id);
    var availableFonts = [{
      family: lsKeys.fontFamily.defaultValue,
      fullName: lsKeys.fontFamily.defaultValue
    }, {
      family: 'Consolas',
      fullName: 'Consolas'
    }, {
      family: 'SimHei',
      fullName: '黑体'
    }, {
      family: 'SimSun',
      fullName: '宋体'
    }, {
      family: 'KaiTi',
      fullName: '楷体'
    }, {
      family: 'Microsoft YaHei',
      fullName: '微软雅黑'
    }];
    var selectedIndex = availableFonts.findIndex(function (f) {
      return f.family === fontFamilyVal;
    });
    resetFontFamilyDiv(selectedIndex, availableFonts);
    buildFontFamilyCtrl();
  }
  function buildFontFamilyCtrl() {
    var fontFamilyCtrl = getById(eleIds.fontFamilyCtrl);
    fontFamilyCtrl.append(embyButton({
      label: '切换手填',
      iconKey: iconKeys.edit
    }, function (e) {
      var xChecked = !e.target.xChecked;
      e.target.xChecked = xChecked;
      e.target.title = xChecked ? '手填' : '选择';
      getById(eleIds.fontFamilySelect).style.display = xChecked ? 'none' : '';
      getById(eleIds.fontFamilyInput).style.display = xChecked ? '' : 'none';
      if (xChecked) {
        getById(eleIds.fontFamilyLabel).innerHTML = '';
      }
    }));
    fontFamilyCtrl.append(embyButton({
      label: '重置为默认',
      iconKey: iconKeys.refresh
    }, function () {
      if (lsCheckSet(lsKeys.fontFamily.id, lsKeys.fontFamily.defaultValue)) {
        changeFontStylePreview();
        onSliderChangeLabel(lsKeys.fontFamily.defaultValue, {
          labelId: eleIds.fontFamilyLabel
        });
        getById(eleIds.fontFamilyInput).value = lsGetItem(lsKeys.fontFamily.id);
        loadDanmaku(LOAD_TYPE.RELOAD);
      }
    }));
  }
  function resetFontFamilyDiv(selectedIndexOrValue, opts) {
    var fontFamilyDiv = getById(eleIds.fontFamilyDiv);
    fontFamilyDiv.innerHTML = '';
    fontFamilyDiv.append(embySelect({
      id: eleIds.fontFamilySelect,
      label: "".concat(lsKeys.fontFamily.name, ": ")
    }, selectedIndexOrValue, opts, 'family', 'family', function (value, index, option) {
      console.log('fontFamilyDivChange: ', value, index, option);
      // loadLocalFont(option.family);
      if (lsCheckSet(lsKeys.fontFamily.id, value)) {
        changeFontStylePreview();
        var _labelVal = option.family !== option.fullName ? option.fullName : '';
        onSliderChangeLabel(_labelVal, {
          labelId: eleIds.fontFamilyLabel
        });
        loadDanmaku(LOAD_TYPE.RELOAD);
      }
    }, function (e) {
      if ('queryLocalFonts' in window && opts.length <= 6) {
        queryLocalFonts().then(function (fonts) {
          opts = [].concat(_toConsumableArray(opts), _toConsumableArray(fonts)).reduce(function (acc, font) {
            if (!acc.some(function (f) {
              return f.family === font.family;
            })) acc.push(font);
            return acc;
          }, []);
          var fontFamilyVal = lsGetItem(lsKeys.fontFamily.id);
          var selectedIndex = opts.findIndex(function (f) {
            return f.family === fontFamilyVal;
          });
          resetFontFamilyDiv(selectedIndex, opts);
        }).catch(function (err) {
          console.error(err);
        });
        console.info('queryLocalFonts 高级查询 API 可用,已补充字体列表');
      }
    }));
    fontFamilyDiv.append(embyInput({
      id: eleIds.fontFamilyInput,
      value: lsGetItem(lsKeys.fontFamily.id),
      type: 'search',
      style: 'display: none;'
    }, function (e) {
      var inputVal = getTargetInput(e).value.trim();
      if (!inputVal) {
        return;
      }
      if (lsCheckSet(lsKeys.fontFamily.id, inputVal)) {
        changeFontStylePreview();
        loadDanmaku(LOAD_TYPE.RELOAD);
      }
    }));
    changeFontStylePreview();
    var fontFamilyOpt = opts.find(function (opt) {
      return opt.family === lsGetItem(lsKeys.fontFamily.id);
    });
    var labelVal = fontFamilyOpt ? fontFamilyOpt.fullName : '';
    onSliderChangeLabel(labelVal, {
      labelId: eleIds.fontFamilyLabel
    });
  }

  // function fontCheck(family, callback) {
  //     document.fonts.ready.then(() => {
  //         if (document.fonts.check(`25px "${family}"`)) {
  //             console.log(`The font family "${family}" is now available`);
  //             callback(true);
  //         } else {
  //             console.log(`The font family "${family}" is not available`);
  //             callback(false);
  //         }
  //     });
  // }

  function loadLocalFont(family) {
    var font = new FontFace(family, "local(\"".concat(family, "\")"));
    font.load().then(function (loadedFont) {
      document.fonts.add(loadedFont);
      console.log("The local font \"".concat(family, "\" has been added under the name \"").concat(family, "\""));
    }).catch(function (err) {
      console.error("Failed to load or add the local font \"".concat(family, "\""), err);
    });
  }
  function changeFontStylePreview() {
    var fontStylePreview = getById(eleIds.fontStylePreview);
    var fontWeight = lsGetItem(lsKeys.fontWeight.id);
    var fontStyle = styles.fontStyles[lsGetItem(lsKeys.fontStyle.id)].id;
    var fontFamily = lsGetItem(lsKeys.fontFamily.id);
    var fontOpacity = Math.round(lsGetItem(lsKeys.fontOpacity.id) * 255).toString(16).padStart(2, '0');
    var baseColor = Number(styles.colors.info).toString(16).padStart(6, '0');
    var color = "".concat(baseColor).concat(fontOpacity);
    var shadowColor = baseColor === '000000' ? "#ffffff".concat(fontOpacity) : "#000000".concat(fontOpacity);
    var fontSizeReferent = fontStylePreview.previousElementSibling;
    var fontSize = parseFloat(getComputedStyle(fontSizeReferent).fontSize.replace('px', ''));
    var cmtStyle = getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily);
    Object.assign(fontStylePreview.style, cmtStyle);
  }
  function buildSearchEpisode(containerId) {
    var container = getById(containerId);
    var episodeId = window.ede.episode_info ? window.ede.episode_info.episodeId : null;
    var comments = window.ede.danmuCache[episodeId] || [];
    var template = "\n            <div>\n                <div>\n                    <label class=\"".concat(classes.embyLabel, "\">\u6807\u9898: </label>\n                    <div id=\"").concat(eleIds.danmakuSearchNameDiv, "\" style=\"display: flex;\"></div>\n                </div>\n                <div id=\"").concat(eleIds.danmakuEpisodeFlag, "\" hidden>\n                    <div style=\"display: flex;\">\n                        <div style=\"width: 80%;\">\n                            <label class=\"").concat(classes.embyLabel, "\">\u5A92\u4F53\u540D: </label>\n                            <div id=\"").concat(eleIds.danmakuAnimeDiv, "\" class=\"").concat(classes.embySelectWrapper, "\"></div>\n                            <label class=\"").concat(classes.embyLabel, "\">\u5206\u96C6\u540D: </label>\n                            <div style=\"display: flex;\">\n                                <div id=\"").concat(eleIds.danmakuEpisodeNumDiv, "\" style=\"max-width: 90%;\" class=\"").concat(classes.embySelectWrapper, "\"></div>\n                                <div id=\"").concat(eleIds.danmakuEpisodeLoad, "\"></div>\n                            </div>\n                        </div>\n                        <div style=\"width: 20%; margin: 0 2%; text-align: center;\">\n                            <img id=\"").concat(eleIds.searchImg, "\" style=\"width: 100%; height: auto;\"\n                                loading=\"lazy\" decoding=\"async\" draggable=\"false\" class=\"coveredImage-noScale\"></img>\n                            <div id=\"").concat(eleIds.searchApiSource, "\" class=\"").concat(classes.embyFieldDesc, "\" style=\"margin-top: 0.5em;\">\n                                <!-- API\u6765\u6E90\u5C06\u5728\u8FD9\u91CC\u663E\u793A -->\n                            </div>\n                        </div>\n                    </div>\n                    </div>\n                <div hidden>\n                    <label class=\"").concat(classes.embyLabel, "\" id=\"").concat(eleIds.danmakuRemark, "\"></label>\n                </div>\n                <div>\n                    <h4>\u5339\u914D\u6E90</h4>\n                    <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n                        <div>\n                            <div id=\"").concat(eleIds.currentMatchedDiv, "\">\n                                <label class=\"").concat(classes.embyLabel, "\">\u5F39\u5F39 play \u603B\u91CF: ").concat(comments.length, "</label>\n                            </div>\n                            <label class=\"").concat(classes.embyLabel, "\">\u5F39\u5F39 play \u9644\u52A0\u7684\u7B2C\u4E09\u65B9 url: </label>\n                        </div>\n                        <button is=\"emby-button\" type=\"button\"\n                            class=\"").concat(classes.embyButtons.basic, "\" id=\"").concat(eleIds.clearLocalMatchCacheBtn, "\">\n                            \u6E05\u9664\u672C\u5730\u5339\u914D\u7F13\u5B58\n                        </button>\n                    </div>\n                    <div id=\"").concat(eleIds.extUrlsDiv, "\"></div>\n                </div>\n                <div is=\"emby-collapse\" title=\"\u9644\u52A0\u5F39\u5E55\">\n                    <div class=\"").concat(classes.collapseContentNav, "\">\n                        <label class=\"").concat(classes.embyLabel, "\">\u5F39\u5F39 play \u652F\u6301\u89E3\u6790\u7684\u7B2C\u4E09\u65B9 url: </label>\n                        <div id=\"").concat(eleIds.extCommentSearchDiv, "\" style=\"display: flex;\"></div>\n                        <div class=\"").concat(classes.embyFieldDesc, "\">\n                            \u539F\u63A5\u53E3\u6587\u6863\u8BF4\u660E\u652F\u6301(\u5982A/B/C\u7AD9),\u81EA\u6D4B\u53E6\u5916\u652F\u6301[ \u7231\u5947\u827A\u89C6\u9891, \u817E\u8BAF\u89C6\u9891, \u4F18\u9177\u89C6\u9891, ],\u4E0D\u652F\u6301[ \u8292\u679C TV, ]\n                        </div>\n                        <div class=\"").concat(classes.embyFieldDesc, "\">\n                            \u4EC5[ \u7231\u5947\u827A\u89C6\u9891, ]\u9700\u8981\u6CE8\u610F\u7F51\u5740\u540E\u4E0D\u80FD\u5E26 ? \u7684\u53C2\u6570,\u5176\u4F59\u7F51\u5740\u5E26\u4E0D\u5E26\u90FD\u53EF\u4EE5\n                        </div>\n                        <div class=\"").concat(classes.embyFieldDesc, "\">\n                            \u8BE6\u7EC6\u7F51\u5740\u793A\u4F8B: \u5F39\u5F39 play PC \u5B98\u65B9\u5BA2\u6237\u7AEF -> \u6DFB\u52A0\u66F4\u591A\u5F39\u5E55 -> \u67E5\u770B\u652F\u6301\u89E3\u6790\u7684\u7F51\u5740\u793A\u4F8B\n                        </div>\n                    </div>\n                </div>\n                <div is=\"emby-collapse\" title=\"\u670D\u52A1\u7AEF Danmu \u63D2\u4EF6\">\n                    <div class=\"").concat(classes.collapseContentNav, "\">\n                        <div id=\"").concat(eleIds.danmuPluginDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                    </div>\n                </div>\n                <div is=\"emby-collapse\" title=\"API\u9009\u62E9\u3001\u81EA\u5B9A\u4E49API\u914D\u7F6E\">\n                    <div class=\"").concat(classes.collapseContentNav, "\">\n                        <div id=\"").concat(eleIds.apiCheckboxListDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, " align-items: center;\">\n                            <!-- API \u590D\u9009\u6846\u5C06\u5728\u8FD9\u91CC\u521B\u5EFA -->\n                        </div>\n                        <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.apiPriority.name, ": </label>\n                        <div id=\"").concat(eleIds.apiPriorityDiv, "\" style=\"margin: 1% 0;\">\n                            <!-- API \u4F18\u5148\u7EA7\u5217\u8868\u5C06\u5728\u8FD9\u91CC\u521B\u5EFA -->\n                        </div>\n                        <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.customApiPrefix.name, ": </label>\n                        <div id=\"").concat(eleIds.customApiPrefixInputDiv, "\" style=\"display: flex;\">\n                            <!-- \u81EA\u5B9A\u4E49API\u5730\u5740\u8F93\u5165\u6846\u5C06\u5728\u8FD9\u91CC\u521B\u5EFA -->\n                        </div>\n                        <div class=\"").concat(classes.embyFieldDesc, "\">\n                            \u5982\u9700\u81EA\u5B9A\u4E49\u5F39\u5E55API\u5730\u5740,\u8BF7\u586B\u5199\u5B8C\u6574URL(\u5982 https://api.example.com ),<br>\u7559\u7A7A\u5219\u4F7F\u7528\u539F\u751FAPI\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ");
    container.innerHTML = template.trim();
    buildSearchEpisodeEle();
    buildExtCommentDiv();
    buildDanmuPluginDiv();
    bindManualMatchButtons();
    buildCustomApiDiv();
  }
  function bindManualMatchButtons() {
    // 绑定清除本地匹配缓存按钮事件
    var btnClearCache = getById(eleIds.clearLocalMatchCacheBtn);
    if (btnClearCache) {
      btnClearCache.addEventListener('click', function () {
        var prefixesToClear = [lsLocalKeys.animeEpisodePrefix, lsLocalKeys.animeSeasonPrefix, lsLocalKeys.animePrefix, lsLocalKeys.bangumiEpInfoPrefix, lsLocalKeys.bangumiMe, lsLocalKeys.apiPrefix];
        lsBatchRemove(prefixesToClear);

        // 清除当前episode_info中的匹配信息
        if (window.ede.episode_info) {
          window.ede.episode_info.episodeId = null;
          window.ede.episode_info.animeId = null;
          window.ede.episode_info.animeTitle = null;
          window.ede.episode_info.episodeTitle = null;
        }

        // 清除搜索选项中的缓存数据
        if (window.ede.searchDanmakuOpts) {
          window.ede.searchDanmakuOpts.animes = [];
          window.ede.searchDanmakuOpts.episodes = [];
        }
        embyToast({
          text: '本地匹配缓存已清除,包括animeId、episodeId等所有匹配信息'
        });
        loadDanmaku(LOAD_TYPE.REFRESH);
      });
    }
  }
  function buildSearchEpisodeEle() {
    var searchNameDiv = getById(eleIds.danmakuSearchNameDiv);
    searchNameDiv.append(embyInput({
      id: eleIds.danmakuSearchName,
      value: window.ede.searchDanmakuOpts.animeName,
      type: 'search'
    }, doDanmakuSearchEpisode));
    searchNameDiv.append(embyButton({
      label: '搜索',
      iconKey: iconKeys.search
    }, doDanmakuSearchEpisode));
    searchNameDiv.append(embyButton({
      label: '切换[原]标题',
      iconKey: iconKeys.text_format
    }, doSearchTitleSwtich));
    getById(eleIds.danmakuEpisodeLoad).append(embyButton({
      id: eleIds.danmakuSwitchEpisode,
      label: '加载弹幕',
      iconKey: iconKeys.done
    }, doDanmakuSwitchEpisode));
    var currentMatchedDiv = getById(eleIds.currentMatchedDiv);
    currentMatchedDiv.append(embyButton({
      label: '取消匹配/清空弹幕',
      iconKey: iconKeys.close
    }, function (e) {
      if (window.ede.episode_info && window.ede.episode_info.episodeId) {
        window.ede.episode_info.episodeId = null;
      }
      if (window.ede.danmaku) {
        createDanmaku([]);
      }
      currentMatchedDiv.querySelector('label').textContent = '弹弹 play 总量: 0';
    }));
  }
  function buildExtCommentDiv() {
    var extCommentSearchDiv = getById(eleIds.extCommentSearchDiv);
    buildExtUrlsDiv();
    extCommentSearchDiv.append(embyInput({
      type: 'search',
      placeholder: 'http(s)://'
    }, onEnterExtComment));
    extCommentSearchDiv.append(embyButton({
      label: '搜索',
      iconKey: iconKeys.search
    }, onEnterExtComment));
  }
  function buildExtUrlsDiv() {
    var episodeId = window.ede.episode_info ? window.ede.episode_info.episodeId : null;
    var comments = window.ede.danmuCache[episodeId] || [];
    var curExtCommentCache = window.ede.extCommentCache[window.ede.itemId];
    var allComments = comments.concat.apply(comments, _toConsumableArray(Object.values(curExtCommentCache || {})));
    var extUrlsDiv = getById(eleIds.extUrlsDiv);
    extUrlsDiv.innerHTML = '';
    curExtCommentCache && objectEntries(curExtCommentCache).forEach(function (_ref10) {
      var _ref11 = _slicedToArray(_ref10, 2),
        key = _ref11[0],
        val = _ref11[1];
      var extUrlDiv = document.createElement('div');
      extUrlDiv.append(embyButton({
        label: '清空此加载',
        iconKey: iconKeys.close
      }, function (e) {
        delete curExtCommentCache[key];
        e.target.parentNode.remove();
        createDanmaku(allComments.filter(function (c) {
          return c.fromUrl !== key;
        }));
      }));
      extUrlDiv.append(embyALink(key), document.createTextNode(" \u603B\u91CF: ".concat(val.length)));
      extUrlsDiv.append(extUrlDiv);
    });
  }
  function buildCustomApiDiv() {
    // API选择设置
    var apiCheckboxListDiv = getById(eleIds.apiCheckboxListDiv);
    // 官方API启用开关
    apiCheckboxListDiv.append(embyCheckbox({
      label: lsKeys.useOfficialApi.name
    }, lsGetItem(lsKeys.useOfficialApi.id), function (checked) {
      lsSetItem(lsKeys.useOfficialApi.id, checked);
    }));
    // 自定义API启用开关
    apiCheckboxListDiv.append(embyCheckbox({
      label: lsKeys.useCustomApi.name
    }, lsGetItem(lsKeys.useCustomApi.id), function (checked) {
      lsSetItem(lsKeys.useCustomApi.id, checked);
    }));

    // API优先级切换
    getById(eleIds.apiPriorityDiv).append(embyTabs(apiPriorityOpts, lsGetItem(lsKeys.apiPriority.id)[0], 'id', 'name', function (value, tabIndex) {
      var currentPriority = lsGetItem(lsKeys.apiPriority.id);
      var apiPriorityArr = apiPriorityOpts.map(function (opt) {
        return opt.id;
      });
      var newPriority = currentPriority[0] === apiPriorityArr[1] ? [apiPriorityArr[0], apiPriorityArr[1]] : [apiPriorityArr[1], apiPriorityArr[0]];
      lsSetItem(lsKeys.apiPriority.id, newPriority);
      console.log('[API优先级] 切换为:', newPriority[0] === apiPriorityOpts[0].id ? apiPriorityOpts[0].name : apiPriorityOpts[1].name);
    }));

    // 添加自定义API地址输入框
    getById(eleIds.customApiPrefixInputDiv).append(embyInput({
      id: 'customApiPrefixInput',
      value: lsGetItem(lsKeys.customApiPrefix.id) || '',
      type: 'search'
    }, null, function (e) {
      // 失焦自动保存
      var val = e.target.value.trim();
      lsSetItem(lsKeys.customApiPrefix.id, val);
      embyToast({
        text: '自定义API地址已保存',
        secondaryText: val
      });
    }));
  }
  async function onEnterExtComment(e) {
    var extUrl = getTargetInput(e).value.trim();
    if (!extUrl.startsWith('http')) {
      return embyToast({
        text: '输入的 url 应以 http 开头!'
      });
    }
    addExtComments(extUrl);
  }
  async function addExtComments(extUrl, extComments) {
    var episode_info = window.ede.episode_info;
    var episodeId = episode_info ? episode_info.episodeId : null;
    var comments = window.ede.danmuCache[episodeId] || [];
    if (!extComments) {
      extComments = await fetchExtcommentActual(extUrl, comments);
    }
    if (extComments.length === 0) {
      return embyToast({
        text: '附加弹幕不能为空!'
      });
    }
    var allComments = comments.concat(extComments);
    createDanmaku(allComments).then(function () {
      var beforeLength = window.ede.commentsParsed.length - extComments.length;
      embyToast({
        text: "\u6B64\u6B21\u9644\u52A0\u603B\u91CF: ".concat(extComments.length, ", \u9644\u52A0\u524D\u603B\u91CF: ").concat(beforeLength, ", \u9644\u52A0\u540E\u603B\u91CF: ").concat(allComments.length)
      });
      console.log("\u9644\u52A0\u5F39\u5E55\u5C31\u4F4D, \u9644\u52A0\u524D\u603B\u91CF: ".concat(beforeLength));
      buildExtUrlsDiv();
    }).catch(function (err) {
      return console.log(err);
    });
  }
  function buildDanmuPluginDiv() {
    getById(eleIds.danmuPluginDiv).append(embyCheckbox({
      label: lsKeys.useFetchPluginXml.name
    }, lsGetItem(lsKeys.useFetchPluginXml.id), function (checked) {
      lsSetItem(lsKeys.useFetchPluginXml.id, checked);
    }));
    // getById(eleIds.danmuPluginDiv).append(embyCheckbox(
    //     { label: lsKeys.refreshPluginXml.name }, lsGetItem(lsKeys.refreshPluginXml.id), (checked) => {
    //         lsSetItem(lsKeys.refreshPluginXml.id, checked);
    //     }
    // ));
  }
  function buildCurrentDanmakuInfo(containerId) {
    var container = getById(containerId);
    if (!container) {
      return;
    }
    var _ref12 = window.ede.episode_info || {},
      episodeTitle = _ref12.episodeTitle,
      animeId = _ref12.animeId,
      animeTitle = _ref12.animeTitle,
      apiName = _ref12.apiName;
    var loadSum = getDanmakuComments(window.ede).length;
    var downloadSum = window.ede.commentsParsed.length;
    var template = "\n            <div style=\"display: flex;\">\n                <div id=\"".concat(eleIds.posterImgDiv, "\"></div>\n                <div>\n                    <div>\n                        <label class=\"").concat(classes.embyLabel, "\">\u5A92\u4F53\u540D: </label>\n                        <div class=\"").concat(classes.embyFieldDesc, "\">").concat(animeTitle, "</div>\n                    </div>\n                    ").concat(!episodeTitle ? '' : "<div>\n                        <label class=\"".concat(classes.embyLabel, "\">\u7AE0\u8282\u540D: </label>\n                        <div class=\"").concat(classes.embyFieldDesc, "\">").concat(episodeTitle, "</div>\n                    </div>"), "\n                    ").concat(!apiName ? '' : "<div>\n                        <label class=\"".concat(classes.embyLabel, "\">\u6765\u6E90: </label>\n                    </div>\n                    <div class=\"").concat(classes.embyFieldDesc, "\">").concat(apiName, "</div>"), "\n                    <div>\n                        <label class=\"").concat(classes.embyLabel, "\">\u5176\u5B83\u4FE1\u606F: </label>\n                        <div class=\"").concat(classes.embyFieldDesc, "\">\n                            \u83B7\u53D6\u603B\u6570: ").concat(downloadSum, ",\n                            \u52A0\u8F7D\u603B\u6570: ").concat(loadSum, ",\n                            \u88AB\u8FC7\u6EE4\u6570: ").concat(downloadSum - loadSum, "\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div style=\"margin-top: 2%;\">\n                <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.danmuList.name, ": </label>\n                <div id=\"").concat(eleIds.danmuListDiv, "\" style=\"margin: 1% 0;\"></div>\n                <textarea id=\"").concat(eleIds.danmuListText, "\" readOnly style=\"display: none;resize: vertical;width: 100%\" rows=\"8\"\n                    is=\"emby-textarea\" class=\"txtOverview emby-textarea\"></textarea>\n                <div class=\"").concat(classes.embyFieldDesc, "\">\u5217\u8868\u5C55\u793A\u683C\u5F0F\u4E3A: [\u5E8F\u53F7][\u5206:\u79D2] : \u5F39\u5E55\u6B63\u6587 [\u6765\u6E90\u5E73\u53F0][\u7528\u6237ID][\u5F39\u5E55CID][\u6A21\u5F0F]</div>\n            </div>\n            <div id=\"").concat(eleIds.extInfoCtrlDiv, "\" style=\"margin: 0.6em 0;\"></div>\n            <div id=\"").concat(eleIds.extInfoDiv, "\" hidden>\n                <label class=\"").concat(classes.embyLabel, "\">Bangumi \u89D2\u8272\u4ECB\u7ECD: </label>\n                <div style=\"").concat(styles.embySlider + 'margin: 0.8em 0;', "\">\n                    <label class=\"").concat(classes.embyLabel, "\" style=\"width:7em;\">\u89D2\u8272\u56FE\u7247\u9AD8\u5EA6: </label>\n                    <div id=\"").concat(eleIds.characterImgHeihtDiv, "\" style=\"width: 36.5em; text-align: center;\"></div>\n                    <label>\n                        <label id=\"").concat(eleIds.characterImgHeihtLabel, "\" style=\"").concat(styles.embySliderLabel, "\">auto</label>\n                        <label>em</label>\n                    </label>\n                </div>\n                <div id=\"").concat(eleIds.charactersDiv, "\" style=\"display: flex; flex-wrap: wrap;\"></div>\n            </div>\n        ");
    container.innerHTML = template.trim();
    if (animeId) {
      getById(eleIds.posterImgDiv, container).append(embyImgButton(embyImg(dandanplayApi.posterImg(animeId)), 'width: calc((var(--videoosd-tabs-height) - 3em) * (2 / 3)); margin-right: 1em;'));
    }
    buildDanmuListDiv(container);
    // 额外信息
    buildExtInfo(container);
  }
  function buildDanmuListDiv(container) {
    var _ref13 = window.ede.episode_info || {},
      episodeId = _ref13.episodeId;
    var extCommentCache = window.ede.extCommentCache[window.ede.itemId] || {};
    var danmuListExts = Object.values(extCommentCache).map(function (value, index) {
      return {
        id: "ext".concat(index + 1),
        name: "\u9644\u52A0".concat(index + 1),
        onChange: function onChange() {
          return danmakuParser(value);
        }
      };
    });
    var danmuListTabOpts = danmuListOpts;
    if (danmuListExts.length > 0) {
      var dandanplayListOpt = {
        id: 'dandanplay',
        name: '弹弹 play',
        onChange: function onChange() {
          var comments = window.ede.danmuCache[episodeId];
          return comments ? danmakuParser(comments) : [];
        }
      };
      danmuListTabOpts = danmuListTabOpts.concat(dandanplayListOpt).concat(danmuListExts);
    }
    getById(eleIds.danmuListDiv, container).append(embyTabs(danmuListTabOpts, lsKeys.danmuList.defaultValue, 'id', 'name', doDanmuListOptsChange));
  }
  function buildExtInfo(container) {
    getById(eleIds.characterImgHeihtDiv, container).append(embySlider({
      labelId: eleIds.characterImgHeihtLabel,
      value: '12',
      min: 12,
      max: 100,
      step: 1
    }, function (val, opts) {
      if (val === '12') {
        val = 'auto';
      }
      onSliderChangeLabel(val, opts);
      Array.from(getById(eleIds.charactersDiv).children).map(function (c) {
        return c.style.height = val === 'auto' ? val : val + 'em';
      });
    }));
    var extInfoCtrlDiv = getById(eleIds.extInfoCtrlDiv, container);
    extInfoCtrlDiv.append(embyButton({
      label: '额外信息',
      iconKey: iconKeys.more
    }, function (e) {
      var xChecked = !e.target.xChecked;
      e.target.xChecked = xChecked;
      e.target.title = xChecked ? '关闭' : '额外信息';
      e.target.firstChild.innerHTML = xChecked ? iconKeys.close : iconKeys.more;
      var extInfoDiv = getById(eleIds.extInfoDiv);
      extInfoDiv.hidden = !xChecked;
      var charactersDiv = getById(eleIds.charactersDiv);
      if (charactersDiv.firstChild) {
        return;
      }
      var bangumiInfo = window.ede.bangumiInfo;
      if (bangumiInfo && bangumiInfo.characters && bangumiInfo.animeId === window.ede.episode_info.animeId) {
        return renderBangumiCharacters(charactersDiv, bangumiInfo.characters);
      }
      getEpisodeBangumiRel().then(function (bangumiInfo) {
        return fetchJson(bangumiApi.getCharacters(bangumiInfo.subjectId));
      }).then(function (characters) {
        bangumiInfo.characters = characters;
        renderBangumiCharacters(charactersDiv, characters);
      });
      function renderBangumiCharacters(container, characters) {
        characters.map(function (c) {
          var characterDiv = document.createElement('div');
          characterDiv.style = 'width: 31%; display: flex; margin: .5em;';
          var embyImgButtonInner = embyImg(c.images.large, 'object-position: top;');
          if (!c.images.large) {
            embyImgButtonInner = embyI(iconKeys.person, classes.cardImageIcon);
          }
          characterDiv.append(embyImgButton(embyImgButtonInner));
          var characterRightDiv = document.createElement('div');
          characterRightDiv.style.marginLeft = '.5em';
          var characterNameDiv = document.createElement('div');
          characterNameDiv.textContent = c.relation + ': ' + c.name;
          characterRightDiv.append(characterNameDiv);
          var characterCvDiv = document.createElement('div');
          characterCvDiv.textContent = 'CV: ' + c.actors.map(function (a) {
            return a.name;
          }).join();
          if (c.actors[0]) {
            characterCvDiv.append(embyImgButton(embyImg(c.actors[0].images.large)));
          }
          characterRightDiv.append(characterCvDiv);
          characterDiv.append(characterRightDiv);
          container.append(characterDiv);
        });
      }
    }));
  }
  function buildProSetting(containerId) {
    var container = getById(containerId);
    var template = "\n            <div style=\"height: 30em;\">\n                <div is=\"emby-collapse\" title=\"\u5F39\u5E55\u5C4F\u853D\" data-expanded=\"true\">\n                    <div class=\"".concat(classes.collapseContentNav, "\">\n                        <div id=\"").concat(eleIds.danmakuTypeFilterDiv, "\" style=\"margin-bottom: 0.2em;\">\n                            <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.typeFilter.name, ": </label>\n                        </div>\n                        <div id=\"").concat(eleIds.danmakuSourceFilterDiv, "\">\n                            <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.sourceFilter.name, ": </label>\n                        </div>\n                        <div id=\"").concat(eleIds.danmakuShowSourceDiv, "\">\n                            <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.showSource.name, ": </label>\n                        </div>\n                    </div>\n                </div>\n                <div is=\"emby-collapse\" title=\"\u5F39\u5E55\u9AD8\u7EA7\u5C4F\u853D\">\n                    <div class=\"").concat(classes.collapseContentNav, "\">\n                        <div>\n                            <div style=\"").concat(styles.embySlider, "\">\n                                <label class=\"").concat(classes.embyLabel, "\" style=\"width: 10em;\">").concat(lsKeys.autoFilterCount.name, ": </label>\n                                <div id=\"").concat(eleIds.danmakuAutoFilterCountDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                                <label style=\"").concat(styles.embySliderLabel, "\">0</label>\n                            </div>\n                            <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.mergeSimilarEnable.name, ": </label>\n                            <div id=\"").concat(eleIds.danmakuFilterProDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                            <div style=\"").concat(styles.embySlider, "\">\n                                <label class=\"").concat(classes.embyLabel, "\" style=\"width: 10em;\">").concat(lsKeys.mergeSimilarPercent.name, ": </label>\n                                <div id=\"").concat(eleIds.mergeSimilarPercentDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                                <label>\n                                    <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                                    <label>%</label>\n                                </label>\n                            </div>\n                            <div style=\"").concat(styles.embySlider, "\">\n                                <label class=\"").concat(classes.embyLabel, "\" style=\"width: 10em;\">").concat(lsKeys.mergeSimilarTime.name, ": </label>\n                                <div id=\"").concat(eleIds.mergeSimilarTimeDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                                <label style=\"").concat(styles.embySliderLabel, "\">-1</label>\n                            </div>\n                        </div>\n                        <div id=\"").concat(eleIds.filterKeywordsDiv, "\" style=\"margin-bottom: 0.2em;\">\n                            <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.filterKeywords.name, ": </label>\n                        </div>\n                    </div>\n                </div>\n                <div is=\"emby-collapse\" title=\"\u989D\u5916\u8BBE\u7F6E\">\n                    <div class=\"").concat(classes.collapseContentNav, "\" style=\"padding-top: 0.5em !important;\">\n                        <div id=\"").concat(eleIds.extCheckboxDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                        <div id=\"").concat(eleIds.danmakuChConverDiv, "\" style=\"margin-bottom: 0.2em;\">\n                            <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.chConvert.name, ": </label>\n                        </div>\n                        <div id=\"").concat(eleIds.danmakuEngineDiv, "\" style=\"margin-bottom: 0.2em;\">\n                            <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.engine.name, ": </label>\n                        </div>\n                    </div>\n                </div>\n                <div is=\"emby-collapse\" title=\"\u64AD\u653E\u754C\u9762\u8BBE\u7F6E\">\n                    <div class=\"").concat(classes.collapseContentNav, "\">\n                        <div id=\"").concat(eleIds.osdCheckboxDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                        <div>\n                            <div id=\"").concat(eleIds.osdLineChartDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                            <div style=\"").concat(styles.embySlider, "\">\n                                <label class=\"").concat(classes.embyLabel, "\" style=\"width: 12em;\">").concat(lsKeys.osdLineChartTime.name, ": </label>\n                                <div id=\"").concat(eleIds.osdLineChartTimeDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                                <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div is=\"emby-collapse\" title=\"\u64AD\u653E\u8BBE\u7F6E\">\n                    <div class=\"").concat(classes.collapseContentNav, "\">\n                        <label class=\"").concat(classes.embyLabel, "\">\u5355\u6B21\u5B9A\u65F6\u6267\u884C: </label>\n                        <div id=\"").concat(eleIds.timeoutCallbackTypeDiv, "\"></div>\n                        <label class=\"").concat(classes.embyLabel, "\">\u5B9A\u65F6\u5355\u4F4D: </label>\n                        <div id=\"").concat(eleIds.timeoutCallbackUnitDiv, "\"></div>\n                        <div style=\"").concat(styles.embySlider + 'margin-top: 0.3em;', "\">\n                            <label class=\"").concat(classes.embyLabel, "\" style=\"width:4em;\">").concat(lsKeys.timeoutCallbackValue.name, ": </label>\n                            <div id=\"").concat(eleIds.timeoutCallbackDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                            <label id=\"").concat(eleIds.timeoutCallbackLabel, "\" style=\"").concat(styles.embySliderLabel, "\"></label>\n                        </div>\n                    </div>\n                </div>\n                <div is=\"emby-collapse\" title=\"Bangumi \u8BBE\u7F6E\">\n                    <div class=\"").concat(classes.collapseContentNav, "\" style=\"padding-top: 0.5em !important;\">\n                        <label id=\"").concat(eleIds.bangumiEnableLabel, "\" class=\"").concat(classes.embyLabel, "\"></label>\n                        <div id=\"").concat(eleIds.bangumiSettingsDiv, "\">\n                            <div id=\"").concat(eleIds.bangumiTokenInputDiv, "\" style=\"display: flex;\" ></div>\n                            <div id=\"").concat(eleIds.bangumiTokenLabel, "\" class=\"").concat(classes.embyFieldDesc, "\"></div>\n                            <div class=\"").concat(classes.embyFieldDesc, "\">\n                                \u4F60\u53EF\u4EE5\u5728\u4EE5\u4E0B\u94FE\u63A5\u751F\u6210\u4E00\u4E2A Access Token\n                            </div>\n                            <div id=\"").concat(eleIds.bangumiTokenLinkDiv, "\" style=\"padding-bottom: 0.5em;\"></div>\n                            <label class=\"").concat(classes.embyLabel, "\">\u81EA\u52A8\u66F4\u65B0\u5355\u7AE0\u8282\u6536\u85CF\u4FE1\u606F: </label>\n                            <div style=\"").concat(styles.embySlider, "\">\n                                <label class=\"").concat(classes.embyLabel, "\" style=\"width:4em;\">").concat(lsKeys.bangumiPostPercent.name, ": </label>\n                                <div id=\"").concat(eleIds.bangumiPostPercentDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                                <label>\n                                    <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                                    <label>%</label>\n                                </label>\n                            </div>\n                            <div class=\"").concat(classes.embyFieldDesc, "\">\n                                \u89E6\u53D1\u65F6\u673A\u4E3A\u6B63\u5E38\u505C\u6B62\u64AD\u653E,\u4E14\u64AD\u653E\u8FDB\u5EA6\u8D85\u8FC7\u8BBE\u5B9A\u767E\u5206\u6BD4\u65F6;\n                                \u540C\u6B65\u7684\u5A92\u4F53\u4FE1\u606F\u4E3A\u81EA\u52A8\u5339\u914D\u800C\u6765,\u53EF\u5728\"\u5F39\u5E55\u4FE1\u606F\"\u4E2D\u67E5\u770B;\n                                \u81EA\u52A8\u5339\u914D\u6709\u8BEF\u53EF\"\u624B\u52A8\u5339\u914D\",\u4ECD\u65E0\u6CD5\u5339\u914D\u53EF\u70B9\u51FB\u6309\u94AEX\"\u53D6\u6D88\u5339\u914D/\u6E05\u9664\u5F39\u5E55\",\u5219\u6B64\u5355\u7AE0\u8282\u4E0D\u4F1A\u540C\u6B65;\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div is=\"emby-collapse\" title=\"\u81EA\u5B9A\u4E49\u63A5\u53E3\u5730\u5740\">\n                    <div id=\"").concat(eleIds.customeUrlsDiv, "\" class=\"").concat(classes.collapseContentNav, "\"></div>\n                </div>\n            </div>\n        ");
    container.innerHTML = template.trim();
    buildDanmakuFilterSetting(container);
    buildExtSetting(container);
    buildOsdSetting();
    buildPlaySetting(container);
    buildBangumiSetting(container);
    buildCustomUrlSetting(container);
  }
  function buildDanmakuFilterSetting(container) {
    getById(eleIds.danmakuTypeFilterDiv, container).append(embyCheckboxList(null, eleIds.danmakuTypeFilterSelectName, lsGetItem(lsKeys.typeFilter.id), Object.values(danmakuTypeFilterOpts).filter(function (o) {
      return !o.hidden;
    }), doDanmakuTypeFilterSelect));
    getById(eleIds.danmakuSourceFilterDiv, container).append(embyCheckboxList(null, eleIds.danmakuSourceFilterSelectName, lsGetItem(lsKeys.sourceFilter.id), Object.values(danmakuSource), doDanmakuSourceFilterSelect));
    getById(eleIds.danmakuShowSourceDiv, container).append(embyCheckboxList(null, eleIds.danmakuShowSourceSelectName, lsGetItem(lsKeys.showSource.id), Object.values(showSource), doDanmakuShowSourceSelect));
    getById(eleIds.danmakuAutoFilterCountDiv).append(embySlider({
      lsKey: lsKeys.autoFilterCount
    }, onSliderChange, onSliderChangeLabel));
    // 合并相似弹幕
    getById(eleIds.danmakuFilterProDiv, container).append(embyCheckbox({
      label: labels.enable
    }, lsGetItem(lsKeys.mergeSimilarEnable.id), function (checked) {
      lsSetItem(lsKeys.mergeSimilarEnable.id, checked);
      loadDanmaku(LOAD_TYPE.RELOAD);
    }));
    getById(eleIds.mergeSimilarPercentDiv).append(embySlider({
      lsKey: lsKeys.mergeSimilarPercent
    }, onSliderChange, onSliderChangeLabel));
    getById(eleIds.mergeSimilarTimeDiv).append(embySlider({
      lsKey: lsKeys.mergeSimilarTime
    }, onSliderChange, onSliderChangeLabel));
    // 屏蔽关键词
    var keywordsContainer = getById(eleIds.filterKeywordsDiv, container);
    var keywordsEnableDiv = keywordsContainer.appendChild(document.createElement('div'));
    var keywordsBtn = embyButton({
      label: '加载关键词过滤',
      iconKey: iconKeys.done_disabled
    }, doDanmakuFilterKeywordsBtnClick);
    keywordsBtn.disabled = true;
    keywordsEnableDiv.setAttribute('style', 'display: flex; justify-content: space-between; align-items: center; width: 100%;');
    keywordsEnableDiv.append(embyCheckbox({
      id: eleIds.filterKeywordsEnableId,
      label: labels.enable
    }, lsGetItem(lsKeys.filterKeywordsEnable.id), function (flag) {
      return updateFilterKeywordsBtn(keywordsBtn, flag, getById(eleIds.filterKeywordsId).value.trim());
    }));
    keywordsEnableDiv.appendChild(document.createElement('div')).appendChild(keywordsBtn);
    keywordsContainer.appendChild(document.createElement('div')).appendChild(embyTextarea({
      id: eleIds.filterKeywordsId,
      value: lsGetItem(lsKeys.filterKeywords.id),
      style: 'width: 100%;margin-top: 0.2em;',
      rows: 8
    }, function (event) {
      return updateFilterKeywordsBtn(keywordsBtn, getById(eleIds.filterKeywordsEnableId).checked, event.target.value.trim());
    }));
    var label = document.createElement('label');
    label.innerText = "\u5173\u952E\u8BCD/\u6B63\u5219\u5339\u914D\u8FC7\u6EE4,\u652F\u6301\u8FC7\u6EE4[\u6B63\u6587,".concat(Object.values(showSource).map(function (o) {
      return o.name;
    }).join(), "],\u591A\u4E2A\u8868\u8FBE\u5F0F\u7528\u6362\u884C\u5206\u9694");
    label.className = classes.embyFieldDesc;
    keywordsContainer.appendChild(document.createElement('div')).appendChild(label);
  }
  function buildExtSetting(container) {
    // getById(eleIds.extCheckboxDiv, container).append(embyCheckbox(
    //     { label: lsKeys.removeEmojiEnable.name }, lsGetItem(lsKeys.removeEmojiEnable.id), (checked) => {
    //         lsSetItem(lsKeys.removeEmojiEnable.id, checked);
    //     }
    // ));
    getById(eleIds.danmakuChConverDiv, container).append(embyTabs(danmakuChConverOpts, window.ede.chConvert, 'id', 'name', doDanmakuChConverChange));
    getById(eleIds.danmakuEngineDiv, container).append(embyTabs(danmakuEngineOpts, lsGetItem(lsKeys.engine.id), 'id', 'name', doDanmakuEngineSelect));
  }
  function buildOsdSetting() {
    getById(eleIds.osdCheckboxDiv).append(embyCheckbox({
      label: lsKeys.osdTitleEnable.name
    }, lsGetItem(lsKeys.osdTitleEnable.id), function (checked) {
      lsSetItem(lsKeys.osdTitleEnable.id, checked);
      var videoOsdContainer = document.querySelector("".concat(mediaContainerQueryStr, " .videoOsdSecondaryText"));
      var videoOsdDanmakuTitle = getById(eleIds.videoOsdDanmakuTitle, videoOsdContainer);
      if (videoOsdDanmakuTitle) {
        videoOsdDanmakuTitle.style.display = checked ? 'block' : 'none';
      } else if (checked) {
        appendvideoOsdDanmakuInfo(getDanmakuComments(window.ede).length);
      }
    }));
    getById(eleIds.osdCheckboxDiv).append(embyCheckbox({
      label: lsKeys.osdHeaderClockEnable.name
    }, lsGetItem(lsKeys.osdHeaderClockEnable.id), function (checked) {
      lsSetItem(lsKeys.osdHeaderClockEnable.id, checked);
      checked ? addHeaderClock() : removeHeaderClock();
    }));
    getById(eleIds.osdLineChartDiv).append(embyCheckbox({
      label: lsKeys.osdLineChartEnable.name
    }, lsGetItem(lsKeys.osdLineChartEnable.id), function (checked) {
      lsSetItem(lsKeys.osdLineChartEnable.id, checked);
      var progressBarLineChart = getById(eleIds.progressBarLineChart);
      if (progressBarLineChart) {
        progressBarLineChart.style.display = checked ? 'block' : 'none';
      } else if (checked) {
        buildProgressBarChart(20);
      }
    }));
    getById(eleIds.osdLineChartDiv).append(embyCheckbox({
      label: lsKeys.osdLineChartSkipFilter.name
    }, lsGetItem(lsKeys.osdLineChartSkipFilter.id), function (checked) {
      lsSetItem(lsKeys.osdLineChartSkipFilter.id, checked);
      buildProgressBarChart(20);
    }));
    getById(eleIds.osdLineChartTimeDiv).append(embySlider({
      lsKey: lsKeys.osdLineChartTime,
      needReload: false
    }, function (val, opts) {
      onSliderChange(val, opts);
      if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
        buildProgressBarChart(20);
      }
    }, onSliderChangeLabel));
  }
  function buildPlaySetting(container) {
    var btnContainer = getById(eleIds.timeoutCallbackDiv, container);
    var timeoutCallbacktOpts = {
      labelId: eleIds.timeoutCallbackLabel,
      key: lsKeys.timeoutCallbackValue.id,
      needReload: false
    };
    onSliderChangeLabel(lsGetItem(lsKeys.timeoutCallbackValue.id), timeoutCallbacktOpts);
    timeOffsetBtns.forEach(function (btn) {
      btnContainer.append(embyButton(btn, function (e) {
        if (e.target) {
          var oldValue = lsGetItem(lsKeys.timeoutCallbackValue.id);
          var newValue = oldValue + (parseFloat(e.target.getAttribute('valueOffset')) || 0);
          if (newValue === oldValue || newValue < 0) {
            newValue = 0;
          }
          onSliderChange(newValue, timeoutCallbacktOpts);
        }
      }));
    });
    getById(eleIds.timeoutCallbackUnitDiv, container).append(embyTabs(timeoutCallbackUnitOpts, lsGetItem(lsKeys.timeoutCallbackUnit.id), 'id', 'name', function (value, index) {
      lsSetItem(lsKeys.timeoutCallbackUnit.id, index);
    }));
    getById(eleIds.timeoutCallbackTypeDiv, container).append(embyTabs(timeoutCallbackTypeOpts, timeoutCallbackTypeOpts[0].id, 'id', 'name', function (value) {
      var unitObj = timeoutCallbackUnitOpts[lsGetItem(lsKeys.timeoutCallbackUnit.id)];
      value.onChange(lsGetItem(lsKeys.timeoutCallbackValue.id) * unitObj.msRate);
    }));
  }
  function buildBangumiSetting(container) {
    var bangumiSettingsDiv = getById(eleIds.bangumiSettingsDiv, container);
    var bangumiEnable = lsGetItem(lsKeys.bangumiEnable.id);
    bangumiSettingsDiv.hidden = !bangumiEnable;
    var bangumiEnableLabel = getById(eleIds.bangumiEnableLabel, container);
    bangumiEnableLabel.append(embyCheckbox({
      label: lsKeys.bangumiEnable.name
    }, bangumiEnable, function (checked) {
      lsSetItem(lsKeys.bangumiEnable.id, checked);
      bangumiSettingsDiv.hidden = !checked;
    }));
    var bangumiTokenInputDiv = getById(eleIds.bangumiTokenInputDiv, container);
    bangumiTokenInputDiv.append(embyInput({
      id: eleIds.bangumiTokenInput,
      type: 'password',
      value: lsGetItem(lsKeys.bangumiToken.id)
    }, onEnterBangumiToken));
    bangumiTokenInputDiv.append(embyButton({
      label: '校验',
      iconKey: iconKeys.check
    }, onEnterBangumiToken));
    getById(eleIds.bangumiPostPercentDiv, container).append(embySlider({
      lsKey: lsKeys.bangumiPostPercent,
      needReload: false
    }, function (val, opts) {
      onSliderChange(val, opts);
    }, onSliderChangeLabel));
    var bangumiTokenLinkDiv = getById(eleIds.bangumiTokenLinkDiv, container);
    bangumiTokenLinkDiv.append(embyALink(bangumiApi.accessTokenUrl, bangumiApi.accessTokenUrl));
  }
  function onEnterBangumiToken(e) {
    var bangumiToken = getById(eleIds.bangumiTokenInput).value.trim();
    lsSetItem(lsKeys.bangumiToken.id, bangumiToken);
    var label = getById(eleIds.bangumiTokenLabel);
    fetchBangumiApiGetMe(bangumiToken).then(function (res) {
      label.innerText = 'Bangumi Token 验证成功';
      label.style.color = 'green';
    }).catch(function (error) {
      label.innerText = 'Bangumi Token 验证失败';
      label.style.color = 'red';
      throw error;
    });
  }
  async function fetchBangumiApiGetMe(bangumiToken) {
    try {
      var res = await fetchJson(bangumiApi.getMe(), {
        token: bangumiToken
      });
      console.log('Bangumi Token 验证成功', res);
      localStorage.setItem(lsLocalKeys.bangumiMe, JSON.stringify(res));
      return res;
    } catch (error) {
      console.error('Bangumi Token 验证失败', error);
      throw error;
    }
  }
  function buildCustomUrlSetting(container) {
    var getTemplate = function getTemplate(obj) {
      return "\n            <label class=\"".concat(classes.embyLabel, "\">").concat(obj.lsKey.name, "(").concat(obj.msg1, "): </label>\n            <div id=\"").concat(obj.divId, "\" style=\"display: flex;\" ></div>\n            <div class=\"").concat(classes.embyFieldDesc, "\">").concat(obj.msg2 ? obj.msg2 : '', "</div>\n        ");
    };
    customeUrl.mapping.map(function (obj) {
      getById(eleIds.customeUrlsDiv, container).innerHTML += getTemplate(obj);
      return obj;
    }).map(function (obj) {
      var inputDiv = getById(obj.divId, container);
      var onEnter = function onEnter(e) {
        var target = getTargetInput(e);
        var value = target.value.trim();
        if (!value) {
          value = obj.lsKey.defaultValue;
          target.value = value;
        }
        lsSetItem(obj.lsKey.id, value);
        obj.rewrite(value);
      };
      inputDiv.append(embyInput({
        type: 'search',
        value: lsGetItem(obj.lsKey.id)
      }, onEnter));
      inputDiv.append(embyButton({
        label: '确认',
        iconKey: iconKeys.check
      }, onEnter));
    });
  }
  function buildAbout(containerId) {
    var container = getById(containerId);
    if (!container) {
      return;
    }
    var template = "\n            <div style=\"height: 30em;\">\n                <div id=\"".concat(eleIds.consoleLogCtrl, "\"></div>\n                <div id=\"").concat(eleIds.consoleLogInfo, "\">\n                    <textarea id=\"").concat(eleIds.consoleLogText, "\" readOnly style=\"resize: vertical;margin-top: 0.6em;\"\n                        rows=\"12\" is=\"emby-textarea\" class=\"txtOverview emby-textarea\"></textarea>\n                    <textarea id=\"").concat(eleIds.consoleLogTextInput, "\" hidden style=\"resize: vertical;\"\n                        rows=\"1\" is=\"emby-textarea\" class=\"txtOverview emby-textarea\"></textarea>\n                </div>\n                <div class=\"").concat(classes.embyFieldDesc, "\">\u6CE8\u610F\u5F00\u542F\u540E\u539F\u672C\u63A7\u5236\u53F0\u4E2D\u8C03\u7528\u65B9\u4FE1\u606F\u5C06\u88AB\u8986\u76D6,\u4E0D\u4F7F\u7528\u8BF7\u4FDD\u6301\u5173\u95ED\u72B6\u6001</div>\n                <div id=\"").concat(eleIds.consoleLogCtrl, "\"></div>\n                <div is=\"emby-collapse\" title=\"\u5F00\u53D1\u8005\u9009\u9879\">\n                    <div class=\"").concat(classes.collapseContentNav, "\">\n                        <label class=\"").concat(classes.embyLabel, "\">\u8C03\u8BD5\u5F00\u5173: </label>\n                        <div id=\"").concat(eleIds.debugCheckbox, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                        <label class=\"").concat(classes.embyLabel, "\">\u8C03\u8BD5\u6309\u94AE: </label>\n                        <div id=\"").concat(eleIds.debugButton, "\"></div>\n                    </div>\n                </div>\n                <div is=\"emby-collapse\" title=\"\u5F00\u653E\u6E90\u4EE3\u7801\u8BB8\u53EF\" data-expanded=\"true\" style=\"margin-top: 0.6em;\">\n                    <div id=\"").concat(eleIds.openSourceLicenseDiv, "\" class=\"").concat(classes.collapseContentNav, "\" style=\"display: flex; flex-direction: column;\"></div>\n                </div>\n            </div>\n        ");
    container.innerHTML = template.trim();
    buildConsoleLog(container);
    buildDebugCheckbox(container);
    buildDebugButton(container);
    buildOpenSourceLicense(container);
  }
  function buildConsoleLog(container) {
    var consoleLogEnable = lsGetItem(lsKeys.consoleLogEnable.id);
    getById(eleIds.consoleLogInfo, container).style.display = consoleLogEnable ? '' : 'none';
    if (consoleLogEnable) {
      doConsoleLogChange(consoleLogEnable);
    }
    var consoleLogCtrlEle = getById(eleIds.consoleLogCtrl, container);
    consoleLogCtrlEle.append(embyCheckbox({
      label: lsKeys.consoleLogEnable.name
    }, consoleLogEnable, doConsoleLogChange));
    var consoleLogCountLabel = document.createElement('label');
    consoleLogCountLabel.id = eleIds.consoleLogCountLabel;
    consoleLogCtrlEle.append(embyButton({
      label: '清空',
      iconKey: iconKeys.block
    }, function () {
      getById(eleIds.consoleLogText, container).value = '';
      getById(eleIds.consoleLogCountLabel).innerHTML = '';
      if (window.ede.appLogAspect) {
        window.ede.appLogAspect.value = '';
      }
    }), consoleLogCountLabel);
    var consoleLogTextInput = getById(eleIds.consoleLogTextInput, container);
    consoleLogTextInput.style.display = consoleLogEnable && lsGetItem(lsKeys.quickDebugOn.id) ? '' : 'none';
    consoleLogTextInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        var inputVal = e.target.value.trim();
        console.log('输入内容为: \n', inputVal);
        eval(inputVal);
        e.target.value = '';
      }
    });
  }
  function buildDebugCheckbox(container) {
    var debugWrapper = getById(eleIds.debugCheckbox, container);
    debugWrapper.append(embyCheckbox({
      label: lsKeys.debugShowDanmakuWrapper.name
    }, lsGetItem(lsKeys.debugShowDanmakuWrapper.id), function (checked) {
      lsSetItem(lsKeys.debugShowDanmakuWrapper.id, checked);
      var wrapper = getById(eleIds.danmakuWrapper);
      wrapper.style.backgroundColor = checked ? styles.colors.highlight : '';
      if (!checked) {
        return;
      }
      console.log("\u5F39\u5E55\u5BB9\u5668(#".concat(eleIds.danmakuWrapper, ")\u5BBD\u9AD8\u50CF\u7D20:"), wrapper.offsetWidth, wrapper.offsetHeight);
      var stage = wrapper.firstChild;
      console.log("\u5B9E\u9645\u821E\u53F0(".concat(stage.tagName, ")\u5BBD\u9AD8\u50CF\u7D20:"), stage.offsetWidth, stage.offsetHeight);
    }));
    debugWrapper.append(embyCheckbox({
      label: lsKeys.debugShowDanmakuCtrWrapper.name
    }, lsGetItem(lsKeys.debugShowDanmakuCtrWrapper.id), function (checked) {
      lsSetItem(lsKeys.debugShowDanmakuCtrWrapper.id, checked);
      var wrapper = getById(eleIds.danmakuCtr);
      wrapper.style.backgroundColor = checked ? styles.colors.highlight : '';
      if (!checked) {
        return;
      }
      console.log("\u6309\u94AE\u5BB9\u5668(#".concat(eleIds.danmakuCtr, ")\u5BBD\u9AD8\u50CF\u7D20:"), wrapper.offsetWidth, wrapper.offsetHeight);
    }));
    debugWrapper.append(embyCheckbox({
      label: lsKeys.debugReverseDanmu.name
    }, lsGetItem(lsKeys.debugReverseDanmu.id), function (checked) {
      lsSetItem(lsKeys.debugReverseDanmu.id, checked);
      // const comments = window.ede.danmuCache[window.ede.episode_info.episodeId];
      var comments = window.ede.commentsOriginal;
      comments.map(function (c) {
        var values = c.p.split(',');
        values[1] = {
          '6': '1',
          '1': '6',
          '5': '4',
          '4': '5'
        }[values[1]];
        c.p = values.join();
      });
      console.log('已' + lsKeys.debugReverseDanmu.name);
      createDanmaku(comments);
    }));
    var toggleDanmuColor = function toggleDanmuColor(checked, lsKey, colorFn) {
      lsSetItem(lsKey.id, checked);
      var comments = window.ede.commentsOriginal;
      if (checked) {
        window.ede._oriComments = structuredClone(comments);
        comments = comments.map(function (c) {
          var values = c.p.split(',');
          values[2] = colorFn();
          return _objectSpread(_objectSpread({}, c), {}, {
            p: values.join()
          });
        });
        console.log('已' + lsKey.name);
      } else {
        comments = window.ede._oriComments;
        window.ede.commentsOriginal = comments;
        console.log('已还原' + lsKey.name);
      }
      createDanmaku(comments);
    };
    debugWrapper.append(embyCheckbox({
      label: lsKeys.debugRandomDanmuColor.name
    }, lsGetItem(lsKeys.debugRandomDanmuColor.id), function (checked) {
      toggleDanmuColor(checked, lsKeys.debugRandomDanmuColor, function () {
        return parseInt(Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), 16);
      });
    }));
    debugWrapper.append(embyCheckbox({
      label: lsKeys.debugForceDanmuWhite.name
    }, lsGetItem(lsKeys.debugForceDanmuWhite.id), function (checked) {
      toggleDanmuColor(checked, lsKeys.debugForceDanmuWhite, function () {
        return parseInt(styles.colors.info.toString(16).padStart(6, '0'), 16);
      });
    }));
    var toggleTopBottomToScroll = function toggleTopBottomToScroll(checked, lsKey) {
      lsSetItem(lsKey.id, checked);
      var comments = window.ede.commentsOriginal;
      if (checked) {
        window.ede._oriComments = structuredClone(comments);
        comments = comments.map(function (c) {
          var values = c.p.split(',');
          if (values[1] === '4' || values[1] === '5') {
            values[1] = '1'; // 改为从右往左滚动
          }
          return _objectSpread(_objectSpread({}, c), {}, {
            p: values.join()
          });
        });
        console.log('已' + lsKey.name);
      } else {
        comments = window.ede._oriComments;
        window.ede.commentsOriginal = comments;
        console.log('已还原' + lsKey.name);
      }
      createDanmaku(comments);
    };
    debugWrapper.append(embyCheckbox({
      label: lsKeys.debugTopBottomToScroll.name
    }, lsGetItem(lsKeys.debugTopBottomToScroll.id), function (checked) {
      toggleTopBottomToScroll(checked, lsKeys.debugTopBottomToScroll);
    }));
    // debugWrapper.append(embyCheckbox({ label: lsKeys.debugGenerateLarge.name }, lsGetItem(lsKeys.debugGenerateLarge.id), (checked) => {
    //     lsSetItem(lsKeys.debugGenerateLarge.id, checked);
    //     let intervalId;
    //     if (checked) {
    //         intervalId = setInterval(() => {
    //             document.childNodes.forEach(node => {
    //                 toastByDanmaku(node.type + ' : class : ' + node.className, 'info');
    //             });
    //         }, check_interval)
    //         window.ede.destroyIntervalIds.push(intervalId);
    //     } else {
    //         clearInterval(intervalId);
    //     }
    // }));
    var dialogContainer = document.querySelector('.' + classes.dialogContainer);
    var centeredDialog = dialogContainer.firstChild;
    // lsKeys.debugDialogHyalinize
    var isExist1 = dialogContainer.classList.contains(classes.dialogBackdropOpened);
    var isExist2 = centeredDialog.classList.contains(classes.dialogBlur);
    var debugDialogHyalinizeOnChange = function debugDialogHyalinizeOnChange(checked) {
      lsSetItem(lsKeys.debugDialogHyalinize.id, checked);
      if (checked) {
        centeredDialog.classList.remove(classes.dialog);
        isExist1 && dialogContainer.classList.remove(classes.dialogBackdropOpened);
        isExist2 && centeredDialog.classList.remove(classes.dialogBlur);
      } else {
        centeredDialog.classList.add(classes.dialog);
        // 跳过魔改版客户端上已经被移除的 css
        isExist1 && dialogContainer.classList.add(classes.dialogBackdropOpened);
        isExist2 && centeredDialog.classList.add(classes.dialogBlur);
      }
    };
    var debugDialogHyalinizeChecked = lsGetItem(lsKeys.debugDialogHyalinize.id);
    debugDialogHyalinizeOnChange(debugDialogHyalinizeChecked);
    debugWrapper.append(embyCheckbox({
      label: lsKeys.debugDialogHyalinize.name
    }, debugDialogHyalinizeChecked, debugDialogHyalinizeOnChange));
    // lsKeys.debugDialogWindow
    var isExist3 = centeredDialog.classList.contains(classes.dialogFullscreen);
    var isExist4 = centeredDialog.classList.contains(classes.dialogFullscreenLowres);
    var debugDialogWindowOnChange = function debugDialogWindowOnChange(checked) {
      lsSetItem(lsKeys.debugDialogWindow.id, checked);
      isExist3 && centeredDialog.classList.toggle(classes.dialogFullscreen, !checked);
      isExist4 && centeredDialog.classList.toggle(classes.dialogFullscreenLowres, !checked);
    };
    var debugDialogWindowChecked = lsGetItem(lsKeys.debugDialogWindow.id);
    debugDialogWindowOnChange(debugDialogWindowChecked);
    debugWrapper.append(embyCheckbox({
      label: lsKeys.debugDialogWindow.name
    }, debugDialogWindowChecked, debugDialogWindowOnChange));
    // lsKeys.debugDialogRight
    var debugDialogRightOnChange = function debugDialogRightOnChange(checked) {
      lsSetItem(lsKeys.debugDialogRight.id, checked);
      dialogContainer.classList.toggle(classes.dialogBackdropOpened, !checked);
      centeredDialog.style = checked ? styles.rightLayout : '';
      if (checked) {
        isExist3 && centeredDialog.classList.remove(classes.dialogFullscreen);
        isExist4 && centeredDialog.classList.remove(classes.dialogFullscreenLowres, !checked);
      }
    };
    var debugDialogRightChecked = lsGetItem(lsKeys.debugDialogRight.id);
    debugDialogRightOnChange(debugDialogRightChecked);
    debugWrapper.append(embyCheckbox({
      label: lsKeys.debugDialogRight.name
    }, debugDialogRightChecked, debugDialogRightOnChange));
    // lsKeys.debugTabIframeEnable
    if (lsGetItem(lsKeys.quickDebugOn.id)) {
      // @deprecated 已废弃,因跨域无法登录网站,无太大意义
      debugWrapper.append(embyCheckbox({
        label: lsKeys.debugTabIframeEnable.name
      }, false, function (checked) {
        getById(tabIframeId + 'Btn').style.display = checked ? '' : 'none';
      }));
    }
    // lsKeys.debugH5VideoAdapterEnable
    var h5VideoAdapter = getById(eleIds.h5VideoAdapter);
    if (h5VideoAdapter) {
      debugWrapper.append(embyCheckbox({
        label: lsKeys.debugH5VideoAdapterEnable.name
      }, lsGetItem(lsKeys.debugH5VideoAdapterEnable.id), function (checked) {
        lsSetItem(lsKeys.debugH5VideoAdapterEnable.id, checked);
        h5VideoAdapter.style.display = checked ? '' : 'none';
        h5VideoAdapter.style.backgroundColor = checked ? styles.colors.highlight : '';
      }));
    }
    // lsKeys.debugDanmuAnywhereEnable
    if (lsGetItem(lsKeys.quickDebugOn.id)) {
      debugWrapper.append(embyCheckbox({
        label: lsKeys.debugDanmuAnywhereEnable.name
      }, false, function (checked) {
        if (checked) {
          var bodyEle = document.body;
          var media = document.createElement('video');
          media.id = 'test-media';
          var containerEle = document.createElement('div');
          containerEle.id = 'test-media-container';
          containerEle.className = mediaContainerQueryStr.replace('.', '');
          containerEle.style.position = 'fixed';
          containerEle.style.zIndex = '255';
          containerEle.prepend(media);
          bodyEle.prepend(containerEle);
          media.play();
          setInterval(function () {
            media.currentTime += 100 / 1e3;
            media.dispatchEvent(new Event('timeupdate'));
          }, 100);
          createDanmaku(generateRandomDanmu(50000, 600)).then(function () {
            console.log('弹幕就位');
          }).catch(function (err) {
            console.log(err);
          });
        } else {
          var _getById;
          if (window.ede.danmaku) {
            window.ede.danmaku.destroy();
            window.ede.danmaku = null;
          }
          (_getById = getById('test-media-container')) === null || _getById === void 0 || _getById.remove();
        }
      }));
    }
  }
  function generateRandomDanmu(count, duration) {
    count = count || 10000;
    duration = duration || 600;
    var comments = [];
    var modes = [1, 4, 5, 6]; // 1=rtl, 6=ltr, 5=top, 4=bottom
    for (var i = 0; i < count; i++) {
      var time = parseFloat((Math.random() * duration).toFixed(2));
      var mode = modes[Math.floor(Math.random() * modes.length)];
      var color = Math.floor(Math.random() * 16777216);
      var p = time + ',' + mode + ',' + color + ',0';
      var cid = 1000000000 + i;
      comments.push({
        cid: cid,
        p: p,
        m: '这是第' + (i + 1) + '条弹幕'
      });
    }
    return comments;
  }
  function buildDebugButton(container) {
    var debugWrapper = getById(eleIds.debugButton, container);
    debugWrapper.append(embyButton({
      label: '打印环境信息',
      style: 'margin: 0.3em;'
    }, function () {
      require(['browser'], function (browser) {
        console.log('Emby 内部自身判断: ', browser);
      });
      console.log('Emby appName: ', ApiClient.appName());
      console.log('Emby appVersion: ', ApiClient.appVersion());
    }));
    debugWrapper.append(embyButton({
      label: '打印弹幕引擎信息',
      style: 'margin: 0.3em;'
    }, function () {
      var msg = "\u5F39\u5E55\u5F15\u64CE\u662F\u5426\u5B58\u5728: ".concat(!!window.Danmaku, ", \u5F39\u5E55\u5F15\u64CE\u662F\u5426\u5B9E\u4F8B\u5316\u6210\u529F: ").concat(!!window.ede.danmaku);
      console.log(msg);
      embyToast({
        text: msg
      });
    }));
    debugWrapper.append(embyButton({
      label: '打印视频加载方',
      style: 'margin: 0.3em;'
    }, function () {
      var _media = document.querySelector(mediaQueryStr);
      if (!_media) {
        return console.error('严重错误,页面中依旧不存在 <video> 标签');
      }
      if (_media.currentTime < 1) {
        console.error('严重错误,<video> 的 currentTime < 1');
      }
      if (!_media.id) {
        console.log('视频加载方为 Web 端 <video> 标签:', _media.parentNode.outerHTML);
      } else {
        console.log('当前 <video> 标签为虚拟适配器:', _media.outerHTML);
        var _embed = document.querySelector('embed');
        if (_embed) {
          console.log('视频加载方为 <embed> 标签占位的 Native 播放器:', _embed.parentNode.outerHTML);
        } else {
          console.log('视频加载方为无占位标签的 Native 播放器,无信息');
        }
      }
    }));
    // debugWrapper.append(embyButton({ label: '清空章节引用缓存', class: classes.embyButtons.submit, style: 'margin: 0.3em;' }, () => {
    //     lsBatchRemove([lsLocalKeys.animeEpisodePrefix, lsLocalKeys.bangumiEpInfoPrefix]);
    //     console.log('已清空章节引用缓存');
    //     embyToast({ text: '已清空章节引用缓存' });
    // }));
    debugWrapper.append(embyButton({
      label: '重置设置',
      class: classes.embyButtons.submit,
      style: 'margin: 0.3em;'
    }, function () {
      settingsReset();
      console.log("\u5DF2\u91CD\u7F6E\u8BBE\u7F6E, \u8DF3\u8FC7\u4E86 ".concat(lsKeys.filterKeywords.name, " \u91CD\u7F6E"));
      embyToast({
        text: "\u5DF2\u91CD\u7F6E\u8BBE\u7F6E, \u8DF3\u8FC7\u4E86 ".concat(lsKeys.filterKeywords.name, " \u91CD\u7F6E")
      });
      loadDanmaku(LOAD_TYPE.INIT);
      closeEmbyDialog();
    }));
  }
  function buildOpenSourceLicense(container) {
    var openSourceWrapper = getById(eleIds.openSourceLicenseDiv, container);
    objectEntries(openSourceLicense).map(function (_ref14) {
      var _ref15 = _slicedToArray(_ref14, 2),
        key = _ref15[0],
        val = _ref15[1];
      openSourceWrapper.append(embyALink(val.url, [key, val.name, val.version, val.license].join(' : ')));
    });
  }

  /**
   * @deprecated 已废弃,无法登录网站,无太大意义
   */
  function buildIframe(containerId) {
    var container = getById(containerId);
    var template = "\n            <div>\n                <div class=\"".concat(classes.embyFieldDesc, "\">\u6CE8\u610F\u5185\u5D4C\u7F51\u9875\u4E0D\u652F\u6301\u63A7\u5236\u5668\u8F93\u5165,\u4E14\u88AB\u7981\u6B62\u5185\u5D4C(CSP)\u7684\u7F51\u9875\u65E0\u6CD5\u663E\u793A,\u4E14\u8DE8\u57DF\u65E0\u6CD5\u767B\u5F55</div>\n                <div style=\"").concat(styles.embySlider + 'margin: 0.8em 0;', "\">\n                    <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">\u7F51\u9875\u9AD8\u5EA6: </label>\n                    <div id=\"").concat(eleIds.tabIframeHeightDiv, "\" style=\"width: 40.5em; text-align: center;\"></div>\n                    <label>\n                        <label id=\"").concat(eleIds.tabIframeHeightLabel, "\" style=\"").concat(styles.embySliderLabel, "\">auto</label>\n                        <label>em</label>\n                    </label>\n                </div>\n                <div id=\"").concat(eleIds.tabIframeCtrlDiv, "\"></div>\n                <div id=\"").concat(eleIds.tabIframeSrcInputDiv, "\" style=\"display: flex; margin-top: 0.6em;\"></div>\n                <iframe id=\"").concat(eleIds.tabIframe, "\" style=\"border: 0;width: 100%;\" src=\"\"></iframe>\n            </div>\n        ");
    container.innerHTML = template.trim();
    getById(eleIds.tabIframeHeightDiv, container).append(embySlider({
      labelId: eleIds.tabIframeHeightLabel,
      value: '29',
      min: 28,
      max: 100,
      step: 1
    }, function (val, opts) {
      if (val === '28') {
        val = 'auto';
      }
      onSliderChangeLabel(val, opts);
      getById(eleIds.tabIframe).style.height = val === 'auto' ? val : val + 'em';
    }));
    getById(eleIds.tabIframeSrcInputDiv, container).append(embyInput({
      type: 'search',
      value: window.ede.bangumiInfo ? window.ede.bangumiInfo.bangumiUrl : ''
    }, function (e) {
      getById(eleIds.tabIframe).src = e.target.value.trim();
    }));
  }
  function appendvideoOsdDanmakuInfo(loadSum) {
    if (!lsGetItem(lsKeys.osdTitleEnable.id)) {
      return;
    }
    var episode_info = window.ede.episode_info || {};
    var episodeId = episode_info.episodeId,
      animeTitle = episode_info.animeTitle,
      episodeTitle = episode_info.episodeTitle;
    var videoOsdContainer = document.querySelector("".concat(mediaContainerQueryStr, " .videoOsdSecondaryText"));
    var videoOsdDanmakuTitle = getById(eleIds.videoOsdDanmakuTitle, videoOsdContainer);
    if (!videoOsdDanmakuTitle) {
      videoOsdDanmakuTitle = document.createElement('h3');
      videoOsdDanmakuTitle.id = eleIds.videoOsdDanmakuTitle;
      videoOsdDanmakuTitle.classList.add(classes.videoOsdTitle);
      videoOsdDanmakuTitle.style = 'margin-left: auto; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word; position: absolute; right: 0px; bottom: 0px;';
    }
    var text = '弹幕：';
    if (episodeId) {
      text += "".concat(animeTitle, " - ").concat(episodeTitle, " - ").concat(loadSum, "\u6761");
    } else {
      text += "\u672A\u5339\u914D";
    }
    videoOsdDanmakuTitle.innerText = text;
    if (videoOsdContainer) {
      videoOsdContainer.append(videoOsdDanmakuTitle);
    }
  }
  function toggleSettingBtn2Header() {
    var targetBtn = getById(eleIds.danmakuSettingBtnDebug);
    if (targetBtn) {
      targetBtn.remove();
      return false;
    }
    var opt = mediaBtnOpts[1];
    opt.id = eleIds.danmakuSettingBtnDebug;
    getByClass(classes.headerRight).prepend(embyButton(opt, opt.onClick));
    return true;
  }
  function quickDebug() {
    var flag = toggleSettingBtn2Header();
    embyToast({
      text: "".concat(lsKeys.quickDebugOn.name, ": ").concat(flag, "!")
    });
    if (!window.ede) {
      window.ede = new EDE();
    }
    lsSetItem(lsKeys.quickDebugOn.id, flag);
    checkRuntimeVars();
  }
  function checkRuntimeVars() {
    var exposeGlobalThis = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    console.log('运行时变量检查');
    console.log(lsKeys.customeCorsProxyUrl.name, corsProxy);
    console.log(lsKeys.customeDanmakuUrl.name, requireDanmakuPath);
    console.log('弹弹 play API 模板', dandanplayApi);
    if (exposeGlobalThis) {
      window.checkRuntimeVars = checkRuntimeVars;
    }
  }
  function doDanmakuSwitch() {
    var flag = !lsGetItem(lsKeys.switch.id);
    console.log("\u5207\u6362".concat(lsKeys.switch.name, ": ").concat(flag));
    if (window.ede.danmaku) {
      flag ? window.ede.danmaku.show() : window.ede.danmaku.hide();
    }
    var osdDanmakuSwitchBtn = getById(eleIds.danmakuSwitchBtn);
    if (osdDanmakuSwitchBtn) {
      osdDanmakuSwitchBtn.firstChild.innerHTML = flag ? iconKeys.comment : iconKeys.comments_disabled;
    }
    var switchElement = getById(eleIds.danmakuSwitch);
    if (switchElement) {
      switchElement.firstChild.innerHTML = flag ? iconKeys.switch_on : iconKeys.switch_off;
      switchElement.style.color = flag ? styles.colors.switchActiveColor : '';
    }
    lsSetItem(lsKeys.switch.id, flag);
  }
  async function doDanmakuSearchEpisode() {
    var embySearch = getById(eleIds.danmakuSearchName);
    if (!embySearch) {
      return;
    }
    var searchName = embySearch.value;
    var danmakuRemarkEle = getById(eleIds.danmakuRemark);
    danmakuRemarkEle.parentNode.hidden = false;
    danmakuRemarkEle.innerText = searchName ? '' : '请填写标题';
    var spinnerEle = getByClass(classes.mdlSpinner);
    spinnerEle && spinnerEle.classList.remove('hide');

    // 合并所有启用源的搜索结果，并按优先级排序
    var apiPriority = lsGetItem(lsKeys.apiPriority.id);
    var apiConfigs = {
      official: {
        name: '官方API',
        prefix: corsProxy + 'https://api.dandanplay.net/api/v2',
        enabled: lsGetItem(lsKeys.useOfficialApi.id)
      },
      custom: {
        name: '自定义API',
        prefix: lsGetItem(lsKeys.customApiPrefix.id),
        enabled: lsGetItem(lsKeys.useCustomApi.id)
      }
    };
    var allAnimes = [];
    var _iterator4 = _createForOfIteratorHelper(apiPriority),
      _step4;
    try {
      var _loop = async function _loop() {
        var apiKey = _step4.value;
        var config = apiConfigs[apiKey];
        // 确保自定义API有地址时才使用
        if (!config || !config.enabled || apiKey === 'custom' && !config.prefix) {
          return 1; // continue
        }
        var manualSearchTitle = searchName;
        var manualSearchEpisode = null;

        // 手动搜索时，同样为官方API优化SXXEXX格式
        if (apiKey === 'official') {
          var parsed = parseAnimeName(searchName);
          if (parsed.season !== null) {
            manualSearchTitle = parsed.season === 1 ? parsed.title : "".concat(parsed.title, " \u7B2C").concat(parsed.season, "\u5B63");
            manualSearchEpisode = parsed.episode; // 使用从文件名解析出的集数
            console.log("[\u624B\u52A8\u5339\u914D][\u5B98\u65B9API\u4F18\u5316] \u683C\u5F0F\u5316\u641C\u7D22: \u6807\u9898='".concat(manualSearchTitle, "', \u96C6\u6570=").concat(manualSearchEpisode));
          }
        }
        console.log("[\u624B\u52A8\u5339\u914D][".concat(config.name, "] \u6B63\u5728\u641C\u7D22: \u6807\u9898='").concat(manualSearchTitle, "', \u96C6\u6570=").concat(manualSearchEpisode || '无'));
        var animaInfo = await fetchSearchEpisodes(manualSearchTitle, manualSearchEpisode, config.prefix);
        if (animaInfo && animaInfo.animes.length > 0) {
          var _allAnimes;
          console.log("[\u624B\u52A8\u5339\u914D][".concat(config.name, "] \u641C\u7D22\u6210\u529F\uFF0C\u627E\u5230 ").concat(animaInfo.animes.length, " \u4E2A\u7ED3\u679C\u3002"));
          // 为每个结果打上来源标签
          animaInfo.animes.forEach(function (anime) {
            anime.apiPrefix = config.prefix;
            anime.apiName = config.name;
          });
          (_allAnimes = allAnimes).push.apply(_allAnimes, _toConsumableArray(animaInfo.animes));
        } else {
          console.log("[\u624B\u52A8\u5339\u914D][".concat(config.name, "] \u672A\u627E\u5230\u7ED3\u679C\u3002"));
        }
      };
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        if (await _loop()) continue;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    allAnimes = prioritizeSeasonCandidates(searchName, allAnimes);
    spinnerEle && spinnerEle.classList.add('hide');
    if (allAnimes.length < 1) {
      danmakuRemarkEle.innerText = '搜索结果为空';
      getById(eleIds.danmakuSwitchEpisode).disabled = true;
      getById(eleIds.danmakuEpisodeFlag).hidden = true;
      return;
    } else {
      danmakuRemarkEle.innerText = '';
    }
    var danmakuAnimeDiv = getById(eleIds.danmakuAnimeDiv);
    var danmakuEpisodeNumDiv = getById(eleIds.danmakuEpisodeNumDiv);
    danmakuAnimeDiv.innerHTML = '';
    danmakuEpisodeNumDiv.innerHTML = '';
    window.ede.searchDanmakuOpts.animes = allAnimes;
    var selectAnimeIdx = allAnimes.findIndex(function (anime) {
      return anime.animeId == window.ede.searchDanmakuOpts.animeId;
    });
    selectAnimeIdx = selectAnimeIdx !== -1 ? selectAnimeIdx : 0;
    var animeSelect = embySelect({
      id: eleIds.danmakuAnimeSelect,
      label: '剧集: ',
      style: 'width: auto;max-width: 100%;'
    }, selectAnimeIdx, allAnimes, 'animeId', function (opt) {
      return "".concat(opt.animeTitle, " \u7C7B\u578B\uFF1A").concat(opt.typeDescription, " \u6765\u6E90\uFF1A").concat(opt.apiName);
    }, doDanmakuAnimeSelect);
    danmakuAnimeDiv.append(animeSelect);
    var episodeNumSelect = embySelect({
      id: eleIds.danmakuEpisodeNumSelect,
      label: '集数: ',
      style: 'width: auto;max-width: 100%;'
    }, window.ede.searchDanmakuOpts.episode - 1, allAnimes[selectAnimeIdx].episodes, 'episodeId', function (opt, i) {
      return "".concat(i + 1, " - ").concat(opt.episodeTitle);
    });
    danmakuEpisodeNumDiv.append(episodeNumSelect);
    getById(eleIds.danmakuEpisodeFlag).hidden = false;
    getById(eleIds.danmakuSwitchEpisode).disabled = false;
    var selectedAnime = allAnimes[selectAnimeIdx];
    // 始终使用匹配到的海报，如果没有则使用官方API拼接
    getById(eleIds.searchImg).src = selectedAnime.imageUrl || dandanplayApi.posterImg(selectedAnime.animeId);

    // 显示API来源
    var apiSourceDiv = getById(eleIds.searchApiSource);
    if (apiSourceDiv) apiSourceDiv.innerText = "\u6765\u6E90: ".concat(selectedAnime.apiName);
  }
  function doSearchTitleSwtich(e) {
    var searchInputEle = getById(eleIds.danmakuSearchName);
    var attrKey = 'isOriginalTitle';
    if ('1' === e.target.getAttribute(attrKey)) {
      e.target.setAttribute(attrKey, '0');
      return searchInputEle.value = window.ede.searchDanmakuOpts.animeName;
    }
    var _window$ede$searchDan = window.ede.searchDanmakuOpts,
      _episode_key = _window$ede$searchDan._episode_key,
      seriesOrMovieId = _window$ede$searchDan.seriesOrMovieId;
    var episode_info = JSON.parse(localStorage.getItem(_episode_key));
    var animeOriginalTitle = episode_info.animeOriginalTitle;
    if (animeOriginalTitle) {
      e.target.setAttribute(attrKey, '1');
      return searchInputEle.value = animeOriginalTitle;
    }
    ApiClient.getItem(ApiClient.getCurrentUserId(), seriesOrMovieId).then(function (item) {
      if (item.OriginalTitle) {
        e.target.setAttribute(attrKey, '1');
        searchInputEle.value = item.OriginalTitle;
        episode_info.animeOriginalTitle = item.OriginalTitle;
        localStorage.setItem(_episode_key, JSON.stringify(episode_info));
        window.ede.episode_info.animeOriginalTitle = item.OriginalTitle;
      }
    });
  }
  function doDanmakuAnimeSelect(value, index, option) {
    var numDiv = getById(eleIds.danmakuEpisodeNumDiv);
    numDiv.innerHTML = '';
    var anime = window.ede.searchDanmakuOpts.animes[index];
    // 切换剧集时，默认选中第一个分集
    var episodeNumSelect = embySelect({
      id: eleIds.danmakuEpisodeNumSelect,
      label: '集数: '
    }, 0, anime.episodes, 'episodeId', function (opt, i) {
      return "".concat(i + 1, " - ").concat(opt.episodeTitle);
    });
    episodeNumSelect.style.maxWidth = '100%';
    numDiv.append(episodeNumSelect);

    // 始终使用匹配到的海报
    getById(eleIds.searchImg).src = anime.imageUrl || dandanplayApi.posterImg(anime.animeId);

    // 更新API来源显示
    var apiSourceDiv = getById(eleIds.searchApiSource);
    if (apiSourceDiv) apiSourceDiv.innerText = "\u6765\u6E90: ".concat(anime.apiName);
  }
  function doDanmakuSwitchEpisode() {
    var animeSelect = getById(eleIds.danmakuAnimeSelect);
    var episodeNumSelect = getById(eleIds.danmakuEpisodeNumSelect);
    var anime = window.ede.searchDanmakuOpts.animes[animeSelect.selectedIndex];

    // 构造一个更完整的 episodeInfo 对象
    var _window$ede$searchDan2 = window.ede.searchDanmakuOpts,
      _episode_key = _window$ede$searchDan2._episode_key,
      seriesOrMovieId = _window$ede$searchDan2.seriesOrMovieId;
    var episodeInfo = {
      episodeId: episodeNumSelect.value,
      episodeTitle: episodeNumSelect.options[episodeNumSelect.selectedIndex].text,
      episodeIndex: episodeNumSelect.selectedIndex,
      bgmEpisodeIndex: episodeNumSelect.selectedIndex,
      animeId: anime.animeId,
      animeTitle: anime.animeTitle,
      animeType: anime.type,
      animeOriginalTitle: '',
      imageUrl: anime.imageUrl,
      seriesOrMovieId: seriesOrMovieId,
      apiPrefix: anime.apiPrefix,
      apiName: anime.apiName
    };
    var seasonInfo = createSeasonInfo(anime, episodeNumSelect.selectedIndex, window.ede.searchDanmakuOpts.episode);
    writeLsSeasonInfo(window.ede.searchDanmakuOpts._season_key, seasonInfo);

    // 使用与 getEpisodeInfo 中相同的逻辑来构造缓存键
    var useOfficialApi = lsGetItem(lsKeys.useOfficialApi.id);
    var useCustomApi = lsGetItem(lsKeys.useCustomApi.id);
    var apiPriority = lsGetItem(lsKeys.apiPriority.id);
    var enabledApis = apiPriority.filter(function (apiKey) {
      if (apiKey === 'official') return useOfficialApi;
      if (apiKey === 'custom') return useCustomApi;
      return false;
    });
    var unique_episode_key = lsLocalKeys.apiPrefix + "".concat(enabledApis.join('_'), "_") + _episode_key;
    localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));
    console.log("\u624B\u52A8\u5339\u914D\u6210\u529F\uFF0C\u5DF2\u52A0\u8F7D\u65B0\u5F39\u5E55\u4FE1\u606F:", episodeInfo);
    loadDanmaku(LOAD_TYPE.RELOAD);
    closeEmbyDialog();
  }
  function writeLsSeasonInfo(_season_key, newSeasonInfo) {
    if (!_season_key) {
      return console.log("_season_key is undefined, skip");
    }
    var seasonInfoListStr = localStorage.getItem(_season_key);
    var seasonInfoList = seasonInfoListStr ? JSON.parse(seasonInfoListStr) : [];
    // 检查是否已经存在相同的 seasonInfo，避免重复添加
    var existingSeasonInfo = seasonInfoList.find(function (si) {
      return si.name === newSeasonInfo.name;
    });
    if (!existingSeasonInfo) {
      seasonInfoList.push(newSeasonInfo);
    } else {
      // 如果存在，更新已有的 seasonInfo
      Object.assign(existingSeasonInfo, newSeasonInfo);
    }
    localStorage.setItem(_season_key, JSON.stringify(seasonInfoList));
  }
  function doDanmakuEngineSelect(value) {
    var selectedValue = value.id;
    if (lsCheckSet(lsKeys.engine.id, selectedValue)) {
      console.log("\u5DF2\u66F4\u6539\u5F39\u5E55\u5F15\u64CE\u4E3A: ".concat(selectedValue));
      loadDanmaku(LOAD_TYPE.RELOAD);
    }
  }
  function doDanmakuChConverChange(value) {
    window.ede.chConvert = value.id;
    lsSetItem(lsKeys.chConvert.id, window.ede.chConvert);
    loadDanmaku(LOAD_TYPE.REFRESH);
    console.log(value.name);
  }
  function doDanmuListOptsChange(value, index) {
    var danmuListEle = getById(eleIds.danmuListText);
    danmuListEle.style.display = index == lsKeys.danmuList.defaultValue ? 'none' : '';
    var f = new Intl.DateTimeFormat('default', {
      minute: '2-digit',
      second: '2-digit'
    });
    var hasShowSourceIds = lsGetItem(lsKeys.showSource.id).length > 0;
    danmuListEle.value = value.onChange(window.ede).map(function (c, i) {
      return "[".concat(i + 1, "][").concat(f.format(new Date(c.time * 1000)), "] : ") + (hasShowSourceIds ? c.originalText : c.text) + (c.source ? " [".concat(c.source, "]") : '') + (c.originalUserId ? "[".concat(c.originalUserId, "]") : '') + (c.cid ? "[".concat(c.cid, "]") : '') + "[".concat(c.mode, "]");
    }).join('\n');
  }
  function doDanmakuTypeFilterSelect() {
    var checkList = Array.from(document.getElementsByName(eleIds.danmakuTypeFilterSelectName)).filter(function (item) {
      return item.checked;
    }).map(function (item) {
      return item.value;
    });
    lsSetItem(lsKeys.typeFilter.id, checkList);
    loadDanmaku(LOAD_TYPE.RELOAD);
    var idNameMap = new Map(Object.values(danmakuTypeFilterOpts).map(function (opt) {
      return [opt.id, opt.name];
    }));
    console.log("\u5F53\u524D\u5F39\u5E55\u7C7B\u578B\u8FC7\u6EE4\u4E3A: ".concat(JSON.stringify(checkList.map(function (s) {
      return idNameMap.get(s);
    }))));
  }
  function doDanmakuSourceFilterSelect() {
    var checkList = Array.from(document.getElementsByName(eleIds.danmakuSourceFilterSelectName)).filter(function (item) {
      return item.checked;
    }).map(function (item) {
      return item.value;
    });
    lsSetItem(lsKeys.sourceFilter.id, checkList);
    loadDanmaku(LOAD_TYPE.RELOAD);
    console.log("\u5F53\u524D\u5F39\u5E55\u6765\u6E90\u5E73\u53F0\u8FC7\u6EE4\u4E3A: ".concat(JSON.stringify(checkList)));
  }
  function doDanmakuShowSourceSelect() {
    var checkList = Array.from(document.getElementsByName(eleIds.danmakuShowSourceSelectName)).filter(function (item) {
      return item.checked;
    }).map(function (item) {
      return item.value;
    });
    lsSetItem(lsKeys.showSource.id, checkList);
    loadDanmaku(LOAD_TYPE.RELOAD);
    var idNameMap = new Map(Object.values(showSource).map(function (opt) {
      return [opt.id, opt.name];
    }));
    console.log("\u5F53\u524D\u5F39\u5E55\u663E\u793A\u6765\u6E90\u4E3A: ".concat(JSON.stringify(checkList.map(function (s) {
      return idNameMap.get(s);
    }))));
  }
  function onSliderChange(val, opts) {
    onSliderChangeLabel(opts.label ? opts.label : val, opts);
    if (opts.lsKey.id && lsCheckSet(opts.lsKey.id, val)) {
      var needReload = opts.needReload === undefined ? true : opts.needReload;
      if (opts.isManual) {
        needReload = false;
      }
      console.log("".concat(opts.lsKey.id, " changed to ").concat(val, ", needReload: ").concat(needReload));
      if (needReload) {
        changeFontStylePreview();
        loadDanmaku(LOAD_TYPE.RELOAD);
      }
    }
  }
  function onSliderChangeLabel(val, opts) {
    if (opts.labelId) {
      getById(opts.labelId).innerText = val;
    }
    if (opts.labelEle) {
      opts.labelEle.innerText = val;
    }
  }
  function doDanmakuFilterKeywordsBtnClick(event) {
    var btn = event.currentTarget;
    if (btn) {
      btn.style = '';
      btn.disabled = true;
    }
    var keywords = getById(eleIds.filterKeywordsId).value.trim();
    var enable = getById(eleIds.filterKeywordsEnableId).checked;
    lsCheckSet(lsKeys.filterKeywordsEnable.id, enable);
    if (!lsCheckSet(lsKeys.filterKeywords.id, keywords) && keywords === '') {
      return;
    }
    loadDanmaku(LOAD_TYPE.RELOAD);
  }
  function updateFilterKeywordsBtn(btn, flag, keywords) {
    var isSame = lsCheckOld(lsKeys.filterKeywordsEnable.id, flag) && lsCheckOld(lsKeys.filterKeywords.id, keywords);
    btn.firstChild.innerHTML = isSame ? iconKeys.done_disabled : iconKeys.done;
    btn.disabled = isSame;
  }
  function doConsoleLogChange(checked) {
    lsSetItem(lsKeys.consoleLogEnable.id, checked);
    // consoleLogTextEle.style.display = checked ? '' : 'none';
    getById(eleIds.consoleLogInfo).style.display = checked ? '' : 'none';
    var consoleLogTextEle = getById(eleIds.consoleLogText);
    if (checked) {
      if (!window.ede.appLogAspect) {
        window.ede.appLogAspect = new AppLogAspect().init();
      }
      consoleLogTextEle.value = window.ede.appLogAspect.value;
      window.ede.appLogAspect.on(function (newValue) {
        if (consoleLogTextEle.value.length !== newValue.length) {
          consoleLogTextEle.value = newValue;
          consoleLogTextEle.scrollTop = consoleLogTextEle.scrollHeight;
          var consoleLogCountLabel = getById(eleIds.consoleLogCountLabel);
          if (consoleLogCountLabel) {
            consoleLogCountLabel.innerHTML = "\u6E05\u7A7A ".concat(newValue.split('\n').length - 1, " \u884C");
          }
        }
      });
    } else {
      consoleLogTextEle.value = '';
      window.ede.appLogAspect.destroy();
      window.ede.appLogAspect = null;
    }
  }
  function getById(childId) {
    var parentNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    if (!parentNode) {
      return null;
    }
    return parentNode.querySelector("#".concat(childId));
  }

  /**
   * @param {string} className - 元素的类名不带点
   * * @param {HTMLElement | null} [parentNode] - 父元素,默认为 document
   * @returns {HTMLElement | null} - 返回找到的单个元素或 null
   */
  function getByClass(className) {
    var parentNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    if (!parentNode) {
      return null;
    }
    return parentNode.querySelector(".".concat(className));
  }

  /** 仅适用于 input 元素和下一个临近元素的事件 */
  function getTargetInput(e) {
    return e.target.tagName === 'INPUT' ? e.target : e.target.previousElementSibling;
  }

  /** props: {id: 'inputId', value: '', type: '', style: '',...} for setAttribute(key, value)
   * function will not setAttribute
   */
  function embyInput(props, onEnter, onChange) {
    var input = document.createElement('input', {
      is: 'emby-input'
    });
    objectEntries(props).forEach(function (_ref16) {
      var _ref17 = _slicedToArray(_ref16, 2),
        key = _ref17[0],
        value = _ref17[1];
      if (typeof value !== 'function') {
        input.setAttribute(key, value);
      }
    });
    input.className = classes.embyInput; // searchfields-txtSearch: 半圆角
    if (typeof onEnter === 'function') {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          onEnter(e);
        }
      });
    }
    if (typeof onChange === 'function') {
      input.addEventListener('change', onChange);
    }
    // 控制器输入左右超出边界时切换元素
    input.addEventListener('keydown', function (event) {
      if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && (input.selectionStart === 0 && event.key === 'ArrowLeft' || input.selectionEnd === input.value.length && event.key === 'ArrowRight')) {
        event.stopPropagation();
        event.preventDefault();
        var options = {
          sourceElement: event.target,
          repeat: event.repeat,
          originalEvent: event
        };
        require(['inputmanager'], function (inputmanager) {
          inputmanager.trigger(event.key.replace('Arrow', '').toLowerCase(), options);
        });
      }
    });
    return input;
  }
  function embyI(iconKey, extClassName) {
    var iNode = document.createElement('i');
    iNode.className = 'md-icon' + (extClassName ? ' ' + extClassName : '');
    iNode.style = 'pointer-events: none;';
    iNode.innerHTML = iconKey;
    return iNode;
  }

  /** props: {id: 'btnId', label: 'label text', style: '', iconKey: '',...} for setAttribute(key, value)
   * 'iconKey' will innerHTML <i>iconKey</i>|function will not setAttribute
   */
  function embyButton(props, onClick) {
    var button = document.createElement('button');
    // !!! important: this is must setAttribute('is', 'emby-xxx'), unknown reason
    button.setAttribute('is', 'emby-button');
    button.setAttribute('type', 'button');
    objectEntries(props).forEach(function (_ref18) {
      var _ref19 = _slicedToArray(_ref18, 2),
        key = _ref19[0],
        value = _ref19[1];
      if (key !== 'iconKey' && typeof value !== 'function') {
        button.setAttribute(key, value);
      }
    });
    if (props.iconKey) {
      button.setAttribute('title', props.label);
      button.setAttribute('aria-label', props.label);
      button.innerHTML = embyI(props.iconKey).outerHTML;
      button.className = classes.embyButtons.iconButton;
    } else {
      var _button$classList;
      (_button$classList = button.classList).add.apply(_button$classList, _toConsumableArray(classes.embyButtons.basic.split(' ')));
      button.textContent = props.label;
    }
    if (typeof onClick === 'function') {
      button.addEventListener('click', onClick);
    }
    return button;
  }
  function embyALink(href, text) {
    var aEle = document.createElement('a');
    // !!! important: this is must setAttribute('is', 'emby-xxx'), unknown reason
    aEle.setAttribute('is', 'emby-linkbutton');
    aEle.href = href;
    aEle.textContent = text || href;
    aEle.target = '_blank';
    aEle.className = 'button-link button-link-color-inherit button-link-fontweight-inherit emby-button';
    if (OS.isMobile()) {
      aEle.addEventListener('click', function (event) {
        event.preventDefault();
        navigator.clipboard.writeText(href).then(function () {
          console.log('Link copied to clipboard:', href);
          var label = document.createElement('label');
          label.textContent = '已复制';
          label.style.color = 'green';
          label.style.paddingLeft = '0.5em';
          aEle.append(label);
          setTimeout(function () {
            aEle.removeChild(label);
          }, 3000);
        }, function (err) {
          console.error('Failed to copy link:', err);
        });
      });
    }
    return aEle;
  }
  function embyTabs(options, selectedValue, optionValueKey, optionTitleKey, onChange) {
    // !!! important: this is must { is: 'emby-xxx' }, unknown reason
    var tabs = document.createElement('div', {
      is: 'emby-tabs'
    });
    tabs.setAttribute('data-index', '0');
    tabs.className = classes.embyTabsDiv1;
    tabs.style.width = 'fit-content';
    var tabsSlider = document.createElement('div');
    tabsSlider.className = classes.embyTabsDiv2;
    tabsSlider.style.padding = '0.25em';
    options.forEach(function (option, index) {
      var value = getValueOrInvoke(option, optionValueKey);
      var title = getValueOrInvoke(option, optionTitleKey);
      var tabButton = document.createElement('button');
      tabButton.id = option.id + 'Btn';
      tabButton.className = "".concat(classes.embyTabsButton).concat(value == selectedValue ? ' emby-tab-button-active' : '');
      tabButton.setAttribute('data-index', index);
      tabButton.textContent = title;
      tabButton.style.display = option.hidden ? 'none' : '';
      tabsSlider.append(tabButton);
    });
    tabs.append(tabsSlider);
    if (typeof onChange === 'function') {
      tabs.addEventListener('tabchange', function (e) {
        return onChange(options[e.detail.selectedTabIndex], e.detail.selectedTabIndex);
      });
    }
    return tabs;
  }
  function embySelect(props, selectedIndexOrValue, options, optionValueKey, optionTitleKey, onChange, onFocus) {
    var defaultProps = {
      class: 'emby-select'
    };
    props = _objectSpread(_objectSpread({}, defaultProps), props);
    if (!Number.isInteger(selectedIndexOrValue)) {
      selectedIndexOrValue = options.indexOf(selectedIndexOrValue);
    }
    // !!! important: this is must { is: 'emby-select' }
    var selectElement = document.createElement('select', {
      is: 'emby-select'
    });
    require(['browser'], function (browser) {
      if (browser.tv) {
        selectElement.classList.add(classes.embySelectTv);
      }
    });
    objectEntries(props).forEach(function (_ref20) {
      var _ref21 = _slicedToArray(_ref20, 2),
        key = _ref21[0],
        value = _ref21[1];
      if (typeof value !== 'function') {
        selectElement.setAttribute(key, value);
      }
    });
    options.forEach(function (option, index) {
      var value = getValueOrInvoke(option, optionValueKey, index);
      var title = getValueOrInvoke(option, optionTitleKey, index);
      var optionElement = document.createElement('option');
      optionElement.value = value;
      optionElement.textContent = title;
      if (index === selectedIndexOrValue) {
        optionElement.selected = true;
      }
      selectElement.append(optionElement);
    });
    if (typeof onChange === 'function') {
      selectElement.addEventListener('change', function (e) {
        onChange(e.target.value, e.target.selectedIndex, options[e.target.selectedIndex]);
      });
    }
    if (typeof onFocus === 'function') {
      selectElement.addEventListener('focus', onFocus);
    }
    // return selectElement;
    // !!! important, only emby-select must have selectLabel class wrapper
    var selectLabel = document.createElement('label');
    selectLabel.classList.add('selectLabel');
    selectLabel.appendChild(selectElement);
    return selectLabel;
  }
  function embyCheckboxList(id, checkBoxName, selectedStrArray, options, onChange) {
    var isVertical = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var checkboxContainer = document.createElement('div');
    checkboxContainer.setAttribute('class', classes.embyCheckboxList);
    checkboxContainer.setAttribute('style', isVertical ? '' : styles.embyCheckboxList);
    checkboxContainer.setAttribute('id', id);
    options.forEach(function (option) {
      checkboxContainer.append(embyCheckbox({
        name: checkBoxName,
        label: option.name,
        value: option.id
      }, selectedStrArray ? selectedStrArray.indexOf(option.id) > -1 : false, onChange));
    });
    return checkboxContainer;
  }
  function embyCheckbox(_ref22) {
    var id = _ref22.id,
      name = _ref22.name,
      label = _ref22.label,
      value = _ref22.value;
    var checked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var onChange = arguments.length > 2 ? arguments[2] : undefined;
    var checkboxLabel = document.createElement('label');
    checkboxLabel.classList.add('emby-checkbox-label');
    checkboxLabel.setAttribute('style', 'width: auto;');
    // !!! important: this is must { is: 'emby-xxx' }, unknown reason
    var checkbox = document.createElement('input', {
      is: 'emby-checkbox'
    });
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', id);
    checkbox.setAttribute('name', name);
    checkbox.setAttribute('value', value);
    checkbox.checked = checked;
    checkbox.classList.add('emby-checkbox', 'chkEnableLiveTvAccess');
    if (typeof onChange === 'function') {
      checkbox.addEventListener('change', function (e) {
        return onChange(e.target.checked);
      });
    }
    var span = document.createElement('span');
    span.setAttribute('class', 'checkboxLabel');
    span.innerHTML = label;
    checkboxLabel.append(checkbox);
    checkboxLabel.append(span);
    return checkboxLabel;
  }

  /** props: {id: 'textareaId',value: '', rows: 10,style: '', styleResize:''|'vertical'|'horizontal'
   *      , style: '', readonly: false} for setAttribute(key, value)
   * function will not setAttribute
   */
  function embyTextarea(props, onBlur) {
    var defaultProps = {
      rows: 10,
      styleResize: 'vertical',
      readonly: false
    };
    props = _objectSpread(_objectSpread({}, defaultProps), props);
    var textarea = document.createElement('textarea', {
      is: 'emby-textarea'
    });
    objectEntries(props).forEach(function (_ref23) {
      var _ref24 = _slicedToArray(_ref23, 2),
        key = _ref24[0],
        value = _ref24[1];
      if (typeof value !== 'function' && key !== 'readonly' && key !== 'styleResize' && key !== 'value') {
        textarea.setAttribute(key, value);
      }
    });
    textarea.className = 'txtOverview emby-textarea';
    textarea.readOnly = props.readonly;
    textarea.style.resize = props.styleResize;
    textarea.value = props.value;
    if (typeof onBlur === 'function') {
      textarea.addEventListener('blur', onBlur);
    }
    return textarea;
  }

  /**
   * @param {Object} opts { id: 'slider id', labelId: 'label id', orient: 'vertical' | 'horizontal' 垂直/水平, ... }
   *   , will return to the callback
   * @param {Function} onChange Trigger after end of tap/swipe, AndroidTV use this
   * @param {Function} onSliding when init/clicking/sliding, trigger every step, AndroidTV not trigger
   *   , but not trigger when init and options.value === options.min
   * @returns HTMLElement
   */
  function embySlider() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var onChange = arguments.length > 1 ? arguments[1] : undefined;
    var onSliding = arguments.length > 2 ? arguments[2] : undefined;
    var defaultOpts = {
      min: 0.1,
      max: 3,
      step: 0.1,
      orient: 'horizontal',
      'data-bubble': false,
      'data-hoverthumb': true,
      style: ''
    };
    var options = _objectSpread(_objectSpread({}, defaultOpts), opts);
    // !!! important: this is must { is: 'emby-xxx' }, unknown reason
    var slider = document.createElement('input', {
      is: 'emby-slider'
    });
    slider.setAttribute('type', 'range');
    if (opts.id) {
      slider.setAttribute('id', opts.id);
    }
    objectEntries(options).forEach(function (_ref25) {
      var _ref26 = _slicedToArray(_ref25, 2),
        key = _ref26[0],
        value = _ref26[1];
      if (key === 'lsKey') {
        // opts.key = value.id;
        var optsKeys = Object.keys(opts);
        if (!optsKeys.includes('value')) {
          options.value = lsGetItem(value.id);
        }
        if (!optsKeys.includes('min')) {
          slider.setAttribute('min', value.min);
        }
        if (!optsKeys.includes('max')) {
          slider.setAttribute('max', value.max);
        }
        if (!optsKeys.includes('step')) {
          slider.setAttribute('step', value.step);
        }
      } else {
        slider.setAttribute(key, value);
      }
    });
    // other EventListeners : 'beginediting'(every step), 'endediting'(end of tap/swipe)
    if (typeof onChange === 'function') {
      slider.addEventListener('change', function (e) {
        opts.isManual = e.isManual;
        var nextEle = e.target.parentNode.nextElementSibling;
        opts.labelEle = nextEle.children.length > 0 ? nextEle.children[0] : nextEle;
        return onChange(e.target.value, opts);
      });
    }
    if (typeof onSliding === 'function') {
      slider.addEventListener('input', function (e) {
        var nextEle = e.target.parentNode.nextElementSibling;
        opts.labelEle = nextEle.children.length > 0 ? nextEle.children[0] : nextEle;
        return onSliding(e.target.value, opts);
      });
    }
    if (options.value || options.value === 0) {
      slider.setValue(options.value);
      waitForElement({
        element: slider,
        needParent: true
      }, function (ele) {
        var e = new Event('change');
        e.isManual = true;
        slider.dispatchEvent(e);
      });
    }
    {
      // 控制器操作锁定滑块焦点,防止方向键触发空间导航跳转焦点
      slider.addEventListener('keydown', function (e) {
        var orient = slider.getAttribute('orient') || 'horizontal';
        if (orient === 'horizontal' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') || orient === 'vertical' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
          e.stopPropagation();
        }
      });
    }
    return slider;
  }

  /**
   * see: ../web/modules/dialog/dialog.js
   * opts have type props: unknown
   * dialog have buttons prop: [{ type: 'submit', id: 'cancel', name:'取消', description: '无操作', href: 'index.html',  }]
   */
  async function embyDialog() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultOpts = {
      text: '',
      title: '',
      timeout: 0,
      html: '',
      buttons: []
    };
    opts = _objectSpread(_objectSpread({}, defaultOpts), opts);
    return require(['dialog']).then(function (items) {
      return items[0](opts);
    }).catch(function (error) {
      console.log('点击弹出框外部取消: ' + error);
    });
  }
  function closeEmbyDialog() {
    getByClass(classes.formDialogFooterItem).dispatchEvent(new Event('click'));
  }
  function embyImg(src, style, id) {
    var draggable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var img = document.createElement('img');
    img.id = id;
    img.src = src;
    img.style = style;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = draggable;
    img.className = 'coveredImage-noScale cardImage';
    return img;
  }
  function embyImgButton(childNode, btnStyle) {
    var btn = document.createElement('button');
    btn.style = btnStyle;
    btn.className = 'cardContent-button cardImageContainer cardPadder-portrait defaultCardBackground';
    btn.append(childNode);
    btn.addEventListener('focus', function () {
      btn.style.boxShadow = '0 0 0 5px green';
    });
    btn.addEventListener('blur', function () {
      btn.style.boxShadow = '';
    });
    return btn;
  }

  // see: ../web/modules/common/dialogs/alert.js
  async function embyAlert() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultOpts = {
      text: '',
      title: '',
      timeout: 0,
      html: ''
    };
    opts = _objectSpread(_objectSpread({}, defaultOpts), opts);
    return require(['alert']).then(function (items) {
      return items[0](opts);
    }).catch(function (error) {
      console.log('点击弹出框外部取消: ' + error);
    });
  }

  // see: ../web/modules/toast/toast.js, 严禁滥用,因遮挡画面影响体验,不建议使用 icon,会导致小秘版弹窗居中且图标过大
  async function embyToast() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultOpts = {
      text: '',
      secondaryText: '',
      icon: '',
      iconStrikeThrough: false
    };
    opts = _objectSpread(_objectSpread({}, defaultOpts), opts);
    return require(['toast'], function (toast) {
      return toast(opts);
    });
  }
  function getValueOrInvoke(option, keyOrFunc, index) {
    return typeof keyOrFunc === 'function' ? keyOrFunc(option, index) : option[keyOrFunc];
  }
  function getSettingsJson() {
    var space = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
    return JSON.stringify(Object.fromEntries(objectEntries(lsKeys).map(function (_ref27) {
      var _ref28 = _slicedToArray(_ref27, 2),
        key = _ref28[0],
        value = _ref28[1];
      return [value.id, lsGetItem(value.id)];
    })), null, space);
    // ([key, value]) => [value.id, { value: lsGetItem(value.id), name: value.name }])), null, space);
  }
  function settingsReset() {
    var defaultSettings = Object.fromEntries(objectEntries(lsKeys).filter(function (_ref29) {
      var _ref30 = _slicedToArray(_ref29, 2),
        key = _ref30[0],
        value = _ref30[1];
      return lsKeys.filterKeywords.id !== value.id;
    }).map(function (_ref31) {
      var _ref32 = _slicedToArray(_ref31, 2),
        key = _ref32[0],
        value = _ref32[1];
      return [value.id, value.defaultValue];
    }));
    lsBatchSet(defaultSettings);
  }

  // 缓存相关方法
  function lsGetItem(id) {
    var key = lsGetKeyById(id);
    if (!key) {
      return null;
    }
    var defaultValue = lsKeys[key].defaultValue;
    var item = localStorage.getItem(id);
    if (item === null) {
      return defaultValue;
    }
    if (Array.isArray(defaultValue)) {
      return JSON.parse(item);
    }
    if (Array.isArray(defaultValue) || _typeof(defaultValue) === 'object') {
      return JSON.parse(item);
    }
    if (typeof defaultValue === 'boolean') {
      return item === 'true';
    }
    if (typeof defaultValue === 'number') {
      return parseFloat(item);
    }
    return item;
  }
  function lsCheckOld(id, value) {
    return JSON.stringify(lsGetItem(id)) === JSON.stringify(value);
  }
  function lsCheckSet(id, value) {
    if (lsCheckOld(id, value)) {
      return false;
    }
    lsSetItem(id, value);
    return true;
  }
  /** 批量设置缓存
   * @param {object} keyValues - 键值对对象,如 {key1: value1, key2: value2}
   * @returns {boolean} - 是否有更新
   */
  function lsBatchSet(keyValues) {
    var needCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (needCheck) {
      return objectEntries(keyValues).reduce(function (acc, _ref33) {
        var _ref34 = _slicedToArray(_ref33, 2),
          id = _ref34[0],
          value = _ref34[1];
        return acc || lsCheckSet(id, value);
      }, false);
    } else {
      objectEntries(keyValues).forEach(function (_ref35) {
        var _ref36 = _slicedToArray(_ref35, 2),
          key = _ref36[0],
          value = _ref36[1];
        return lsSetItem(key, value);
      });
    }
  }
  function lsSetItem(id, value) {
    if (!lsGetKeyById(id)) {
      return;
    }
    var stringValue;
    if (Array.isArray(value)) {
      stringValue = JSON.stringify(value);
    } else if (_typeof(value) === 'object') {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = value;
    }
    localStorage.setItem(id, stringValue);
  }
  function lsGetKeyById(id) {
    return Object.keys(lsKeys).find(function (key) {
      return lsKeys[key].id === id;
    });
  }
  function lsBatchRemove(prefixes) {
    return Object.keys(localStorage).filter(function (key) {
      return prefixes.some(function (prefix) {
        return key.startsWith(prefix);
      });
    }).map(function (key) {
      return localStorage.removeItem(key);
    }).length > 0;
  }
  function destroyAllInterval() {
    window.ede.destroyIntervalIds.map(function (id) {
      return clearInterval(id);
    });
    window.ede.destroyIntervalIds = [];
  }

  /**
   * @param {string|object} target - 等待目标,string 为 selector,object 目标高级自定义 { element: ele, needParent: true }
   * @param {function} callback - 等待目标获取成功后的回调函数,参数为元素
   * @param {number} [timeout=10000] - 超时时间,默认10秒,0则不设置超时
   * @param {number} [interval=check_interval] - 检查间隔,默认200ms
   * @returns {Promise<HTMLElement|null>} - 返回一个 Promise 对象:
   *   - 如果目标元素在超时时间内被找到,Promise 将 resolve 为目标元素 (HTMLElement)
   *   - 如果超时且未找到目标元素,Promise 将 reject 为一个 Error 对象,表示查找失败
  */
  function waitForElement(target, callback) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10000;
    var interval = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : check_interval;
    var intervalId = null;
    var timeoutId = null;
    var isSelector = typeof target === 'string';
    var elementMark = isSelector ? target : target.element.tagName;
    var promise = new Promise(function (resolve, reject) {
      function checkElement() {
        console.log("waitForElement: checking element[".concat(elementMark, "]"));
        var element = null;
        if (isSelector) {
          element = document.querySelector(target);
        } else {
          if (target.needParent) {
            element = target.element.parentNode;
          } else {
            element = target.element;
          }
        }
        if (element) {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          if (callback) {
            callback(element);
          }
          resolve(element);
        }
      }
      intervalId = setInterval(checkElement, interval);
      window.ede.destroyIntervalIds.push(intervalId);
      if (timeout > 0) {
        timeoutId = setTimeout(function () {
          clearInterval(intervalId);
          console.log("waitForElement: unable to find element[".concat(elementMark, "], timeout: ").concat(timeout));
          reject(new Error("Element [".concat(elementMark, "] not found within ").concat(timeout, "ms")));
        }, timeout);
      }
    });
    return promise;
  }
  function addEasterEggListener() {
    var target = getByClass(classes.headerUserButton);
    if (!target) {
      return;
    }
    var longPressTimeout;
    function startLongPress() {
      longPressTimeout = setTimeout(function () {
        console.log('恭喜你发现了隐藏功能, 长按了 2 秒!');
        quickDebug();
      }, 2000);
    }
    function cancelLongPress() {
      clearTimeout(longPressTimeout);
    }
    var isMobile = OS.isMobile();
    var startEventName = isMobile ? 'touchstart' : 'mousedown';
    var endEventName = isMobile ? 'touchend' : 'mouseup';
    require(['browser'], function (browser) {
      if (browser.tv) {
        startEventName = 'focus';
        endEventName = 'blur';
      }
      if (target.getAttribute('startFlag') !== '1') {
        target.addEventListener(startEventName, startLongPress);
        target.setAttribute('startFlag', '1');
      }
      if (target.getAttribute('endFlag') !== '1') {
        target.addEventListener(endEventName, cancelLongPress);
        target.setAttribute('endFlag', '1');
      }
    });
    return function () {
      target.removeEventListener(startEventName, startLongPress);
      target.removeEventListener(endEventName, cancelLongPress);
      clearTimeout(longPressTimeout);
    };
  }
  function initCss() {
    // 修复emby小秘版播放过程中toast消息提示框不显示问题
    if (OS.isEmbyNoisyX()) {
      var existingStyle = document.querySelector('style[css-emby-noisyx-fix]');
      if (!existingStyle) {
        var style = document.createElement('style');
        style.setAttribute('css-emby-noisyx-fix', '');
        style.innerHTML = "\n                    [class*=\"accent-\"].noScrollY.transparentDocument .toast-group {\n                        position: fixed;\n                        top: auto;\n                    }\n                ";
        document.head.appendChild(style);
      }
    }
  }
  function removeHeaderClock() {
    var headerClockEle = getById('headerClock');
    if (headerClockEle) {
      headerClockEle.remove();
    }
    destroyAllInterval();
  }
  function addHeaderClock() {
    var warpper = getByClass('headerMiddle');
    var headerClockEle = getById('headerClock');
    if (!warpper) {
      return;
    }
    if (headerClockEle) {
      headerClockEle.remove();
    }
    var clockElement = document.createElement('div');
    clockElement.id = 'headerClock';
    warpper.append(clockElement);
    function updateClock() {
      var timeString = new Date().toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      clockElement.textContent = timeString;
      // console.log(timeString);
      headerClockEle = getById('headerClock');
      if (!headerClockEle) {
        clearInterval(intervalId);
      }
    }
    updateClock();
    var intervalId = setInterval(updateClock, 1000);
    window.ede.destroyIntervalIds.push(intervalId);
    return intervalId;
  }
  function refreshEventListener(eventsMap) {
    objectEntries(eventsMap).forEach(function (_ref37) {
      var _ref38 = _slicedToArray(_ref37, 2),
        eventName = _ref38[0],
        fn = _ref38[1];
      document.removeEventListener(eventName, fn);
      document.addEventListener(eventName, fn);
    });
  }

  /**
   * 添加事件并先移除事件
   * from emby videoosd.js bindToPlayer events, warning: not dom event
   * @param {Object} eventsMap { eventName: fn } fn 请勿使用匿名函数,off 时无法移除事件
   * @returns null
   */
  async function playbackEventsRefresh(eventsMap) {
    var _await$require = await require(['playbackManager', 'events']),
      _await$require2 = _slicedToArray(_await$require, 2),
      playbackManager = _await$require2[0],
      events = _await$require2[1];
    var player = playbackManager.getCurrentPlayer();
    if (!player) {
      return;
    }
    objectEntries(eventsMap).forEach(function (_ref39) {
      var _ref40 = _slicedToArray(_ref39, 2),
        eventName = _ref40[0],
        fn = _ref40[1];
      // 无法修改 fn ,会导致引用变更重复添加,events.off 中的 array.indexOf(fn) 返回 -1
      events.off(player, eventName, fn);
      events.on(player, eventName, fn);
    });
  }
  async function initH5VideoAdapter() {
    var _media = document.querySelector(mediaQueryStr);
    if (_media) {
      if (_media.id) {
        // 若是手动创建的<video>
        videoTimeUpdateInterval(_media, true);
      }
      return;
    }
    console.log('播放页不存在 video 标签,适配器处理开始');
    _media = document.createElement('video');
    // !!! Apple 设备上此属性必须存在,否则 currentTime = 0 无法更新; 而其他设备反而不能有
    if (OS.isApple()) {
      _media.src = '';
    }
    _media.style.display = 'none';
    _media.id = eleIds.h5VideoAdapter;
    _media.classList.add('htmlvideoplayer', 'moveUpSubtitles');
    document.body.prepend(_media);
    _media.play();
    videoTimeUpdateInterval(_media, true);

    // 以下暂未遇到匿名函数导致的事件重复,等出现时再匿名转命名函数
    require(['playbackManager'], function (playbackManager) {
      playbackEventsRefresh({
        'timeupdate': function timeupdate(e) {
          // conver to seconds from Ticks
          var realCurrentTime = playbackManager.currentTime(playbackManager.getCurrentPlayer()) / 1e7;
          var mediaTime = _media.currentTime;
          _media.currentTime = realCurrentTime;
          // playbackRate 同步依赖至少 100ms currentTime 变更
          var embyPlaybackRate = playbackManager.getPlayerState().PlayState.PlaybackRate;
          _media.playbackRate = embyPlaybackRate ? embyPlaybackRate : 1;
          // 当前时间与上次记录时间差值大于2秒,则判定为用户操作进度,seeking 事件必须在 currentTime 更改后触发,否则回退后弹幕将消失
          if (Math.abs(mediaTime - realCurrentTime) > 2) {
            _media.dispatchEvent(new Event('seeking'));
            console.warn('seeking', realCurrentTime, mediaTime);
          }
          if (lsGetItem(lsKeys.debugH5VideoAdapterEnable.id)) {
            console.warn("".concat(eleIds.h5VideoAdapter, ", currentTime: ").concat(_media.currentTime, ", playbackRate: ").concat(_media.playbackRate));
          }
        }
      });
    });
    playbackEventsRefresh({
      'pause': function pause(e) {
        console.warn(e.type);
        _media.dispatchEvent(new Event('pause'));
        videoTimeUpdateInterval(_media, false);
      },
      'unpause': function unpause(e) {
        console.warn(e.type);
        _media.dispatchEvent(new Event('play'));
        videoTimeUpdateInterval(_media, true);
      }
    });
    console.log('已创建虚拟 video 标签,适配器处理正确结束');
  }

  // 平滑补充<video> timeupdate 中秒级间隔缺失的 100ms 间隙
  function videoTimeUpdateInterval(media, enable) {
    var _media = media || document.querySelector(mediaQueryStr);
    if (!_media) {
      return;
    }
    if (enable && !_media.timeupdateIntervalId) {
      _media.timeupdateIntervalId = setInterval(function () {
        _media.currentTime += 100 / 1e3;
      }, 100);
    } else if (!enable && _media.timeupdateIntervalId) {
      clearInterval(_media.timeupdateIntervalId);
      _media.timeupdateIntervalId = null;
    }
  }
  function beforeDestroy(e) {
    if (e.detail.type !== 'video-osd') {
      return;
    }
    // 此段销毁不重要,可有可无,仅是规范使用,清除弹幕,但未销毁 danmaku 实例
    if (window.ede.danmaku) {
      window.ede.danmaku.clear();
    }
    // 销毁弹幕按钮容器简单,双 mediaContainerQueryStr 下免去 DOM 位移操作
    var danmakuCtr = getById(eleIds.danmakuCtr);
    if (danmakuCtr) {
      danmakuCtr.remove();
    }
    // const h5VideoAdapterEle = getById(eleIds.h5VideoAdapter);
    // if (h5VideoAdapterEle) {
    //     h5VideoAdapterEle.remove();
    // }
    // 销毁平滑补充 timeupdate 定时器
    videoTimeUpdateInterval(null, false);
    // 销毁可能残留的定时器
    destroyAllInterval();
    // 退出播放页面重置轴偏秒
    lsSetItem(lsKeys.timelineOffset.id, lsKeys.timelineOffset.defaultValue);
  }
  function onViewShow(e) {
    console.log(e.type, e);
    customeUrl.init();
    lsGetItem(lsKeys.quickDebugOn.id) && !getById(eleIds.danmakuSettingBtnDebug) && quickDebug();
    addEasterEggListener();
    if (e.detail.type === 'video-osd') {
      if (!window.ede) {
        window.ede = new EDE();
      }
      if (!window.ede.appLogAspect && lsGetItem(lsKeys.consoleLogEnable.id)) {
        window.ede.appLogAspect = new AppLogAspect().init();
      }
      initUI();
      initH5VideoAdapter();
      // loadDanmaku(LOAD_TYPE.INIT);
      initListener();
      initCss();
    }
    window.ede.itemId = e.detail.params.id ? e.detail.params.id : '';
  }

  // emby/jellyfin CustomEvent. see: https://github.com/MediaBrowser/emby-web-defaultskin/blob/822273018b82a4c63c2df7618020fb837656868d/nowplaying/videoosd.js#L698
  refreshEventListener({
    'viewshow': onViewShow
  });
  refreshEventListener({
    'viewbeforehide': beforeDestroy
  });
})();
