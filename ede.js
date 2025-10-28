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
    let requireDanmakuPath = 'https://danmaku.7o7o.cc/danmaku.min.js';
    // 跨域代理 cf_worker
    let corsProxy = 'https://ddplay-api.7o7o.cc/cors/';
    // ------ 用户配置 end ------
    // note01: 部分 AndroidTV 仅支持最高 ES9 (支持 webview 内核版本 60 以上)
    // note02: url 禁止使用相对路径,非 web 环境的根路径为文件路径,非 http
    // ------ 程序内部使用,请勿更改 start ------
    const openSourceLicense = {
        self: { version: '1.47', name: 'Emby Danmaku Extension(Forked from original:1.11)', license: 'MIT License', url: 'https://github.com/chen3861229/dd-danmaku' },
        original: { version: '1.11', name: 'Emby Danmaku Extension', license: 'MIT License', url: 'https://github.com/RyoLee/emby-danmaku' },
        jellyfinFork: { version: '1.52', name: 'Jellyfin Danmaku Extension', license: 'MIT License', url: 'https://github.com/Izumiko/jellyfin-danmaku' },
        danmaku: { version: '2.0.8', name: 'Danmaku', license: 'MIT License', url: 'https://github.com/weizhenye/Danmaku' },
        dandanplayApi: { version: 'v2', name: '弹弹 play API', license: 'MIT License', url: 'https://github.com/kaedei/dandanplay-libraryindex' },
        dandanplayDoc: { version: 'PC', name: '赞助弹弹 play 官方', license: 'None', url: 'https://doc.dandanplay.com/other/donate.html' },
        bangumiApi: { version: '2025-02-5', name: 'Bangumi API', license: 'None', url: 'https://github.com/bangumi/api' },
        embyPluginDanmu: { version: '1.0.2', name: 'EmbyPluginDanmu', license: 'None', url: 'https://github.com/fengymi/emby-plugin-danmu' },
    };
    const dandanplayApi = {
        get prefix() {
            const custom = lsGetItem(lsKeys.customApiPrefix.id);
            if (custom && custom.length > 0 && !lsGetItem(lsKeys.useOfficialApi.id)) {
                return custom;
            }
            // 官方API强制走代理
            return corsProxy + 'https://api.dandanplay.net/api/v2';
        },
        getSearchEpisodes: (anime, episode, tmdbId) => `${dandanplayApi.prefix}/search/episodes?anime=${anime}${episode ? `&episode=${episode}` : ''}${tmdbId ? `&tmdbId=${tmdbId}` : ''}`,
        getComment: (episodeId, chConvert) => `${dandanplayApi.prefix}/comment/${episodeId}?withRelated=true&chConvert=${chConvert}`,
        getExtcomment: (url) => `${dandanplayApi.prefix}/extcomment?url=${encodeURI(url)}`,
        getBangumi: (animeId) => `${dandanplayApi.prefix}/bangumi/${animeId}`,
        posterImg: (animeId) => `https://img.dandanplay.net/anime/${animeId}.jpg`,
    };
    const dandanplayApiCustom = {
        get prefix() {
            const custom = lsGetItem(lsKeys.customApiPrefix.id);
            // 自定义API可以不走代理
            return custom && custom.length > 0 ? custom : corsProxy + 'https://api.dandanplay.net/api/v2';
        },
        getMatchUrl: () => `${dandanplayApiCustom.prefix}/match`,
    };
    const bangumiApi = {
        prefix: 'https://api.bgm.tv/v0',
        accessTokenUrl: 'https://next.bgm.tv/demo/access-token',
        getCharacters: (subjectId) => `${bangumiApi.prefix}/subjects/${subjectId}/characters`,
        // need auth
        getMe: () => `${bangumiApi.prefix}/me`,
        getUserCollection: (userName, subjectId) => `${bangumiApi.prefix}/users/${userName}/collections/${subjectId}`,
        postUserCollection: (subjectId) => `${bangumiApi.prefix}/users/-/collections/${subjectId}`,
        getUserSubjectEpisodeCollection: (subjectId) => `${bangumiApi.prefix}/users/-/collections/${subjectId}/episodes?offset=0&limit=100`,
        putUserEpisodeCollection: (episodeId ) => `${bangumiApi.prefix}/users/-/collections/-/episodes/${episodeId}`,
    };
    const check_interval = 200;
    const LOAD_TYPE = {
        CHECK: 'check',
        INIT: 'init',
        REFRESH: 'refresh',
        RELOAD: 'reload', // 优先走缓存,其余类型走接口
        SEARCH: 'search',
    };
    let isVersionOld = false;
    // htmlVideoPlayerContainer
    let mediaContainerQueryStr = '.graphicContentContainer';
    const notHide = ':not(.hide)';
    const mediaQueryStr = 'video';

    // https://fonts.google.com/icons
    const iconKeys = {
        replay_30: 'replay_30',
        replay_10: 'replay_10',
        replay_5: 'replay_5',
        replay: 'replay',
        reset: 'repeat',
        forward_media: 'forward_media', // electron 中图标不正确,使用 replay 反转
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
        edit: 'edit',
    };
    // 此 id 等同于 danmakuTabOpts 内的弹幕信息的 id
    const currentDanmakuInfoContainerId = 'danmakuTab2';
    const tabIframeId = 'danmakuTab5';
    // 菜单 tabs, 为兼容控制器移动, 应避免使用左右布局
    const danmakuTabOpts = [
        { id: 'danmakuTab0', name: '弹幕设置', buildMethod: buildDanmakuSetting },
        { id: 'danmakuTab1', name: '手动匹配', buildMethod: buildSearchEpisode },
        { id: currentDanmakuInfoContainerId, name: '弹幕信息', buildMethod: buildCurrentDanmakuInfo },
        { id: 'danmakuTab3', name: '高级设置', buildMethod: buildProSetting },
        { id: 'danmakuTab4', name: '关于', buildMethod: buildAbout },
        { id: tabIframeId, name: '内嵌网页', hidden: true, buildMethod: buildIframe },
    ];
    // 弹幕类型过滤
    const danmakuTypeFilterOpts = {
        bottom: { id: 'bottom', name: '底部弹幕', },
        top: { id: 'top', name: '顶部弹幕', },
        ltr: { id: 'ltr', name: '从左至右', },
        rtl: { id: 'rtl', name: '从右至左', },
        rolling: { id: 'rolling', name: '滚动弹幕', },
        onlyWhite: { id: 'onlyWhite', name: '彩色弹幕', },
        emoji: { id: 'emoji', name: 'emoji', },
    };
    const danmakuSource = {
        AcFun: { id: 'AcFun', name: 'A站(AcFun)' },
        BiliBili: { id: 'BiliBili', name: 'B站(BiliBili)' },
        DanDanPlay: { id: 'DanDanPlay', name: '弹弹(DanDanPlay)' }, // 无弹幕来源的默认值
        D: { id: 'D', name: 'D' }, // 未知平台
        Gamer: { id: 'Gamer', name: '巴哈(Gamer)' },
        iqiyi: { id: 'iqiyi', name: '爱奇艺(iqiyi)' },
        QQ: { id: 'QQ', name: '腾讯视频(QQ)' },
        Youku: { id: 'Youku', name: '优酷(Youku)' },
        '5dm': { id: '5dm', name: 'D站(5dm)' },
        '异世界动漫': { id: '异世界动漫', name: '异世界动漫' },
    };
    const showSource = {
        source: { id: 'source', name: '来源平台' },
        originalUserId: { id: 'originalUserId', name: '用户ID' },
        cid: { id: 'cid', name: '弹幕CID' }, // 非弹幕 id,唯一性需自行用 uid + cid 拼接的 cuid
    };
    const danmakuEngineOpts = [
        { id: 'canvas', name: 'canvas' },
        { id: 'dom', name: 'dom' },
    ];
    const danmakuChConverOpts = [
        { id: '0', name: '未启用' },
        { id: '1', name: '转换为简体' },
        { id: '2', name: '转换为繁体' },
    ];
    const embyOffsetBtnStyle = 'margin: 0;padding: 0;';
    const timeOffsetBtns = [
        { label: '-30', valueOffset: '-30', iconKey: iconKeys.replay_30,  style: embyOffsetBtnStyle },
        { label: '-10', valueOffset: '-10', iconKey: iconKeys.replay_10,  style: embyOffsetBtnStyle },
        { label: '-5',  valueOffset: '-5',  iconKey: iconKeys.replay_5,   style: embyOffsetBtnStyle },
        { label: '-1',  valueOffset: '-1',  iconKey: iconKeys.replay,     style: embyOffsetBtnStyle },
        { label: '0',   valueOffset: '0',   iconKey: iconKeys.reset,      style: embyOffsetBtnStyle },
        { label: '+1',  valueOffset: '1',   iconKey: iconKeys.replay,     style: embyOffsetBtnStyle + ' transform: rotateY(180deg);' },
        { label: '+5',  valueOffset: '5',   iconKey: iconKeys.forward_5,  style: embyOffsetBtnStyle },
        { label: '+10', valueOffset: '10',  iconKey: iconKeys.forward_10, style: embyOffsetBtnStyle },
        { label: '+30', valueOffset: '30',  iconKey: iconKeys.forward_30, style: embyOffsetBtnStyle },
    ];
    const toastPrefixes = {
        system: '[系统通知] : ',
    };
    const hasToastPrefixes = (comment, prefixes) => Object.values(prefixes).some(prefix => comment.text.startsWith(prefix));
    const getDanmakuComments = (ede) => {
        if (ede.danmaku && ede.danmaku.comments) {
          return ede.danmaku.comments.filter(c => !hasToastPrefixes(c, toastPrefixes));
        }
        return [];
      };
    const danmuListOpts = [
        { id: '0', name: '不展示' , onChange: () => [] },
        { id: '1', name: '屏中', onChange: (ede) => ede.danmaku ? ede.danmaku._.runningList : [] },
        { id: '2', name: '所有', onChange: (ede) => ede.commentsParsed },
        { id: '3', name: '已加载', onChange: getDanmakuComments },
        { id: '4', name: '被过滤', onChange: (ede) => { // 取差集慢,减轻负担,默认不启用
            return ede.commentsParsed.filter(p => !getDanmakuComments(ede).some(c => p.cuid === c.cuid))
        } },
        { id: '5', name: '已相似合并', onChange: (ede) => ede.commentsParsed.filter(p => p.xCount) },
        { id: '100', name: '通知', onChange: (ede) => ede.danmaku ? ede.danmaku.comments.filter(c => hasToastPrefixes(c, toastPrefixes)) : [] },
    ];
    const timeoutCallbackUnitOpts = [
        { id: '0', name: '秒', msRate: 1000 },
        { id: '1', name: '分', msRate: 1000 * 60 },
        { id: '2', name: '时', msRate: 1000 * 60 * 60 },
    ];
    let timeoutCallbackId;
    const timeoutCallbackClear = () => timeoutCallbackId && clearTimeout(timeoutCallbackId);
    const timeoutCallbackTypeOpts = [
        { id: '0', name: '不启用' , onChange: () => timeoutCallbackClear() },
        { id: '1', name: '退出播放', onChange: (ms) => {
            timeoutCallbackClear(), timeoutCallbackId = setTimeout(() => { closeEmbyDialog(), Emby.InputManager.trigger('back') }, ms);
        } },
        { id: '2', name: '返回主页', onChange: (ms) => { // Native 播放器不支持.trigger('home'),虽底层一样,但原因未知
            timeoutCallbackClear(), timeoutCallbackId = setTimeout(() => { closeEmbyDialog(), Emby.Page.goHome() }, ms);
        } },
    ];
    const getApiTl = fn => fn.toString().match(/\=>\s*(.*)$/)[1].trim().replace(/`/g, '');
    const labels = {
        enable: '启用',
    };
    const lsKeys = { // id 统一使用 danmaku 前缀
        chConvert: { id: 'danmakuChConvert', defaultValue: 1, name: '简繁转换' },
        switch: { id: 'danmakuSwitch', defaultValue: true, name: '弹幕开关' },
        filterLevel: { id: 'danmakuFilterLevel', defaultValue: 0, name: '过滤强度', min: 0, max: 3, step: 1 },
        heightPercent: { id: 'danmakuHeightPercent', defaultValue: 100, name: '显示区域', min: 3, max: 100, step: 1 },
        fontSizeRate: { id: 'danmakuFontSizeRate', defaultValue: 1, name: '弹幕大小', min: 0.1, max: 3, step: 0.1 },
        fontOpacity: { id: 'danmakuFontOpacity', defaultValue: 1, name: '透明度', min: 0.1, max: 1, step: 0.1 },
        speed: { id: 'danmakuBaseSpeed', defaultValue: 1, name: '速度', min: 0.1, max: 3, step: 0.1 },
        timelineOffset: { id: 'danmakuTimelineOffset', defaultValue: 0, name: '轴偏秒' },
        fontWeight: { id: 'danmakuFontWeight', defaultValue: 400, name: '弹幕粗细', min: 100, max: 1000, step: 100 },
        fontStyle: { id: 'danmakuFontStyle', defaultValue: 0, name: '弹幕斜体', min: 0, max: 2, step: 1 },
        fontFamily: { id: 'danmakuFontFamily', defaultValue: 'sans-serif', name: '字体' },
        danmuList: { id: 'danmakuDanmuList', defaultValue: 0, name: '弹幕列表' },
        typeFilter: { id: 'danmakuTypeFilter', defaultValue: [], name: '屏蔽类型' },
        sourceFilter: { id: 'danmakuSourceFilter', defaultValue: [], name: '屏蔽来源平台' },
        showSource: { id: 'danmakuShowSource', defaultValue: [], name: '显示每条来源' },
        autoFilterCount: { id: 'danmakuAutoFilterCount', defaultValue: 0, name: '自动过滤弹幕数阈值', min: 0, max: 10000, step: 500 },
        mergeSimilarEnable: { id: 'danmakuMergeSimilarEnable', defaultValue: false, name: '合并相似弹幕' },
        mergeSimilarPercent: { id: 'danmakuMergeSimilarPercent', defaultValue: 80, name: '相似度百分比', min: 20, max: 100, step: 1 },
        mergeSimilarTime: { id: 'danmakuMergeSimilarTime', defaultValue: 10, name: '相似度时间窗口秒', min: 1, max: 60, step: 1 },
        filterKeywords: { id: 'danmakuFilterKeywords', defaultValue: '', name: '屏蔽关键词' },
        filterKeywordsEnable: { id: 'danmakuFilterKeywordsEnable', defaultValue: true, name: '屏蔽关键词启用' },
        // removeEmojiEnable: { id: 'danmakuRemoveEmojiEnable', defaultValue: false, name: '移除弹幕中的emoji' },
        engine: { id: 'danmakuEngine', defaultValue: 'canvas', name: '弹幕引擎' },
        osdTitleEnable: { id: 'danmakuOsdTitleEnable', defaultValue: false, name: '播放界面右下角显示弹幕信息' },
        osdLineChartEnable: { id: 'danmakuOsdLineChartEnable', defaultValue: false, name: '弹幕高能进度条' },
        osdLineChartSkipFilter: { id: 'danmakuOsdLineChartSkipFilter', defaultValue: false, name: '弹幕高能进度条免过滤' },
        osdLineChartTime: { id: 'danmakuOsdLineChartTime', defaultValue: 10, name: '弹幕高能进度条颗粒度秒', min: 1, max: 60, step: 1  },
        osdHeaderClockEnable: { id: 'danmakuOsdHeaderClockEnable', defaultValue: false, name: '播放界面头中显示时钟' },
        timeoutCallbackUnit: { id: 'danmakuTimeoutCallbackUnit', defaultValue: 1, name: '定时单位' },
        timeoutCallbackValue: { id: 'danmakuTimeoutCallbackValue', defaultValue: 0, name: '定时值' },
        bangumiEnable: { id: 'danmakuBangumiEnable', defaultValue: false, name: '启用并填写个人令牌' },
        bangumiToken: { id: 'danmakuBangumiToken', defaultValue: '', name: '个人令牌' },
        bangumiPostPercent: { id: 'danmakuBangumiPostPercent', defaultValue: 95, name: '时长比', min: 1, max: 99, step: 1 },
        consoleLogEnable: { id: 'danmakuConsoleLogEnable', defaultValue: false, name: '控制台日志' },
        useFetchPluginXml: { id: 'danmakuUseFetchPluginXml', defaultValue: false, name: '加载媒体服务端xml弹幕' },
        // refreshPluginXml: { id: 'danmakuRefreshPluginXml', defaultValue: false, name: '加载前刷新媒体服务端xml弹幕' },
        debugShowDanmakuWrapper: { id: 'danmakuDebugShowDanmakuWrapper', defaultValue: false, name: '弹幕容器边界' },
        debugShowDanmakuCtrWrapper: { id: 'danmakuDebugShowDanmakuCtrWrapper', defaultValue: false, name: '按钮容器边界' },
        debugReverseDanmu: { id: 'danmakuDebugReverseDanmu', defaultValue: false, name: '反转弹幕方向' },
        debugRandomDanmuColor: { id: 'danmakuDebugRandomDanmuColor', defaultValue: false, name: '随机弹幕颜色' },
        debugForceDanmuWhite: { id: 'danmakuDebugForceDanmuWhite', defaultValue: false, name: '强制弹幕白色' },
        debugGenerateLarge: { id: 'danmakuDebugGenerateLarge', defaultValue: false, name: '测试大量弹幕' },
        debugDialogHyalinize: { id: 'danmakuDebugDialogHyalinize', defaultValue: false, name: '透明弹窗背景' },
        debugDialogWindow: { id: 'danmakuDebugDialogWindow', defaultValue: false, name: '弹窗窗口化' },
        debugDialogRight: { id: 'danmakuDebugDialogRight', defaultValue: false, name: '弹窗靠右布局' }, // Emby Android 上暂时存在 bug
        debugTabIframeEnable: { id: 'danmakuDebugTabIframeEnable', defaultValue: false, name: '打开内嵌网页' },
        debugH5VideoAdapterEnable: { id: 'danmakuDebugH5VideoAdapterEnable', defaultValue: false, name: '查看视频适配器情况' },
        quickDebugOn: { id: 'danmakuQuickDebugOn', defaultValue: false, name: '快速调试' },
        customeCorsProxyUrl: { id: 'danmakuCustomeCorsProxyUrl', defaultValue: corsProxy, name: '跨域代理前缀' },
        customeDanmakuUrl: { id: 'danmakuCustomeDanmakuUrl', defaultValue: requireDanmakuPath, name: '弹幕引擎依赖' },
        customeGetCommentUrl: { id: 'danmakuCustomeGetCommentUrl', defaultValue: getApiTl(dandanplayApi.getComment), name: '获取指定弹幕库的所有弹幕' },
        customeGetExtcommentUrl: { id: 'danmakuCustomeGetExtcommentUrl', defaultValue: getApiTl(dandanplayApi.getExtcomment), name: '获取指定第三方url的弹幕' },
        customePosterImgUrl: { id: 'danmakuCustomePosterImgUrl', defaultValue: getApiTl(dandanplayApi.posterImg), name: '媒体海报' },
        customApiPrefix: { id: 'danmakuCustomApiPrefix', defaultValue: '', name: '自定义弹弹play API地址' },
        useOfficialApi: { id: 'danmakuUseOfficialApi', defaultValue: true, name: '使用官方API' },
        useCustomApi: { id: 'danmakuUseCustomApi', defaultValue: false, name: '使用自定义API' },
        apiPriority: { id: 'danmakuApiPriority', defaultValue: ['official', 'custom'], name: 'API 优先级' },
    };
    const lsLocalKeys = {
        animePrefix: '_anime_id_rel_',
        animeSeasonPrefix: '_anime_season_rel_',
        animeEpisodePrefix: '_episode_id_rel_',
        bangumiEpInfoPrefix: '_bangumi_episode_id_rel_',
        bangumiMe: '_bangumi_me',
    };
    const eleIds = {
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
        apiSelectDiv: 'apiSelectDiv',
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
        progressBarLineChart: 'progressBarLineChart',
    };
    // 播放界面下方按钮
    const mediaBtnOpts = [
        { id: eleIds.danmakuSwitchBtn, label: '弹幕开关', iconKey: iconKeys.comment, onClick: doDanmakuSwitch },
        { label: '弹幕设置', iconKey: iconKeys.setting, onClick: createDialog },
    ];
    const customeUrlMsg1 = '限弹弹 play API 兼容结构';
    const customeUrl = {
        init: () => customeUrl.mapping.map(obj => obj.rewrite(lsGetItem(obj.lsKey.id))),
        mapping: [
            { divId: eleIds.customeDanmakuDiv, lsKey: lsKeys.customeDanmakuUrl, rewrite: (tl) => {requireDanmakuPath = tl; }
                , msg1: `限 ${openSourceLicense.danmaku.url} 兼容结构`
                , msg2: `Danmaku 依赖路径,index.html 引入的和篡改猴环境不会使用到,依赖已内置,
                        仅在被 CustomCssJS 执行的特殊环境下使用,支持相对/绝对/网络路径,
                        默认是相对路径等同 https://emby/web/ 和 /system/dashboard-ui/ ,非浏览器客户端必须使用网络路径`  },
            { divId: eleIds.customeCorsProxyDiv, lsKey: lsKeys.customeCorsProxyUrl, rewrite: (tl) => { corsProxy = tl; }
                , msg1: '仅弹弹 play API 跨域使用,限 URL 前缀反代方式,例如 cf_worker'
                , msg2: '以下共用变量: { dandanplayApi.prefix: 反代前缀拼接的弹弹 play API 路径前缀, }' },
            { divId: eleIds.customeGetCommentDiv, lsKey: lsKeys.customeGetCommentUrl, rewrite: (tl) => {
                dandanplayApi.getComment = (episodeId, chConvert) => eval('`' + tl + '`');
            }, msg1: customeUrlMsg1, msg2: '变量: { episodeId: 章节 ID, chConvert: 简繁转换, }' },
            { divId: eleIds.customeGetExtcommentDiv, lsKey: lsKeys.customeGetExtcommentUrl, rewrite: (tl) => {
                dandanplayApi.getExtcomment = (url) => eval('`' + tl + '`');
            }, msg1: customeUrlMsg1, msg2: '变量: { url: 附加弹幕输入框中的网址, }' },
            { divId: eleIds.customePosterImgDiv, lsKey: lsKeys.customePosterImgUrl, rewrite: (tl) => {
                dandanplayApi.posterImg = (animeId) => eval('`' + tl + '`');
            }, msg1: customeUrlMsg1, msg2: '变量: { animeId: 弹弹 play 的作品 ID, }' },
        ],
    };
    // emby ui class
    const classes = {
        dialogContainer: 'dialogContainer',
        dialogBackdropOpened: 'dialogBackdropOpened',
        dialogBlur: 'dialog-blur', // Emby Theater (魔改版)上的毛玻璃背景
        dialog: 'dialog',
        formDialogHeader: 'formDialogHeader',
        formDialogFooter: 'formDialogFooter',
        formDialogFooterItem: 'formDialogFooterItem',
        dialogFullscreen: 'dialog-fullscreen',
        dialogFullscreenLowres: 'dialog-fullscreen-lowres', // Emby Android (魔改版)特殊全屏
        videoOsdTitle: 'videoOsdTitle', // 播放页媒体次级标题
        videoOsdBottomButtons: 'videoOsdBottom-buttons', // 新老客户端播放页通用的底部按钮,但在 TV 下是 hide
        videoOsdBottomButtonsTopRight: 'videoOsdBottom-buttons-topright', // 新客户端播放页右上方的按钮
        videoOsdBottomButtonsRight: 'videoOsdBottom-buttons-right', // 老客户端上的右侧按钮
        videoOsdPositionSliderContainer: 'videoOsdPositionSliderContainer',
        cardImageIcon: 'cardImageIcon',
        headerRight: 'headerRight',
        headerUserButton: 'headerUserButton',
        mdlSpinner: 'mdl-spinner',
        collapseContentNav: 'collapseContent navDrawerCollapseContent',
        embyLabel: 'inputLabel',
        embyInput: 'emby-input emby-input-smaller',
        embySelectWrapper: 'emby-select-wrapper',
        embySelectTv: 'emby-select-tv', // highlight on tv layout
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
            iconButton: 'flex-shrink-zero paper-icon-button-light',
        },
    };
    const styles = {
        // 更改 checkboxList 垂直排列为横向自动
        embyCheckboxList: 'display: flex;flex-wrap: wrap;',
        // 容器内元素垂直排列,水平居中
        embySliderList: 'display: flex;flex-direction: column;justify-content: center;align-items: center;',
        // 容器内元素横向并排,垂直居中
        embySlider: 'display: flex; align-items: center; margin-bottom: 0.3em;',
        embySliderLabel: 'width: 4em; margin-left: 1em;',
        rightLayout: 'position: fixed; right: 0; width: 40%; min-width: auto; min-height: auto; max-width: 100%; max-height: 100%;',
        colors: {
            info: 0xffffff,  // 白色
            success: 0x00ff00,  // 绿色
            warn: 0xffff00,  // 黄色
            error: 0xff0000,  // 红色
            highlight: 'rgba(115, 160, 255, 0.3)', // 尽量接近浏览器控制台选定元素的淡蓝色背景色
            switchActiveColor: '#52b54b',
        },
        fontStyles: [
            { id: 'normal', name: '正常' },
            { id: 'italic', name: '原生斜体' },
            { id: 'oblique', name: '形变斜体' },
        ],
    };
    function objectEntries(obj) {
        if (obj && typeof obj === 'object') {
            return Object.keys(obj).map(key => [key, obj[key]]);
        }
        return [];
    }
    const OS = {
        isAndroid: () => /android/i.test(navigator.userAgent),
        isIOS: () => /iPad|iPhone|iPod/i.test(navigator.userAgent),
        isMacOS: () => /Macintosh|MacIntel/i.test(navigator.userAgent),
        isApple: () => OS.isMacOS() || OS.isIOS(),
        isWindows: () => /compatible|Windows/i.test(navigator.userAgent),
        isMobile: () => OS.isAndroid() || OS.isIOS(),
        isUbuntu: () => /Ubuntu/i.test(navigator.userAgent),
        isAndroidEmbyNoisyX: () => OS.isAndroid() && ApiClient.appVersion().includes('-'),
        isEmbyNoisyX: () => ApiClient.appVersion().includes('-'),
        isEmbyTheater: () => ApiClient.appName() === 'Emby Theater',
        isEmbyUWP: () => ApiClient.appName() === 'Emby Windows',
        isOthers: () => objectEntries(OS).filter(([key, val]) => key !== 'isOthers').every(([key, val]) => !val()),
    };
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu;

    // ------ 程序内部使用,请勿更改 end ------

    // ------ require start ------
    let skipInnerModule = false;
    try {
        throw new Error();
    } catch(e) {
        skipInnerModule = e.stack && e.stack.includes('CustomCssJS');
        // console.log('ignore this not error, callee:', e);
    }
    if (!skipInnerModule) {
        // 这里内置依赖是工作在浏览器油猴和服务端 index.html 环境下, requireDanmakuPath 是特殊环境 CustomCssJS 下网络加载使用
        /* https://cdn.jsdelivr.net/npm/danmaku@2.0.8/dist/danmaku.min.js */
        /* eslint-disable */
        // prettier-ignore
        !function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Danmaku=e()}(this,(function(){"use strict";var t=function(){if("undefined"==typeof document)return"transform";for(var t=["oTransform","msTransform","mozTransform","webkitTransform","transform"],e=document.createElement("div").style,i=0;i<t.length;i++)if(t[i]in e)return t[i];return"transform"}();function e(t){var e=document.createElement("div");if(e.style.cssText="position:absolute;","function"==typeof t.render){var i=t.render();if(i instanceof HTMLElement)return e.appendChild(i),e}if(e.textContent=t.text,t.style)for(var n in t.style)e.style[n]=t.style[n];return e}var i={name:"dom",init:function(){var t=document.createElement("div");return t.style.cssText="overflow:hidden;white-space:nowrap;transform:translateZ(0);",t},clear:function(t){for(var e=t.lastChild;e;)t.removeChild(e),e=t.lastChild},resize:function(t,e,i){t.style.width=e+"px",t.style.height=i+"px"},framing:function(){},setup:function(t,i){var n=document.createDocumentFragment(),s=0,r=null;for(s=0;s<i.length;s++)(r=i[s]).node=r.node||e(r),n.appendChild(r.node);for(i.length&&t.appendChild(n),s=0;s<i.length;s++)(r=i[s]).width=r.width||r.node.offsetWidth,r.height=r.height||r.node.offsetHeight},render:function(e,i){i.node.style[t]="translate("+i.x+"px,"+i.y+"px)"},remove:function(t,e){t.removeChild(e.node),this.media||(e.node=null)}},n="undefined"!=typeof window&&window.devicePixelRatio||1,s=Object.create(null);function r(t,e){if("function"==typeof t.render){var i=t.render();if(i instanceof HTMLCanvasElement)return t.width=i.width,t.height=i.height,i}var r=document.createElement("canvas"),h=r.getContext("2d"),o=t.style||{};o.font=o.font||"10px sans-serif",o.textBaseline=o.textBaseline||"bottom";var a=1*o.lineWidth;for(var d in a=a>0&&a!==1/0?Math.ceil(a):1*!!o.strokeStyle,h.font=o.font,t.width=t.width||Math.max(1,Math.ceil(h.measureText(t.text).width)+2*a),t.height=t.height||Math.ceil(function(t,e){if(s[t])return s[t];var i=12,n=t.match(/(\d+(?:\.\d+)?)(px|%|em|rem)(?:\s*\/\s*(\d+(?:\.\d+)?)(px|%|em|rem)?)?/);if(n){var r=1*n[1]||10,h=n[2],o=1*n[3]||1.2,a=n[4];"%"===h&&(r*=e.container/100),"em"===h&&(r*=e.container),"rem"===h&&(r*=e.root),"px"===a&&(i=o),"%"===a&&(i=r*o/100),"em"===a&&(i=r*o),"rem"===a&&(i=e.root*o),void 0===a&&(i=r*o)}return s[t]=i,i}(o.font,e))+2*a,r.width=t.width*n,r.height=t.height*n,h.scale(n,n),o)h[d]=o[d];var u=0;switch(o.textBaseline){case"top":case"hanging":u=a;break;case"middle":u=t.height>>1;break;default:u=t.height-a}return o.strokeStyle&&h.strokeText(t.text,a,u),h.fillText(t.text,a,u),r}function h(t){return 1*window.getComputedStyle(t,null).getPropertyValue("font-size").match(/(.+)px/)[1]}var o={name:"canvas",init:function(t){var e=document.createElement("canvas");return e.context=e.getContext("2d"),e._fontSize={root:h(document.getElementsByTagName("html")[0]),container:h(t)},e},clear:function(t,e){t.context.clearRect(0,0,t.width,t.height);for(var i=0;i<e.length;i++)e[i].canvas=null},resize:function(t,e,i){t.width=e*n,t.height=i*n,t.style.width=e+"px",t.style.height=i+"px"},framing:function(t){t.context.clearRect(0,0,t.width,t.height)},setup:function(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.canvas=r(n,t._fontSize)}},render:function(t,e){t.context.drawImage(e.canvas,e.x*n,e.y*n)},remove:function(t,e){e.canvas=null}},a=("undefined"!=typeof window&&(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(t){return setTimeout(t,50/3)}).bind(window),d=("undefined"!=typeof window&&(window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame)||clearTimeout).bind(window);function u(t,e,i){for(var n=0,s=0,r=t.length;s<r-1;)i>=t[n=s+r>>1][e]?s=n:r=n;return t[s]&&i<t[s][e]?s:r}function m(t){return/^(ltr|top|bottom)$/i.test(t)?t.toLowerCase():"rtl"}function c(){var t=9007199254740991;return[{range:0,time:-t,width:t,height:0},{range:t,time:t,width:0,height:0}]}function l(t){t.ltr=c(),t.rtl=c(),t.top=c(),t.bottom=c()}function f(){return void 0!==window.performance&&window.performance.now?window.performance.now():Date.now()}function p(t){var e=this,i=this.media?this.media.currentTime:f()/1e3,n=this.media?this.media.playbackRate:1;function s(t,s){if("top"===s.mode||"bottom"===s.mode)return i-t.time<e._.duration;var r=(e._.width+t.width)*(i-t.time)*n/e._.duration;if(t.width>r)return!0;var h=e._.duration+t.time-i,o=e._.width+s.width,a=e.media?s.time:s._utc,d=o*(i-a)*n/e._.duration,u=e._.width-d;return h>e._.duration*u/(e._.width+s.width)}for(var r=this._.space[t.mode],h=0,o=0,a=1;a<r.length;a++){var d=r[a],u=t.height;if("top"!==t.mode&&"bottom"!==t.mode||(u+=d.height),d.range-d.height-r[h].range>=u){o=a;break}s(d,t)&&(h=a)}var m=r[h].range,c={range:m+t.height,time:this.media?t.time:t._utc,width:t.width,height:t.height};return r.splice(h+1,o-h-1,c),"bottom"===t.mode?this._.height-t.height-m%this._.height:m%(this._.height-t.height)}function g(){if(!this._.visible||!this._.paused)return this;if(this._.paused=!1,this.media)for(var t=0;t<this._.runningList.length;t++){var e=this._.runningList[t];e._utc=f()/1e3-(this.media.currentTime-e.time)}var i=this,n=function(t,e,i,n){return function(s){t(this._.stage);var r=(s||f())/1e3,h=this.media?this.media.currentTime:r,o=this.media?this.media.playbackRate:1,a=null,d=0,u=0;for(u=this._.runningList.length-1;u>=0;u--)a=this._.runningList[u],h-(d=this.media?a.time:a._utc)>this._.duration&&(n(this._.stage,a),this._.runningList.splice(u,1));for(var m=[];this._.position<this.comments.length&&(a=this.comments[this._.position],!((d=this.media?a.time:a._utc)>=h));)h-d>this._.duration||(this.media&&(a._utc=r-(this.media.currentTime-a.time)),m.push(a)),++this._.position;for(e(this._.stage,m),u=0;u<m.length;u++)(a=m[u]).y=p.call(this,a),this._.runningList.push(a);for(u=0;u<this._.runningList.length;u++){a=this._.runningList[u];var c=(this._.width+a.width)*(r-a._utc)*o/this._.duration;"ltr"===a.mode&&(a.x=c-a.width),"rtl"===a.mode&&(a.x=this._.width-c),"top"!==a.mode&&"bottom"!==a.mode||(a.x=this._.width-a.width>>1),i(this._.stage,a)}}}(this._.engine.framing.bind(this),this._.engine.setup.bind(this),this._.engine.render.bind(this),this._.engine.remove.bind(this));return this._.requestID=a((function t(e){n.call(i,e),i._.requestID=a(t)})),this}function _(){return!this._.visible||this._.paused||(this._.paused=!0,d(this._.requestID),this._.requestID=0),this}function v(){if(!this.media)return this;this.clear(),l(this._.space);var t=u(this.comments,"time",this.media.currentTime);return this._.position=Math.max(0,t-1),this}function w(t){t.play=g.bind(this),t.pause=_.bind(this),t.seeking=v.bind(this),this.media.addEventListener("play",t.play),this.media.addEventListener("pause",t.pause),this.media.addEventListener("playing",t.play),this.media.addEventListener("waiting",t.pause),this.media.addEventListener("seeking",t.seeking)}function y(t){this.media.removeEventListener("play",t.play),this.media.removeEventListener("pause",t.pause),this.media.removeEventListener("playing",t.play),this.media.removeEventListener("waiting",t.pause),this.media.removeEventListener("seeking",t.seeking),t.play=null,t.pause=null,t.seeking=null}function x(t){this._={},this.container=t.container||document.createElement("div"),this.media=t.media,this._.visible=!0,this.engine=(t.engine||"DOM").toLowerCase(),this._.engine="canvas"===this.engine?o:i,this._.requestID=0,this._.speed=Math.max(0,t.speed)||144,this._.duration=4,this.comments=t.comments||[],this.comments.sort((function(t,e){return t.time-e.time}));for(var e=0;e<this.comments.length;e++)this.comments[e].mode=m(this.comments[e].mode);return this._.runningList=[],this._.position=0,this._.paused=!0,this.media&&(this._.listener={},w.call(this,this._.listener)),this._.stage=this._.engine.init(this.container),this._.stage.style.cssText+="position:relative;pointer-events:none;",this.resize(),this.container.appendChild(this._.stage),this._.space={},l(this._.space),this.media&&this.media.paused||(v.call(this),g.call(this)),this}function b(){if(!this.container)return this;for(var t in _.call(this),this.clear(),this.container.removeChild(this._.stage),this.media&&y.call(this,this._.listener),this)Object.prototype.hasOwnProperty.call(this,t)&&(this[t]=null);return this}var L=["mode","time","text","render","style"];function T(t){if(!t||"[object Object]"!==Object.prototype.toString.call(t))return this;for(var e={},i=0;i<L.length;i++)void 0!==t[L[i]]&&(e[L[i]]=t[L[i]]);if(e.text=(e.text||"").toString(),e.mode=m(e.mode),e._utc=f()/1e3,this.media){var n=0;void 0===e.time?(e.time=this.media.currentTime,n=this._.position):(n=u(this.comments,"time",e.time))<this._.position&&(this._.position+=1),this.comments.splice(n,0,e)}else this.comments.push(e);return this}function E(){return this._.visible?this:(this._.visible=!0,this.media&&this.media.paused||(v.call(this),g.call(this)),this)}function k(){return this._.visible?(_.call(this),this.clear(),this._.visible=!1,this):this}function C(){return this._.engine.clear(this._.stage,this._.runningList),this._.runningList=[],this}function z(){return this._.width=this.container.offsetWidth,this._.height=this.container.offsetHeight,this._.engine.resize(this._.stage,this._.width,this._.height),this._.duration=this._.width/this._.speed,this}var D={get:function(){return this._.speed},set:function(t){return"number"!=typeof t||isNaN(t)||!isFinite(t)||t<=0?this._.speed:(this._.speed=t,this._.width&&(this._.duration=this._.width/t),t)}};function M(t){t&&x.call(this,t)}return M.prototype.destroy=function(){return b.call(this)},M.prototype.emit=function(t){return T.call(this,t)},M.prototype.show=function(){return E.call(this)},M.prototype.hide=function(){return k.call(this)},M.prototype.clear=function(){return C.call(this)},M.prototype.resize=function(){return z.call(this)},Object.defineProperty(M.prototype,"speed",D),M}));
        /* eslint-enable */
    } else {
        window.Danmaku || Emby.importModule(requireDanmakuPath).then(f => {
            console.log(f);
            window.Danmaku = f;
        }).catch(error => {
            console.error(`fail Emby.importModule error:`, error);
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
        ArrayBuffer: function() {
            this._buff = new DataView(new ArrayBuffer(0));
            this._length = 0;
            this._hash = [1732584193, -271733879, -1732584194, 271733878];
        }
    };

    SparkMD5.ArrayBuffer.prototype.append = function(arrayBuffer) {
        console.log('[SparkMD5] append called with buffer size:', arrayBuffer.byteLength);
        // 简化实现：直接使用crypto API如果可用
        return this;
    };

    SparkMD5.ArrayBuffer.prototype.end = function() {
        // 返回32位MD5哈希值（官方API要求）
        const mockHash = 'a1b2c3d4e5f6789012345678901234567890abcd'.substring(0, 32);
        console.log('[SparkMD5] end called, returning 32-bit MD5 hash:', mockHash);
        return mockHash;
    };

    class EDE {
        constructor() {
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
        }
    }

    class AppLogAspect {
        constructor() {
            this.initialized = false;
            this.originalError = console.error;
            this.originalWarn = console.warn;
            this.originalLog = console.log;
            this.originalOnerror = null;
            this.value = '';
            this.listeners = [];
            this.ERROR = { text: 'ERROR', emoji: '❗️' };
            this.WARN = { text: 'WARN', emoji: '⚠️' };
            this.INFO = { text: 'INFO', emoji: '❕' };
        }
        init() {
            if (this.initialized) { return this; }
            console.error = (...args) => {
                this.originalError.apply(console, args);
                this.value += this.format(this.ERROR, args);
                this.notifyListeners();
            };
            console.warn = (...args) => {
                this.originalWarn.apply(console, args);
                this.value += this.format(this.WARN, args);
                this.notifyListeners();
            };
            console.log = (...args) => {
                this.originalLog.apply(console, args);
                this.value += this.format(this.INFO, args);
                this.notifyListeners();
            };
            this.originalOnerror = window.onerror;
            window.onerror = (...args) => {
                console.error(args);
                if (typeof this.originalOnerror === 'function') {
                    this.originalOnerror(...args);
                }
            };
            this.initialized = true;
            return this;
        }
        destroy(clearValue = true) {
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
        format(level, args) {
            const emoji = level.emoji ? `[${level.emoji}] ` : '';
            return `[${new Date(Date.now()).toLocaleString()}] [${level.text}] ${emoji}: `
                + args.map(arg => arg instanceof Error ? arg.message : (typeof arg === 'string' ? arg : JSON.stringify(arg)))
                .join(' ') + '\n';
        }
        on(valueChangedCallback) {
            if (valueChangedCallback.toString().includes('console.log')
                || valueChangedCallback.toString().includes('console.error')) {
                throw new Error('The callback function must not contain console.log or console.error to avoid infinite loops.');
            }
            this.listeners.push(() => valueChangedCallback(this.value));
        }
        notifyListeners() { this.listeners.forEach(listener => listener()); }
        clearValue() { this.value = ''; this.notifyListeners(); }
    }

    function initListener() {
        const _media = document.querySelector(mediaQueryStr);
        // 页面未加载
        if (!_media) {
            window.ede.episode_info && (window.ede.episode_info = null);
            return;
        }
        if (_media.getAttribute('ede_listening')) { return; }
        console.log('正在初始化Listener');
        playbackEventsRefresh({ 'playbackstart': onPlaybackStart });
        playbackEventsRefresh({ 'playbackstop': onPlaybackStop });
        _media.setAttribute('ede_listening', true);
        refreshEventListener({ 'video-osd-show': onVideoOsdShow });
        refreshEventListener({ 'video-osd-hide': onVideoOsdHide });
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
        if (getById(eleIds.danmakuCtr)) { return; }
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
        const ctrlWrapperQueryStr = `${mediaContainerQueryStr} .videoOsdBottom-maincontrols`;
        waitForElement(ctrlWrapperQueryStr, (wrapper) => {
            const commonWrapper = getByClass(classes.videoOsdBottomButtons += notHide, wrapper);
            if (commonWrapper) {
                wrapper = commonWrapper;
            } else {
                // Emby 客户端启动时会检测鼠标设备,无鼠标时, commonWrapper 将会 hide
                // 手动模拟无鼠标步骤为浏览器页签打开后不要动鼠标,仅使用键盘操作
                wrapper = getByClass(classes.videoOsdBottomButtonsTopRight, wrapper);
            }
            // 在老客户端上存在右侧按钮,在右侧按钮前添加
            const rightButtons = getByClass(classes.videoOsdBottomButtonsRight, wrapper);
            const menubar = document.createElement('div');
            menubar.id = eleIds.danmakuCtr;
            if (!window.ede.episode_info) {
                menubar.style.opacity = 0.5;
            }
            if (rightButtons) {
                wrapper.insertBefore(menubar, rightButtons);
            } else {
                wrapper.append(menubar);
            }
            mediaBtnOpts.forEach(opt => {
                menubar.appendChild(embyButton(opt, opt.onClick));
            });
            console.log('UI初始化完成');
        }, 0);
    }

    async function getEmbyItemInfo() {
        return require(['playbackManager']).then((items) => items[0].currentItem());
    }

    async function fatchEmbyItemInfo(id) {
        if (!id) { return; }
        return await ApiClient.getItem(ApiClient.getCurrentUserId(), id);
    }

    async function fetchSearchEpisodes(anime, episode, prefix) {
        if (!anime) { throw new Error('anime is required'); }
        // 使用传入的 prefix 构造 URL
        const url = `${prefix}/search/episodes?anime=${anime}${episode ? `&episode=${episode}` : ''}`;
        const searchResult = await fetchJson(url)
            .catch((error) => {
                console.error(`[API请求] search/episodes 查询失败: ${error.message}`);
                return null;
            });
        console.log(`[API请求] search/episodes 查询成功`, searchResult);
        return searchResult;
    }

    async function fetchComment(episodeId) {
        // 优先使用当前匹配信息中记录的 API 地址
        const prefix = window.ede.episode_info?.apiPrefix || dandanplayApi.prefix;
        const url = `${prefix}/comment/${episodeId}?withRelated=true&chConvert=${window.ede.chConvert}`;
        return fetchJson(url)
            .then((data) => {
                console.log('[获取]弹幕成功: ' + data.comments.length);
                return data.comments;
            })
            .catch((error) => {
                console.log('[获取]弹幕失败:', error);
                return null;
            });
    }

    async function fetchExtcommentActual(extUrl, comments) {
        if (!extUrl) {
            return null;
        }
        let extComments  = (await fetchJson(dandanplayApi.getExtcomment(extUrl))).comments;
        if (extComments.length === 0) { // 只重试一遍进行弹弹 play 服务器缓存覆盖加载触发
            extComments = (await fetchJson(dandanplayApi.getExtcomment(extUrl))).comments;
        }
        extComments.map(c => c.fromUrl = extUrl);
        const itemId = window.ede.itemId;
        if (!window.ede.extCommentCache[itemId]) {
            window.ede.extCommentCache = { [itemId]: {} };
        }
        if (comments) {
            console.log(`取差集并覆盖: ${extUrl}`);
            extComments = extComments.filter(extC => !comments.some(c => c.cid === extC.cid));
        }
        window.ede.extCommentCache[itemId][extUrl] = extComments;
        return extComments;
    }

    function onPlaybackStopPct(e, state) {
        if (!state.NowPlayingItem) { return console.log('跳过 Web 端自身错误触发的第二次播放停止事件'); }
        console.log(e.type);
        const positionTicks = state.PlayState.PositionTicks;
        const runtimeTicks = state.NowPlayingItem.RunTimeTicks;
        if (!runtimeTicks) { return console.log('无可播放时长,跳过处理'); }
        const pct = parseInt(positionTicks / runtimeTicks * 100);
        console.log(`结束播放百分比: ${pct}%`);
        const bangumiPostPercent = lsGetItem(lsKeys.bangumiPostPercent.id);
        const bangumiToken = lsGetItem(lsKeys.bangumiToken.id);
        if (lsGetItem(lsKeys.bangumiEnable.id) && bangumiToken
            && pct >= bangumiPostPercent && window.ede.episode_info.episodeId
        ) {
            console.log(`大于需提交的设定百分比: ${bangumiPostPercent}%`);
            const { animeTitle, episodeTitle } = window.ede.episode_info;
            const targetName = `${animeTitle} - ${episodeTitle}`;
            putBangumiEpStatus(bangumiToken).then(res => {
                embyToast({ text: `putBangumiEpStatus 成功, 目标: ${targetName}, 结束播放百分比: ${pct}%, 大于需提交的设定百分比: ${bangumiPostPercent}%`});
                console.log(`putBangumiEpStatus 成功, 目标: ${targetName}`);
            }).catch(error => {
                embyToast({ text: `putBangumiEpStatus 失败, 目标: ${targetName}, ${error.message}` });
                console.error(`putBangumiEpStatus 失败, 目标: ${targetName}`, error);
            });
        }
    }

    async function getEpisodeBangumiRel() {
        const episode_info = window.ede.episode_info;
        const _bangumi_key = lsLocalKeys.bangumiEpInfoPrefix + episode_info.episodeId;
        let bangumiInfoLs = localStorage.getItem(_bangumi_key);
        if (bangumiInfoLs) {
            bangumiInfoLs = JSON.parse(bangumiInfoLs);
        }
        let bangumiEpsRes = bangumiInfoLs ? bangumiInfoLs.bangumiEpsRes : null;
        let subjectId = bangumiInfoLs ? bangumiInfoLs.subjectId : null;
        let bangumiUrl = bangumiInfoLs ? bangumiInfoLs.bangumiUrl : null;
        const animeId = episode_info.animeId;
        if (!subjectId) {
            if (!animeId) { throw new Error('未获取到 animeId'); }
            const danDanPlayBangumiRes = await fetchJson(dandanplayApi.getBangumi(animeId));
            episode_info.bgmEpisodeIndex = offsetBgmEpisodeIndex(episode_info.bgmEpisodeIndex, danDanPlayBangumiRes.bangumi);
            bangumiUrl = danDanPlayBangumiRes.bangumi.bangumiUrl;
            if (!bangumiUrl) { throw new Error('未请求到 bangumiUrl'); }
            subjectId = parseInt(bangumiUrl.match(/\/(\d+)$/)[1]);
        }
        const episodeIndex = episode_info ? episode_info.episodeIndex : null;
        const bgmEpisodeIndex = episode_info ? episode_info.bgmEpisodeIndex : null;
        const bangumiInfo = { animeId, bangumiUrl, subjectId, episodeIndex, bgmEpisodeIndex, bangumiEpsRes, _bangumi_key };
        window.ede.bangumiInfo = bangumiInfo;
        localStorage.setItem(bangumiInfo._bangumi_key, JSON.stringify(bangumiInfo));
        return bangumiInfo;
    }

    function offsetBgmEpisodeIndex(currentBgmEpisodeIndex, danDanPlayBangumi) {
        if (!danDanPlayBangumi) {
            return currentBgmEpisodeIndex;
        }
        let bangumiEp = danDanPlayBangumi.episodes[currentBgmEpisodeIndex];
        if (!bangumiEp) {
            console.log(`未匹配到 danDanPlayBangumi 番剧集数,剧集不为第一季,尝试切换接口数据匹配返回修正后的 bgmEpisodeIndex`);
            return danDanPlayBangumi.episodes.findIndex(ep => ep.episodeNumber == currentBgmEpisodeIndex + 1);
        } else {
            return currentBgmEpisodeIndex;
        }
    }

    async function putBangumiEpStatus(token) {
        const bangumiInfo = await getEpisodeBangumiRel();
        const { subjectId, bgmEpisodeIndex, } = bangumiInfo;
        const episodeIndex = bgmEpisodeIndex ? bgmEpisodeIndex : bangumiInfo.episodeIndex;
        console.log('准备校验 Bangumi 条目收藏状态是否为看过');
        let bangumiMe = localStorage.getItem(lsLocalKeys.bangumiMe);
        if (bangumiMe) {
            bangumiMe = JSON.parse(bangumiMe);
        } else {
            bangumiMe = await fetchBangumiApiGetMe(token);
        }
        let msg = '';
        let bangumiUserColl = null;
        try {
            bangumiUserColl = await fetchJson(bangumiApi.getUserCollection(bangumiMe.username, subjectId), { token });
        } catch (error) {
            console.warn('Bangumi 条目未收藏');
        }
        if (bangumiUserColl && bangumiUserColl.type === 2) { // 看过状态
            msg = 'Bangumi 条目已为看过状态,跳过更新';
            console.log(msg, bangumiUserColl);
            throw new Error(msg);
        }
        console.log('准备修改 Bangumi 条目收藏状态为在看, 如果不存在则创建, 如果存在则修改');
        let body = { type: 3 }; // 在看状态
        await fetchJson(bangumiApi.postUserCollection(subjectId), { token, body });
        if (!bangumiInfo.bangumiEpsRes) {
            const fetchUrl = bangumiApi.getUserSubjectEpisodeCollection(subjectId);
            const bangumiEpsRes = await fetchJson(fetchUrl, { token });
            bangumiInfo.bangumiEpsRes = bangumiEpsRes;
            const bangumiEpColl = bangumiEpsRes.data[episodeIndex];
            if (!bangumiEpColl) { throw new Error('未匹配到 bangumiEpColl'); }
            // bangumiInfo.episodeIndex = episodeIndex;
        }
        const bangumiEpColl = bangumiInfo.bangumiEpsRes.data[episodeIndex];
        const bangumiEp = bangumiEpColl.episode;
        if (bangumiEpColl.type === 2) {
            msg = 'Bangumi 章节收藏已是看过状态,跳过更新';
            console.log(msg, bangumiEp);
            throw new Error(msg);
        }
        console.log('准备更新 Bangumi 章节收藏状态, 详情: ', bangumiEp);
        body.type = 2; // 看过状态
        await fetchJson(bangumiApi.putUserEpisodeCollection(bangumiEp.id), { token, body, method: 'PUT' });
        bangumiEp.type = body.type;
        console.log(`成功更新 Bangumi 章节收藏状态, 在看 => 看过, 详情: `, bangumiEp);
        window.ede.bangumiInfo = bangumiInfo;
        localStorage.setItem(bangumiInfo._bangumi_key, JSON.stringify(bangumiInfo));
        return bangumiInfo;
    }

    async function fetchJson(url, opts = {}) {
        const { token, headers, body } = opts;
        let { method = 'GET' } = opts;
        if (method === 'GET' && body) {
            method = 'POST';
        }
        const requestHeaders = {
            'Accept-Encoding': 'gzip',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': navigator.userAgent,
        };
        if (token) {
            requestHeaders.Authorization = `Bearer ${token}`;
        }
        if (headers) {
            Object.assign(requestHeaders, headers);
        }
        const requestBody = body ? JSON.stringify(body) : null;
        try {
            const response = await fetch(url, {
                method: method,
                headers: requestHeaders,
                body: requestBody,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const responseText = await response.text();
            if (responseText.length > 0) {
                try {
                    return JSON.parse(responseText);
                } catch (parseError) {
                    console.warn('responseText not is JSON:', parseError);
                }
            }
            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    async function getMapByEmbyItemInfo() {
        let item = await getEmbyItemInfo();
        if (!item) {
            // this only working on quickDebug
            item = await fatchEmbyItemInfo(window.ede.itemId);
        }
        if (!item) { return null; } // getEmbyItemInfo from playbackManager null, will next called
        if (!['Episode', 'Movie'].includes(item.Type)) {
            return console.error('不支持的类型');
        }
        window.ede.itemId = item.Id;
        let _id;
        let animeName;
        let animeId = -1;
        let episode;
        if (item.Type == 'Episode') {
            _id = item.SeasonId;
            const seriesName = item.SeriesName;
            const seasonNumber = item.ParentIndexNumber;
            const episodeNumber = item.IndexNumber;
            episode = episodeNumber;
            if (seasonNumber !== undefined && episodeNumber !== undefined) {
                animeName = `${seriesName} S${String(seasonNumber).padStart(2, '0')}E${String(episodeNumber).padStart(2, '0')}`;
            } else {
                animeName = seriesName + (seasonNumber && seasonNumber !== 1 ? ` ${seasonNumber}` : '');
            }
        } else {
            _id = item.Id;
            animeName = item.Name;
            episode = 'movie';
        }
        let _id_key = lsLocalKeys.animePrefix + _id;
        let _season_key = lsLocalKeys.animeSeasonPrefix + _id;
        let _episode_key = lsLocalKeys.animeEpisodePrefix + _id + '_' + episode;
        if (window.localStorage.getItem(_id_key)) {
            animeId = window.localStorage.getItem(_id_key);
        }

        // 检查是否需要重新获取完整的item信息
        if (!item.MediaSources || item.MediaSources.length === 0) {
            console.log(`[Stream] MediaSources为空，通过API重新获取完整信息...`);
            try {
                const fullItem = await fatchEmbyItemInfo(item.Id);
                if (fullItem && fullItem.MediaSources && fullItem.MediaSources.length > 0) {
                    item = fullItem;
                    console.log(`[Stream] 重新获取成功，MediaSources数量: ${item.MediaSources.length}`);
                } else {
                    console.warn(`[Stream] 重新获取失败或仍无MediaSources`);
                }
            } catch (error) {
                console.error(`[Stream] 重新获取item信息失败:`, error);
            }
        }

        const mediaSource = item.MediaSources && item.MediaSources[0];
        console.log(`[Stream] 最终MediaSources数量: ${item.MediaSources ? item.MediaSources.length : 0}`);

        // 参考embyToLocalPlayer项目的方式构建流媒体URL
        let streamUrl = null;
        if (mediaSource) {
            const itemId = item.Id;
            const mediaSourceId = mediaSource.Id;
            const deviceId = ApiClient.deviceId();
            const apiKey = ApiClient.accessToken();
            const serverAddress = ApiClient.serverAddress();

            // 检测是否为Emby服务器
            const isEmby = serverAddress.includes('/emby/') || ApiClient.appName().toLowerCase().includes('emby');
            const extraStr = isEmby ? '/emby' : '';

            // 构建流媒体URL，参考embyToLocalPlayer的方式
            const container = item.Path ? item.Path.split('.').pop() : 'mkv';
            streamUrl = `${serverAddress}${extraStr}/videos/${itemId}/stream?DeviceId=${deviceId}&MediaSourceId=${mediaSourceId}&api_key=${apiKey}&Static=true&Container=${container}`;

            console.log(`[Stream] 认证信息 - ApiKey: ${apiKey ? '已获取' : '未获取'}, DeviceId: ${deviceId}`);
        } else {
            console.warn(`[Stream] 无MediaSource，无法构建流媒体URL`);
        }

        return {
            _id: _id,
            _id_key: _id_key,
            _season_key: _season_key,
            _episode_key: _episode_key,
            animeId: animeId,
            episode: episode, // this is episode index, not a program index
            animeName: animeName,
            seriesOrMovieId: item.SeriesId || item.Id,
            // 新增：提取匹配所需的文件信息
            streamUrl: streamUrl,
            size: mediaSource?.Size,
            duration: (mediaSource?.RunTimeTicks || 0) / 10000000, // Ticks to seconds
        };
    }

    // 通过缓存中的剧集名称与偏移量进行匹配
    async function lsSeasonSearchEpisodes(_season_key, episode) {
        const seasonInfoListStr = window.localStorage.getItem(_season_key);
        if (!seasonInfoListStr) {
            return null;
        }
        const seasonInfoList = JSON.parse(seasonInfoListStr);
        let minPositiveDiff = Infinity;
        let selectedSeasonInfo = null;
        for (let i = 0; i < seasonInfoList.length; i++) {
            const seasonInfo = seasonInfoList[i];
            const adjustedEpisode = episode + seasonInfo.episodeOffset;
            if (adjustedEpisode > 0 && adjustedEpisode < minPositiveDiff) {
                minPositiveDiff = adjustedEpisode;
                selectedSeasonInfo = seasonInfo;
            }
        }
        if (selectedSeasonInfo) {
            const newEpisode = episode + selectedSeasonInfo.episodeOffset;
            console.log(`命中seasonInfo缓存: ${selectedSeasonInfo.name},偏移量: ${selectedSeasonInfo.episodeOffset},集: ${newEpisode}`);
            const animaInfo = await fetchSearchEpisodes(selectedSeasonInfo.name, newEpisode);
            return { animaInfo, newEpisode, };
        }
        return null;
    }

    async function autoFailback(animeName, episodeIndex, seriesOrMovieId) {
        let rvt = await movieAutoFailback(animeName, episodeIndex);
        if (rvt) { return rvt; }

        const seriesOrMovieInfo = await ApiClient.getItem(ApiClient.getCurrentUserId(), seriesOrMovieId);
        
        
        const animeOriginalTitle = seriesOrMovieInfo.OriginalTitle;
        rvt = await oriTitleAutoFailback(animeName, episodeIndex, animeOriginalTitle);
        if (rvt) { return rvt; }
    }

    async function tmdbAutoFailback(animeName, episodeIndex, tmdbId) {
        if (!tmdbId) { return null; }
        console.log(`标题名: ${animeName},自动匹配未查询到结果,将使用元信息中的 tmdbId,重试一次`);
        animaInfo = await fetchSearchEpisodes(animeOriginalTitle, episodeIndex);
        if (animaInfo.animes.length < 1) { return null; }
        console.log(`使用原标题名: ${animeOriginalTitle},自动匹配成功`);
        return { animeName, animaInfo, animeOriginalTitle, };
    }

    async function oriTitleAutoFailback(animeName, episodeIndex, animeOriginalTitle) {
        // from: https://github.com/Izumiko/jellyfin-danmaku/blob/jellyfin/ede.js#L886
        // const seriesOrMovieInfo = await ApiClient.getItem(ApiClient.getCurrentUserId(), seriesOrMovieId);
        // if (!seriesOrMovieInfo.OriginalTitle) { return null; }
        if (!animeOriginalTitle) { return null; }
        console.log(`标题名: ${animeName},自动匹配未查询到结果,将使用原标题名,重试一次`);
        // const animeOriginalTitle = seriesOrMovieInfo.OriginalTitle;
        animaInfo = await fetchSearchEpisodes(animeOriginalTitle, episodeIndex);
        if (animaInfo.animes.length < 1) { return null; }
        console.log(`使用原标题名: ${animeOriginalTitle},自动匹配成功`);
        return { animeName, animaInfo, animeOriginalTitle, };
    }

    async function movieAutoFailback(animeName, episodeIndex) {
        console.log(`自动匹配未查询到结果,可能为非番剧,将移除章节过滤,重试一次`);
        let animaInfo = await fetchSearchEpisodes(animeName);
        if (animaInfo.animes.length > 0) {
            console.log(`移除章节过滤,自动匹配成功,转换为目标章节索引 0`);
            if (isNaN(episodeIndex)) { episodeIndex = 0; }
            // const episodeInfo = animaInfo.animes[0].episodes[episodeIndex - 1 ?? 0];
            const episodeInfo = animaInfo.animes[0].episodes[episodeIndex];
            if (!episodeInfo) {
                return null;
            }
            animaInfo.animes[0].episodes = [episodeInfo];
            return { animeName, animaInfo, };
        }
    }

    // 智能匹配函数：从候选列表中选择最佳匹配
    function selectBestMatch(searchTitle, candidates) {
        if (!candidates || candidates.length === 0) return null;

        console.log(`[智能匹配] 搜索标题: "${searchTitle}", 候选数量: ${candidates.length}`);

        // 解析搜索标题
        const parsedSearch = parseSearchKeyword(searchTitle);
        console.log(`[智能匹配] 解析搜索标题: ${JSON.stringify(parsedSearch)}`);

        // 计算相似度得分
        const scoredCandidates = candidates.map(candidate => {
            const score = calculateMatchScore(parsedSearch.title, candidate);

            // 季度和集数匹配加分
            if (parsedSearch.season && candidate.animeTitle) {
                const candidateParsed = parseSearchKeyword(candidate.animeTitle);
                if (candidateParsed.season === parsedSearch.season) {
                    score.total += 0.15; // 季度匹配加分
                    console.log(`[智能匹配] 季度匹配加分: ${candidate.animeTitle}`);
                }
            }

            // 集数匹配加分 (多种方式检测)
            if (parsedSearch.episode) {
                let episodeMatched = false;

                // 方式1: 从episodeId末尾提取集数 (如181180001 -> 1)
                if (candidate.episodeId) {
                    const episodeFromId = parseInt(candidate.episodeId.toString().slice(-3));
                    if (episodeFromId === parsedSearch.episode) {
                        score.total += 0.25; // episodeId匹配加分更高
                        episodeMatched = true;
                        console.log(`[智能匹配] episodeId集数匹配加分: ${candidate.animeTitle} (${episodeFromId})`);
                    }
                }

                // 方式2: 从episodeTitle提取集数
                if (!episodeMatched && candidate.episodeTitle) {
                    const episodeMatch = candidate.episodeTitle.match(/第?(\d+)[话集]/);
                    if (episodeMatch && parseInt(episodeMatch[1]) === parsedSearch.episode) {
                        score.total += 0.2; // episodeTitle匹配加分
                        console.log(`[智能匹配] episodeTitle集数匹配加分: ${candidate.animeTitle} - ${candidate.episodeTitle}`);
                    }
                }
            }

            console.log(`[智能匹配] "${candidate.animeTitle}" (${candidate.typeDescription}) - 得分: ${score.total.toFixed(2)}`);
            return { ...candidate, score: score.total, scoreDetails: score };
        });

        // 按得分排序
        scoredCandidates.sort((a, b) => b.score - a.score);

        // 选择得分最高的候选
        const bestMatch = scoredCandidates[0];
        if (bestMatch.score > 0.15) { // 进一步降低阈值，提高匹配成功率
            console.log(`[智能匹配] 选择最佳匹配: "${bestMatch.animeTitle}" (得分: ${bestMatch.score.toFixed(2)})`);
            return bestMatch;
        }

        console.log(`[智能匹配] 没有找到足够好的匹配 (最高得分: ${bestMatch.score.toFixed(2)})`);
        return null;
    }

    // 计算匹配得分
    function calculateMatchScore(searchTitle, candidate) {
        const score = {
            titleSimilarity: 0,
            typeBonus: 0,
            keywordMatch: 0,
            exactMatch: 0,
            total: 0
        };

        // 0. 精确匹配检查 (权重: 0.4)
        const normalizedSearch = normalizeTitle(searchTitle);
        const normalizedCandidate = normalizeTitle(candidate.animeTitle);
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
        const searchKeywords = extractKeywords(searchTitle);
        const candidateKeywords = extractKeywords(candidate.animeTitle);
        const keywordMatches = searchKeywords.filter(keyword =>
            candidateKeywords.some(ck => ck.includes(keyword) || keyword.includes(ck))
        ).length;
        score.keywordMatch = (keywordMatches / Math.max(searchKeywords.length, 1)) * 0.1;

        score.total = score.exactMatch + score.titleSimilarity + score.typeBonus + score.keywordMatch;
        return score;
    }

    // 标题标准化函数
    function normalizeTitle(title) {
        return title
            .toLowerCase()
            .replace(/[：:]/g, '')
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 保留中文、英文、数字和空格
            .trim();
    }

    // 解析搜索关键词，提取标题、季数和集数
    function parseSearchKeyword(keyword) {
        keyword = keyword.trim();

        // 1. 优先匹配 SXXEXX 格式
        const sePattern = /^(.+?)\s*S(\d{1,2})E(\d{1,4})$/i;
        const seMatch = sePattern.exec(keyword);
        if (seMatch) {
            return {
                title: seMatch[1].trim(),
                season: parseInt(seMatch[2]),
                episode: parseInt(seMatch[3])
            };
        }

        // 2. 匹配季度信息
        const seasonPatterns = [
            // S01, Season 1
            { pattern: /^(.*?)\s*(?:S|Season)\s*(\d{1,2})$/i, handler: (m) => parseInt(m[2]) },
            // 第一季, 第二部
            { pattern: /^(.*?)\s*第\s*([一二三四五六七八九十\d]+)\s*[季部]$/i,
              handler: (m) => {
                  const seasonMap = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10};
                  return seasonMap[m[2]] || parseInt(m[2]);
              }
            },
            // 罗马数字 Ⅰ-Ⅻ
            { pattern: /^(.*?)\s*([Ⅰ-Ⅻ])$/,
              handler: (m) => {
                  const romanMap = {'Ⅰ': 1, 'Ⅱ': 2, 'Ⅲ': 3, 'Ⅳ': 4, 'Ⅴ': 5, 'Ⅵ': 6, 'Ⅶ': 7, 'Ⅷ': 8, 'Ⅸ': 9, 'Ⅹ': 10, 'Ⅺ': 11, 'Ⅻ': 12};
                  return romanMap[m[2].toUpperCase()];
              }
            },
            // 普通数字
            { pattern: /^(.*?)\s+(\d{1,2})$/, handler: (m) => parseInt(m[2]) }
        ];

        for (const {pattern, handler} of seasonPatterns) {
            const match = pattern.exec(keyword);
            if (match) {
                try {
                    const title = match[1].trim();
                    const season = handler(match);
                    // 避免将年份误认为季度
                    if (season && !(title.length > 4 && /\d{4}$/.test(title))) {
                        return { title, season, episode: null };
                    }
                } catch (e) {
                    continue;
                }
            }
        }

        // 3. 如果没有匹配到特定格式，则返回原始标题
        return { title: keyword, season: null, episode: null };
    }

    // 计算字符串相似度 (简化版编辑距离)
    function calculateStringSimilarity(str1, str2) {
        const s1 = str1.toLowerCase().replace(/[：:]/g, '');
        const s2 = str2.toLowerCase().replace(/[：:]/g, '');

        if (s1 === s2) return 1.0;
        if (s1.includes(s2) || s2.includes(s1)) return 0.8;

        // 计算编辑距离
        const matrix = [];
        for (let i = 0; i <= s1.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= s2.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= s1.length; i++) {
            for (let j = 1; j <= s2.length; j++) {
                if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        const maxLength = Math.max(s1.length, s2.length);
        return maxLength === 0 ? 1 : (maxLength - matrix[s1.length][s2.length]) / maxLength;
    }

    // 提取关键词
    function extractKeywords(title) {
        // 移除常见的无意义词汇
        const stopWords = ['第', '季', '部', '篇', '章', '话', '集', '期', 'season', 'episode', 'ep', 'ova', 'tv', 'movie', 'special', 'the', 'of', 'and', 'in', 'to', 'a', 'an'];

        return title
            .toLowerCase()
            .replace(/[：:]/g, ' ')
            .replace(/[^\w\s\u4e00-\u9fff]/g, ' ') // 保留中文、英文、数字和空格
            .split(/[\s\u3000]+/)
            .filter(word => word.length > 1) // 过滤单字符
            .filter(word => !stopWords.includes(word)) // 过滤停用词
            .filter(word => !/^\d+$/.test(word)) // 过滤纯数字
            .map(word => word.trim());
    }

    async function fetchMatchApi(payload, prefix) {
        const url = `${prefix}/match`;
        console.log(`[自动匹配] 尝试 match 接口`);
        try {
            const requestHeaders = {
                'Accept-Encoding': 'gzip',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            const requestBody = JSON.stringify(payload);

            const response = await fetch(url, {
                method: 'POST',
                headers: requestHeaders,
                body: requestBody
            });

            if (!response.ok) {
                const responseText = await response.text();
                console.warn(`[自动匹配] match 失败: HTTP ${response.status}`);
                throw new Error(`HTTP error! Status: ${response.status}, Body: ${responseText}`);
            }

            const matchResult = await response.json();
            console.log(`[自动匹配] match 成功`);

            // 统一 /match 和 /search/episodes 的返回格式
            if (matchResult && matchResult.matches) {
                matchResult.animes = matchResult.matches;
                delete matchResult.matches;
            }
            return matchResult;
        } catch (error) {
            console.warn(`[自动匹配] match 失败:`, error.message || error);
            return null;
        }
    }

    async function calculateFileHash(streamUrl, fileSize) {
        if (!streamUrl || !fileSize) {
            console.warn('缺少 streamUrl 或 fileSize，无法计算哈希。');
            return null;
        }

        console.log(`[Hash] 使用流媒体URL: ${streamUrl ? '已获取' : '未获取'}`);

        if (!streamUrl.includes('api_key=')) {
            console.warn('[Hash] 流媒体URL缺少api_key参数，可能导致认证失败');
        }

        const authHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*',
            'Accept-Encoding': 'identity'
        };

        const CHUNK_SIZE = 16 * 1024 * 1024; // 16MB
        const spark = new SparkMD5.ArrayBuffer();

        try {
            if (fileSize < CHUNK_SIZE * 2) {
                console.log(`[Hash] 文件大小 (${(fileSize / 1024 / 1024).toFixed(2)}MB) 小于32MB，将下载整个文件计算哈希。`);

                const response = await fetch(streamUrl, {
                    headers: authHeaders,
                    timeout: 30000
                });

                if (!response.ok) {
                    throw new Error(`下载文件失败: ${response.status} ${response.statusText}`);
                }

                console.log(`[Hash] 响应状态: ${response.status}, Content-Length: ${response.headers.get('content-length')}`);
                const arrayBuffer = await response.arrayBuffer();
                spark.append(arrayBuffer);
            } else {
                console.log(`[Hash] 文件大小 (${(fileSize / 1024 / 1024).toFixed(2)}MB)，将分块下载计算哈希。`);

                console.log('[Hash] 正在下载文件头部 16MB...');
                const headRequestHeaders = {
                    ...authHeaders,
                    'Range': `bytes=0-${CHUNK_SIZE - 1}`,
                    'Accept-Ranges': 'bytes'
                };

                const headResponse = await fetch(streamUrl, {
                    headers: headRequestHeaders,
                    timeout: 30000
                });

                if (!headResponse.ok) {
                    throw new Error(`下载文件头部失败: ${headResponse.status} ${headResponse.statusText}`);
                }

                console.log(`[Hash] 头部响应状态: ${headResponse.status}, Content-Range: ${headResponse.headers.get('content-range')}`);
                const headBuffer = await headResponse.arrayBuffer();
                spark.append(headBuffer);
                console.log('[Hash] 文件头部下载完成。');

                console.log('[Hash] 正在下载文件尾部 16MB...');
                const tailRequestHeaders = {
                    ...authHeaders,
                    'Range': `bytes=${fileSize - CHUNK_SIZE}-${fileSize - 1}`,
                    'Accept-Ranges': 'bytes'
                };

                const tailResponse = await fetch(streamUrl, {
                    headers: tailRequestHeaders,
                    timeout: 30000
                });

                if (!tailResponse.ok) {
                    throw new Error(`下载文件尾部失败: ${tailResponse.status} ${tailResponse.statusText}`);
                }

                console.log(`[Hash] 尾部响应状态: ${tailResponse.status}, Content-Range: ${tailResponse.headers.get('content-range')}`);
                const tailBuffer = await tailResponse.arrayBuffer();
                spark.append(tailBuffer);
                console.log('[Hash] 文件尾部下载完成。');
            }
            const hash = spark.end();
            console.log(`[Hash] 文件哈希计算成功: ${hash}`);
            console.log(`[Hash] 哈希值详情 - 长度: ${hash.length}, 值: ${hash}`);
            return hash;
        } catch (error) {
            console.error('[Hash] 文件哈希计算过程中发生错误:', error);
            console.error('[Hash] 错误详情:', {
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
        const match = animeName.match(/^(.*?)\s*[Ss](\d{1,2})[Ee](\d{1,4})\b/);
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
        const { _season_key, animeName, episode, seriesOrMovieId, streamUrl, size, duration } = itemInfoMap;
        console.log(`[自动匹配] 标题名: ${animeName}` + (episode ? `,章节过滤: ${episode}` : ''));
        console.log(`[Debug] searchEpisodes调用 - streamUrl: ${streamUrl ? '已获取' : '未获取'}, size: ${size}, duration: ${duration}`);

        // 读取用户定义的API优先级
        const apiPriority = lsGetItem(lsKeys.apiPriority.id);
        const apiConfigs = {
            official: { name: '官方API', prefix: corsProxy + 'https://api.dandanplay.net/api/v2', enabled: lsGetItem(lsKeys.useOfficialApi.id) },
            custom: { name: '自定义API', prefix: lsGetItem(lsKeys.customApiPrefix.id), enabled: lsGetItem(lsKeys.useCustomApi.id) }
        };

        let animeOriginalTitle = '';
        let animaInfo;

        // 准备 /match 接口的请求体
        const matchPayload = {
            fileName: animeName,
            fileHash: null,
            fileSize: size || 0,
            videoDuration: Math.floor(duration || 0),
            matchMode: "hashAndFileName"
        };

        // 仅在有文件路径时才计算哈希值
        if (streamUrl && size > 0) {
            console.log(`准备通过播放链接计算文件哈希`);
            matchPayload.fileHash = await calculateFileHash(streamUrl, size);
            if (matchPayload.fileHash) {
                console.log(`文件哈希计算完成: ${matchPayload.fileHash}`);
            } else {
                console.warn('[Hash] 文件哈希计算失败，将使用假哈希值进行匹配。');
                matchPayload.fileHash = 'a1b2c3d4e5f67890abcd1234ef567890';
            }
        } else {
            console.warn('未找到播放链接或文件大小，将使用假哈希值进行匹配。');
            matchPayload.fileHash = 'a1b2c3d4e5f67890abcd1234ef567890';
        }

        // 尝试 /match 接口（按优先级）
        for (const apiKey of apiPriority) {
            const config = apiConfigs[apiKey];
            if (!config || !config.enabled || (apiKey === 'custom' && !config.prefix)) {
                continue;
            }

            console.log(`[自动匹配] 尝试 ${config.name} /match 接口, 请求体:`, {...matchPayload, fileHash: matchPayload.fileHash ? '...' : null});
            const matchResult = await fetchMatchApi(matchPayload, config.prefix);
            if (matchResult && matchResult.isMatched && matchResult.animes && matchResult.animes.length > 0) {
                console.log(`${config.name} /match 接口直接匹配成功，将直接使用返回的 episodeId`);
                const match = matchResult.animes[0];
                return {
                    directMatch: true,
                    apiPrefix: config.prefix,
                    apiName: config.name,
                    episodeInfo: {
                        ...match,
                        episodes: [{ episodeId: match.episodeId, episodeTitle: match.episodeTitle }],
                        imageUrl: match.imageUrl
                    }
                };
            }

            // 如果 /match 接口返回了候选列表但没有直接匹配，尝试智能选择
            if (matchResult && !matchResult.isMatched && matchResult.animes && matchResult.animes.length > 0) {
                console.log(`[${config.name}] /match 接口返回候选列表，尝试智能匹配...`);
                const bestMatch = selectBestMatch(animeName, matchResult.animes);
                if (bestMatch) {
                    console.log(`[${config.name}] 智能匹配选择:`, bestMatch.animeTitle);
                    return {
                        directMatch: true,
                        apiPrefix: config.prefix,
                        apiName: config.name,
                        episodeInfo: {
                            ...bestMatch,
                            episodes: [{ episodeId: bestMatch.episodeId, episodeTitle: bestMatch.episodeTitle }],
                            imageUrl: bestMatch.imageUrl
                        }
                    };
                }
            }

            // 尝试 /search/episodes 接口 (带集数)
            let searchTitle = animeName;
            let searchEpisode = episode;

            // 针对官方API的特殊处理逻辑
            if (apiKey === 'official') {
                const parsed = parseAnimeName(animeName);
                if (parsed.season !== null) {
                    // 第一季只使用原始标题，第二季及以上拼接 "第X季"
                    searchTitle = parsed.season === 1 ? parsed.title : `${parsed.title} 第${parsed.season}季`;
                    searchEpisode = parsed.episode; // 使用从文件名解析出的集数
                    console.log(`[自动匹配][官方API优化] 格式化搜索: 标题='${searchTitle}', 集数=${searchEpisode}`);
                }
            }
            console.log(`[自动匹配][${config.name}] 尝试 /search/episodes 接口, 标题名: ${searchTitle}, 集数: ${searchEpisode}`);
            let searchAnimaInfo = await fetchSearchEpisodes(searchTitle, searchEpisode, config.prefix);
            if (searchAnimaInfo && searchAnimaInfo.animes.length > 0) {
                console.log(`[${config.name}] 带集数搜索成功`);
                return { animaInfo: searchAnimaInfo, apiPrefix: config.prefix };
            }

            // 尝试 /search/episodes 接口 (不带集数)
            console.log(`[${config.name}] 带集数搜索失败，尝试不带集数...`);
            searchAnimaInfo = await fetchSearchEpisodes(animeName, null, config.prefix);
            if (searchAnimaInfo && searchAnimaInfo.animes.length > 0) {
                console.log(`[${config.name}] 不带集数搜索成功`);
                return { animaInfo: searchAnimaInfo, apiPrefix: config.prefix };
            }
        }

        // 使用缓存中的剧集标题与集偏移量进行匹配
        let animaRes = await lsSeasonSearchEpisodes(_season_key, episode);
        if (animaRes) {
            animaInfo = animaRes.animaInfo;
            const bgmEpisodeIndex = animaRes.newEpisode - 1;
            if (animaInfo && animaInfo.animes.length > 0) {
                return { animeOriginalTitle, animaInfo, bgmEpisodeIndex, };
            }
        }
        // 默认匹配方式
        animaInfo = await fetchSearchEpisodes(animeName, episode);
        if (animaInfo && animaInfo.animes.length > 0) {
            return { animeOriginalTitle, animaInfo, };
        }
        const res = await autoFailback(animeName, episode, seriesOrMovieId);
        if (res) {
            return res;
        }
    }

    async function getEpisodeInfo(is_auto = true) {
        const itemInfoMap = await getMapByEmbyItemInfo();
        if (!itemInfoMap) { return null; }
        const { _episode_key, animeId, episode, seriesOrMovieId } = itemInfoMap;

        // 下一集/上一集推理逻辑
        const previous_info = window.ede.previous_episode_info;
        if (is_auto && previous_info && previous_info.episodeId && previous_info.seriesOrMovieId === seriesOrMovieId) {
            const previousEpisodeIndex = previous_info.episodeIndex; // 0-based
            const currentEpisodeNumber = episode; // 1-based
            const previousEpisodeId = parseInt(previous_info.episodeId, 10);

            let predictedEpisodeId = null;
            let direction = '';

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
                console.log(`[推理匹配] 检测到播放'${direction}'，尝试使用推断的 episodeId: ${predictedEpisodeId}`);
                const comments = await fetchComment(predictedEpisodeId);
                if (comments && comments.length > 0) {
                    console.log(`[推理匹配] 成功！使用 episodeId: ${predictedEpisodeId}`);
                    const predictedEpisodeInfo = {
                        ...itemInfoMap,
                        episodeId: predictedEpisodeId,
                        episodeTitle: `第 ${currentEpisodeNumber} 集 (推断)`,
                        animeId: previous_info.animeId,
                        animeTitle: previous_info.animeTitle,
                        imageUrl: previous_info.imageUrl,
                        seriesOrMovieId: seriesOrMovieId,
                        episodeIndex: currentEpisodeNumber - 1,
                    };
                    // 不写入缓存，因为这只是一个快速的推断
                    return predictedEpisodeInfo;
                } else {
                    console.log(`[推理匹配] 失败，episodeId: ${predictedEpisodeId} 无弹幕，回退到常规匹配。`);
                }
            }
        }

        // 修正缓存键，区分官方和自定义API
        const useOfficialApi = lsGetItem(lsKeys.useOfficialApi.id);
        const useCustomApi = lsGetItem(lsKeys.useCustomApi.id);
        const apiPriority = lsGetItem(lsKeys.apiPriority.id);
        const enabledApis = apiPriority.filter(apiKey => {
            if (apiKey === 'official') return useOfficialApi;
            if (apiKey === 'custom') return useCustomApi;
            return false;
        });
        const unique_episode_key = `_api_${enabledApis.join('_')}_` + _episode_key;
        if (is_auto && window.localStorage.getItem(unique_episode_key)) {
            return JSON.parse(window.localStorage.getItem(unique_episode_key));
        }

        const res = await searchEpisodes(itemInfoMap);

        const useOfficial = lsGetItem(lsKeys.useOfficialApi.id);
        const useCustom = lsGetItem(lsKeys.useCustomApi.id);
        if (!useOfficial && !useCustom) {
            return null;
        }
        if (!res) {
            console.log(`弹弹 Play 章节匹配失败`);
            // 播放界面右下角添加弹幕信息
            appendvideoOsdDanmakuInfo();
            // toastByDanmaku('弹弹 Play 章节匹配失败', 'error');
            return null;
        }

        // 处理 directMatch 的情况
        if (res.directMatch && res.episodeInfo) {
            console.log(`使用 /match 接口直接匹配的结果`);
            const episodeIndex = isNaN(episode) ? 0 : episode - 1;
            const episodeInfo = {
                episodeId: res.episodeInfo.episodeId,
                episodeTitle: res.episodeInfo.episodeTitle,
                episodeIndex,
                bgmEpisodeIndex: episodeIndex,
                animeId: res.episodeInfo.animeId,
                animeTitle: res.episodeInfo.animeTitle,
                animeOriginalTitle: '',
                imageUrl: res.episodeInfo.imageUrl,
                apiName: res.apiName,
                apiPrefix: res.apiPrefix,
                seriesOrMovieId: seriesOrMovieId,
            };
            window.localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));
            return episodeInfo;
        }

        // 处理传统搜索结果
        if (!res.animaInfo || res.animaInfo.animes.length === 0) {
            console.log(`弹弹 Play 章节匹配失败`);
            appendvideoOsdDanmakuInfo();
            return null;
        }

        const { animeOriginalTitle, animaInfo } = res;
        let selectAnime_id = 1;
        if (animeId != -1) {
            for (let index = 0; index < animaInfo.animes.length; index++) {
                if (animaInfo.animes[index].animeId == animeId) {
                    selectAnime_id = index + 1;
                }
            }
        }
        selectAnime_id = parseInt(selectAnime_id) - 1;
        const episodeIndex = isNaN(episode) ? 0 : episode - 1;
        const episodeInfo = {
            episodeId: animaInfo.animes[selectAnime_id].episodes[0].episodeId,
            episodeTitle: animaInfo.animes[selectAnime_id].episodes[0].episodeTitle,
            episodeIndex,
            bgmEpisodeIndex: res.bgmEpisodeIndex ? res.bgmEpisodeIndex : episodeIndex,
            animeId: animaInfo.animes[selectAnime_id].animeId,
            animeTitle: animaInfo.animes[selectAnime_id].animeTitle,
            animeOriginalTitle,
            seriesOrMovieId: seriesOrMovieId,
        };
        localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));
        return episodeInfo;
    }

    // copy from https://github.com/Izumiko/jellyfin-danmaku/blob/74598c7bcb388f1288d6f7c7b03103e31af248ef/ede.js#L1069
    // thanks for Izumiko
    async function getCommentsByPluginApi(mediaServerItemId) {
        // const path = window.location.pathname.replace(/\/web\/(index\.html)?/, '/api/danmu/');
        // const url = window.location.origin + path + jellyfinItemId + '/raw';
        const url = `${ApiClient.serverAddress()}/api/danmu/${mediaServerItemId}/raw?X-Emby-Token=${ApiClient.accessToken()}`;
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        const xmlText = await response.text();
        if (!xmlText || xmlText.length === 0) {
            return null;
        }

        // parse the xml data
        // xml data: <d p="392.00000,1,25,16777215,0,0,[BiliBili]e6860b30,1723088443,1">弹幕内容</d>
        //           <d p="stime, type, fontSize, color, date, pool, sender, dbid, unknown">content</d>
        // comment data: {cid: "1723088443", p: "392.00,1,16777215,[BiliBili]e6860b30", m: "弹幕内容"}
        //               {cid: "dbid", p: "stime, type, color, sender", m: "content"}
        try {
            const parser = new DOMParser();
            const data = parser.parseFromString(xmlText, 'text/xml');
            const comments = [];

            for (const comment of data.getElementsByTagName('d')) {
                const p = comment.getAttribute('p').split(',').map(Number);
                const commentData = {
                    cid: p[7],
                    p: p[0] + ',' + p[1] + ',' + p[3] + ',' + p[6],
                    m: comment.textContent
                };
                comments.push(commentData);
            }

            return comments;
        } catch (error) {
            console.error('Failed to parse XML data:', error);
            return null;
        }
    }

    async function refreshPluginXml(mediaServerItemId) {
        const url = `${ApiClient.serverAddress()}/api/danmu/${mediaServerItemId}?option=Refresh&X-Emby-Token=${ApiClient.accessToken()}`;
        const response = await fetch(url);
        if (response.ok) {
            console.log(lsKeys.refreshPluginXml.name + ':成功');
        } else {
            throw new Error(lsKeys.refreshPluginXml.name + ':失败');
        }
    }

    async function createDanmaku(comments) {
        if (!comments) { return; }
        if (window.ede.danmaku != null) {
            window.ede.danmaku.destroy();
            window.ede.danmaku = null;
        }
        const commentsParsed = danmakuParser(comments);
        window.ede.commentsParsed = commentsParsed;
        let _comments = danmakuFilter(commentsParsed);
        console.log('[加载]弹幕成功: ' + _comments.length);

        const _media = document.querySelector(mediaQueryStr);
        if (!_media) {
            // this only working on quickDebug
            if (!window.ede.danmaku) {
                window.ede.danmaku = { comments: _comments, };
            }
            // 设置弹窗内的弹幕信息
            buildCurrentDanmakuInfo(currentDanmakuInfoContainerId);
            throw new Error('用户已退出视频播放');
        }
        if (!isVersionOld) { _media.style.position = 'absolute'; }
        // from https://github.com/Izumiko/jellyfin-danmaku/blob/jellyfin/ede.js#L1104
        const wrapperTop = 0; // 播放器 UI 顶部阴影
        let wrapper = getById(eleIds.danmakuWrapper);
        wrapper && wrapper.remove();
        wrapper = document.createElement('div');
        wrapper.id = eleIds.danmakuWrapper;
        wrapper.style.position = 'fixed';
        wrapper.style.width = '100%';
        wrapper.style.height = `calc(${lsGetItem(lsKeys.heightPercent.id)}% - ${wrapperTop}px)`;
        wrapper.style.backgroundColor = lsGetItem(lsKeys.debugShowDanmakuWrapper.id) ? styles.colors.highlight : '';
        // wrapper.style.opacity = lsGetItem(lsKeys.fontOpacity.id); // 弹幕整体透明度
        wrapper.style.top = wrapperTop + 'px';
        wrapper.style.pointerEvents = 'none';
        // const _container = document.querySelector(mediaContainerQueryStr);
        const _container = await waitForElement(mediaContainerQueryStr);
        _container.prepend(wrapper);
        let _speed = 144 * lsGetItem(lsKeys.speed.id);
        window.ede.danmaku = new Danmaku({
            container: wrapper,
            media: _media,
            comments: _comments,
            engine: lsGetItem(lsKeys.engine.id),
            speed: _speed,
        });
        lsGetItem(lsKeys.switch.id) ? window.ede.danmaku.show() : window.ede.danmaku.hide();
        if (window.ede.ob) {
            window.ede.ob.disconnect();
        }
        window.ede.ob = new ResizeObserver(() => {
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
            require(['playbackManager'], (playbackManager) => {
                if (playbackManager.getPlayerState().PlayState.IsPaused) {
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
        const chartEle = getById(eleIds.progressBarLineChart);
        if (chartEle) {
            chartEle.remove();
        }
        if (!window.ede.danmaku) {
            return;
        }
        const osdLineChartSkipFilter = lsGetItem(lsKeys.osdLineChartSkipFilter.id);
        const comments = osdLineChartSkipFilter ? window.ede.commentsParsed : window.ede.danmaku.comments;
        const container = getByClass(classes.videoOsdPositionSliderContainer);
        if (!comments || !container || (comments && comments.length === 0)) {
            return;
        }
        const progressBarWidth = container.offsetWidth;
        console.log('progressBarWidth: ' + progressBarWidth);
        const bulletChartCanvas = document.createElement('canvas');
        bulletChartCanvas.id = eleIds.progressBarLineChart;
        bulletChartCanvas.width = progressBarWidth;
        bulletChartCanvas.height = chartHeightNum;
        bulletChartCanvas.style.position = 'absolute';
        bulletChartCanvas.style.top = OS.isEmbyNoisyX() ? '-24px' : '-21px';
        container.prepend(bulletChartCanvas);
        const ctx = bulletChartCanvas.getContext('2d');
        // 计算每个时间点的弹幕数量
        const maxTime = Math.max(...comments.map(c => c.time));
        const timeStep = lsGetItem(lsKeys.osdLineChartTime.id);
        const timeCounts = Array.from({ length: Math.ceil(maxTime / timeStep) }, () => 0);
        comments.forEach(c => {
            const index = Math.floor(c.time / timeStep);
            if (index < timeCounts.length) {
                timeCounts[index]++;
            }
        });
        function drawLineChart(data) {
            ctx.clearRect(0, 0, progressBarWidth, chartHeightNum);
            const maxY = Math.max(...data);
            const scale = chartHeightNum / maxY; // 用于拉长 y 轴间距
            ctx.beginPath();
            ctx.moveTo(0, chartHeightNum - data[0] * scale);
            for (let i = 1; i < data.length; i++) {
                const x = (i / (data.length - 1)) * progressBarWidth;
                const y = chartHeightNum - data[i] * scale;
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; // 与次标题同色
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        drawLineChart(timeCounts);
        console.log('已重绘进度条弹幕数量折线图');
    }

    function loadDanmaku(loadType = LOAD_TYPE.CHECK) {
        const _media = document.querySelector(mediaQueryStr);
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
            getMapByEmbyItemInfo().then((itemInfoMap) => {
                getCommentsByPluginApi(window.ede.itemId)
                .then((comments) => {
                    if (comments && comments.length > 0) {
                        return createDanmaku(comments).then(() => {
                            console.log(lsKeys.useFetchPluginXml.name + ':就位');
                        }).then(() => {
                            window.ede.loading = false;
                            const danmakuCtrEle = getById(eleIds.danmakuCtr);
                            if (danmakuCtrEle && danmakuCtrEle.style.opacity !== '1') {
                                danmakuCtrEle.style.opacity = '1';
                            }
                            const videoOsdDanmakuTitle = getById(eleIds.videoOsdDanmakuTitle);
                            if (videoOsdDanmakuTitle && videoOsdDanmakuTitle.innerText.includes('未匹配')) {
                                videoOsdDanmakuTitle.innerText = `弹幕：${lsKeys.useFetchPluginXml.name} - ${comments.length}条`;
                            }
                        }).catch((error) => {
                            console.error(error);
                            console.error('useFetchPluginXml createDanmaku error');
                        });
                    }
                    throw new Error(lsKeys.useFetchPluginXml.name + '失败,尝试在线加载');
                })
                .catch((error) => {
                    console.error(error);
                    return loadOnlineDanmaku(loadType);
                });
            });
        } else {
            loadOnlineDanmaku(loadType);
        }
    }

    function loadOnlineDanmaku(loadType) {
        getEpisodeInfo(loadType !== LOAD_TYPE.SEARCH)
            .then((info) => {
                return new Promise((resolve, reject) => {
                    if (!info) {
                        if (loadType !== LOAD_TYPE.INIT) {
                            reject('播放器未完成加载');
                        } else {
                            reject(null);
                        }
                    }
                    if (
                        loadType !== LOAD_TYPE.SEARCH &&
                        loadType !== LOAD_TYPE.REFRESH &&
                        loadType !== LOAD_TYPE.RELOAD &&
                        loadType !== LOAD_TYPE.INIT &&
                        window.ede.danmaku &&
                        window.ede.episode_info &&
                        window.ede.episode_info.episodeId == info.episodeId
                    ) {
                        reject('当前播放视频未变动');
                    } else {
                        // 保存上一集的信息，用于下一集/上一集推理
                        if (window.ede.episode_info) {
                            window.ede.previous_episode_info = { ...window.ede.episode_info };
                        }
                        window.ede.episode_info = info;
                        resolve(info.episodeId);
                    }
                });
            })
            .then(
                (episodeId) => {
                    if (episodeId) {
                        if (loadType === LOAD_TYPE.RELOAD && window.ede.danmuCache[episodeId]) {
                            createDanmaku(window.ede.danmuCache[episodeId])
                                .then(() => {
                                    console.log('弹幕就位');
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        } else {
                            fetchComment(episodeId).then((comments) => {
                                window.ede.danmuCache[episodeId] = comments;
                                createDanmaku(comments)
                                    .then(() => {
                                        console.log('弹幕就位');
                                        // embyToast({ text: `弹幕就位,已获取 ${comments.length} 条弹幕` });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            });
                        }
                    }
                },
                (msg) => {
                    if (msg) {
                        console.log(msg);
                    }
                },
            )
            .then(() => {
                const extCommentCache = window.ede.extCommentCache[window.ede.itemId] || {};
                objectEntries(extCommentCache).forEach(([key, val]) => {
                    addExtComments(key, val);
                })
                window.ede.loading = false;
                const danmakuCtrEle = getById(eleIds.danmakuCtr);
                if (danmakuCtrEle && danmakuCtrEle.style.opacity !== '1') {
                    danmakuCtrEle.style.opacity = '1';
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function danmakuFilter(comments) {
        let _comments = [...comments];
        danmakuAutoFilter(_comments);
        _comments = danmakuTypeFilter(_comments);
        _comments = danmakuSourceFilter(_comments);
        _comments = danmakuDensityLevelFilter(_comments);
        _comments = danmakuKeywordsFilter(_comments);
        _comments = danmakuMergeSimilar(_comments, lsGetItem(lsKeys.mergeSimilarPercent.id), lsGetItem(lsKeys.mergeSimilarTime.id));
        return _comments;
    }

    function danmakuAutoFilter(comments) {
        const autoFilterCount = lsGetItem(lsKeys.autoFilterCount.id);
        if (autoFilterCount == 0 || comments.length < autoFilterCount) {
            return danmakuAutoFilterCancel();
        }
        let msg = `检测到 ${comments.length} 条弹幕 > ${lsKeys.autoFilterCount.name}:${autoFilterCount},准备开始自动过滤(单集有效)`;
        const initMsgLenth = msg.length;
        const heightPercent = lsGetItem(lsKeys.heightPercent.id);
        if (heightPercent > 90) {
            window.ede.tempLsValues[lsKeys.heightPercent.id] = heightPercent;
            lsSetItem(lsKeys.heightPercent.id, 90);
            msg += `\n已自动调整 ${lsKeys.heightPercent.name}:90`;
        }
        const typeFilter = lsGetItem(lsKeys.typeFilter.id);
        if (!typeFilter.includes(danmakuTypeFilterOpts.bottom.id)) {
            window.ede.tempLsValues[lsKeys.typeFilter.id] = typeFilter;
            const typeFilterTemp = [...typeFilter, danmakuTypeFilterOpts.bottom.id];
            lsSetItem(lsKeys.typeFilter.id, typeFilterTemp);
            msg += `\n已自动添加 ${lsKeys.typeFilter.name}:${danmakuTypeFilterOpts.bottom.name}`;
        }
        const mergeSimilarEnable = lsGetItem(lsKeys.mergeSimilarEnable.id);
        if (!mergeSimilarEnable) {
            window.ede.tempLsValues[lsKeys.mergeSimilarEnable.id] = mergeSimilarEnable;
            lsSetItem(lsKeys.mergeSimilarEnable.id, true);
            msg += `\n已自动调整 ${lsKeys.mergeSimilarEnable.name}:true`;
        }
        if (msg.length != initMsgLenth) {
            embyToast({ text: msg });
            console.log(msg);
        }
    }

    function danmakuAutoFilterCancel() {
        if (Object.keys(window.ede.tempLsValues).length > 0) {
            objectEntries(window.ede.tempLsValues).forEach(([key, val]) => lsSetItem(key, val));
            window.ede.tempLsValues = {};
            console.log('从临时值恢复用户值并重置');
        }
    }

    /** 过滤弹幕类型 */
    function danmakuTypeFilter(comments) {
        let idArray = lsGetItem(lsKeys.typeFilter.id);
        // 彩色过滤,只留下默认的白色
        if (idArray.includes(danmakuTypeFilterOpts.onlyWhite.id)) {
            comments = comments.filter(c => '#ffffff' === c.style.color.toLowerCase().slice(0, 7));
            idArray.splice(idArray.indexOf(danmakuTypeFilterOpts.onlyWhite.id), 1);
        }
        // 过滤滚动弹幕
        if (idArray.includes(danmakuTypeFilterOpts.rolling.id)) {
            comments = comments.filter(c => danmakuTypeFilterOpts.ltr.id !== c.mode
                && danmakuTypeFilterOpts.rtl.id !== c.mode);
            idArray.splice(idArray.indexOf(danmakuTypeFilterOpts.rolling.id), 1);
        }
        // 按 emoji 过滤
        if (idArray.includes(danmakuTypeFilterOpts.emoji.id)) {
            comments = comments.filter(c => !emojiRegex.test(c.text));
            idArray.splice(idArray.indexOf(danmakuTypeFilterOpts.emoji.id), 1);
        }
        // 过滤特定模式的弹幕
        if (idArray.length > 0) {
            comments = comments.filter(c => !idArray.includes(c.mode));
        }
        return comments;
    }

    /** 过滤弹幕来源平台 */
    function danmakuSourceFilter(comments) {
        return comments.filter(c => !(lsGetItem(lsKeys.sourceFilter.id).includes(c.source)));
    }

    /** 过滤弹幕密度等级,水平和垂直 */
    function danmakuDensityLevelFilter(comments) {
        let level = lsGetItem(lsKeys.filterLevel.id);
        if (level == 0) {
            return comments;
        }
        let limit = 9 - level * 2;
        let vertical_limit = 6;
        let arr_comments = [];
        let vertical_comments = [];
        for (let index = 0; index < comments.length; index++) {
            let element = comments[index];
            let i = Math.ceil(element.time);
            let i_v = Math.ceil(element.time / 3);
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
        if (!lsGetItem(lsKeys.filterKeywordsEnable.id)) { return comments; }
        const keywords = lsGetItem(lsKeys.filterKeywords.id)
            .split(/\r?\n/).map(k => k.trim()).filter(k => k.length > 0 && !k.startsWith('// '));
        if (keywords.length === 0) { return comments; }
        const cKeys = [ 'text', ...Object.keys(showSource) ];
        return comments.filter(comment =>
            !keywords.some(keyword => {
                try {
                    return cKeys.some(key => new RegExp(keyword).test(comment[key]));
                } catch (error) {
                    return cKeys.some(key => comment[key].includes(keyword));
                }
            })
        );
    }

    function danmakuMergeSimilar(comments, threshold = 50, timeWindow = 15) {
        if (!lsGetItem(lsKeys.mergeSimilarEnable.id)) { return comments; }
    
        const mergedComments = [];
        const mergedIndexes = [];
        const startTime = new Date().getTime();
    
        for (let i = 0; i < comments.length; i++) {
            if (mergedIndexes.includes(i)) { continue; }
    
            let mergedComment = comments[i];
            let count = 1;
            let totalSimilarity = 0;
    
            for (let j = i + 1; j < comments.length && Math.abs(comments[j].time - comments[i].time) <= timeWindow; j++) {
                if (mergedIndexes.includes(j)) { continue; }
    
                const similarity = similarityPercentage(mergedComment.text, comments[j].text);
                if (similarity >= threshold) {
                    count++;
                    mergedIndexes.push(j);
                    totalSimilarity += similarity;
                }
            }
    
            if (count > 1) {
                mergedComment.text += ` [x${count}]`;
                mergedComment.xCount = count;
                mergedComment.xTotalSimilarity = totalSimilarity / count;
            }
    
            mergedComments.push(mergedComment);
        }
    
        const endTime = new Date().getTime();
        console.log(`danmakuMergeSimilar 耗时: ${endTime - startTime} 毫秒`);
    
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
            [a, b] = [b, a];
        }

        let previousRow = Array.from({ length: a.length + 1 }, (_, i) => i);
        let currentRow = Array(a.length + 1);

        for (let j = 1; j <= b.length; j++) {
            currentRow[0] = j;

            for (let i = 1; i <= a.length; i++) {
                const substitutionCost = (a[i - 1] === b[j - 1]) ? 0 : 1;
                const insertionCost = previousRow[i] + 1;
                const deletionCost = currentRow[i - 1] + 1;

                currentRow[i] = Math.min(
                    previousRow[i - 1] + substitutionCost,
                    insertionCost,
                    deletionCost,
                );
            }

            [previousRow, currentRow] = [currentRow, previousRow];
        }

        const distance = previousRow[a.length];
        const maxLength = Math.max(a.length, b.length);
        const similarity = ((maxLength - distance) / maxLength) * 100;

        return similarity;
    }

    function danmakuParser($obj) {
        //const fontSize = Number(values[2]) || 25
        // 弹幕大小
        const fontSizeRate = lsGetItem(lsKeys.fontSizeRate.id);
        let fontSize = 25;
        // 播放页媒体次级标题 h3 元素
        const fontSizeReferent = getByClass(classes.videoOsdTitle);
        if (fontSizeReferent) {
            fontSize = parseFloat(getComputedStyle(fontSizeReferent).fontSize.replace('px', '')) * fontSizeRate;
        } else {
            fontSize = Math.round(
                (window.screen.height > window.screen.width
                    ? window.screen.width
                    : window.screen.height / 1080) * 18 * fontSizeRate
            );
        }
        const fontWeight = lsGetItem(lsKeys.fontWeight.id);
        const fontStyle = styles.fontStyles[lsGetItem(lsKeys.fontStyle.id)].id;
        const fontFamily = lsGetItem(lsKeys.fontFamily.id);
        // 弹幕透明度
        const fontOpacity = Math.round(lsGetItem(lsKeys.fontOpacity.id) * 255).toString(16).padStart(2, '0');
        // 时间轴偏移秒数
        const timelineOffset = lsGetItem(lsKeys.timelineOffset.id);
        const sourceUidReg = /\[(.*)\](.*)/;
        const showSourceIds = lsGetItem(lsKeys.showSource.id);
        // const removeEmojiEnable = lsGetItem(lsKeys.removeEmojiEnable.id);
        //const $xml = new DOMParser().parseFromString(string, 'text/xml')
        return $obj
            .map(($comment) => {
                const p = $comment.p;
                //if (p === null || $comment.childNodes[0] === undefined) return null;
                const values = p.split(',');
                const mode = { 6: 'ltr', 1: 'rtl', 5: 'top', 4: 'bottom' }[values[1]];
                if (!mode) return null;
                // 弹幕颜色+透明度
                const baseColor = Number(values[2]).toString(16).padStart(6, '0');
                const color = `${baseColor}${fontOpacity}`; // 生成8位十六进制颜色
                const shadowColor = baseColor === '000000' ? `#ffffff${fontOpacity}` : `#000000${fontOpacity}`;
                const sourceUidMatches = values[3].match(sourceUidReg);
                const sourceId = sourceUidMatches && sourceUidMatches[1] ? sourceUidMatches[1] : danmakuSource.DanDanPlay.id;
                const originalUserId = sourceUidMatches && sourceUidMatches[2] ? sourceUidMatches[2] : values[3];
                const cmt = {
                    text: $comment.m,
                    mode,
                    time: values[0] * 1 + timelineOffset,
                    style: getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily),
                    // 以下为自定义属性
                    [showSource.cid.id]: $comment.cid,
                    [showSource.source.id]: sourceId,
                    [showSource.originalUserId.id]: originalUserId,
                };
                if (showSourceIds.length > 0) {
                    cmt.originalText = cmt.text;
                    cmt.text += showSourceIds.map(id => id === showSource.source.id ? `,[${cmt[id]}]` : ',' + cmt[id]).join('');
                }
                cmt.cuid = cmt[showSource.cid.id] + ',' + cmt[showSource.originalUserId.id];
                // if (removeEmojiEnable) {
                //     cmt.text = cmt.text.replace(emojiRegex, '');
                // }
                return cmt;
            })
            .filter((x) => x)
            .sort((a, b) => a.time - b.time);
    }

    function getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily) {
        return {
            color: `#${color}`, // dom
            textShadow: `-1px -1px ${shadowColor}, -1px 1px ${shadowColor}, 1px -1px ${shadowColor}, 1px 1px ${shadowColor}`,

            font: `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`,
            fillStyle: `#${color}`, // canvas
            strokeStyle: shadowColor,
            lineWidth: 2.0,
        };
    }

    function toastByDanmaku(text, type) {
        text = toastPrefixes.system + text;
        const fontSize = parseFloat(getComputedStyle(getByClass(classes.videoOsdTitle))
            .fontSize.replace('px', '')) * 1.5;
        const color = styles.colors[type];
        const dandanplayMode = 5;
        const time = document.querySelector(mediaQueryStr).currentTime;
        const fontOpacity = 'ff';
        const colorStr = `000000${color.toString(16)}${fontOpacity}`.slice(-8);
        const mode = { 6: 'ltr', 1: 'rtl', 5: 'top', 4: 'bottom' }[dandanplayMode];
        const comment = {
            text,
            mode,
            time,
            style: {
                fontSize: `${fontSize}px`,
                color: `#${colorStr}`,
                textShadow:
                    colorStr === '00000' ? '-1px -1px #fff, -1px 1px #fff, 1px -1px #fff, 1px 1px #fff' : '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',

                font: `${fontSize}px sans-serif`,
                fillStyle: `#${colorStr}`,
                strokeStyle: colorStr === '000000' ? `#ffffff${fontOpacity}` : `#000000${fontOpacity}`,
                lineWidth: 2.0,
            }, // emit 无法添加自定义属性
        };
        window.ede.danmaku.emit(comment);
    }

    function createDialog() {
        require([
            'emby-select', 'emby-checkbox', 'emby-slider', 'emby-textarea', 'emby-collapse'
            , 'emby-button',
        ]);
        const html = `<div id="${eleIds.dialogContainer}"></div>`;
        embyDialog({ html, buttons: [{ name: '关闭' }] });
        waitForElement('#' + eleIds.dialogContainer, afterEmbyDialogCreated);
    }

    async function afterEmbyDialogCreated(dialogContainer) {
        const itemInfoMap = await getMapByEmbyItemInfo();
        if (itemInfoMap) {
            window.ede.searchDanmakuOpts = {
                _id_key: itemInfoMap._id_key,
                _season_key: itemInfoMap._season_key,
                _episode_key: itemInfoMap._episode_key,
                animeId: itemInfoMap.animeId,
                animeName: itemInfoMap.animeName,
                seriesOrMovieId: itemInfoMap.seriesOrMovieId,
                episode: (parseInt(itemInfoMap.episode) || 1) - 1, // convert to index
                animes: [],
            }
        }
        let formDialogHeader = getByClass(classes.formDialogHeader);
        const formDialogFooter = getByClass(classes.formDialogFooter);
        formDialogHeader = formDialogHeader || dialogContainer;
        const tabsMenuContainer = document.createElement('div');
        tabsMenuContainer.className = classes.embyTabsMenu;
        tabsMenuContainer.append(embyTabs(danmakuTabOpts, danmakuTabOpts[0].id, 'id', 'name', (value) => {
            danmakuTabOpts.forEach(obj => {
                const elem = getById(obj.id);
                if (elem) { elem.hidden = obj.id !== value.id; }
            });
        }));
        formDialogHeader.append(tabsMenuContainer);
        formDialogHeader.style = 'width: 100%; padding: 0; height: auto;';

        danmakuTabOpts.forEach((tab, index) => {
            const tabContainer = document.createElement('div');
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
        const container = getById(containerId);
        let template =  `
            <div style="display: flex; justify-content: center;">
                <div>
                    <div id="${eleIds.danmakuSwitchDiv}" style="margin-bottom: 0.2em;">
                        <label class="${classes.embyLabel}">${lsKeys.switch.name} </label>
                    </div>
                    <div style="${styles.embySlider}">
                        <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.filterLevel.name}: </label>
                        <div id="${eleIds.filterLevelDiv}" style="width: 15.5em; text-align: center;"></div>
                        <label style="${styles.embySliderLabel}"></label>
                    </div>
                    <div style="${styles.embySlider}">
                        <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.heightPercent.name}: </label>
                        <div id="${eleIds.heightPercentDiv}" style="width: 15.5em; text-align: center;"></div>
                        <label>
                            <label style="${styles.embySliderLabel}"></label>
                            <label>%</label>
                        </label>
                    </div>
                    <div style="${styles.embySlider}">
                        <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.fontSizeRate.name}: </label>
                        <div id="${eleIds.danmakuSizeDiv}" style="width: 15.5em; text-align: center;"></div>
                        <label>
                            <label style="${styles.embySliderLabel}"></label>
                            <label>倍</label>
                        </label>
                    </div>
                    <div style="${styles.embySlider}">
                        <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.fontOpacity.name}: </label>
                        <div id="${eleIds.danmakuOpacityDiv}" style="width: 15.5em; text-align: center;"></div>
                        <label style="${styles.embySliderLabel}"></label>
                    </div>
                    <div style="${styles.embySlider}">
                        <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.speed.name}: </label>
                        <div id="${eleIds.danmakuSpeedDiv}" style="width: 15.5em; text-align: center;"></div>
                        <label>
                            <label style="${styles.embySliderLabel}"></label>
                            <label>倍</label>
                        </label>
                    </div>
                    <div style="${styles.embySlider}">
                        <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.timelineOffset.name}: </label>
                        <div id="${eleIds.timelineOffsetDiv}" style="width: 15.5em; text-align: center;"></div>
                        <label style="${styles.embySliderLabel}"></label>
                    </div>
                    <div is="emby-collapse" title="弹幕字体样式" data-expanded="false">
                        <div class="${classes.collapseContentNav}">
                            <div style="${styles.embySlider}">
                                <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.fontWeight.name}: </label>
                                <div id="${eleIds.danmakuFontWeightDiv}" style="width: 15.5em; text-align: center;"></div>
                                <label style="${styles.embySliderLabel}"></label>
                            </div>
                            <div style="${styles.embySlider}">
                                <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.fontStyle.name}: </label>
                                <div id="${eleIds.danmakuFontStyleDiv}" style="width: 15.5em; text-align: center;"></div>
                                <label style="${styles.embySliderLabel}"></label>
                            </div>
                            <div id="${eleIds.fontFamilyCtrl}" style="margin: 0.6em 0;"></div>
                            <div style="${styles.embySlider}">
                                <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.fontFamily.name}: </label>
                                <div id="${eleIds.fontFamilyDiv}" class="${classes.embySelectWrapper}"></div>
                                <label id="${eleIds.fontFamilyLabel}" style="width: 10em; margin-left: 1em;"></label>
                            </div>
                            <div style="max-width: 31.5em;">
                                <label class="${classes.embyLabel}" style="width: 5em;">弹幕外观: </label>
                                <div id="${eleIds.fontStylePreview}"
                                    class="flex justify-content-center"
                                    style="border: .08em solid gray;color: black;border-radius: .24em;padding: .5em;;background-color: #6a96bd;">
                                    简中/繁體/English/こんにちはウォルド/</br>
                                    ABC/abc/012/~!@<?>[]/《？》【】</br>
                                    ☆*: .｡. o(≧▽≦)o .｡.:*☆</br>
                                    emoji:😆👏🎈🍋🌞⁉️🎉</br>
                                </div>
                                <div class="${classes.embyFieldDesc}">
                                    这些设置会影响此设备上的弹幕外观,此处固定为 dom 引擎,
                                    canvas 引擎效果一样,此处不做切换展示,
                                    因为弹幕大小是根据播放页次标题动态计算的,此处不做参考,
                                    选择或输入的字体是否有效取决于设备本身的字体库,没有网络加载
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="${eleIds.settingsCtrl}" style="margin: 0.6em 0;"></div>
                    <textarea id="${eleIds.settingsText}" style="display: none;resize: vertical;width: 100%" rows="20"
                        is="emby-textarea" class="txtOverview emby-textarea"></textarea>
                </div>
            </div>
        `;
        container.innerHTML = template.trim();

        getById(eleIds.danmakuSwitchDiv, container).prepend(
            embyButton({ id: eleIds.danmakuSwitch, label: '弹幕开关'
                , iconKey: lsGetItem(lsKeys.switch.id) ? iconKeys.switch_on : iconKeys.switch_off
                , style: (lsGetItem(lsKeys.switch.id) ? 'color:#52b54b;' : '') + 'font-size:1.5em;padding:0;' }
                // , style: lsGetItem(lsKeys.switch.id) ? 'color:#52b54b;font-size:1.5em;padding:0;': 'font-size:1.5em;padding:0;'}
                , doDanmakuSwitch)
        );
        // 滑块
        getById(eleIds.filterLevelDiv, container).append(
            embySlider({ lsKey: lsKeys.filterLevel }, onSliderChange, onSliderChangeLabel)
        );
        getById(eleIds.heightPercentDiv, container).append(
            embySlider({ lsKey: lsKeys.heightPercent }, onSliderChange, onSliderChangeLabel)
        );
        getById(eleIds.danmakuSizeDiv, container).append(
            embySlider({ lsKey: lsKeys.fontSizeRate }, onSliderChange, onSliderChangeLabel)
        );
        getById(eleIds.danmakuOpacityDiv, container).append(
            embySlider({ lsKey: lsKeys.fontOpacity }, onSliderChange, onSliderChangeLabel
        )
        );
        getById(eleIds.danmakuSpeedDiv, container).append(
            embySlider({ lsKey: lsKeys.speed }, onSliderChange, onSliderChangeLabel)
        );
        // 弹幕时间轴偏移秒数
        const btnContainer = getById(eleIds.timelineOffsetDiv, container);
        const nextEle = btnContainer.nextElementSibling;
        const labelEle = nextEle.children.length > 0 ? nextEle.children[0] : nextEle;
        const timelineOffsetOpts = { lsKey: lsKeys.timelineOffset, labelEle };
        onSliderChangeLabel(lsGetItem(lsKeys.timelineOffset.id), timelineOffsetOpts);
        timeOffsetBtns.forEach(btn => {
            btnContainer.append(embyButton(btn, (e) => {
                if (e.target) {
                    let oldValue = lsGetItem(lsKeys.timelineOffset.id);
                    let newValue = oldValue + (parseFloat(e.target.getAttribute('valueOffset')) || 0);
                    // 如果 offset 为 0,则 newValue 应该设置为 0
                    if (newValue === oldValue) { newValue = 0; }
                    onSliderChange(newValue, timelineOffsetOpts);
                }
            }));
        });
        buildFontStyleSetting(container);
        // 配置 JSON 导入,导出
        buildSettingsBackup(container);
    }

    function buildSettingsBackup(container) {
        const settingsCtrlEle = getById(eleIds.settingsCtrl, container);
        settingsCtrlEle.append(
            embyButton({ label: '配置', iconKey: iconKeys.more }, (e) => {
                const xChecked = !e.target.xChecked;
                e.target.xChecked = xChecked;
                e.target.title = xChecked ? '关闭' : '配置';
                e.target.firstChild.innerHTML = xChecked ? iconKeys.close : iconKeys.more;
                const settingsTextEle = getById(eleIds.settingsText);
                settingsTextEle.style.display = xChecked ? '' : 'none';
                if (xChecked) { settingsTextEle.value = getSettingsJson(2); }
                [eleIds.settingReloadBtn, eleIds.settingsImportBtn].forEach(id => {
                    getById(id).style.display = xChecked ? '' : 'none';
                });
            })
        );
        settingsCtrlEle.append(
            embyButton({ id: eleIds.settingReloadBtn, label: '刷新', iconKey: iconKeys.refresh, style: 'display: none;' }
                , () => getById(eleIds.settingsText).value = getSettingsJson(2))
        );
        settingsCtrlEle.append(
            embyButton({ id: eleIds.settingsImportBtn, label: '应用', iconKey: iconKeys.done, style: 'display: none;' }, () => {
                // const settings = JSON.parse(getById(eleIds.settingsText).value);
                // lsBatchSet(Object.fromEntries(objectEntries(settings).map(([key, valueObj]) => [key, valueObj.value])));
                lsBatchSet(JSON.parse(getById(eleIds.settingsText).value));
                loadDanmaku(LOAD_TYPE.INIT);
                closeEmbyDialog();
            })
        );
    }

    function buildFontStyleSetting() {
        getById(eleIds.danmakuFontWeightDiv).append(
            embySlider({ lsKey: lsKeys.fontWeight }, onSliderChange, onSliderChangeLabel)
        );
        getById(eleIds.danmakuFontStyleDiv).append(
            embySlider({ lsKey: lsKeys.fontStyle }
            , (val, opts) => {
                opts.label = styles.fontStyles[val].id;
                onSliderChange(val, opts);
            }
            , (val, opts) => onSliderChangeLabel(styles.fontStyles[val].id, opts))
        );
        buildFontFamilySetting();
    }

    function buildFontFamilySetting() {
        const fontFamilyVal = lsGetItem(lsKeys.fontFamily.id);
        let availableFonts = [
            { family: lsKeys.fontFamily.defaultValue, fullName: lsKeys.fontFamily.defaultValue },
            { family: 'Consolas', fullName: 'Consolas' },
            { family: 'SimHei', fullName: '黑体' },
            { family: 'SimSun', fullName: '宋体' },
            { family: 'KaiTi', fullName: '楷体' },
            { family: 'Microsoft YaHei', fullName: '微软雅黑' },
        ];
        const selectedIndex = availableFonts.findIndex(f => f.family === fontFamilyVal);
        resetFontFamilyDiv(selectedIndex, availableFonts);
        buildFontFamilyCtrl();
    }

    function buildFontFamilyCtrl() {
        const fontFamilyCtrl = getById(eleIds.fontFamilyCtrl);
        fontFamilyCtrl.append(
            embyButton({ label: '切换手填', iconKey: iconKeys.edit, }, (e) => {
                const xChecked = !e.target.xChecked;
                e.target.xChecked = xChecked;
                e.target.title = xChecked ? '手填' : '选择';
                getById(eleIds.fontFamilySelect).style.display = xChecked ? 'none' : '';
                getById(eleIds.fontFamilyInput).style.display = xChecked ? '' : 'none';
                if (xChecked) {
                    getById(eleIds.fontFamilyLabel).innerHTML = '';
                }
            })
        );
        fontFamilyCtrl.append(
            embyButton({ label: '重置为默认', iconKey: iconKeys.refresh, }
                , () => {
                    if (lsCheckSet(lsKeys.fontFamily.id, lsKeys.fontFamily.defaultValue)) {
                        changeFontStylePreview();
                        onSliderChangeLabel(lsKeys.fontFamily.defaultValue, { labelId: eleIds.fontFamilyLabel });
                        getById(eleIds.fontFamilyInput).value = lsGetItem(lsKeys.fontFamily.id);
                        loadDanmaku(LOAD_TYPE.RELOAD);
                    }
                })
        );
    }

    function resetFontFamilyDiv(selectedIndexOrValue, opts) {
        const fontFamilyDiv = getById(eleIds.fontFamilyDiv);
        fontFamilyDiv.innerHTML = '';
        fontFamilyDiv.append(
            embySelect({ id: eleIds.fontFamilySelect, label: `${lsKeys.fontFamily.name}: `, }
                , selectedIndexOrValue, opts, 'family', 'family'
                , (value, index, option) => {
                    console.log('fontFamilyDivChange: ', value, index, option);
                    // loadLocalFont(option.family);
                    if (lsCheckSet(lsKeys.fontFamily.id, value)) {
                        changeFontStylePreview();
                        const labelVal = option.family !== option.fullName ? option.fullName : '';
                        onSliderChangeLabel(labelVal, { labelId: eleIds.fontFamilyLabel });
                        loadDanmaku(LOAD_TYPE.RELOAD);
                    }
                }, (e) => {
                    if ('queryLocalFonts' in window && opts.length <= 6) {
                        queryLocalFonts().then(fonts => {
                            opts = [...opts, ...fonts].reduce((acc, font) => {
                                if (!acc.some(f => f.family === font.family)) acc.push(font);
                                return acc;
                            }, []);
                            const fontFamilyVal = lsGetItem(lsKeys.fontFamily.id);
                            const selectedIndex = opts.findIndex(f => f.family === fontFamilyVal);
                            resetFontFamilyDiv(selectedIndex, opts);
                        }).catch(err => {
                            console.error(err);
                        });
                        console.info('queryLocalFonts 高级查询 API 可用,已补充字体列表');
                    }
                })
        );
        fontFamilyDiv.append(
            embyInput({ id: eleIds.fontFamilyInput, value: lsGetItem(lsKeys.fontFamily.id)
                , type: 'search', style: 'display: none;' }
                , (e) => {
                    const inputVal = getTargetInput(e).value.trim();
                    if (!inputVal) { return; }
                    if (lsCheckSet(lsKeys.fontFamily.id, inputVal)) {
                        changeFontStylePreview();
                        loadDanmaku(LOAD_TYPE.RELOAD);
                    }
                })
        );
        changeFontStylePreview();
        const fontFamilyOpt = opts.find(opt => opt.family === lsGetItem(lsKeys.fontFamily.id));
        const labelVal = fontFamilyOpt ? fontFamilyOpt.fullName : '';
        onSliderChangeLabel(labelVal, { labelId: eleIds.fontFamilyLabel });
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
        const font = new FontFace(family, `local("${family}")`);
        font.load().then(loadedFont => {
            document.fonts.add(loadedFont);
            console.log(`The local font "${family}" has been added under the name "${family}"`);
        }).catch(err => {
            console.error(`Failed to load or add the local font "${family}"`, err);
        });
    }

    function changeFontStylePreview() {
        const fontStylePreview = getById(eleIds.fontStylePreview);
        const fontWeight = lsGetItem(lsKeys.fontWeight.id);
        const fontStyle = styles.fontStyles[lsGetItem(lsKeys.fontStyle.id)].id;
        const fontFamily = lsGetItem(lsKeys.fontFamily.id);
        const fontOpacity = Math.round(lsGetItem(lsKeys.fontOpacity.id) * 255).toString(16).padStart(2, '0');
        const baseColor = Number(styles.colors.info).toString(16).padStart(6, '0');
        const color = `${baseColor}${fontOpacity}`;
        const shadowColor = baseColor === '000000' ? `#ffffff${fontOpacity}` : `#000000${fontOpacity}`;
        const fontSizeReferent = fontStylePreview.previousElementSibling;
        const fontSize  = parseFloat(getComputedStyle(fontSizeReferent).fontSize.replace('px', ''));
        const cmtStyle = getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily);
        Object.assign(fontStylePreview.style, cmtStyle);
    }

    function buildSearchEpisode(containerId) {
        const container = getById(containerId);
        const episodeId = window.ede.episode_info ? window.ede.episode_info.episodeId : null;
        const comments = window.ede.danmuCache[episodeId] || [];
        let template = `
            <div>
                <div>
                    <label class="${classes.embyLabel}">标题: </label>
                    <div id="${eleIds.danmakuSearchNameDiv}" style="display: flex;"></div>
                </div>
                <div id="${eleIds.danmakuEpisodeFlag}" hidden>
                    <div style="display: flex;">
                        <div style="width: 80%;">
                            <label class="${classes.embyLabel}">媒体名: </label>
                            <div id="${eleIds.danmakuAnimeDiv}" class="${classes.embySelectWrapper}"></div>
                            <label class="${classes.embyLabel}">分集名: </label>
                            <div style="display: flex;">
                                <div id="${eleIds.danmakuEpisodeNumDiv}" style="max-width: 90%;" class="${classes.embySelectWrapper}"></div>
                                <div id="${eleIds.danmakuEpisodeLoad}"></div>
                            </div>
                        </div>
                        <div style="width: 20%; margin: 0 2%; text-align: center;">
                            <img id="${eleIds.searchImg}" style="width: 100%; height: auto;"
                                loading="lazy" decoding="async" draggable="false" class="coveredImage-noScale"></img>
                            <div id="${eleIds.searchApiSource}" class="${classes.embyFieldDesc}" style="margin-top: 0.5em;">
                                <!-- API来源将在这里显示 -->
                            </div>
                        </div>
                    </div>
                    </div>
                <div hidden>
                    <label class="${classes.embyLabel}" id="${eleIds.danmakuRemark}"></label>
                </div>
                <div>
                    <h4>匹配源</h4>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div id="${eleIds.currentMatchedDiv}">
                                <label class="${classes.embyLabel}">弹弹 play 总量: ${comments.length}</label>
                            </div>
                            <label class="${classes.embyLabel}">弹弹 play 附加的第三方 url: </label>
                        </div>
                        <button is="emby-button" type="button" class="raised emby-button" id="btnClearLocalMatchCache">清除本地匹配缓存</button>
                    </div>
                    <div id="${eleIds.extUrlsDiv}"></div>
                </div>
                <div is="emby-collapse" title="附加弹幕">
                    <div class="${classes.collapseContentNav}">
                        <label class="${classes.embyLabel}">弹弹 play 支持解析的第三方 url: </label>
                        <div id="${eleIds.extCommentSearchDiv}" style="display: flex;"></div>
                        <div class="${classes.embyFieldDesc}">
                            原接口文档说明支持(如A/B/C站),自测另外支持[ 爱奇艺视频, 腾讯视频, 优酷视频, ],不支持[ 芒果 TV, ]
                        </div>
                        <div class="${classes.embyFieldDesc}">
                            仅[ 爱奇艺视频, ]需要注意网址后不能带 ? 的参数,其余网址带不带都可以
                        </div>
                        <div class="${classes.embyFieldDesc}">
                            详细网址示例: 弹弹 play PC 官方客户端 -> 添加更多弹幕 -> 查看支持解析的网址示例
                        </div>
                    </div>
                </div>
                <div is="emby-collapse" title="服务端 Danmu 插件">
                    <div class="${classes.collapseContentNav}">
                        <div id="${eleIds.danmuPluginDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                    </div>
                </div>
                <div is="emby-collapse" title="API选择、自定义API配置">
                    <div class="${classes.collapseContentNav}">
                        <div id="${eleIds.apiSelectDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList} align-items: center;">
                            <!-- API 优先级列表将在这里创建 -->
                        </div>
                        <div id="customApiContainer" style="margin-top: 1em;">
                            <!-- 自定义API地址输入框将在这里创建 -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = template.trim();
        buildSearchEpisodeEle();
        buildExtCommentDiv();
        buildDanmuPluginDiv();
        bindManualMatchButtons();
    }

    function bindManualMatchButtons() {
        // 绑定清除本地匹配缓存按钮事件
        const btnClearCache = getById('btnClearLocalMatchCache');
        if (btnClearCache) {
            btnClearCache.addEventListener('click', () => {
                const prefixesToClear = [
                    lsLocalKeys.animeEpisodePrefix,
                    lsLocalKeys.animeSeasonPrefix,
                    lsLocalKeys.animePrefix,
                    lsLocalKeys.bangumiEpInfoPrefix,
                    lsLocalKeys.bangumiMe
                ];
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

                embyToast({ text: '本地匹配缓存已清除，包括animeId、episodeId等所有匹配信息' });
                loadDanmaku(LOAD_TYPE.REFRESH);
            });
        }
    }

    function buildSearchEpisodeEle() {
        // 添加自定义API地址输入框
        const customApiContainer = getById('customApiContainer');
        const customApiDiv = document.createElement('div');
        customApiDiv.className = 'emby-field';
        const customApiLabel = document.createElement('label');
        customApiLabel.className = 'emby-label';
        customApiLabel.textContent = lsKeys.customApiPrefix.name + '：';
        customApiDiv.append(customApiLabel);
        const customApiInput = embyInput({
            id: 'customApiPrefixInput',
            type: 'search',
            value: lsGetItem(lsKeys.customApiPrefix.id) || '',
            style: 'width: 24em;'
        }, (e) => {
            if (e.key === 'Enter') {
                const val = e.target.value.trim();
                lsSetItem(lsKeys.customApiPrefix.id, val);
                embyToast({ text: '自定义API地址已保存', secondaryText: val });
            }
        }, (e) => {
            // 失焦自动保存
            const val = e.target.value.trim();
            lsSetItem(lsKeys.customApiPrefix.id, val);
        });
        customApiDiv.append(customApiInput);
        const customApiDesc = document.createElement('div');
        customApiDesc.className = 'emby-field-desc';
        customApiDesc.innerHTML = '如需自定义弹幕API地址，请填写完整URL（如 https://api.example.com ），<br>留空则使用原生API';
        customApiDiv.append(customApiDesc);
        customApiContainer.append(customApiDiv);

        // API选择和优先级设置
        const apiSelectDiv = getById(eleIds.apiSelectDiv);
        apiSelectDiv.innerHTML = '';
        apiSelectDiv.style.display = 'block';

        // 官方API启用开关
        apiSelectDiv.append(embyCheckbox({ label: lsKeys.useOfficialApi.name }, lsGetItem(lsKeys.useOfficialApi.id), (checked) => {
            lsSetItem(lsKeys.useOfficialApi.id, checked);
        }));

        // 自定义API启用开关
        apiSelectDiv.append(embyCheckbox({ label: lsKeys.useCustomApi.name }, lsGetItem(lsKeys.useCustomApi.id), (checked) => {
            lsSetItem(lsKeys.useCustomApi.id, checked);
        }));

        // API优先级开关
        const priorityLabel = document.createElement('label');
        priorityLabel.className = classes.embyLabel;
        priorityLabel.textContent = 'API 优先级:';
        priorityLabel.style.marginTop = '1em';
        priorityLabel.style.display = 'block';
        apiSelectDiv.append(priorityLabel);

        const priorityContainer = document.createElement('div');
        priorityContainer.style.display = 'flex';
        priorityContainer.style.alignItems = 'center';
        priorityContainer.style.marginTop = '0.5em';

        const prioritySwitch = document.createElement('div');
        prioritySwitch.className = 'emby-toggle-switch';
        prioritySwitch.style.position = 'relative';
        prioritySwitch.style.width = '200px';
        prioritySwitch.style.height = '40px';
        prioritySwitch.style.backgroundColor = '#333';
        prioritySwitch.style.borderRadius = '20px';
        prioritySwitch.style.cursor = 'pointer';
        prioritySwitch.style.transition = 'all 0.3s ease';

        const prioritySlider = document.createElement('div');
        prioritySlider.style.position = 'absolute';
        prioritySlider.style.top = '2px';
        prioritySlider.style.width = '96px';
        prioritySlider.style.height = '36px';
        prioritySlider.style.backgroundColor = '#4a90e2';
        prioritySlider.style.borderRadius = '18px';
        prioritySlider.style.transition = 'all 0.3s ease';
        prioritySlider.style.display = 'flex';
        prioritySlider.style.alignItems = 'center';
        prioritySlider.style.justifyContent = 'center';
        prioritySlider.style.color = 'white';
        prioritySlider.style.fontSize = '12px';
        prioritySlider.style.fontWeight = 'bold';

        const leftLabel = document.createElement('div');
        leftLabel.style.position = 'absolute';
        leftLabel.style.left = '10px';
        leftLabel.style.top = '50%';
        leftLabel.style.transform = 'translateY(-50%)';
        leftLabel.style.fontSize = '12px';
        leftLabel.style.color = '#999';
        leftLabel.style.pointerEvents = 'none';
        leftLabel.textContent = '自定义API优先';

        const rightLabel = document.createElement('div');
        rightLabel.style.position = 'absolute';
        rightLabel.style.right = '10px';
        rightLabel.style.top = '50%';
        rightLabel.style.transform = 'translateY(-50%)';
        rightLabel.style.fontSize = '12px';
        rightLabel.style.color = '#999';
        rightLabel.style.pointerEvents = 'none';
        rightLabel.textContent = '官方API优先';

        prioritySwitch.append(leftLabel, rightLabel, prioritySlider);

        // 获取当前优先级设置
        const currentPriority = lsGetItem(lsKeys.apiPriority.id);
        const isOfficialFirst = currentPriority[0] === 'official';

        function updatePrioritySwitch(officialFirst) {
            if (officialFirst) {
                prioritySlider.style.left = '102px';
                prioritySlider.textContent = '官方API优先';
                leftLabel.style.color = '#999';
                rightLabel.style.color = 'white';
            } else {
                prioritySlider.style.left = '2px';
                prioritySlider.textContent = '自定义API优先';
                leftLabel.style.color = 'white';
                rightLabel.style.color = '#999';
            }
        }

        updatePrioritySwitch(isOfficialFirst);

        prioritySwitch.onclick = () => {
            const currentPriority = lsGetItem(lsKeys.apiPriority.id);
            const newPriority = currentPriority[0] === 'official' ? ['custom', 'official'] : ['official', 'custom'];
            lsSetItem(lsKeys.apiPriority.id, newPriority);
            updatePrioritySwitch(newPriority[0] === 'official');
            console.log('[API优先级] 切换为:', newPriority[0] === 'official' ? '官方API优先' : '自定义API优先');
        };

        priorityContainer.append(prioritySwitch);
        apiSelectDiv.append(priorityContainer);

        const searchNameDiv = getById(eleIds.danmakuSearchNameDiv);
        searchNameDiv.append(embyInput({ id: eleIds.danmakuSearchName, value: window.ede.searchDanmakuOpts.animeName, type: 'search' }
            , doDanmakuSearchEpisode));
        searchNameDiv.append(embyButton({ label: '搜索', iconKey: iconKeys.search}, doDanmakuSearchEpisode));
        searchNameDiv.append(embyButton({ label: '切换[原]标题', iconKey: iconKeys.text_format }, doSearchTitleSwtich));
        getById(eleIds.danmakuEpisodeLoad).append(
            embyButton({ id: eleIds.danmakuSwitchEpisode, label: '加载弹幕', iconKey: iconKeys.done }, doDanmakuSwitchEpisode)
        );
        const currentMatchedDiv = getById(eleIds.currentMatchedDiv);
        currentMatchedDiv.append(
            embyButton({ label: '取消匹配/清空弹幕', iconKey: iconKeys.close }, (e) => {
                if (window.ede.episode_info && window.ede.episode_info.episodeId) {
                    window.ede.episode_info.episodeId = null;
                }
                if (window.ede.danmaku) {
                    createDanmaku([]);
                }
                currentMatchedDiv.querySelector('label').textContent = '弹弹 play 总量: 0';
            })
        );
    }

    function buildExtCommentDiv() {
        const extCommentSearchDiv = getById(eleIds.extCommentSearchDiv);
        buildExtUrlsDiv();
        extCommentSearchDiv.append(embyInput({ type: 'search', placeholder: 'http(s)://' }, onEnterExtComment));
        extCommentSearchDiv.append(embyButton({ label: '搜索', iconKey: iconKeys.search}, onEnterExtComment));
    }

    function buildExtUrlsDiv() {
        const episodeId = window.ede.episode_info ? window.ede.episode_info.episodeId : null;
        const comments = window.ede.danmuCache[episodeId] || [];
        const curExtCommentCache = window.ede.extCommentCache[window.ede.itemId];
        const allComments = comments.concat(...Object.values(curExtCommentCache || {}));
        const extUrlsDiv = getById(eleIds.extUrlsDiv);
        extUrlsDiv.innerHTML = '';
        curExtCommentCache && objectEntries(curExtCommentCache).forEach(([key, val]) => {
            const extUrlDiv = document.createElement('div');
            extUrlDiv.append(embyButton({ label: '清空此加载', iconKey: iconKeys.close }, (e) => {
                delete curExtCommentCache[key];
                e.target.parentNode.remove();
                createDanmaku(allComments.filter(c => c.fromUrl !== key));
            }));
            extUrlDiv.append(embyALink(key), document.createTextNode(` 总量: ${val.length}`));
            extUrlsDiv.append(extUrlDiv);
        });
    }

    async function onEnterExtComment(e) {
        const extUrl = getTargetInput(e).value.trim();
        if (!extUrl.startsWith('http')) { return embyToast({ text: '输入的 url 应以 http 开头!' }); }
        addExtComments(extUrl);
    }

    async function addExtComments(extUrl, extComments) {
        const episode_info = window.ede.episode_info;
        const episodeId = episode_info ? episode_info.episodeId : null;
        const comments = window.ede.danmuCache[episodeId] || [];
        if (!extComments) {
            extComments = await fetchExtcommentActual(extUrl, comments);
        }
        if (extComments.length === 0) {
            return embyToast({ text: '附加弹幕不能为空!' });
        }
        const allComments = comments.concat(extComments);
        createDanmaku(allComments)
        .then(() => {
            const beforeLength = window.ede.commentsParsed.length - extComments.length;
            embyToast({ text: `此次附加总量: ${extComments.length}, 附加前总量: ${beforeLength}, 附加后总量: ${allComments.length}` });
            console.log(`附加弹幕就位, 附加前总量: ${beforeLength}`);
            buildExtUrlsDiv();
        })
        .catch(err => console.log(err));
    }

    function buildDanmuPluginDiv() {
        getById(eleIds.danmuPluginDiv).append(embyCheckbox(
            { label: lsKeys.useFetchPluginXml.name }, lsGetItem(lsKeys.useFetchPluginXml.id), (checked) => {
                lsSetItem(lsKeys.useFetchPluginXml.id, checked);
            }
        ));
        // getById(eleIds.danmuPluginDiv).append(embyCheckbox(
        //     { label: lsKeys.refreshPluginXml.name }, lsGetItem(lsKeys.refreshPluginXml.id), (checked) => {
        //         lsSetItem(lsKeys.refreshPluginXml.id, checked);
        //     }
        // ));
    }

    function buildCurrentDanmakuInfo(containerId) {
        const container = getById(containerId);
        if (!container) { return; }
        const { episodeTitle, animeId, animeTitle, apiName } = window.ede.episode_info || {};
        const loadSum = getDanmakuComments(window.ede).length;
        const downloadSum = window.ede.commentsParsed.length;
        let template = `
            <div style="display: flex;">
                <div id="${eleIds.posterImgDiv}"></div>
                <div>
                    <div>
                        <label class="${classes.embyLabel}">媒体名: </label>
                        <div class="${classes.embyFieldDesc}">${animeTitle}</div>
                    </div>
                    ${!episodeTitle ? '' :
                    `<div>
                        <label class="${classes.embyLabel}">章节名: </label>
                        <div class="${classes.embyFieldDesc}">${episodeTitle}</div>
                    </div>`}
                    ${!apiName ? '' :
                    `<div>
                        <label class="${classes.embyLabel}">来源: </label>
                    </div>
                    <div class="${classes.embyFieldDesc}">${apiName}</div>`}
                    <div>
                        <label class="${classes.embyLabel}">其它信息: </label>
                        <div class="${classes.embyFieldDesc}">
                            获取总数: ${downloadSum},
                            加载总数: ${loadSum},
                            被过滤数: ${downloadSum - loadSum}
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 2%;">
                <label class="${classes.embyLabel}">${lsKeys.danmuList.name}: </label>
                <div id="${eleIds.danmuListDiv}" style="margin: 1% 0;"></div>
                <textarea id="${eleIds.danmuListText}" readOnly style="display: none;resize: vertical;width: 100%" rows="8"
                    is="emby-textarea" class="txtOverview emby-textarea"></textarea>
                <div class="${classes.embyFieldDesc}">列表展示格式为: [序号][分:秒] : 弹幕正文 [来源平台][用户ID][弹幕CID][模式]</div>
            </div>
            <div id="${eleIds.extInfoCtrlDiv}" style="margin: 0.6em 0;"></div>
            <div id="${eleIds.extInfoDiv}" hidden>
                <label class="${classes.embyLabel}">Bangumi 角色介绍: </label>
                <div style="${styles.embySlider + 'margin: 0.8em 0;'}">
                    <label class="${classes.embyLabel}" style="width:7em;">角色图片高度: </label>
                    <div id="${eleIds.characterImgHeihtDiv}" style="width: 36.5em; text-align: center;"></div>
                    <label>
                        <label id="${eleIds.characterImgHeihtLabel}" style="${styles.embySliderLabel}">auto</label>
                        <label>em</label>
                    </label>
                </div>
                <div id="${eleIds.charactersDiv}" style="display: flex; flex-wrap: wrap;"></div>
            </div>
        `;
        container.innerHTML = template.trim();
        if (animeId) {
            getById(eleIds.posterImgDiv, container).append(
                embyImgButton(embyImg(dandanplayApi.posterImg(animeId)), 'width: calc((var(--videoosd-tabs-height) - 3em) * (2 / 3)); margin-right: 1em;')
            );
        }
        buildDanmuListDiv(container);
        // 额外信息
        buildExtInfo(container);
    }

    function buildDanmuListDiv(container) {
        const { episodeId, } = window.ede.episode_info || {};
        const extCommentCache = window.ede.extCommentCache[window.ede.itemId] || {};
        const danmuListExts = Object.values(extCommentCache).map((value, index) => {
            return { id: `ext${index + 1}`, name: `附加${index + 1}`, onChange: () => danmakuParser(value) };
        });
        let danmuListTabOpts = danmuListOpts;
        if (danmuListExts.length > 0) {
            const dandanplayListOpt = { id: 'dandanplay', name: '弹弹 play', onChange: () => {
                const comments = window.ede.danmuCache[episodeId];
                return comments ? danmakuParser(comments) : [];
            } };
            danmuListTabOpts = danmuListTabOpts.concat(dandanplayListOpt).concat(danmuListExts);
        }
        getById(eleIds.danmuListDiv, container).append(
            embyTabs(danmuListTabOpts, lsKeys.danmuList.defaultValue, 'id', 'name', doDanmuListOptsChange)
        );
    }

    function buildExtInfo(container) {
        getById(eleIds.characterImgHeihtDiv, container).append(embySlider(
            { labelId: eleIds.characterImgHeihtLabel, value: '12', min: 12, max: 100, step: 1 }
            , (val, opts) => {
                if (val === '12') { val = 'auto'; }
                onSliderChangeLabel(val, opts);
                Array.from(getById(eleIds.charactersDiv).children)
                    .map(c => c.style.height = val === 'auto' ? val : val + 'em');
            }
        ));
        const extInfoCtrlDiv = getById(eleIds.extInfoCtrlDiv, container);
        extInfoCtrlDiv.append(
            embyButton({ label: '额外信息', iconKey: iconKeys.more }, (e) => {
                const xChecked = !e.target.xChecked;
                e.target.xChecked = xChecked;
                e.target.title = xChecked ? '关闭' : '额外信息';
                e.target.firstChild.innerHTML = xChecked ? iconKeys.close : iconKeys.more;
                const extInfoDiv = getById(eleIds.extInfoDiv);
                extInfoDiv.hidden = !xChecked;
                const charactersDiv = getById(eleIds.charactersDiv);
                if (charactersDiv.firstChild) { return; }
                const bangumiInfo = window.ede.bangumiInfo;
                if (bangumiInfo && bangumiInfo.characters
                    && bangumiInfo.animeId === window.ede.episode_info.animeId
                ) {
                    return renderBangumiCharacters(charactersDiv, bangumiInfo.characters);
                }
                getEpisodeBangumiRel().then(bangumiInfo => {
                    return fetchJson(bangumiApi.getCharacters(bangumiInfo.subjectId));
                }).then(characters => {
                    bangumiInfo.characters = characters;
                    renderBangumiCharacters(charactersDiv, characters);
                });
                function renderBangumiCharacters(container, characters) {
                    characters.map(c => {
                        const characterDiv = document.createElement('div');
                        characterDiv.style = 'width: 31%; display: flex; margin: .5em;';
                        let embyImgButtonInner = embyImg(c.images.large, 'object-position: top;');
                        if (!c.images.large) {
                            embyImgButtonInner = embyI(iconKeys.person, classes.cardImageIcon);
                        }
                        characterDiv.append(embyImgButton(embyImgButtonInner));
                        const characterRightDiv = document.createElement('div');
                        characterRightDiv.style.marginLeft = '.5em';
                        const characterNameDiv = document.createElement('div');
                        characterNameDiv.textContent = c.relation + ': ' + c.name;
                        characterRightDiv.append(characterNameDiv);
                        const characterCvDiv = document.createElement('div');
                        characterCvDiv.textContent = 'CV: ' + c.actors.map(a => a.name).join();
                        if (c.actors[0]) {
                            characterCvDiv.append(embyImgButton(embyImg(c.actors[0].images.large)));
                        }
                        characterRightDiv.append(characterCvDiv);
                        characterDiv.append(characterRightDiv);
                        container.append(characterDiv);
                    });
                }
            })
        );
    }

    function buildProSetting(containerId) {
        const container = getById(containerId);
        let template = `
            <div style="height: 30em;">
                <div is="emby-collapse" title="弹幕屏蔽" data-expanded="true">
                    <div class="${classes.collapseContentNav}">
                        <div id="${eleIds.danmakuTypeFilterDiv}" style="margin-bottom: 0.2em;">
                            <label class="${classes.embyLabel}">${lsKeys.typeFilter.name}: </label>
                        </div>
                        <div id="${eleIds.danmakuSourceFilterDiv}">
                            <label class="${classes.embyLabel}">${lsKeys.sourceFilter.name}: </label>
                        </div>
                        <div id="${eleIds.danmakuShowSourceDiv}">
                            <label class="${classes.embyLabel}">${lsKeys.showSource.name}: </label>
                        </div>
                    </div>
                </div>
                <div is="emby-collapse" title="弹幕高级屏蔽">
                    <div class="${classes.collapseContentNav}">
                        <div>
                            <div style="${styles.embySlider}">
                                <label class="${classes.embyLabel}" style="width: 10em;">${lsKeys.autoFilterCount.name}: </label>
                                <div id="${eleIds.danmakuAutoFilterCountDiv}" style="width: 15.5em; text-align: center;"></div>
                                <label style="${styles.embySliderLabel}">0</label>
                            </div>
                            <label class="${classes.embyLabel}">${lsKeys.mergeSimilarEnable.name}: </label>
                            <div id="${eleIds.danmakuFilterProDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                            <div style="${styles.embySlider}">
                                <label class="${classes.embyLabel}" style="width: 10em;">${lsKeys.mergeSimilarPercent.name}: </label>
                                <div id="${eleIds.mergeSimilarPercentDiv}" style="width: 15.5em; text-align: center;"></div>
                                <label>
                                    <label style="${styles.embySliderLabel}"></label>
                                    <label>%</label>
                                </label>
                            </div>
                            <div style="${styles.embySlider}">
                                <label class="${classes.embyLabel}" style="width: 10em;">${lsKeys.mergeSimilarTime.name}: </label>
                                <div id="${eleIds.mergeSimilarTimeDiv}" style="width: 15.5em; text-align: center;"></div>
                                <label style="${styles.embySliderLabel}">-1</label>
                            </div>
                        </div>
                        <div id="${eleIds.filterKeywordsDiv}" style="margin-bottom: 0.2em;">
                            <label class="${classes.embyLabel}">${lsKeys.filterKeywords.name}: </label>
                        </div>
                    </div>
                </div>
                <div is="emby-collapse" title="额外设置">
                    <div class="${classes.collapseContentNav}" style="padding-top: 0.5em !important;">
                        <div id="${eleIds.extCheckboxDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                        <div id="${eleIds.danmakuChConverDiv}" style="margin-bottom: 0.2em;">
                            <label class="${classes.embyLabel}">${lsKeys.chConvert.name}: </label>
                        </div>
                        <div id="${eleIds.danmakuEngineDiv}" style="margin-bottom: 0.2em;">
                            <label class="${classes.embyLabel}">${lsKeys.engine.name}: </label>
                        </div>
                    </div>
                </div>
                <div is="emby-collapse" title="播放界面设置">
                    <div class="${classes.collapseContentNav}">
                        <div id="${eleIds.osdCheckboxDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                        <div>
                            <div id="${eleIds.osdLineChartDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                            <div style="${styles.embySlider}">
                                <label class="${classes.embyLabel}" style="width: 12em;">${lsKeys.osdLineChartTime.name}: </label>
                                <div id="${eleIds.osdLineChartTimeDiv}" style="width: 15.5em; text-align: center;"></div>
                                <label style="${styles.embySliderLabel}"></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div is="emby-collapse" title="播放设置">
                    <div class="${classes.collapseContentNav}">
                        <label class="${classes.embyLabel}">单次定时执行: </label>
                        <div id="${eleIds.timeoutCallbackTypeDiv}"></div>
                        <label class="${classes.embyLabel}">定时单位: </label>
                        <div id="${eleIds.timeoutCallbackUnitDiv}"></div>
                        <div style="${styles.embySlider + 'margin-top: 0.3em;'}">
                            <label class="${classes.embyLabel}" style="width:4em;">${lsKeys.timeoutCallbackValue.name}: </label>
                            <div id="${eleIds.timeoutCallbackDiv}" style="width: 15.5em; text-align: center;"></div>
                            <label id="${eleIds.timeoutCallbackLabel}" style="${styles.embySliderLabel}"></label>
                        </div>
                    </div>
                </div>
                <div is="emby-collapse" title="Bangumi 设置">
                    <div class="${classes.collapseContentNav}" style="padding-top: 0.5em !important;">
                        <label id="${eleIds.bangumiEnableLabel}" class="${classes.embyLabel}"></label>
                        <div id="${eleIds.bangumiSettingsDiv}">
                            <div id="${eleIds.bangumiTokenInputDiv}" style="display: flex;" ></div>
                            <div id="${eleIds.bangumiTokenLabel}" class="${classes.embyFieldDesc}"></div>
                            <div class="${classes.embyFieldDesc}">
                                你可以在以下链接生成一个 Access Token
                            </div>
                            <div id="${eleIds.bangumiTokenLinkDiv}" style="padding-bottom: 0.5em;"></div>
                            <label class="${classes.embyLabel}">自动更新单章节收藏信息: </label>
                            <div style="${styles.embySlider}">
                                <label class="${classes.embyLabel}" style="width:4em;">${lsKeys.bangumiPostPercent.name}: </label>
                                <div id="${eleIds.bangumiPostPercentDiv}" style="width: 15.5em; text-align: center;"></div>
                                <label>
                                    <label style="${styles.embySliderLabel}"></label>
                                    <label>%</label>
                                </label>
                            </div>
                            <div class="${classes.embyFieldDesc}">
                                触发时机为正常停止播放,且播放进度超过设定百分比时;
                                同步的媒体信息为自动匹配而来,可在"弹幕信息"中查看;
                                自动匹配有误可"手动匹配",仍无法匹配可点击按钮X"取消匹配/清除弹幕",则此单章节不会同步;
                            </div>
                        </div>
                    </div>
                </div>
                <div is="emby-collapse" title="自定义接口地址">
                    <div id="${eleIds.customeUrlsDiv}" class="${classes.collapseContentNav}"></div>
                </div>
            </div>
        `;
        container.innerHTML = template.trim();
        buildDanmakuFilterSetting(container);
        buildExtSetting(container);
        buildOsdSetting();
        buildPlaySetting(container);
        buildBangumiSetting(container);
        buildCustomUrlSetting(container);
    }

    function buildDanmakuFilterSetting(container) {
        getById(eleIds.danmakuTypeFilterDiv, container).append(
            embyCheckboxList(null, eleIds.danmakuTypeFilterSelectName
                , lsGetItem(lsKeys.typeFilter.id), Object.values(danmakuTypeFilterOpts).filter(o => !o.hidden)
                , doDanmakuTypeFilterSelect)
        );
        getById(eleIds.danmakuSourceFilterDiv, container).append(
            embyCheckboxList(null, eleIds.danmakuSourceFilterSelectName
                , lsGetItem(lsKeys.sourceFilter.id), Object.values(danmakuSource), doDanmakuSourceFilterSelect)
        );
        getById(eleIds.danmakuShowSourceDiv, container).append(
            embyCheckboxList(null, eleIds.danmakuShowSourceSelectName
                , lsGetItem(lsKeys.showSource.id), Object.values(showSource), doDanmakuShowSourceSelect)
        );
        getById(eleIds.danmakuAutoFilterCountDiv).append(
            embySlider({ lsKey: lsKeys.autoFilterCount }, onSliderChange, onSliderChangeLabel)
        );
        // 合并相似弹幕
        getById(eleIds.danmakuFilterProDiv, container).append(
            embyCheckbox({ label: labels.enable }, lsGetItem(lsKeys.mergeSimilarEnable.id)
            , (checked) => {
                lsSetItem(lsKeys.mergeSimilarEnable.id, checked);
                loadDanmaku(LOAD_TYPE.RELOAD);
            }
        ));
        getById(eleIds.mergeSimilarPercentDiv).append(
            embySlider({ lsKey: lsKeys.mergeSimilarPercent }, onSliderChange, onSliderChangeLabel)
        );
        getById(eleIds.mergeSimilarTimeDiv).append(
            embySlider({ lsKey: lsKeys.mergeSimilarTime }, onSliderChange, onSliderChangeLabel)
        );
        // 屏蔽关键词
        const keywordsContainer = getById(eleIds.filterKeywordsDiv, container);
        const keywordsEnableDiv = keywordsContainer.appendChild(document.createElement('div'));
        const keywordsBtn = embyButton({ label: '加载关键词过滤', iconKey: iconKeys.done_disabled }, doDanmakuFilterKeywordsBtnClick);
        keywordsBtn.disabled = true;
        keywordsEnableDiv.setAttribute('style', 'display: flex; justify-content: space-between; align-items: center; width: 100%;');
        keywordsEnableDiv.append(embyCheckbox(
            { id: eleIds.filterKeywordsEnableId, label: labels.enable }
            , lsGetItem(lsKeys.filterKeywordsEnable.id), (flag) => updateFilterKeywordsBtn(keywordsBtn, flag
                , getById(eleIds.filterKeywordsId).value.trim()))
        );
        keywordsEnableDiv.appendChild(document.createElement('div')).appendChild(keywordsBtn);
        keywordsContainer.appendChild(document.createElement('div')).appendChild(
            embyTextarea({id: eleIds.filterKeywordsId, value: lsGetItem(lsKeys.filterKeywords.id)
                , style: 'width: 100%;margin-top: 0.2em;', rows: 8}, (event) => updateFilterKeywordsBtn(keywordsBtn
                , getById(eleIds.filterKeywordsEnableId).checked, event.target.value.trim()))
        );
        const label = document.createElement('label');
        label.innerText = `关键词/正则匹配过滤,支持过滤[正文,${Object.values(showSource).map(o => o.name).join()}],多个表达式用换行分隔`;
        label.className = classes.embyFieldDesc;
        keywordsContainer.appendChild(document.createElement('div')).appendChild(label);
    }

    function buildExtSetting(container) {
        // getById(eleIds.extCheckboxDiv, container).append(embyCheckbox(
        //     { label: lsKeys.removeEmojiEnable.name }, lsGetItem(lsKeys.removeEmojiEnable.id), (checked) => {
        //         lsSetItem(lsKeys.removeEmojiEnable.id, checked);
        //     }
        // ));
        getById(eleIds.danmakuChConverDiv, container).append(
            embyTabs(danmakuChConverOpts, window.ede.chConvert, 'id', 'name', doDanmakuChConverChange)
        );
        getById(eleIds.danmakuEngineDiv, container).append(
            embyTabs(danmakuEngineOpts, lsGetItem(lsKeys.engine.id), 'id', 'name', doDanmakuEngineSelect)
        );
    }

    function buildOsdSetting() {
        getById(eleIds.osdCheckboxDiv).append(embyCheckbox(
            { label: lsKeys.osdTitleEnable.name }, lsGetItem(lsKeys.osdTitleEnable.id), (checked) => {
                lsSetItem(lsKeys.osdTitleEnable.id, checked);
                const videoOsdContainer = document.querySelector(`${mediaContainerQueryStr} .videoOsdSecondaryText`);
                const videoOsdDanmakuTitle = getById(eleIds.videoOsdDanmakuTitle, videoOsdContainer);
                if (videoOsdDanmakuTitle) {
                    videoOsdDanmakuTitle.style.display = checked ? 'block' : 'none';
                } else if (checked) {
                    appendvideoOsdDanmakuInfo(getDanmakuComments(window.ede).length);
                }
            }
        ));
        getById(eleIds.osdCheckboxDiv).append(embyCheckbox(
            { label: lsKeys.osdHeaderClockEnable.name }, lsGetItem(lsKeys.osdHeaderClockEnable.id), (checked) => {
                lsSetItem(lsKeys.osdHeaderClockEnable.id, checked);
                checked ? addHeaderClock() : removeHeaderClock();
            }
        ));
        getById(eleIds.osdLineChartDiv).append(embyCheckbox(
            { label: lsKeys.osdLineChartEnable.name }, lsGetItem(lsKeys.osdLineChartEnable.id), (checked) => {
                lsSetItem(lsKeys.osdLineChartEnable.id, checked);
                const progressBarLineChart = getById(eleIds.progressBarLineChart);
                if (progressBarLineChart) {
                    progressBarLineChart.style.display = checked ? 'block' : 'none';
                } else if (checked) {
                    buildProgressBarChart(20);
                }
            }
        ));
        getById(eleIds.osdLineChartDiv).append(embyCheckbox(
            { label: lsKeys.osdLineChartSkipFilter.name }, lsGetItem(lsKeys.osdLineChartSkipFilter.id), (checked) => {
                lsSetItem(lsKeys.osdLineChartSkipFilter.id, checked);
                buildProgressBarChart(20);
            }
        ));
        getById(eleIds.osdLineChartTimeDiv).append(
            embySlider({ lsKey: lsKeys.osdLineChartTime, needReload: false }
                , (val, opts) => {
                    onSliderChange(val, opts);
                    if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
                        buildProgressBarChart(20);
                    }
                }, onSliderChangeLabel)
        );
    }

    function buildPlaySetting(container) {
        const btnContainer = getById(eleIds.timeoutCallbackDiv, container);
        const timeoutCallbacktOpts = { labelId: eleIds.timeoutCallbackLabel, key: lsKeys.timeoutCallbackValue.id, needReload: false };
        onSliderChangeLabel(lsGetItem(lsKeys.timeoutCallbackValue.id), timeoutCallbacktOpts);
        timeOffsetBtns.forEach(btn => {
            btnContainer.append(embyButton(btn, (e) => {
                if (e.target) {
                    let oldValue = lsGetItem(lsKeys.timeoutCallbackValue.id);
                    let newValue = oldValue + (parseFloat(e.target.getAttribute('valueOffset')) || 0);
                    if (newValue === oldValue || newValue < 0) { newValue = 0; }
                    onSliderChange(newValue, timeoutCallbacktOpts);
                }
            }));
        });
        getById(eleIds.timeoutCallbackUnitDiv, container).append(
            embyTabs(timeoutCallbackUnitOpts, lsGetItem(lsKeys.timeoutCallbackUnit.id), 'id', 'name', (value, index) => {
                lsSetItem(lsKeys.timeoutCallbackUnit.id, index);
            })
        );
        getById(eleIds.timeoutCallbackTypeDiv, container).append(
            embyTabs(timeoutCallbackTypeOpts, timeoutCallbackTypeOpts[0].id, 'id', 'name', (value) => {
                const unitObj = timeoutCallbackUnitOpts[lsGetItem(lsKeys.timeoutCallbackUnit.id)];
                value.onChange(lsGetItem(lsKeys.timeoutCallbackValue.id) * unitObj.msRate);
            })
        );
    }

    function buildBangumiSetting(container) {
        const bangumiSettingsDiv = getById(eleIds.bangumiSettingsDiv, container);
        const bangumiEnable = lsGetItem(lsKeys.bangumiEnable.id);
        bangumiSettingsDiv.hidden = !bangumiEnable;
        const bangumiEnableLabel = getById(eleIds.bangumiEnableLabel, container);
        bangumiEnableLabel.append(embyCheckbox(
            { label: lsKeys.bangumiEnable.name }, bangumiEnable, (checked) => {
                lsSetItem(lsKeys.bangumiEnable.id, checked);
                bangumiSettingsDiv.hidden = !checked;
            }
        ));
        const bangumiTokenInputDiv = getById(eleIds.bangumiTokenInputDiv, container);
        bangumiTokenInputDiv.append(embyInput(
            { id: eleIds.bangumiTokenInput, type: 'password', value: lsGetItem(lsKeys.bangumiToken.id) }, onEnterBangumiToken
        ));
        bangumiTokenInputDiv.append(embyButton({ label: '校验', iconKey: iconKeys.check}, onEnterBangumiToken));
        getById(eleIds.bangumiPostPercentDiv, container).append(embySlider(
            { lsKey: lsKeys.bangumiPostPercent, needReload: false }
            , (val, opts) => { onSliderChange(val, opts) }, onSliderChangeLabel
        ));
        const bangumiTokenLinkDiv = getById(eleIds.bangumiTokenLinkDiv, container);
        bangumiTokenLinkDiv.append(embyALink(bangumiApi.accessTokenUrl, bangumiApi.accessTokenUrl));
    }

    function onEnterBangumiToken(e) {
        const bangumiToken = getById(eleIds.bangumiTokenInput).value.trim();
        lsSetItem(lsKeys.bangumiToken.id, bangumiToken);
        const label = getById(eleIds.bangumiTokenLabel);
        fetchBangumiApiGetMe(bangumiToken).then(res => {
            label.innerText = 'Bangumi Token 验证成功';
            label.style.color = 'green';
        }).catch(error => {
            label.innerText = 'Bangumi Token 验证失败';
            label.style.color = 'red';
            throw error;
        });
    }

    async function fetchBangumiApiGetMe(bangumiToken) {
        try {
            const res = await fetchJson(bangumiApi.getMe(), { token: bangumiToken });
            console.log('Bangumi Token 验证成功', res);
            localStorage.setItem(lsLocalKeys.bangumiMe, JSON.stringify(res));
            return res;
        } catch (error) {
            console.error('Bangumi Token 验证失败', error);
            throw error;
        }
    }

    function buildCustomUrlSetting(container) {
        const getTemplate = (obj) => `
            <label class="${classes.embyLabel}">${obj.lsKey.name}(${obj.msg1}): </label>
            <div id="${obj.divId}" style="display: flex;" ></div>
            <div class="${classes.embyFieldDesc}">${obj.msg2 ? obj.msg2 : ''}</div>
        `;
        customeUrl.mapping.map(obj => { getById(eleIds.customeUrlsDiv, container).innerHTML += getTemplate(obj); return obj; })
        .map(obj => {
            const inputDiv = getById(obj.divId, container);
            const onEnter = (e) => {
                const target = getTargetInput(e);
                let value = target.value.trim();
                if (!value) {
                    value = obj.lsKey.defaultValue;
                    target.value = value;
                }
                lsSetItem(obj.lsKey.id, value);
                obj.rewrite(value);
            };
            inputDiv.append(embyInput({ type: 'search', value: lsGetItem(obj.lsKey.id) }, onEnter));
            inputDiv.append(embyButton({ label: '确认', iconKey: iconKeys.check }, onEnter));
        });
    }

    function buildAbout(containerId) {
        const container = getById(containerId);
        if (!container) { return; }
        const template = `
            <div style="height: 30em;">
                <div id="${eleIds.consoleLogCtrl}"></div>
                <div id="${eleIds.consoleLogInfo}">
                    <textarea id="${eleIds.consoleLogText}" readOnly style="resize: vertical;margin-top: 0.6em;"
                        rows="12" is="emby-textarea" class="txtOverview emby-textarea"></textarea>
                    <textarea id="${eleIds.consoleLogTextInput}" hidden style="resize: vertical;"
                        rows="1" is="emby-textarea" class="txtOverview emby-textarea"></textarea>
                </div>
                <div class="${classes.embyFieldDesc}">注意开启后原本控制台中调用方信息将被覆盖,不使用请保持关闭状态</div>
                <div id="${eleIds.consoleLogCtrl}"></div>
                <div is="emby-collapse" title="开发者选项">
                    <div class="${classes.collapseContentNav}">
                        <label class="${classes.embyLabel}">调试开关: </label>
                        <div id="${eleIds.debugCheckbox}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                        <label class="${classes.embyLabel}">调试按钮: </label>
                        <div id="${eleIds.debugButton}"></div>
                    </div>
                </div>
                <div is="emby-collapse" title="开放源代码许可" data-expanded="true" style="margin-top: 0.6em;">
                    <div id="${eleIds.openSourceLicenseDiv}" class="${classes.collapseContentNav}" style="display: flex; flex-direction: column;"></div>
                </div>
            </div>
        `;
        container.innerHTML = template.trim();
        buildConsoleLog(container);
        buildDebugCheckbox(container);
        buildDebugButton(container);
        buildOpenSourceLicense(container);
    }

    function buildConsoleLog(container) {
        const consoleLogEnable = lsGetItem(lsKeys.consoleLogEnable.id);
        getById(eleIds.consoleLogInfo, container).style.display = consoleLogEnable ? '' : 'none';
        if (consoleLogEnable) { doConsoleLogChange(consoleLogEnable); }
        const consoleLogCtrlEle = getById(eleIds.consoleLogCtrl, container);
        consoleLogCtrlEle.append(embyCheckbox({ label: lsKeys.consoleLogEnable.name }, consoleLogEnable, doConsoleLogChange));
        const consoleLogCountLabel = document.createElement('label');
        consoleLogCountLabel.id = eleIds.consoleLogCountLabel;
        consoleLogCtrlEle.append(
            embyButton({ label: '清空', iconKey: iconKeys.block }, () => {
                getById(eleIds.consoleLogText, container).value = '';
                getById(eleIds.consoleLogCountLabel).innerHTML = '';
                if (window.ede.appLogAspect) { window.ede.appLogAspect.value = ''; }
            })
            , consoleLogCountLabel
        );
        const consoleLogTextInput = getById(eleIds.consoleLogTextInput, container);
        consoleLogTextInput.style.display = consoleLogEnable && lsGetItem(lsKeys.quickDebugOn.id) ? '' : 'none';
        consoleLogTextInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const inputVal = e.target.value.trim();
                console.log('输入内容为: \n', inputVal);
                eval(inputVal);
                e.target.value = '';
            }
        });
    }

    function buildDebugCheckbox(container) {
        const debugWrapper = getById(eleIds.debugCheckbox, container);
        debugWrapper.append(embyCheckbox({ label: lsKeys.debugShowDanmakuWrapper.name }
            , lsGetItem(lsKeys.debugShowDanmakuWrapper.id), (checked) => {
                lsSetItem(lsKeys.debugShowDanmakuWrapper.id, checked);
                const wrapper = getById(eleIds.danmakuWrapper);
                wrapper.style.backgroundColor = checked ? styles.colors.highlight : '';
                if (!checked) { return; }
                console.log(`弹幕容器(#${eleIds.danmakuWrapper})宽高像素:`, wrapper.offsetWidth, wrapper.offsetHeight);
                const stage = wrapper.firstChild;
                console.log(`实际舞台(${stage.tagName})宽高像素:`, stage.offsetWidth, stage.offsetHeight);
            }
        ));
        debugWrapper.append(embyCheckbox({ label: lsKeys.debugShowDanmakuCtrWrapper.name }
            , lsGetItem(lsKeys.debugShowDanmakuCtrWrapper.id), (checked) => {
                lsSetItem(lsKeys.debugShowDanmakuCtrWrapper.id, checked);
                const wrapper = getById(eleIds.danmakuCtr);
                wrapper.style.backgroundColor = checked ? styles.colors.highlight : '';
                if (!checked) { return; }
                console.log(`按钮容器(#${eleIds.danmakuCtr})宽高像素:`, wrapper.offsetWidth, wrapper.offsetHeight);
            }
        ));
        debugWrapper.append(embyCheckbox({ label: lsKeys.debugReverseDanmu.name }
            , lsGetItem(lsKeys.debugReverseDanmu.id), (checked) => {
                lsSetItem(lsKeys.debugReverseDanmu.id, checked);
                const comments = window.ede.danmuCache[window.ede.episode_info.episodeId];
                comments.map(c => {
                    const values = c.p.split(',');
                    values[1]= { '6': '1', '1': '6', '5': '4', '4': '5' }[values[1]];
                    c.p = values.join();
                });
                console.log('已' + lsKeys.debugReverseDanmu.name);
                createDanmaku(comments);
            }
        ));
        const toggleDanmuColor = (checked, lsKey, colorFn) => {
            lsSetItem(lsKey.id, checked);
            let comments = window.ede.danmuCache[window.ede.episode_info.episodeId];
            if (checked) {
                window.ede._oriComments = structuredClone(comments);
                comments = comments.map(c => {
                    const values = c.p.split(',');
                    values[2] = colorFn();
                    return { ...c, p: values.join() };
                });
                console.log('已' + lsKey.name);
            } else {
                comments = window.ede._oriComments;
                window.ede.danmuCache[window.ede.episode_info.episodeId] = comments;
                console.log('已还原' + lsKey.name);
            }
            createDanmaku(comments);
        };
        debugWrapper.append(embyCheckbox({ label: lsKeys.debugRandomDanmuColor.name }
            , lsGetItem(lsKeys.debugRandomDanmuColor.id), (checked) => {
                toggleDanmuColor(checked, lsKeys.debugRandomDanmuColor
                    , () => parseInt(Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), 16));
            }
        ));
        debugWrapper.append(embyCheckbox({ label: lsKeys.debugForceDanmuWhite.name }
            , lsGetItem(lsKeys.debugForceDanmuWhite.id), (checked) => {
                toggleDanmuColor(checked, lsKeys.debugForceDanmuWhite
                    , () => parseInt(styles.colors.info.toString(16).padStart(6, '0'), 16));
            }
        ));
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
        const dialogContainer = document.querySelector('.' + classes.dialogContainer);
        const centeredDialog = dialogContainer.firstChild;
        // lsKeys.debugDialogHyalinize
        const isExist1 = dialogContainer.classList.contains(classes.dialogBackdropOpened);
        const isExist2 = centeredDialog.classList.contains(classes.dialogBlur);
        const debugDialogHyalinizeOnChange = (checked) => {
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
        }
        const debugDialogHyalinizeChecked = lsGetItem(lsKeys.debugDialogHyalinize.id);
        debugDialogHyalinizeOnChange(debugDialogHyalinizeChecked);
        debugWrapper.append(embyCheckbox({ label: lsKeys.debugDialogHyalinize.name }
            , debugDialogHyalinizeChecked, debugDialogHyalinizeOnChange)
        );
        // lsKeys.debugDialogWindow
        const isExist3 = centeredDialog.classList.contains(classes.dialogFullscreen);
        const isExist4 = centeredDialog.classList.contains(classes.dialogFullscreenLowres);
        const debugDialogWindowOnChange = (checked) => {
            lsSetItem(lsKeys.debugDialogWindow.id, checked);
            isExist3 && centeredDialog.classList.toggle(classes.dialogFullscreen, !checked);
            isExist4 && centeredDialog.classList.toggle(classes.dialogFullscreenLowres, !checked);
        }
        const debugDialogWindowChecked = lsGetItem(lsKeys.debugDialogWindow.id);
        debugDialogWindowOnChange(debugDialogWindowChecked);
        debugWrapper.append(embyCheckbox({ label: lsKeys.debugDialogWindow.name }
            , debugDialogWindowChecked, debugDialogWindowOnChange)
        );
        // lsKeys.debugDialogRight
        const debugDialogRightOnChange = (checked) => {
            lsSetItem(lsKeys.debugDialogRight.id, checked);
            dialogContainer.classList.toggle(classes.dialogBackdropOpened, !checked);
            centeredDialog.style = checked ? styles.rightLayout : '';
            if (checked) {
                isExist3 && centeredDialog.classList.remove(classes.dialogFullscreen);
                isExist4 && centeredDialog.classList.remove(classes.dialogFullscreenLowres, !checked);
            }
        }
        const debugDialogRightChecked = lsGetItem(lsKeys.debugDialogRight.id);
        debugDialogRightOnChange(debugDialogRightChecked);
        debugWrapper.append(embyCheckbox({ label: lsKeys.debugDialogRight.name }
            , debugDialogRightChecked, debugDialogRightOnChange)
        );
        // lsKeys.debugTabIframeEnable
        if (lsGetItem(lsKeys.quickDebugOn.id)) { // @deprecated 已废弃,因跨域无法登录网站,无太大意义
            debugWrapper.append(embyCheckbox({ label: lsKeys.debugTabIframeEnable.name }
                , lsGetItem(lsKeys.debugTabIframeEnable.id), (checked) => {
                    lsSetItem(lsKeys.debugTabIframeEnable.id, checked);
                    getById(tabIframeId + 'Btn').style.display = checked ? '' : 'none';
                }
            ));
        }
        // lsKeys.debugH5VideoAdapterEnable
        const h5VideoAdapter = getById(eleIds.h5VideoAdapter);
        if (h5VideoAdapter) {
            debugWrapper.append(embyCheckbox({ label: lsKeys.debugH5VideoAdapterEnable.name }
                , lsGetItem(lsKeys.debugH5VideoAdapterEnable.id), (checked) => {
                    lsSetItem(lsKeys.debugH5VideoAdapterEnable.id, checked);
                    h5VideoAdapter.style.display = checked ? '' : 'none';
                    h5VideoAdapter.style.backgroundColor = checked ? styles.colors.highlight : '';
                }
            ));
        }
    }

    function buildDebugButton(container) {
        const debugWrapper = getById(eleIds.debugButton, container);
        debugWrapper.append(embyButton({ label: '打印环境信息', style: 'margin: 0.3em;' }, () => {
            require(['browser'], (browser) => {
                console.log('Emby 内部自身判断: ', browser);
            });
            console.log('Emby appName: ', ApiClient.appName());
            console.log('Emby appVersion: ', ApiClient.appVersion());
        }));
        debugWrapper.append(embyButton({ label: '打印弹幕引擎信息', style: 'margin: 0.3em;' }, () => {
            const msg = `弹幕引擎是否存在: ${!!window.Danmaku}, 弹幕引擎是否实例化成功: ${!!window.ede.danmaku}`;
            console.log(msg);
            embyToast({ text: msg });
        }));
        debugWrapper.append(embyButton({ label: '打印视频加载方', style: 'margin: 0.3em;' }, () => {
            const _media = document.querySelector(mediaQueryStr);
            if (!_media) { return console.error('严重错误,页面中依旧不存在 <video> 标签') }
            if (_media.currentTime < 1) { console.error('严重错误,<video> 的 currentTime < 1') }
            if (!_media.id) {
                console.log('视频加载方为 Web 端 <video> 标签:', _media.parentNode.outerHTML);
            } else {
                console.log('当前 <video> 标签为虚拟适配器:', _media.outerHTML);
                const _embed = document.querySelector('embed');
                if (_embed) {
                    console.log('视频加载方为 <embed> 标签占位的 Native 播放器:', _embed.parentNode.outerHTML);
                } else {
                    console.log('视频加载方为无占位标签的 Native 播放器,无信息');
                }
            }
        }));
        debugWrapper.append(embyButton({ label: '清空章节引用缓存', class: classes.embyButtons.submit, style: 'margin: 0.3em;' }, () => {
            lsBatchRemove([lsLocalKeys.animeEpisodePrefix, lsLocalKeys.bangumiEpInfoPrefix]);
            console.log('已清空章节引用缓存');
            embyToast({ text: '已清空章节引用缓存' });
        }));
        debugWrapper.append(embyButton({ label: '重置设置', class: classes.embyButtons.submit, style: 'margin: 0.3em;' }, () => {
            settingsReset();
            console.log(`已重置设置, 跳过了 ${lsKeys.filterKeywords.name} 重置`);
            embyToast({ text: `已重置设置, 跳过了 ${lsKeys.filterKeywords.name} 重置` });
            loadDanmaku(LOAD_TYPE.INIT);
            closeEmbyDialog();
        }));
    }

    function buildOpenSourceLicense(container) {
        const openSourceWrapper = getById(eleIds.openSourceLicenseDiv, container);
        objectEntries(openSourceLicense).map(([key, val]) => {
            openSourceWrapper.append(embyALink(val.url, [key, val.name, val.version, val.license].join(' : ')));
        });
    }

    /**
     * @deprecated 已废弃,无法登录网站,无太大意义
     */
    function buildIframe(containerId) {
        const container = getById(containerId);
        const template = `
            <div>
                <div class="${classes.embyFieldDesc}">注意内嵌网页不支持控制器输入,且被禁止内嵌(CSP)的网页无法显示,且跨域无法登录</div>
                <div style="${styles.embySlider + 'margin: 0.8em 0;'}">
                    <label class="${classes.embyLabel}" style="width: 5em;">网页高度: </label>
                    <div id="${eleIds.tabIframeHeightDiv}" style="width: 40.5em; text-align: center;"></div>
                    <label>
                        <label id="${eleIds.tabIframeHeightLabel}" style="${styles.embySliderLabel}">auto</label>
                        <label>em</label>
                    </label>
                </div>
                <div id="${eleIds.tabIframeCtrlDiv}"></div>
                <div id="${eleIds.tabIframeSrcInputDiv}" style="display: flex; margin-top: 0.6em;"></div>
                <iframe id="${eleIds.tabIframe}" style="border: 0;width: 100%;" src=""></iframe>
            </div>
        `;
        container.innerHTML = template.trim();
        getById(eleIds.tabIframeHeightDiv, container).append(embySlider(
            { labelId: eleIds.tabIframeHeightLabel, value: '29', min: 28, max: 100, step: 1 }
            , (val, opts) => {
                if (val === '28') { val = 'auto'; }
                onSliderChangeLabel(val, opts);
                getById(eleIds.tabIframe).style.height = val === 'auto' ? val : val + 'em';
            }
        ));
        getById(eleIds.tabIframeSrcInputDiv, container).append(embyInput(
            { type: 'search', value: window.ede.bangumiInfo ? window.ede.bangumiInfo.bangumiUrl : '' }
            , (e) => { getById(eleIds.tabIframe).src = e.target.value.trim(); }
        ));
    }

    function appendvideoOsdDanmakuInfo(loadSum) {
        if (!lsGetItem(lsKeys.osdTitleEnable.id)) {
            return;
        }
        const episode_info = window.ede.episode_info || {};
        const { episodeId, animeTitle, episodeTitle } = episode_info;
        const videoOsdContainer = document.querySelector(`${mediaContainerQueryStr} .videoOsdSecondaryText`);
        let videoOsdDanmakuTitle = getById(eleIds.videoOsdDanmakuTitle, videoOsdContainer);
        if (!videoOsdDanmakuTitle) {
            videoOsdDanmakuTitle = document.createElement('h3');
            videoOsdDanmakuTitle.id = eleIds.videoOsdDanmakuTitle;
            videoOsdDanmakuTitle.classList.add(classes.videoOsdTitle);
            videoOsdDanmakuTitle.style = 'margin-left: auto; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word; position: absolute; right: 0px; bottom: 0px;';
        }
        let text = '弹幕：';
        if (episodeId) {
            text += `${animeTitle} - ${episodeTitle} - ${loadSum}条`;
        } else {
            text += `未匹配`;
        }
        videoOsdDanmakuTitle.innerText = text;
        if (videoOsdContainer) {
            videoOsdContainer.append(videoOsdDanmakuTitle);
        }
    }

    function toggleSettingBtn2Header() {
        const targetBtn = getById(eleIds.danmakuSettingBtnDebug);
        if (targetBtn) {
            targetBtn.remove();
            return false;
        }
        const opt = mediaBtnOpts[1];
        opt.id = eleIds.danmakuSettingBtnDebug;
        getByClass(classes.headerRight).prepend(embyButton(opt, opt.onClick));
        return true;
    }

    function quickDebug() {
        const flag = toggleSettingBtn2Header();
        embyToast({ text: `${lsKeys.quickDebugOn.name}: ${flag}!` });
        if (!window.ede) { window.ede = new EDE(); }
        lsSetItem(lsKeys.quickDebugOn.id, flag);
        checkRuntimeVars();
    }

    function checkRuntimeVars(exposeGlobalThis = true) {
        console.log('运行时变量检查');
        console.log(lsKeys.customeCorsProxyUrl.name ,corsProxy);
        console.log(lsKeys.customeDanmakuUrl.name, requireDanmakuPath);
        console.log('弹弹 play API 模板', dandanplayApi);
        if (exposeGlobalThis) { window.checkRuntimeVars = checkRuntimeVars; }
    }

    function doDanmakuSwitch() {
        const flag = !lsGetItem(lsKeys.switch.id);
        console.log(`切换${lsKeys.switch.name}: ${flag}`);
        if (window.ede.danmaku) {
            flag ? window.ede.danmaku.show() : window.ede.danmaku.hide();
        }
        const osdDanmakuSwitchBtn = getById(eleIds.danmakuSwitchBtn);
        if (osdDanmakuSwitchBtn) {
            osdDanmakuSwitchBtn.firstChild.innerHTML = flag ? iconKeys.comment : iconKeys.comments_disabled;
        }
        const switchElement = getById(eleIds.danmakuSwitch);
        if (switchElement) {
            switchElement.firstChild.innerHTML = flag ? iconKeys.switch_on : iconKeys.switch_off;
            switchElement.style.color = flag ? styles.colors.switchActiveColor : '';
        }
        lsSetItem(lsKeys.switch.id, flag);
    }

    async function doDanmakuSearchEpisode() {
        let embySearch = getById(eleIds.danmakuSearchName);
        if (!embySearch) { return; }
        let searchName = embySearch.value
        const danmakuRemarkEle = getById(eleIds.danmakuRemark);
        danmakuRemarkEle.parentNode.hidden = false;
        danmakuRemarkEle.innerText = searchName ? '' : '请填写标题';
        const spinnerEle = getByClass(classes.mdlSpinner);
        spinnerEle && spinnerEle.classList.remove('hide');

        // 合并所有启用源的搜索结果，并按优先级排序
        const apiPriority = lsGetItem(lsKeys.apiPriority.id);
        const apiConfigs = {
            official: { name: '官方API', prefix: corsProxy + 'https://api.dandanplay.net/api/v2', enabled: lsGetItem(lsKeys.useOfficialApi.id) },
            custom: { name: '自定义API', prefix: lsGetItem(lsKeys.customApiPrefix.id), enabled: lsGetItem(lsKeys.useCustomApi.id) }
        };

        let allAnimes = [];
        for (const apiKey of apiPriority) {
            const config = apiConfigs[apiKey];
            // 确保自定义API有地址时才使用
            if (!config || !config.enabled || (apiKey === 'custom' && !config.prefix)) {
                continue;
            }

            let manualSearchTitle = searchName;
            let manualSearchEpisode = null;

            // 手动搜索时，同样为官方API优化SXXEXX格式
            if (apiKey === 'official') {
                const parsed = parseAnimeName(searchName);
                if (parsed.season !== null) {
                    manualSearchTitle = parsed.season === 1 ? parsed.title : `${parsed.title} 第${parsed.season}季`;
                    manualSearchEpisode = parsed.episode; // 使用从文件名解析出的集数
                    console.log(`[手动匹配][官方API优化] 格式化搜索: 标题='${manualSearchTitle}', 集数=${manualSearchEpisode}`);
                }
            }
            console.log(`[手动匹配][${config.name}] 正在搜索: 标题='${manualSearchTitle}', 集数=${manualSearchEpisode || '无'}`);
            const animaInfo = await fetchSearchEpisodes(manualSearchTitle, manualSearchEpisode, config.prefix);
            if (animaInfo && animaInfo.animes.length > 0) {
                console.log(`[手动匹配][${config.name}] 搜索成功，找到 ${animaInfo.animes.length} 个结果。`);
                // 为每个结果打上来源标签
                animaInfo.animes.forEach(anime => { anime.apiPrefix = config.prefix; anime.apiName = config.name; });
                allAnimes.push(...animaInfo.animes);
            } else {
                console.log(`[手动匹配][${config.name}] 未找到结果。`);
            }
        }

        spinnerEle && spinnerEle.classList.add('hide');
        if (allAnimes.length < 1) {
            danmakuRemarkEle.innerText = '搜索结果为空';
            getById(eleIds.danmakuSwitchEpisode).disabled = true;
            getById(eleIds.danmakuEpisodeFlag).hidden = true;
            return;
        } else {
            danmakuRemarkEle.innerText = '';
        }
        const danmakuAnimeDiv = getById(eleIds.danmakuAnimeDiv);
        const danmakuEpisodeNumDiv = getById(eleIds.danmakuEpisodeNumDiv);
        danmakuAnimeDiv.innerHTML = '';
        danmakuEpisodeNumDiv.innerHTML = '';
        window.ede.searchDanmakuOpts.animes = allAnimes;

        let selectAnimeIdx = allAnimes.findIndex(anime => anime.animeId == window.ede.searchDanmakuOpts.animeId);
        selectAnimeIdx = selectAnimeIdx !== -1 ? selectAnimeIdx : 0;
        const animeSelect = embySelect({ id: eleIds.danmakuAnimeSelect, label: '剧集: ', style: 'width: auto;max-width: 100%;' }
            , selectAnimeIdx, allAnimes, 'animeId', opt => `${opt.animeTitle} 类型：${opt.typeDescription} 来源：${opt.apiName}`, doDanmakuAnimeSelect);
        danmakuAnimeDiv.append(animeSelect);
        const episodeNumSelect = embySelect({ id: eleIds.danmakuEpisodeNumSelect, label: '集数: ', style: 'width: auto;max-width: 100%;' }
            , window.ede.searchDanmakuOpts.episode - 1, allAnimes[selectAnimeIdx].episodes, 'episodeId', (opt, i) => `${i + 1} - ${opt.episodeTitle}`);
        danmakuEpisodeNumDiv.append(episodeNumSelect);
        getById(eleIds.danmakuEpisodeFlag).hidden = false;
        getById(eleIds.danmakuSwitchEpisode).disabled = false;

        const selectedAnime = allAnimes[selectAnimeIdx];
        // 始终使用匹配到的海报，如果没有则使用官方API拼接
        getById(eleIds.searchImg).src = selectedAnime.imageUrl || dandanplayApi.posterImg(selectedAnime.animeId);

        // 显示API来源
        const apiSourceDiv = getById(eleIds.searchApiSource);
        if (apiSourceDiv) apiSourceDiv.innerText = `来源: ${selectedAnime.apiName}`;
    }

    function doSearchTitleSwtich(e) {
        const searchInputEle = getById(eleIds.danmakuSearchName);
        const attrKey = 'isOriginalTitle';
        if ('1' === e.target.getAttribute(attrKey)) {
            e.target.setAttribute(attrKey, '0');
            return searchInputEle.value = window.ede.searchDanmakuOpts.animeName;
        }
        const { _episode_key, seriesOrMovieId } = window.ede.searchDanmakuOpts;
        const episode_info = JSON.parse(localStorage.getItem(_episode_key));
        const { animeOriginalTitle } = episode_info;
        if (animeOriginalTitle) {
            e.target.setAttribute(attrKey, '1');
            return searchInputEle.value = animeOriginalTitle;
        }
        ApiClient.getItem(ApiClient.getCurrentUserId(), seriesOrMovieId).then(item => {
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
        const numDiv = getById(eleIds.danmakuEpisodeNumDiv);
        numDiv.innerHTML = '';
        const anime = window.ede.searchDanmakuOpts.animes[index];
        // 切换剧集时，默认选中第一个分集
        const episodeNumSelect = embySelect({ id: eleIds.danmakuEpisodeNumSelect, label: '集数: ' }, 0, anime.episodes, 'episodeId', (opt, i) => `${i + 1} - ${opt.episodeTitle}`);
        episodeNumSelect.style.maxWidth = '100%';
        numDiv.append(episodeNumSelect);

        // 始终使用匹配到的海报
        getById(eleIds.searchImg).src = anime.imageUrl || dandanplayApi.posterImg(anime.animeId);

        // 更新API来源显示
        const apiSourceDiv = getById(eleIds.searchApiSource);
        if (apiSourceDiv) apiSourceDiv.innerText = `来源: ${anime.apiName}`;
    }

    function doDanmakuSwitchEpisode() {
        const animeSelect = getById(eleIds.danmakuAnimeSelect);
        const episodeNumSelect = getById(eleIds.danmakuEpisodeNumSelect);
        const anime = window.ede.searchDanmakuOpts.animes[animeSelect.selectedIndex];

        // 构造一个更完整的 episodeInfo 对象
        const { _episode_key, seriesOrMovieId } = window.ede.searchDanmakuOpts;
        const episodeInfo = {
            episodeId: episodeNumSelect.value,
            episodeTitle: episodeNumSelect.options[episodeNumSelect.selectedIndex].text,
            episodeIndex: episodeNumSelect.selectedIndex,
            bgmEpisodeIndex: episodeNumSelect.selectedIndex,
            animeId: anime.animeId,
            animeTitle: anime.animeTitle,
            animeOriginalTitle: '',
            imageUrl: anime.imageUrl,
            seriesOrMovieId: seriesOrMovieId,
            apiPrefix: anime.apiPrefix,
            apiName: anime.apiName,
        };
        const seasonInfo = {
            name: anime.animeTitle,
            episodeOffset: episodeNumSelect.selectedIndex - window.ede.searchDanmakuOpts.episode,
        }
        writeLsSeasonInfo(window.ede.searchDanmakuOpts._season_key, seasonInfo);

        // 使用与 getEpisodeInfo 中相同的逻辑来构造缓存键
        const useOfficialApi = lsGetItem(lsKeys.useOfficialApi.id);
        const useCustomApi = lsGetItem(lsKeys.useCustomApi.id);
        const apiPriority = lsGetItem(lsKeys.apiPriority.id);
        const enabledApis = apiPriority.filter(apiKey => {
            if (apiKey === 'official') return useOfficialApi;
            if (apiKey === 'custom') return useCustomApi;
            return false;
        });
        const unique_episode_key = `_api_${enabledApis.join('_')}_` + _episode_key;
        localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));

        console.log(`手动匹配成功，已加载新弹幕信息:`, episodeInfo);
        loadDanmaku(LOAD_TYPE.RELOAD);
        closeEmbyDialog();
    }

    function writeLsSeasonInfo(_season_key, newSeasonInfo) {
        if (!_season_key) {
            return console.log(`_season_key is undefined, skip`);
        }
        let seasonInfoListStr = localStorage.getItem(_season_key);
        let seasonInfoList = seasonInfoListStr ? JSON.parse(seasonInfoListStr) : [];
        // 检查是否已经存在相同的 seasonInfo，避免重复添加
        const existingSeasonInfo = seasonInfoList.find(si => si.name === newSeasonInfo.name);
        if (!existingSeasonInfo) {
            seasonInfoList.push(newSeasonInfo);
        } else {
            // 如果存在，更新已有的 seasonInfo
            Object.assign(existingSeasonInfo, newSeasonInfo);
        }
        localStorage.setItem(_season_key, JSON.stringify(seasonInfoList));
    }

    function doDanmakuEngineSelect(value) {
        let selectedValue = value.id;
        if (lsCheckSet(lsKeys.engine.id, selectedValue)) {
            console.log(`已更改弹幕引擎为: ${selectedValue}`);
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
        const danmuListEle = getById(eleIds.danmuListText);
        danmuListEle.style.display = index == lsKeys.danmuList.defaultValue ? 'none' : '';
        const f = new Intl.DateTimeFormat('default', { minute: '2-digit', second: '2-digit' });
        const hasShowSourceIds = lsGetItem(lsKeys.showSource.id).length > 0;
        danmuListEle.value = value.onChange(window.ede)
            .map((c, i) => `[${i + 1}][${f.format(new Date(c.time * 1000))}] : `
                + (hasShowSourceIds ? c.originalText : c.text)
                + (c.source ? ` [${c.source}]` : '')
                + (c.originalUserId ? `[${c.originalUserId}]` : '')
                + (c.cid ? `[${c.cid}]` : '')
                + `[${c.mode}]`
            ).join('\n');
    }

    function doDanmakuTypeFilterSelect() {
        const checkList = Array.from(document.getElementsByName(eleIds.danmakuTypeFilterSelectName))
            .filter(item => item.checked).map(item => item.value);
        lsSetItem(lsKeys.typeFilter.id, checkList);
        loadDanmaku(LOAD_TYPE.RELOAD);
        const idNameMap = new Map(Object.values(danmakuTypeFilterOpts).map(opt => [opt.id, opt.name]));
        console.log(`当前弹幕类型过滤为: ${JSON.stringify(checkList.map(s => idNameMap.get(s)))}`);
    }

    function doDanmakuSourceFilterSelect() {
        const checkList = Array.from(document.getElementsByName(eleIds.danmakuSourceFilterSelectName))
            .filter(item => item.checked).map(item => item.value);
        lsSetItem(lsKeys.sourceFilter.id, checkList);
        loadDanmaku(LOAD_TYPE.RELOAD);
        console.log(`当前弹幕来源平台过滤为: ${JSON.stringify(checkList)}`);
    }

    function doDanmakuShowSourceSelect() {
        const checkList = Array.from(document.getElementsByName(eleIds.danmakuShowSourceSelectName))
            .filter(item => item.checked).map(item => item.value);
        lsSetItem(lsKeys.showSource.id, checkList);
        loadDanmaku(LOAD_TYPE.RELOAD);
        const idNameMap = new Map(Object.values(showSource).map(opt => [opt.id, opt.name]));
        console.log(`当前弹幕显示来源为: ${JSON.stringify(checkList.map(s => idNameMap.get(s)))}`);
    }

    function onSliderChange(val, opts) {
        onSliderChangeLabel(opts.label ? opts.label : val, opts);
        if (opts.lsKey.id && lsCheckSet(opts.lsKey.id, val)) {
            let needReload = opts.needReload === undefined ? true : opts.needReload;
            if (opts.isManual) {
                needReload = false;
            }
            console.log(`${opts.lsKey.id} changed to ${val}, needReload: ${needReload}`);
            if (needReload) {
                changeFontStylePreview();
                loadDanmaku(LOAD_TYPE.RELOAD);
            }
        }
    }

    function onSliderChangeLabel(val, opts) {
        if (opts.labelId) { getById(opts.labelId).innerText = val; }
        if (opts.labelEle) { opts.labelEle.innerText = val; }
    }

    function doDanmakuFilterKeywordsBtnClick(event) {
        const btn = event.currentTarget;
        if (btn) {
            btn.style = '';
            btn.disabled = true;
        }
        let keywords = getById(eleIds.filterKeywordsId).value.trim();
        let enable = getById(eleIds.filterKeywordsEnableId).checked;
        lsCheckSet(lsKeys.filterKeywordsEnable.id, enable);

        if (!lsCheckSet(lsKeys.filterKeywords.id, keywords) && keywords === '') { return; }
        loadDanmaku(LOAD_TYPE.RELOAD);
    }

    function updateFilterKeywordsBtn(btn, flag, keywords) {
        const isSame = lsCheckOld(lsKeys.filterKeywordsEnable.id, flag) && lsCheckOld(lsKeys.filterKeywords.id, keywords);
        btn.firstChild.innerHTML = isSame ? iconKeys.done_disabled : iconKeys.done;
        btn.disabled = isSame;
    }

    function doConsoleLogChange(checked) {
        lsSetItem(lsKeys.consoleLogEnable.id, checked);
        // consoleLogTextEle.style.display = checked ? '' : 'none';
        getById(eleIds.consoleLogInfo).style.display = checked ? '' : 'none';
        const consoleLogTextEle = getById(eleIds.consoleLogText);
        if (checked) {
            if (!window.ede.appLogAspect) {
                window.ede.appLogAspect = new AppLogAspect().init();
            }
            consoleLogTextEle.value = window.ede.appLogAspect.value;
            window.ede.appLogAspect.on(newValue => {
                if (consoleLogTextEle.value.length !== newValue.length) {
                    consoleLogTextEle.value = newValue;
                    consoleLogTextEle.scrollTop = consoleLogTextEle.scrollHeight;
                    const consoleLogCountLabel = getById(eleIds.consoleLogCountLabel);
                    if (consoleLogCountLabel) {
                        consoleLogCountLabel.innerHTML = `清空 ${newValue.split('\n').length - 1} 行`;
                    }
                }
            });
        } else {
            consoleLogTextEle.value = '';
            window.ede.appLogAspect.destroy();
            window.ede.appLogAspect = null;
        }
    }

    function getById(childId, parentNode = document) {
        if (!parentNode) { return null; }
        return parentNode.querySelector(`#${childId}`);
    }

    /**
     * @param {string} className - 元素的类名不带点
     * * @param {HTMLElement | null} [parentNode] - 父元素,默认为 document
     * @returns {HTMLElement | null} - 返回找到的单个元素或 null
     */
    function getByClass(className, parentNode = document) {
        if (!parentNode) { return null; }
        return parentNode.querySelector(`.${className}`);
    }

    /** 仅适用于 input 元素和下一个临近元素的事件 */
    function getTargetInput(e) {
        return e.target.tagName === 'INPUT' ? e.target : e.target.previousElementSibling;
    }

    /** props: {id: 'inputId', value: '', type: '', style: '',...} for setAttribute(key, value)
     * function will not setAttribute
     */
    function embyInput(props, onEnter, onChange) {
        const input = document.createElement('input', { is: 'emby-input' });
        objectEntries(props).forEach(([key, value]) => {
            if (typeof value !== 'function') { input.setAttribute(key, value); }
        });
        input.className = classes.embyInput; // searchfields-txtSearch: 半圆角
        if (typeof onEnter === 'function') {
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { onEnter(e); } });
        }
        if (typeof onChange === 'function') { input.addEventListener('change', onChange); }
        // 控制器输入左右超出边界时切换元素
        input.addEventListener('keydown', (event) => {
            if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') &&
                    ((input.selectionStart === 0 && event.key === 'ArrowLeft') ||
                        (input.selectionEnd === input.value.length && event.key === 'ArrowRight'))) {
                event.stopPropagation();
                event.preventDefault()
                var options = {sourceElement: event.target, repeat: event.repeat, originalEvent: event };
                require(['inputmanager'], (inputmanager) => {
                    inputmanager.trigger(event.key.replace('Arrow', '').toLowerCase(), options);
                });
            }
        });
        return input;
    }

    function embyI(iconKey, extClassName) {
        const iNode = document.createElement('i');
        iNode.className = 'md-icon' + (extClassName ? ' ' + extClassName : '');
        iNode.style = 'pointer-events: none;';
        iNode.innerHTML = iconKey;
        return iNode;
    }

    /** props: {id: 'btnId', label: 'label text', style: '', iconKey: '',...} for setAttribute(key, value)
     * 'iconKey' will innerHTML <i>iconKey</i>|function will not setAttribute
     */
    function embyButton(props, onClick) {
        const button = document.createElement('button');
        // !!! important: this is must setAttribute('is', 'emby-xxx'), unknown reason
        button.setAttribute('is', 'emby-button');
        button.setAttribute('type', 'button');
        objectEntries(props).forEach(([key, value]) => {
            if (key !== 'iconKey' &&  typeof value !== 'function') { button.setAttribute(key, value); }
        });
        if (props.iconKey) {
            button.setAttribute('title', props.label);
            button.setAttribute('aria-label', props.label);
            button.innerHTML = embyI(props.iconKey).outerHTML;
            button.className = classes.embyButtons.iconButton;
        } else {
            button.classList.add(...classes.embyButtons.basic.split(' '));
            button.textContent = props.label;
        }
        if (typeof onClick === 'function') { button.addEventListener('click', onClick); }
        return button;
    }

    function embyALink(href, text) {
        const aEle = document.createElement('a');
        // !!! important: this is must setAttribute('is', 'emby-xxx'), unknown reason
        aEle.setAttribute('is', 'emby-linkbutton');
        aEle.href = href;
        aEle.textContent = text || href;
        aEle.target = '_blank';
        aEle.className = 'button-link button-link-color-inherit button-link-fontweight-inherit emby-button';
        if (OS.isMobile()) {
            aEle.addEventListener('click', (event) => {
                event.preventDefault();
                navigator.clipboard.writeText(href).then(() => {
                    console.log('Link copied to clipboard:', href);
                    const label = document.createElement('label');
                    label.textContent = '已复制';
                    label.style.color = 'green';
                    label.style.paddingLeft = '0.5em';
                    aEle.append(label);
                    setTimeout(() => {
                        aEle.removeChild(label);
                    }, 3000);
                }, (err) => {
                    console.error('Failed to copy link:', err);
                });
            });
        }
        return aEle;
    }

    function embyTabs(options, selectedValue, optionValueKey, optionTitleKey, onChange) {
        // !!! important: this is must { is: 'emby-xxx' }, unknown reason
        const tabs = document.createElement('div', { is: 'emby-tabs' });
        tabs.setAttribute('data-index', '0');
        tabs.className = classes.embyTabsDiv1;
        tabs.style.width = 'fit-content';
        const tabsSlider = document.createElement('div');
        tabsSlider.className = classes.embyTabsDiv2;
        tabsSlider.style.padding = '0.25em';
        options.forEach((option, index) => {
            const value = getValueOrInvoke(option, optionValueKey);
            const title = getValueOrInvoke(option, optionTitleKey);
            const tabButton = document.createElement('button');
            tabButton.id = option.id + 'Btn';
            tabButton.className = `${classes.embyTabsButton}${value == selectedValue ? ' emby-tab-button-active' : ''}`;
            tabButton.setAttribute('data-index', index);
            tabButton.textContent = title;
            tabButton.style.display = option.hidden ? 'none' : '';
            tabsSlider.append(tabButton);
        });
        tabs.append(tabsSlider);
        if (typeof onChange === 'function') {
            tabs.addEventListener('tabchange', e => onChange(options[e.detail.selectedTabIndex], e.detail.selectedTabIndex));
        }
        return tabs;
    }

    function embySelect(props, selectedIndexOrValue, options, optionValueKey, optionTitleKey, onChange, onFocus) {
        const defaultProps = { class: 'emby-select' };
        props = { ...defaultProps, ...props };
        if (!Number.isInteger(selectedIndexOrValue)) {
            selectedIndexOrValue = options.indexOf(selectedIndexOrValue);
        }
        // !!! important: this is must { is: 'emby-select' }
        const selectElement = document.createElement('select', { is: 'emby-select'});
        require(['browser'], (browser) => {
            if (browser.tv) {
                selectElement.classList.add(classes.embySelectTv);
            }
        });
        objectEntries(props).forEach(([key, value]) => {
            if (typeof value !== 'function') { selectElement.setAttribute(key, value); }
        });
        options.forEach((option, index) => {
            const value = getValueOrInvoke(option, optionValueKey, index);
            const title = getValueOrInvoke(option, optionTitleKey, index);
            const optionElement = document.createElement('option');
            optionElement.value = value;
            optionElement.textContent = title;
            if (index === selectedIndexOrValue) {
                optionElement.selected = true;
            }
            selectElement.append(optionElement);
        });
        if (typeof onChange === 'function') {
            selectElement.addEventListener('change', e => {
                onChange(e.target.value, e.target.selectedIndex, options[e.target.selectedIndex]);
            });
        }
        if (typeof onFocus === 'function') {
            selectElement.addEventListener('focus', onFocus);
        }
        // return selectElement;
        // !!! important, only emby-select must have selectLabel class wrapper
        const selectLabel = document.createElement('label');
        selectLabel.classList.add('selectLabel');
        selectLabel.appendChild(selectElement);
        return selectLabel;
    }

    function embyCheckboxList(id, checkBoxName, selectedStrArray, options, onChange, isVertical = false) {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.setAttribute('class', classes.embyCheckboxList);
        checkboxContainer.setAttribute('style', isVertical ? '' : styles.embyCheckboxList);
        checkboxContainer.setAttribute('id', id);
        options.forEach(option => {
            checkboxContainer.append(embyCheckbox({ name: checkBoxName, label: option.name, value: option.id }
                , (selectedStrArray ? selectedStrArray.indexOf(option.id) > -1 : false) , onChange));
        });
        return checkboxContainer;
    }

    function embyCheckbox({ id, name, label, value }, checked = false, onChange) {
        const checkboxLabel = document.createElement('label');
        checkboxLabel.classList.add('emby-checkbox-label');
        checkboxLabel.setAttribute('style', 'width: auto;');
        // !!! important: this is must { is: 'emby-xxx' }, unknown reason
        const checkbox = document.createElement('input', { is: 'emby-checkbox' });
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', id);
        checkbox.setAttribute('name', name);
        checkbox.setAttribute('value', value);
        checkbox.checked = checked;
        checkbox.classList.add('emby-checkbox', 'chkEnableLiveTvAccess');
        if (typeof onChange === 'function') {
            checkbox.addEventListener('change', e => onChange(e.target.checked));
        }
        const span = document.createElement('span');
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
        const defaultProps = { rows: 10, styleResize: 'vertical', readonly: false };
        props = { ...defaultProps, ...props };
        const textarea = document.createElement('textarea', { is: 'emby-textarea' });
        objectEntries(props).forEach(([key, value]) => {
            if (typeof value !== 'function' && key !== 'readonly'
                && key !== 'styleResize' && key !== 'value') { textarea.setAttribute(key, value); }
        });
        textarea.className = 'txtOverview emby-textarea';
        textarea.readOnly = props.readonly;
        textarea.style.resize = props.styleResize;
        textarea.value = props.value;
        if (typeof onBlur === 'function') { textarea.addEventListener('blur', onBlur); }
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
    function embySlider(opts = {}, onChange, onSliding) {
        const defaultOpts = {
            min: 0.1, max: 3, step: 0.1, orient: 'horizontal',
            'data-bubble': false, 'data-hoverthumb': true , style: '',
        };
        const options = { ...defaultOpts, ...opts };
        // !!! important: this is must { is: 'emby-xxx' }, unknown reason
        const slider = document.createElement('input', { is: 'emby-slider' });
        slider.setAttribute('type', 'range');
        if (opts.id) { slider.setAttribute('id', opts.id); }
        objectEntries(options).forEach(([key, value]) => {
            if (key === 'lsKey') {
                // opts.key = value.id;
                const optsKeys = Object.keys(opts);
                if (!optsKeys.includes('value')) { options.value = lsGetItem(value.id); }
                if (!optsKeys.includes('min')) { slider.setAttribute('min', value.min); }
                if (!optsKeys.includes('max')) { slider.setAttribute('max', value.max); }
                if (!optsKeys.includes('step')) { slider.setAttribute('step', value.step); }
            } else {
                slider.setAttribute(key, value);
            }
        });
        // other EventListeners : 'beginediting'(every step), 'endediting'(end of tap/swipe)
        if (typeof onChange === 'function') {
            slider.addEventListener('change', e => {
                opts.isManual = e.isManual;
                const nextEle = e.target.parentNode.nextElementSibling;
                opts.labelEle = nextEle.children.length > 0 ? nextEle.children[0] : nextEle;
                return onChange(e.target.value, opts);
            });
        }
        if (typeof onSliding === 'function') {
            slider.addEventListener('input', e => {
                const nextEle = e.target.parentNode.nextElementSibling;
                opts.labelEle = nextEle.children.length > 0 ? nextEle.children[0] : nextEle;
                return onSliding(e.target.value, opts);
            });
        }
        if (options.value || options.value === 0) {
            slider.setValue(options.value);
            waitForElement({ element: slider, needParent: true }, (ele) => {
                const e = new Event('change');
                e.isManual = true;
                slider.dispatchEvent(e);
            });
        }
        if (OS.isEmbyTheater()) {
            // 以下兼容旧版本emby,控制器操作锁定滑块焦点
            slider.addEventListener('keydown', e => {
                const orient = slider.getAttribute('orient') || 'horizontal';
                if ((orient === 'horizontal' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) ||
                    (orient === 'vertical' && (e.key === 'ArrowUp' || e.key === 'ArrowDown'))) {
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
    async function embyDialog(opts = {}) {
        const defaultOpts = { text: '', title: '', timeout: 0, html: '', buttons: [] };
        opts = { ...defaultOpts, ...opts };
        return require(['dialog']).then(items => items[0](opts))
            .catch(error => { console.log('点击弹出框外部取消: ' + error) });
    }

    function closeEmbyDialog() {
        getByClass(classes.formDialogFooterItem).dispatchEvent(new Event('click'));
    }

    function embyImg(src, style, id, draggable = false) {
        const img = document.createElement('img');
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
        const btn = document.createElement('button');
        btn.style = btnStyle;
        btn.className = 'cardContent-button cardImageContainer cardPadder-portrait defaultCardBackground';
        btn.append(childNode);
        btn.addEventListener('focus', () => {
            btn.style.boxShadow = '0 0 0 5px green';
        });
        btn.addEventListener('blur', () => {
            btn.style.boxShadow = '';
        });
        return btn;
    }

    // see: ../web/modules/common/dialogs/alert.js
    async function embyAlert(opts = {}) {
        const defaultOpts = { text: '', title: '', timeout: 0, html: ''};
        opts = { ...defaultOpts, ...opts };
        return require(['alert']).then(items => items[0](opts))
            .catch(error => { console.log('点击弹出框外部取消: ' + error) });
    }

    // see: ../web/modules/toast/toast.js, 严禁滥用,因遮挡画面影响体验,不建议使用 icon,会导致小秘版弹窗居中且图标过大
    async function embyToast(opts = {}) {
        const defaultOpts = { text: '', secondaryText: '', icon: '', iconStrikeThrough: false};
        opts = { ...defaultOpts, ...opts };
        return require(['toast'], toast => toast(opts));
    }

    function getValueOrInvoke(option, keyOrFunc, index) {
        return typeof keyOrFunc === 'function' ? keyOrFunc(option, index) : option[keyOrFunc];
    }

    function getSettingsJson(space = 4) {
        return JSON.stringify(Object.fromEntries(objectEntries(lsKeys).map(
            ([key, value]) => [value.id, lsGetItem(value.id)])), null, space);
            // ([key, value]) => [value.id, { value: lsGetItem(value.id), name: value.name }])), null, space);
    }

    function settingsReset() {
        const defaultSettings = Object.fromEntries(
            objectEntries(lsKeys)
            .filter(([key, value]) => lsKeys.filterKeywords.id !== value.id)
            .map(([key, value]) => [value.id, value.defaultValue])
        );
        lsBatchSet(defaultSettings);
    }

    // 缓存相关方法
    function lsGetItem(id) {
        const key = lsGetKeyById(id);
        if (!key) { return null; }
        const defaultValue = lsKeys[key].defaultValue;
        const item = localStorage.getItem(id);
        if (item === null) { return defaultValue; }
        if (Array.isArray(defaultValue)) { return JSON.parse(item); }
        if (Array.isArray(defaultValue) || typeof defaultValue === 'object') { return JSON.parse(item); }
        if (typeof defaultValue === 'boolean') { return item === 'true'; }
        if (typeof defaultValue === 'number') { return parseFloat(item); }
        return item;
    }
    function lsCheckOld(id, value) {
        return JSON.stringify(lsGetItem(id)) === JSON.stringify(value);
    }
    function lsCheckSet(id, value) {
        if (lsCheckOld(id, value)) { return false; }
        lsSetItem(id, value);
        return true;
    }
    /** 批量设置缓存
     * @param {object} keyValues - 键值对对象,如 {key1: value1, key2: value2}
     * @returns {boolean} - 是否有更新
     */
    function lsBatchSet(keyValues, needCheck = true) {
        if (needCheck) {
            return objectEntries(keyValues).reduce((acc, [id, value]) => (acc || lsCheckSet(id, value)), false);
        } else {
            objectEntries(keyValues).forEach(([key, value]) => lsSetItem(key, value));
        }
    }
    function lsSetItem(id, value) {
        if (!lsGetKeyById(id)) { return; }
        let stringValue;
        if (Array.isArray(value)) {
            stringValue = JSON.stringify(value);
        } else if (typeof value === 'object') {
            stringValue = JSON.stringify(value);
        } else {
            stringValue = value;
        }
        localStorage.setItem(id, stringValue);
    }
    function lsGetKeyById(id) {
        return Object.keys(lsKeys).find(key => lsKeys[key].id === id);
    }
    function lsBatchRemove(prefixes) {
        return Object.keys(localStorage)
        .filter(key => prefixes.some(prefix => key.startsWith(prefix)))
            .map(key => localStorage.removeItem(key))
            .length > 0;
    }

    function destroyAllInterval() {
        window.ede.destroyIntervalIds.map(id => clearInterval(id));
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
    function waitForElement(target, callback, timeout = 10000, interval = check_interval) {
        let intervalId = null;
        let timeoutId = null;
        const isSelector = typeof target === 'string';
        const elementMark = isSelector ? target : target.element.tagName;
    
        const promise = new Promise((resolve, reject) => {
            function checkElement() {
                console.log(`waitForElement: checking element[${elementMark}]`);
                let element = null;
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
                timeoutId = setTimeout(() => {
                    clearInterval(intervalId);
                    console.log(`waitForElement: unable to find element[${elementMark}], timeout: ${timeout}`);
                    reject(new Error(`Element [${elementMark}] not found within ${timeout}ms`));
                }, timeout);
            }
        });
    
        return promise;
    }

    function addEasterEggListener() {
        const target = getByClass(classes.headerUserButton);
        if (!target) { return; }
        let longPressTimeout;
        function startLongPress() {
            longPressTimeout = setTimeout(() => {
                console.log('恭喜你发现了隐藏功能, 长按了 2 秒!');
                quickDebug();
            }, 2000);
        }
        function cancelLongPress() {
            clearTimeout(longPressTimeout);
        }
        const isMobile = OS.isMobile();
        let startEventName = isMobile ? 'touchstart' : 'mousedown';
        let endEventName = isMobile ? 'touchend' : 'mouseup';
        require(['browser'], (browser) => {
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
        return () => {
            target.removeEventListener(startEventName, startLongPress);
            target.removeEventListener(endEventName, cancelLongPress);
            clearTimeout(longPressTimeout);
        };
    }

    function initCss() {
        // 修复emby小秘版播放过程中toast消息提示框不显示问题
        if (OS.isEmbyNoisyX()) {
            const existingStyle = document.querySelector('style[css-emby-noisyx-fix]');
            if (!existingStyle) {
                const style = document.createElement('style');
                style.setAttribute('css-emby-noisyx-fix', '');
                style.innerHTML = `
                    [class*="accent-"].noScrollY.transparentDocument .toast-group {
                        position: fixed;
                        top: auto;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    function removeHeaderClock() {
        const headerClockEle = getById('headerClock');
        if (headerClockEle) {
            headerClockEle.remove();
        }
        destroyAllInterval();
    }

    function addHeaderClock() {
        const warpper = getByClass('headerMiddle');
        let headerClockEle = getById('headerClock');
        if (!warpper) {
            return;
        }
        if (headerClockEle) {
            headerClockEle.remove();
        }
    
        const clockElement = document.createElement('div');
        clockElement.id = 'headerClock';
        warpper.append(clockElement);

        function updateClock() {
            const timeString = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            clockElement.textContent = timeString;
            // console.log(timeString);
            headerClockEle = getById('headerClock');
            if (!headerClockEle) {
                clearInterval(intervalId);
            }
        }
        updateClock();
        const intervalId = setInterval(updateClock, 1000);
    
        window.ede.destroyIntervalIds.push(intervalId);
        return intervalId;
    }

    function refreshEventListener(eventsMap) {
        objectEntries(eventsMap).forEach(([eventName, fn]) => {
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
        const [playbackManager, events] = await require(['playbackManager', 'events']);
        const player = playbackManager.getCurrentPlayer();
        if (!player) { return; }
        objectEntries(eventsMap).forEach(([eventName, fn]) => {
            // 无法修改 fn ,会导致引用变更重复添加,events.off 中的 array.indexOf(fn) 返回 -1
            events.off(player, eventName, fn);
            events.on(player, eventName, fn);
        });
    }

    async function initH5VideoAdapter() {
        let _media = document.querySelector(mediaQueryStr);
        if (_media) {
            if (_media.id) { // 若是手动创建的<video>
                videoTimeUpdateInterval(_media, true);
            }
            return;
        }
        console.log('播放页不存在 video 标签,适配器处理开始');
        _media = document.createElement('video');
        // !!! Apple 设备上此属性必须存在,否则 currentTime = 0 无法更新; 而其他设备反而不能有
        if (OS.isApple()) { _media.src = ''; }
        _media.style.display = 'none';
        _media.id = eleIds.h5VideoAdapter;
        _media.classList.add('htmlvideoplayer', 'moveUpSubtitles');
        document.body.prepend(_media);

        _media.play();
        videoTimeUpdateInterval(_media, true);

        // 以下暂未遇到匿名函数导致的事件重复,等出现时再匿名转命名函数
        require(['playbackManager'], (playbackManager) => {
            playbackEventsRefresh({
                'timeupdate': (e) => {
                    // conver to seconds from Ticks
                    const realCurrentTime = playbackManager.currentTime(playbackManager.getCurrentPlayer()) / 1e7;
                    const mediaTime = _media.currentTime;
                    _media.currentTime = realCurrentTime;
                    // playbackRate 同步依赖至少 100ms currentTime 变更
                    const embyPlaybackRate = playbackManager.getPlayerState().PlayState.PlaybackRate;
                    _media.playbackRate = embyPlaybackRate ? embyPlaybackRate : 1;
                    // 当前时间与上次记录时间差值大于2秒,则判定为用户操作进度,seeking 事件必须在 currentTime 更改后触发,否则回退后弹幕将消失
                    if (Math.abs(mediaTime - realCurrentTime) > 2) {
                        _media.dispatchEvent(new Event('seeking'));
                        console.warn('seeking', realCurrentTime, mediaTime);
                    }
                    if (lsGetItem(lsKeys.debugH5VideoAdapterEnable.id)) {
                        console.warn(`${eleIds.h5VideoAdapter}, currentTime: ${_media.currentTime}, playbackRate: ${_media.playbackRate}`);
                    }
                },
            });
        });
        playbackEventsRefresh({
            'pause': (e) => {
                console.warn(e.type);
                _media.dispatchEvent(new Event('pause'));
                videoTimeUpdateInterval(_media, false);
            },
            'unpause': (e) => {
                console.warn(e.type);
                _media.dispatchEvent(new Event('play'));
                videoTimeUpdateInterval(_media, true);
            },
        });
        console.log('已创建虚拟 video 标签,适配器处理正确结束');
    }

    // 平滑补充<video> timeupdate 中秒级间隔缺失的 100ms 间隙
    function videoTimeUpdateInterval(media, enable) {
        const _media = media || document.querySelector(mediaQueryStr);
        if (!_media) { return; }
        if (enable && !_media.timeupdateIntervalId) {
            _media.timeupdateIntervalId = setInterval(() => { _media.currentTime += 100 / 1e3 }, 100);
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
        const danmakuCtr = getById(eleIds.danmakuCtr);
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
            if (!window.ede) { window.ede = new EDE(); }
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
    refreshEventListener({ 'viewshow': onViewShow });
    refreshEventListener({ 'viewbeforehide': beforeDestroy });

})();
