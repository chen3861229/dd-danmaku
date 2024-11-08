define(["exports", "./../modules/common/playback/playbackmanager.js", "./../modules/focusmanager.js", "./../modules/cardbuilder/cardbuilder.js", "./../modules/common/imagehelper.js", "./../modules/dom.js", "./../modules/browser.js", "./../modules/common/globalize.js", "./../modules/common/datetime.js", "./../modules/layoutmanager.js", "./../modules/common/itemmanager/itemmanager.js", "./../modules/loading/loading.js", "./../modules/emby-apiclient/events.js", "./../modules/emby-apiclient/connectionmanager.js", "./../modules/appheader/appheader.js", "./../modules/mediainfo/mediainfo.js", "./../modules/backdrop/backdrop.js", "./playqueue.js", "./tvplayqueue.js", "./lyrics.js", "./../modules/approuter.js", "./../modules/itemcontextmenu.js", "./../modules/shortcuts.js", "./../modules/common/inputmanager.js", "./../modules/common/usersettings/usersettings.js", "./../modules/input/mouse.js", "./../modules/emby-elements/emby-scroller/emby-scroller.js", "./../modules/emby-elements/emby-button/paper-icon-button-light.js", "./../modules/emby-elements/emby-tabs/emby-tabs.js", "./../modules/emby-elements/emby-slider/emby-slider.js", "./../modules/common/appsettings.js", "./../modules/common/servicelocator.js", "./../modules/input/keyboard.js", "./../modules/viewmanager/baseview.js", "./../modules/playback/osdcontroller.js", "./../modules/playback/playersettingsmenu.js"], function(_exports, _playbackmanager, _focusmanager, _cardbuilder, _imagehelper, _dom, _browser, _globalize, _datetime, _layoutmanager, _itemmanager, _loading, _events, _connectionmanager, _appheader, _mediainfo, _backdrop, _playqueue, _tvplayqueue, _lyrics, _approuter, _itemcontextmenu, _shortcuts, _inputmanager, _usersettings, _mouse, _embyScroller, _paperIconButtonLight, _embyTabs, _embySlider, _appsettings, _servicelocator, _keyboard, _baseview, _osdcontroller, _playersettingsmenu) {
    Object.defineProperty(_exports, "__esModule", {
        value: !0
    }),
    _exports.default = void 0,
    require(["css!videoosd/videoosd.css"]);
    var useBackdropFilterForBlur = _dom.default.allowBackdropFilter()
      , headerElement = document.querySelector(".skinHeader")
      , backdropContainer = document.querySelector(".backdropContainer")
      , backgroundContainer = document.querySelector(".backgroundContainer")
      , headerRight = document.querySelector(".headerRight");
    function showActionSheet(options) {
        return Emby.importModule("./modules/actionsheet/actionsheet.js").then(function(ActionSheet) {
            return ActionSheet.show(options)
        })
    }
    var deviceMemory, platform, enableHighResBlur = !((cores = navigator.hardwareConcurrency || 4) < 6 || (deviceMemory = navigator.deviceMemory || 2) < 2 || (platform = (navigator.platform || "").toLowerCase(),
    "android" === globalThis.appMode && (cores < 4 || deviceMemory < 2 || platform.includes("armv7"))));
    var enableTabAnimation = function() {
        var deviceMemory, platform, cores = navigator.hardwareConcurrency || 4;
        return !(cores < 4 || (2400 <= (screen.width || screen.availWidth || 0) || 1400 <= (screen.height || screen.availHeight || 0)) && cores < 6 || (deviceMemory = navigator.deviceMemory || 2) < 2 || (platform = (navigator.platform || "").toLowerCase(),
        "android" === globalThis.appMode && (cores < 4 || deviceMemory < 2 || platform.includes("armv7"))))
    }()
      , fadeSize = "1.5%"
      , fadeDuration = 300;
    function isDisplayingLocalVideo(player, mediaType) {
        return !(!player || !player.isLocalPlayer) && ("Video" === mediaType || !mediaType && _playbackmanager.default.isPlayingMediaType(["Video"], player))
    }
    function getRewindIconLTR() {
        switch (_usersettings.default.skipBackLength()) {
        case 5e3:
            return "&#xe05b;";
        case 1e4:
            return "&#xe059;";
        case 3e4:
            return "&#xe05a;";
        default:
            return "&#xe042;"
        }
    }
    function getForwardIconLTR() {
        switch (_usersettings.default.skipForwardLength()) {
        case 5e3:
            return "&#xe058;";
        case 1e4:
            return "&#xe056;";
        case 3e4:
            return "&#xe057;";
        default:
            return "&#xf6f4;"
        }
    }
    function getBaseActionSheetOptions(positionTo, isLocalVideo) {
        isLocalVideo = !(!_layoutmanager.default.tv || !isLocalVideo);
        return {
            positionTo: positionTo,
            positionX: isLocalVideo ? "right" : null,
            positionY: "above",
            transformOrigin: isLocalVideo ? "right bottom" : "center bottom",
            noTextWrap: !0
        }
    }
    function showMoreMenu(item, button, isLocalVideo) {
        _connectionmanager.default.getApiClient(item.ServerId).getCurrentUser().then(function(user) {
            return _itemcontextmenu.default.show(function(item, user, button, isLocalVideo) {
                return Object.assign(getBaseActionSheetOptions(button, isLocalVideo), {
                    items: [item],
                    open: !1,
                    play: !1,
                    playAllFromHere: !1,
                    queueAllFromHere: !1,
                    cancelTimer: !1,
                    record: !1,
                    deleteItem: !1,
                    shuffle: !1,
                    instantMix: !1,
                    user: user,
                    share: !0,
                    queue: !1,
                    editSubtitles: !1,
                    convert: !1,
                    refreshMetadata: !1,
                    identify: !1
                })
            }(item, user, button, isLocalVideo))
        })
    }
    function focusMainOsdControls(instance) {
        console.log("focusMainOsdControls"),
        _focusmanager.default.focus(instance.nowPlayingPositionSlider)
    }
    function hideOrShowAll(instance, elems, hide, focusedElement) {
        for (var wasFocused, i = 0, length = elems.length; i < length; i++) {
            var elem = elems[i];
            hide ? (focusedElement && focusedElement === elem && (wasFocused = !0),
            elem.classList.add("hide")) : elem.classList.remove("hide")
        }
        wasFocused && focusMainOsdControls(instance)
    }
    function getTextActionButton(item, text) {
        return text = text || _itemmanager.default.getDisplayName(item, {}),
        _layoutmanager.default.tv ? text : "<button " + _shortcuts.default.getShortcutAttributesHtml(item, {}) + ' type="button" class="itemAction button-link osdTextActionButton" is="emby-button" data-action="link">' + text + "</button>"
    }
    function getSecondaryName(item, enableLinkButton) {
        var title = _itemmanager.default.getDisplayName(item, {
            includeParentInfo: "Program" !== item.Type,
            includeIndexNumber: "Program" !== item.Type
        });
        return enableLinkButton ? getTextActionButton(item, title) : title
    }
    function getDefaultOsdContentSection() {
        return _layoutmanager.default.tv || 1056 <= _dom.default.getWindowSize().innerWidth ? "playqueue" : null
    }
    function destroyPlayQueue(instance) {
        var playQueue = instance.playQueue;
        playQueue && (playQueue.destroy(),
        instance.playQueue = null)
    }
    function destroyLyricsRenderer(instance) {
        var lyricsRenderer = instance.lyricsRenderer;
        lyricsRenderer && (lyricsRenderer.destroy(),
        instance.lyricsRenderer = null)
    }
    function destroyStats(instance) {
        var statsOverlay = instance.statsOverlay;
        statsOverlay && (statsOverlay.destroy(),
        instance.statsOverlay = null)
    }
    function destroySubtitleOffsetOverlay(instance) {
        var subtitleOffsetOverlay = instance.subtitleOffsetOverlay;
        subtitleOffsetOverlay && (subtitleOffsetOverlay.destroy(),
        instance.subtitleOffsetOverlay = null)
    }
    function clearBlurFromDocumentElement() {
        backgroundContainer && (backgroundContainer.style.backgroundImage = null)
    }
    function shouldOsdBeShown(instance) {
        return !_layoutmanager.default.tv || !!instance.currentVisibleMenu || !(instance = instance.currentPlayer) || isDisplayingLocalVideo(instance)
    }
    function onMuteButtonClick() {
        _playbackmanager.default.toggleMute(this.currentPlayer)
    }
    function onVolumeSliderInputOrChange(e) {
        e = e.target;
        _playbackmanager.default.setVolume(parseFloat(e.value), this.currentPlayer),
        this.showOsd()
    }
    var cores = "ontouchstart"in document.documentElement
      , DefaultPointerType = "undefined" != typeof PointerEvent && "pointerType"in PointerEvent.prototype ? null : cores ? "touch" : "mouse";
    function rewind(instance, animate) {
        var player = instance.currentPlayer;
        animate && ((animate = instance.view.querySelector(".osd-rew-animationtext")).innerHTML = "-" + parseInt(_usersettings.default.skipBackLength() / 1e3),
        fadeInAndOut(animate)),
        _playbackmanager.default.rewind(player)
    }
    function fadeInAndOut(elem) {
        if (elem.animate)
            try {
                elem.animate([{
                    opacity: "1",
                    offset: .5
                }, {
                    opacity: "0",
                    transform: "none",
                    offset: 1
                }], {
                    duration: 600,
                    iterations: 1,
                    easing: "ease-out"
                })
            } catch (err) {
                console.log("error animating element: " + err)
            }
    }
    function fastForward(instance, animate) {
        var player = instance.currentPlayer;
        animate && ((animate = instance.view.querySelector(".osd-ff-animationtext")).innerHTML = "+" + parseInt(_usersettings.default.skipForwardLength() / 1e3),
        fadeInAndOut(animate)),
        _playbackmanager.default.fastForward(player)
    }
    function onOsdClick(e, instance, elementToFocusIfShowing, showOsdIfNoEvent) {
        var target = e.target;
        if (target.closest(".videoOsdBottom"))
            showOsdIfNoEvent && instance.showOsd();
        else if (!target.closest("button,.videoosd-tabsslider"))
            return target = instance.currentPlayer,
            !e.button && target && isDisplayingLocalVideo(target) ? (instance.showOsd(null, elementToFocusIfShowing),
            console.log("onOsdClick playPause"),
            _playbackmanager.default.playPause(target)) : showOsdIfNoEvent && instance.showOsd(),
            1
    }
    function toggleStats(instance) {
        require(["playerStats"], function(PlayerStats) {
            var player = instance.currentPlayer;
            player && (instance.statsOverlay ? instance.statsOverlay.toggle() : (instance.statsOverlay = new PlayerStats({
                player: player,
                view: instance.view
            }),
            _events.default.on(instance.statsOverlay, "close", function() {
                this.currentVisibleMenu && !this.upNextContainer._visible && _focusmanager.default.focus(this.btnVideoOsdSettingsRight)
            }
            .bind(instance))))
        })
    }
    function canSetBottomTabIndex(instance, index) {
        return -1 === index || !instance.bottomTabButtons[index].classList.contains("hide")
    }
    function setBottomTabIndex(instance, index) {
        var bottomTabButtons, bottomTabs = instance.bottomTabs;
        -1 === index ? (document.documentElement.classList.remove("osd-tab-guide"),
        bottomTabs.selectedIndex(index)) : (bottomTabButtons = instance.bottomTabButtons)[index].classList.contains("hide") || (instance.showOsd(null, bottomTabButtons[index]),
        bottomTabs.selectedIndex(index),
        _focusmanager.default.focus(bottomTabButtons[index]))
    }
    function onRewindInputCommand(e, instance) {
        instance.currentVisibleMenu || e.detail.repeat || (rewind(instance),
        e.preventDefault()),
        shouldOsdBeShown(instance) && instance.showOsd()
    }
    function onFastForwardInputCommand(e, instance) {
        instance.currentVisibleMenu || e.detail.repeat || (fastForward(instance),
        e.preventDefault()),
        shouldOsdBeShown(instance) && instance.showOsd()
    }
    function startOsdHideTimer(instance, timeoutMs) {
        var isLocalVideo;
        stopOsdHideTimer(instance),
        instance.paused || !(isLocalVideo = isDisplayingLocalVideo(instance.currentPlayer)) || 0 === timeoutMs || _focusmanager.default.hasExclusiveFocusScope() || (instance.osdHideTimeout = setTimeout(instance.boundOnOsdHideTimeout, timeoutMs || (isLocalVideo ? 4e3 : 1e4)))
    }
    function stopOsdHideTimer(instance) {
        var osdHideTimeout = instance.osdHideTimeout;
        osdHideTimeout && (clearTimeout(osdHideTimeout),
        instance.osdHideTimeout = null)
    }
    var systemUIHidden, orientationLocked = !1;
    function onOrientationChangeSuccess() {
        orientationLocked = !0
    }
    function onOrientationChangeError(err) {
        orientationLocked = !0,
        console.log("error locking orientation: " + err)
    }
    function setSystemUIHidden(hidden) {
        if (systemUIHidden !== hidden && (systemUIHidden = hidden,
        _servicelocator.appHost.setSystemUIHidden))
            try {
                _servicelocator.appHost.setSystemUIHidden(hidden)
            } catch (err) {
                console.log("Error in setSystemUIHidden: " + err)
            }
    }
    var enableOrientationLock = !_browser.default.tv;
    function lockOrientation(type) {
        var _screen$orientation;
        enableOrientationLock && !function(orientation) {
            var promise;
            console.log("attempting to lock orientation to: " + orientation);
            try {
                return (promise = screen.orientation && screen.orientation.lock ? screen.orientation.lock(orientation) : promise) && promise.then ? promise : Promise.resolve()
            } catch (err) {
                return Promise.reject(err)
            }
        }(type = type || (null == (_screen$orientation = screen.orientation) ? void 0 : _screen$orientation.type) || "landscape").then(onOrientationChangeSuccess, onOrientationChangeError)
    }
    function unlockOrientation() {
        if (enableOrientationLock && orientationLocked && screen.orientation && screen.orientation.unlock) {
            console.log("unlocking orientation");
            try {
                screen.orientation.unlock()
            } catch (err) {
                console.log("error unlocking orientation: " + err)
            }
            orientationLocked = !1
        }
    }
    function getTabOnItemUpdatedData(instance) {
        return {
            item: instance.osdController.currentItem,
            displayItem: instance.osdController.currentDisplayItem,
            mediaSource: instance.osdController.currentMediaSource,
            enableProgressByTimeOfDay: instance.osdController.enableProgressByTimeOfDay,
            currentPlayer: instance.currentPlayer,
            currentChapters: instance.osdController.currentChapters,
            currentDisplayChapters: instance.osdController.currentDisplayChapters
        }
    }
    function VideoOsd(view, params) {
        _baseview.default.apply(this, arguments);
        var comingUpNextDisplayed, isEnabled, currentIntroInfo, currentCreditsInfo, skipIntroValidated, enableAutoSkipIntro, lastPointerUpType, currentOsdContentSectionName, self = this, currentPlayerSupportedCommands = [], currentRuntimeTicks = 0, lastUpdateTime = 0, ratingTextNeedsUpdate = !0, brightnessSlider = (this.currentLockState = 0,
        view.querySelector(".videoOsdBrightnessSlider")), brightnessSliderContainer = view.querySelector(".brightnessSliderContainer"), videoOsdPositionText = (this.nowPlayingPositionSlider = view.querySelector(".videoOsdPositionSlider"),
        this.nowPlayingVolumeSlider = view.querySelector(".videoOsdVolumeSlider"),
        view.querySelector(".videoOsdPositionText")), videoOsdDurationText = view.querySelector(".videoOsdDurationText"), rewindButtons = (this.osdController = new _osdcontroller.default({
            nowPlayingPositionSlider: this.nowPlayingPositionSlider,
            positionTextElem: videoOsdPositionText,
            durationTextElem: videoOsdDurationText,
            enableSeekThumbnails: !0
        }),
        _events.default.on(this.osdController, "displayitemupdated", function(e, item, displayItem, state) {
            var apiClient, player;
            displayItem && (apiClient = _connectionmanager.default.getApiClient(item),
            player = self.currentPlayer,
            apiClient.getCurrentUser().then(function(user) {
                var displayingLocalVideo = isDisplayingLocalVideo(player, item.MediaType);
                if (!function(item, displayItem, user, displayingLocalVideo) {
                    updateRecordingButton(displayItem, user),
                    updateButtomTabsVisibility(item, displayItem),
                    displayItem.EpisodeTitle || displayItem.IsSeries ? primaryNameText = displayItem.Name : displayItem.SeriesName ? (primaryNameText = displayItem.SeriesName,
                    displayItem.SeriesId && !displayingLocalVideo && (primaryNameHtml = getTextActionButton({
                        Id: displayItem.SeriesId,
                        Type: "Series",
                        IsFolder: !0,
                        ServerId: displayItem.ServerId,
                        Name: displayItem.SeriesName,
                        ParentId: displayItem.ParentId
                    }))) : displayItem.ArtistItems && displayItem.ArtistItems.length && (primaryNameText = displayItem.Name,
                    primaryNameHtml = function(displayItem) {
                        var html = []
                          , artistItems = displayItem.ArtistItems;
                        if (artistItems)
                            for (var i = 0, length = artistItems.length; i < length; i++)
                                html.push(getTextActionButton({
                                    Id: artistItems[i].Id,
                                    ServerId: displayItem.ServerId,
                                    Name: artistItems[i].Name,
                                    Type: "MusicArtist",
                                    IsFolder: !0
                                }));
                        return html
                    }(displayItem).join(", "));
                    primaryNameHtml = primaryNameHtml || primaryNameText;
                    (function(item, originalItem, title) {
                        _appheader.default.setLogoTitle({
                            items: [item, originalItem],
                            titleText: "",
                            preferredLogoImageTypes: ["LogoLightColor", "LogoLight", "Logo"]
                        });
                        originalItem = title || (item ? item.Name : null);
                        originalItem && (document.title = originalItem)
                    }
                    )(displayItem, item, primaryNameText),
                    function(displayItem, item, displayingLocalVideo, mediaType) {
                        var backdropItems = [displayItem];
                        item.Id !== displayItem.Id && backdropItems.push(item);
                        if (displayingLocalVideo)
                            _backdrop.default.setBackdrops(backdropItems),
                            view.classList.add("darkContentContainer", "graphicContentContainer"),
                            headerElement.classList.add("headroom-scrolling"),
                            clearBlurFromDocumentElement();
                        else {
                            displayItem = "Video" === mediaType ? "nowPlayingVideoBackgroundStyle" : "nowPlayingAudioBackgroundStyle";
                            if ("blur" === _usersettings.default[displayItem]() && (backdropItems = getDetailImageItemsSync().Items,
                            item = backdropItems[0])) {
                                displayingLocalVideo = _imagehelper.default.getImageUrl(item, _connectionmanager.default.getApiClient(item), {
                                    width: 100,
                                    adjustForPixelRatio: !1
                                }).imgUrl;
                                if (displayingLocalVideo)
                                    return _backdrop.default.setBackdrop(displayingLocalVideo),
                                    displayingLocalVideo ? (view.classList.add("darkContentContainer"),
                                    view.classList.remove("graphicContentContainer"),
                                    headerElement.classList.remove("headroom-scrolling")) : (view.classList.remove("darkContentContainer", "graphicContentContainer"),
                                    headerElement.classList.remove("headroom-scrolling"),
                                    clearBlurFromDocumentElement())
                            }
                            _backdrop.default.setBackdrops(backdropItems),
                            clearBlurFromDocumentElement(),
                            headerElement.classList.remove("headroom-scrolling"),
                            _backdrop.default.hasBackdrop() ? view.classList.add("darkContentContainer", "graphicContentContainer") : view.classList.remove("darkContentContainer", "graphicContentContainer")
                        }
                    }(displayItem, item, displayingLocalVideo, item.MediaType),
                    displayingLocalVideo ? setPoster(null) : setPoster(displayItem);
                    var secondaryName, user = osdTitle;
                    secondaryName = "Audio" === item.MediaType ? (secondaryName = getSecondaryName(displayItem, !1),
                    primaryNameText = primaryNameHtml,
                    primaryNameHtml = secondaryName,
                    primaryNameText) : getSecondaryName(displayItem, !displayingLocalVideo);
                    primaryNameHtml || (primaryNameHtml = secondaryName,
                    secondaryName = null);
                    videoOsdParentTitle.innerHTML = primaryNameHtml,
                    (videoOsdParentTitleLarge.innerHTML = primaryNameHtml) ? videoOsdSecondaryText.classList.add("videoOsdSecondaryText-withparentname") : videoOsdSecondaryText.classList.remove("videoOsdSecondaryText-withparentname");
                    secondaryName || displayItem.Type;
                    (user.innerHTML = secondaryName) ? user.classList.remove("hide") : user.classList.add("hide");
                    var secondaryMediaInfoHtml, item = videoOsdSecondaryMediaInfo;
                    "Audio" === displayItem.MediaType || "Program" !== displayItem.Type && !secondaryName ? secondaryMediaInfoHtml = _mediainfo.default.getMediaInfoHtml(displayItem, {
                        runtime: !1,
                        endsAt: !1,
                        container: !displayingLocalVideo,
                        year: "Audio" !== displayItem.MediaType,
                        CommunityRating: !1,
                        criticRating: !1,
                        subtitles: !1,
                        officialRating: !1,
                        mediaInfoIcons: !1
                    }) : "Program" !== displayItem.Type && "Recording" !== displayItem.Type && (secondaryMediaInfoHtml = _mediainfo.default.getSecondaryMediaInfoHtml(displayItem, {
                        startDate: !1,
                        programTime: !1
                    }));
                    "Audio" === displayItem.MediaType && displayItem.Album && displayItem.AlbumId ? (videoOsdThirdTitle.innerHTML = getTextActionButton({
                        Type: "MusicAlbum",
                        Id: displayItem.AlbumId,
                        ServerId: displayItem.ServerId,
                        Name: displayItem.Album
                    }),
                    videoOsdThirdTitle.classList.remove("hide")) : videoOsdThirdTitle.classList.add("hide");
                    (function(item) {
                        item && "Audio" !== item.MediaType && (item = null);
                        for (var mediaStreams = (((item || {}).MediaSources || [])[0] || {}).MediaStreams || [], _i3 = 0, _length3 = mediaStreams.length; _i3 < _length3; _i3++)
                            if ("Subtitle" === mediaStreams[_i3].Type)
                                return btnLyrics.classList.remove("hide");
                        btnLyrics.classList.add("hide"),
                        "lyrics" === currentOsdContentSectionName && setContentSection(getDefaultOsdContentSection(), !1)
                    }
                    )(displayItem),
                    item.innerHTML = secondaryMediaInfoHtml,
                    (videoOsdAudioInfo.innerHTML = secondaryMediaInfoHtml) ? "Audio" === displayItem.MediaType ? (item.classList.add("hide"),
                    videoOsdAudioInfo.classList.remove("hide")) : (item.classList.remove("hide"),
                    videoOsdAudioInfo.classList.add("hide")) : (item.classList.add("hide"),
                    videoOsdAudioInfo.classList.add("hide"));
                    var primaryNameText = self.lyricsRenderer;
                    primaryNameText && primaryNameText.updateItem(displayItem);
                    for (var introStart, introEnd, creditsStart, chapters = self.osdController.currentChapters, _i4 = 0, _length4 = chapters.length; _i4 < _length4; _i4++) {
                        var chapter = chapters[_i4];
                        "IntroStart" === chapter.MarkerType ? (introStart = chapter.StartPositionTicks,
                        _i4 < chapters.length - 1 && (introEnd = chapters[_i4 + 1].StartPositionTicks)) : "IntroEnd" === chapter.MarkerType ? introEnd = chapter.StartPositionTicks : "CreditsStart" === chapter.MarkerType && (creditsStart = chapter.StartPositionTicks)
                    }
                    {
                        var primaryNameHtml;
                        creditsStart && (primaryNameHtml = introEnd || introStart) && creditsStart <= primaryNameHtml && (creditsStart = null)
                    }
                    currentIntroInfo = null != introStart && introEnd ? {
                        start: introStart,
                        end: introEnd
                    } : null,
                    currentCreditsInfo = null != creditsStart ? {
                        start: creditsStart
                    } : null;
                    for (var bottomTabControllers = self.bottomTabControllers, _i5 = 0, _length5 = bottomTabControllers.length; _i5 < _length5; _i5++)
                        bottomTabControllers[_i5] && bottomTabControllers[_i5].onItemUpdated(getTabOnItemUpdatedData(self))
                }(item, displayItem, user, displayingLocalVideo),
                self.nowPlayingVolumeSlider.disabled = !1,
                "Video" === item.MediaType || item.SupportsResume) {
                    for (var _i8 = 0, _length8 = fastForwardButtons.length; _i8 < _length8; _i8++)
                        fastForwardButtons[_i8].classList.remove("hide"),
                        fastForwardButtons[_i8].disabled = !0 === state.IsInitialRequest;
                    for (var _i9 = 0, _length9 = rewindButtons.length; _i9 < _length9; _i9++)
                        rewindButtons[_i9].classList.remove("hide"),
                        rewindButtons[_i9].disabled = !0 === state.IsInitialRequest
                } else {
                    for (var _i10 = 0, _length10 = fastForwardButtons.length; _i10 < _length10; _i10++)
                        fastForwardButtons[_i10].classList.add("hide");
                    for (var _i11 = 0, _length11 = rewindButtons.length; _i11 < _length11; _i11++)
                        rewindButtons[_i11].classList.add("hide")
                }
                1 < _playbackmanager.default.audioTracks(player).length ? btnAudio.classList.remove("hide") : btnAudio.classList.add("hide"),
                enableSkipIntro = "None" !== user.Configuration.IntroSkipMode,
                enableAutoSkipIntro = "AutoSkip" === user.Configuration.IntroSkipMode,
                enableSkipIntro && validateSkipIntroFeature({
                    showDialog: !1
                }, !0),
                _playbackmanager.default.subtitleTracks(player).length || _itemmanager.default.canDownloadSubtitles(item, user) && supportsSubtitleDownloading() ? btnSubtitles.classList.remove("hide") : btnSubtitles.classList.add("hide")
            }))
        }),
        view.querySelectorAll(".btnRewind")), fastForwardButtons = view.querySelectorAll(".btnOsdFastForward"), stopButtons = (this.btnPause = view.querySelector(".videoOsd-btnPause"),
        view.querySelectorAll(".btnVideoOsd-stop")), btnRepeatModeTopRight = view.querySelector(".btnOsdRepeatMode-topright"), btnRepeatModeBottom = view.querySelector(".btnOsdRepeatMode-bottom"), btnShuffleTopRight = view.querySelector(".btnOsdShuffle-topright"), btnShuffleBottom = view.querySelector(".btnOsdShuffle-bottom"), btnPlaybackSpeed = view.querySelector(".btnPlaybackSpeed"), btnOsdMoreBottom = view.querySelector(".btnOsdMore-bottom"), btnOsdMoreTitle = view.querySelector(".btnOsdMore-title"), transitionEndEventName = _dom.default.whichTransitionEvent(), belowTransportButtonsContainer = (this.osdBottomElement = view.querySelector(".videoOsdBottom"),
        view.querySelector(".videoOsd-belowtransportbuttons")), btnPreviousTrack = view.querySelector(".btnPreviousTrack"), btnNextTrack = view.querySelector(".btnNextTrack"), buttonMute = view.querySelector(".buttonMute"), btnSubtitles = view.querySelector(".btnSubtitles"), btnAudio = view.querySelector(".btnAudio"), btnFullscreen = view.querySelector(".btnFullscreen"), videoOsdSecondaryText = view.querySelector(".videoOsdSecondaryText"), videoOsdBottomButtons = (this.videoOsdText = view.querySelector(".videoOsdText"),
        view.querySelector(".videoOsdBottom-buttons")), mainTransportButtons = view.querySelector(".videoOsd-maintransportbuttons"), videoOsdPositionContainer = view.querySelector(".videoOsdPositionContainer"), osdTitle = view.querySelector(".videoOsdTitle"), videoOsdThirdTitle = view.querySelector(".videoOsdThirdTitle"), videoOsdParentTitle = view.querySelector(".videoOsdParentTitle-small"), videoOsdParentTitleLarge = view.querySelector(".videoOsdParentTitle-large"), osdPosterContainer = view.querySelector(".osdPosterContainer"), videoOsdSecondaryMediaInfo = view.querySelector(".videoOsdSecondaryMediaInfo"), videoOsdAudioInfo = view.querySelector(".videoOsd-audioInfo"), mainLockButton = view.querySelector(".videoOsd-btnLock"), tabContainers = (this.bottomTabs = view.querySelector(".videoOsdBottom-tabs"),
        this.bottomTabButtons = view.querySelectorAll(".videoosd-tab-button"),
        view.querySelectorAll(".videoosd-tab")), btnCloseTabContent = (this.bottomTabControllers = [],
        this.bottomTabControllers.length = tabContainers.length,
        view.querySelector(".btnCloseTabContent")), tabContainersElem = view.querySelector(".videoosd-tabcontainers"), videoOsdBottomContentbuttons = view.querySelector(".videoOsdBottom-contentbuttons"), videoOsdBottomMaincontrols = (this.upNextContainer = view.querySelector(".upNextContainer"),
        view.querySelector(".videoOsdBottom-maincontrols")), videoOsdVolumeControlsBottom = view.querySelector(".videoOsdVolumeControls-bottom"), videoOsdButtomButtonsTopRight = view.querySelector(".videoOsdBottom-buttons-topright"), ratingInfoContainer = view.querySelector(".videoOsd-ratingInfo"), ratingTextElement = view.querySelector(".videoOsd-ratingText"), btnSkipIntro = view.querySelector(".btnSkipIntro"), skipIntroContainer = view.querySelector(".skipIntroContainer"), btnLyrics = view.querySelector(".btnLyrics"), btnVideoOsdSettingsTransportButton = (this.btnRecord = view.querySelector(".btnRecord"),
        this.btnVideoOsdSettingsRight = view.querySelector(".btnVideoOsdSettings-right"),
        view.querySelector(".btnVideoOsdSettings-transport")), btnPlayNextFromUpNextProgress = view.querySelector(".btnPlayNextFromUpNext-progress"), btnHideUpNext = view.querySelector(".btnHideUpNext"), enableSkipIntro = !0, subtitleIcon = (_layoutmanager.default.tv ? videoOsdBottomButtons.classList.add("videoOsdBottom-buttons-tv") : (videoOsdPositionText.classList.add("videoOsd-customFont-x0"),
        videoOsdDurationText.classList.add("videoOsd-customFont-x0"),
        ratingTextElement.classList.add("videoOsd-customFont-x2"),
        videoOsdBottomButtons.classList.add("videoOsd-customFont-x2"),
        videoOsdButtomButtonsTopRight.classList.add("videoOsd-customFont-x2"),
        skipIntroContainer.classList.add("videoOsd-customFont-x2"),
        this.upNextContainer.classList.add("videoOsd-customFont-x2"),
        this.osdBottomElement.classList.add("videoOsd-nobuttonmargin")),
        _itemmanager.default.getDefaultIcon({
            Type: "MediaStream",
            StreamType: "Subtitle"
        })), subtitleIconElement = view.querySelector(".subtitleIcon");
        "&#xe8cd;" === subtitleIcon && subtitleIconElement.classList.add("md-icon-pushdown-bubble"),
        subtitleIconElement.innerHTML = subtitleIcon,
        view.querySelector(".audioIcon").innerHTML = _itemmanager.default.getDefaultIcon({
            Type: "MediaStream",
            StreamType: "Audio"
        }),
        view.querySelector(".lyricsIcon").innerHTML = _itemmanager.default.getDefaultIcon({
            Type: "MediaStream",
            StreamType: "Lyrics"
        });
        for (var i = 0, length = fastForwardButtons.length; i < length; i++)
            fastForwardButtons[i].querySelector("i").innerHTML = ("rtl" === document.dir ? getRewindIconLTR : getForwardIconLTR)();
        for (var _i = 0, _length = rewindButtons.length; _i < _length; _i++)
            rewindButtons[_i].querySelector("i").innerHTML = ("rtl" === document.dir ? getForwardIconLTR : getRewindIconLTR)();
        function updateRecordingButton(item, user) {
            item && "Program" === item.Type ? user.Policy.EnableLiveTvManagement && require(["recordingButton"], function(RecordingButton) {
                var recordingButtonManager = self.recordingButtonManager;
                recordingButtonManager ? recordingButtonManager.refreshItem(item) : (recordingButtonManager = self.recordingButtonManager = new RecordingButton({
                    item: item,
                    button: self.btnRecord
                }),
                self.btnRecord.classList.remove("hide"))
            }) : ((user = self.recordingButtonManager) && (user.destroy(),
            self.recordingButtonManager = null),
            self.btnRecord.classList.add("hide"))
        }
        function updateButtomTabsVisibility(item, displayItem) {
            var apiClient;
            item ? (apiClient = _connectionmanager.default.getApiClient(item),
            ("Video" === item.MediaType ? apiClient.getUserViews({}, apiClient.getCurrentUserId()) : Promise.resolve({
                Items: []
            })).then(function(result) {
                var bottomTabButtons = self.bottomTabButtons
                  , _self$osdController$c = ("Video" === item.MediaType ? bottomTabButtons[0].classList.remove("hide") : bottomTabButtons[0].classList.add("hide"),
                null != (_self$osdController$c = self.osdController.currentDisplayChapters) && _self$osdController$c.length ? bottomTabButtons[1].classList.remove("hide") : bottomTabButtons[1].classList.add("hide"),
                displayItem.People && displayItem.People.length ? bottomTabButtons[2].classList.remove("hide") : bottomTabButtons[2].classList.add("hide"),
                "Video" === item.MediaType && 1 < _playbackmanager.default.getCurrentPlaylistLength(self.currentPlayer) ? bottomTabButtons[3].classList.remove("hide") : bottomTabButtons[3].classList.add("hide"),
                !function(userViews) {
                    for (var _i2 = 0, _length2 = userViews.length; _i2 < _length2; _i2++)
                        if ("livetv" === userViews[_i2].CollectionType)
                            return 1
                }(result.Items) ? (bottomTabButtons[4].classList.add("hide"),
                bottomTabButtons[5].classList.add("hide")) : (bottomTabButtons[4].classList.remove("hide"),
                bottomTabButtons[5].classList.remove("hide")),
                self.bottomTabs)
                  , result = (view.querySelector(".videoosd-tab-button:not(.hide)") ? (tabContainersElem.classList.remove("hide"),
                _self$osdController$c.classList.remove("hide")) : (tabContainersElem.classList.add("hide"),
                _self$osdController$c.classList.add("hide")),
                _self$osdController$c.selectedIndex());
                0 <= result && bottomTabButtons[result].classList.contains("hide") && setBottomTabIndex(self, -1)
            })) : (setBottomTabIndex(self, -1),
            tabContainersElem.classList.add("hide"),
            self.bottomTabs.classList.add("hide"))
        }
        function supportsSubtitleDownloading() {
            return currentPlayerSupportedCommands.includes("RefreshMediaSource")
        }
        function setPoster(item) {
            var posterContainer = osdPosterContainer;
            item ? (posterContainer.classList.remove("hide"),
            posterContainer.resume({
                refresh: !0
            })) : (posterContainer.classList.add("hide"),
            posterContainer.innerHTML = "")
        }
        function updateFullscreenIcon() {
            var title;
            _playbackmanager.default.isFullscreen(self.currentPlayer) ? (title = _globalize.default.translate("ExitFullscreen"),
            btnFullscreen.querySelector("i").innerHTML = "&#xe5D1;") : (title = _globalize.default.translate("Fullscreen"),
            btnFullscreen.querySelector("i").innerHTML = "&#xe5D0;"),
            btnFullscreen.title = title,
            btnFullscreen.setAttribute("aria-label", title)
        }
        function updateTransparency(player, state, mediaType, isLocalVideo) {
            console.log("updateTransparency: isLocalVideo:" + isLocalVideo + ", mediaType:" + mediaType),
            _layoutmanager.default.tv ? videoOsdSecondaryText.classList.add("videoOsdSecondaryText-tv") : videoOsdSecondaryText.classList.remove("videoOsdSecondaryText-tv");
            var hideTransportButtons, instance, videoOsdText = self.videoOsdText, bottomTabs = self.bottomTabs, osdBottomElement = self.osdBottomElement;
            if (isLocalVideo) {
                if ((instance = self)._resizeObserver || (instance._resizeObserver = new ResizeObserver(function(entries) {
                    for (var i = 0, length = entries.length; i < length; i++)
                        if (entries[i]) {
                            var height = this.osdBottomElement.offsetHeight;
                            try {
                                document.documentElement.style.setProperty("--osd-height", Math.ceil(height) + "px")
                            } catch (err) {
                                console.log("error setting --osd-height css variable")
                            }
                        }
                }
                .bind(instance),{}),
                instance._resizeObserver.observe(instance.osdBottomElement)),
                !player.isLocalPlayer || player.isExternalPlayer || state.IsBackgroundPlayback)
                    unlockOrientation(),
                    setSystemUIHidden(!1);
                else {
                    switch (_usersettings.default.videoOrientation()) {
                    case "device":
                        unlockOrientation();
                        break;
                    case "landscape":
                        lockOrientation("landscape");
                        break;
                    default:
                        lockOrientation("any")
                    }
                    setSystemUIHidden(!0)
                }
                self.currentVisibleMenu || (headerElement.classList.add("videoOsdHeader-hidden", "hide"),
                osdBottomElement.classList.add("hide", "videoOsdBottom-hidden")),
                osdBottomElement.classList.add("videoOsdBottom-video"),
                osdPosterContainer.classList.remove("osdPosterContainer-autoexpand"),
                videoOsdSecondaryText.classList.remove("videoOsdSecondaryText-remotecontrol"),
                videoOsdBottomMaincontrols.classList.remove("videoOsdBottomMaincontrols-autoexpand"),
                videoOsdPositionContainer.classList.remove("videoOsdPositionContainer-autosmall"),
                videoOsdPositionContainer.classList.add("focuscontainer-x"),
                belowTransportButtonsContainer.classList.remove("videoOsd-belowtransportbuttons-vertical"),
                _layoutmanager.default.tv ? (function() {
                    var val;
                    if (!_usersettings.default.enableVideoUnderUI())
                        return "true" === (val = _usersettings.default.hideMediaTransportButtons()) ? 1 : "false" !== val && !_mouse.default.lastMouseInputTime()
                }() && (hideTransportButtons = !0),
                mainLockButton.classList.add("hide")) : mainLockButton.classList.remove("hide"),
                videoOsdButtomButtonsTopRight.classList.remove("videoOsdBottom-buttons-topright-remotecontrol", "videoOsdBottom-buttons-topright-remotecontrol-tv"),
                tabContainersElem.classList.remove("videoosd-tabcontainers-autosmall"),
                bottomTabs.classList.remove("videoOsdBottom-tabs-remotecontrol"),
                videoOsdVolumeControlsBottom.classList.add("hide"),
                self.topVolumeControls && self.topVolumeControls.classList.remove("hide"),
                videoOsdParentTitle.classList.add("hide", "osdText-nowrap"),
                videoOsdParentTitleLarge.classList.add("osdText-nowrap"),
                videoOsdParentTitleLarge.classList.remove("hide"),
                state.IsInitialRequest ? _approuter.default.setTransparency(0) : _approuter.default.setTransparency("full"),
                hideOrShowAll(self, stopButtons, !_layoutmanager.default.tv || !_usersettings.default.enableVideoUnderUI(), null),
                videoOsdText.classList.remove("videoOsdText-remotecontrol", "videoOsdText-autosmall", "videoOsdText-remotecontrol-tv"),
                videoOsdBottomButtons.classList.remove("videoOsdBottom-buttons-remotecontrol", "videoOsdBottom-buttons-remotecontrol-tv"),
                osdBottomElement.classList.remove("videoOsdBottom-remotecontrol", "videoOsdBottom-safe", "padded-top-page", "videoOsdBottom-tvnowplaying"),
                view.classList.remove("justify-content-flex-end"),
                osdTitle.classList.remove("secondaryText"),
                osdTitle.classList.add("osdText-nowrap"),
                videoOsdSecondaryMediaInfo.classList.remove("videoOsdSecondaryMediaInfo-remotecontrol"),
                videoOsdPositionText.classList.remove("videoOsd-customFont-remotecontrol"),
                videoOsdDurationText.classList.remove("videoOsd-customFont-remotecontrol"),
                videoOsdBottomButtons.classList.remove("videoOsd-customFont-remotecontrol", "videoOsd-customFont-remotecontrol-buttons"),
                videoOsdButtomButtonsTopRight.classList.remove("videoOsd-customFont-remotecontrol", "videoOsd-customFont-remotecontrol-buttons"),
                headerElement.classList.remove("videoosd-header-safe"),
                videoOsdBottomContentbuttons.classList.add("hide"),
                videoOsdBottomContentbuttons.classList.remove("videoOsd-customFont-remotecontrol-buttons", "videoOsd-customFont-remotecontrol", "videoOsd-customFont-remotecontrol-buttons", "videoOsdBottom-contentbuttons-tv"),
                videoOsdPositionContainer.classList.remove("videoOsdPositionContainer-limitwidth"),
                backdropContainer.classList.remove("nowplaying-backdropcontainer-blur", "nowplaying-backdropcontainer-blur-high", "nowplaying-backdropcontainer-blur-extrasaturation", "nowplaying-backdropcontainer-blur-backdropfilter"),
                backgroundContainer.classList.remove("nowplaying-backgroundcontainer-blur", "nowplaying-backgroundcontainer-blur-backdropfilter"),
                backgroundContainer.classList.remove("nowplaying-backgroundcontainer-brighter"),
                self.enableStopOnBack = !0,
                self.enableBackOnStop = !0,
                btnOsdMoreTitle.classList.add("hide"),
                btnOsdMoreBottom.classList.add("hide")
            } else
                destroyOsdResizeObserver(self),
                unlockOrientation(),
                setSystemUIHidden(!1),
                osdTitle.classList.add("secondaryText"),
                osdTitle.classList.remove("osdText-nowrap"),
                osdBottomElement.classList.remove("videoOsdBottom-video", "videoOsdBottom-hidden", "hide", "videoosd-withupnext"),
                self.showOsd(),
                "blur" === _usersettings.default["Video" === mediaType ? "nowPlayingVideoBackgroundStyle" : "nowPlayingAudioBackgroundStyle"]() ? (backdropContainer.classList.add("nowplaying-backdropcontainer-blur"),
                enableHighResBlur && backdropContainer.classList.add("nowplaying-backdropcontainer-blur-high"),
                _browser.default.chrome ? backdropContainer.classList.add("nowplaying-backdropcontainer-blur-extrasaturation") : backdropContainer.classList.remove("nowplaying-backdropcontainer-blur-extrasaturation"),
                backgroundContainer.classList.add("nowplaying-backgroundcontainer-blur"),
                useBackdropFilterForBlur && (backgroundContainer.classList.add("nowplaying-backgroundcontainer-blur-backdropfilter"),
                backdropContainer.classList.add("nowplaying-backdropcontainer-blur-backdropfilter")),
                backgroundContainer.classList.remove("nowplaying-backgroundcontainer-brighter")) : (backdropContainer.classList.remove("nowplaying-backdropcontainer-blur", "nowplaying-backdropcontainer-blur-high", "nowplaying-backdropcontainer-blur-extrasaturation", "nowplaying-backdropcontainer-blur-backdropfilter"),
                backgroundContainer.classList.remove("nowplaying-backgroundcontainer-blur", "nowplaying-backgroundcontainer-blur-backdropfilter"),
                backgroundContainer.classList.add("nowplaying-backgroundcontainer-brighter")),
                videoOsdParentTitleLarge.classList.remove("osdText-nowrap"),
                videoOsdParentTitleLarge.classList.add("hide"),
                videoOsdParentTitle.classList.remove("hide", "osdText-nowrap"),
                videoOsdSecondaryMediaInfo.classList.add("videoOsdSecondaryMediaInfo-remotecontrol"),
                mainLockButton.classList.add("hide"),
                headerElement.classList.add("videoosd-header-safe"),
                _layoutmanager.default.tv ? (osdBottomElement.classList.add("videoOsdBottom-safe", "padded-top-page", "videoOsdBottom-tvnowplaying", "videoOsdBottom-remotecontrol"),
                view.classList.remove("justify-content-flex-end"),
                belowTransportButtonsContainer.classList.remove("videoOsd-belowtransportbuttons-vertical"),
                videoOsdText.classList.add("videoOsdText-remotecontrol", "videoOsdText-remotecontrol-tv"),
                videoOsdText.classList.remove("videoOsdText-autosmall"),
                osdPosterContainer.classList.remove("osdPosterContainer-autoexpand"),
                videoOsdSecondaryText.classList.add("videoOsdSecondaryText-remotecontrol"),
                videoOsdBottomButtons.classList.remove("videoOsdBottom-buttons-remotecontrol", "videoOsd-customFont-remotecontrol", "videoOsd-customFont-remotecontrol-buttons"),
                videoOsdBottomButtons.classList.add("videoOsdBottom-buttons-remotecontrol-tv"),
                videoOsdBottomMaincontrols.classList.remove("videoOsdBottomMaincontrols-autoexpand"),
                videoOsdPositionContainer.classList.add("focuscontainer-x"),
                videoOsdPositionContainer.classList.remove("videoOsdPositionContainer-autosmall"),
                tabContainersElem.classList.remove("videoosd-tabcontainers-autosmall"),
                bottomTabs.classList.remove("videoOsdBottom-tabs-remotecontrol"),
                videoOsdPositionText.classList.remove("videoOsd-customFont-remotecontrol"),
                videoOsdDurationText.classList.remove("videoOsd-customFont-remotecontrol"),
                videoOsdBottomContentbuttons.classList.add("videoOsdBottom-contentbuttons-tv"),
                videoOsdBottomContentbuttons.classList.remove("hide", "videoOsd-customFont-remotecontrol-buttons", "videoOsd-customFont-remotecontrol", "videoOsd-customFont-remotecontrol-buttons"),
                videoOsdVolumeControlsBottom.classList.add("hide"),
                self.topVolumeControls && self.topVolumeControls.classList.remove("hide"),
                videoOsdButtomButtonsTopRight.classList.remove("videoOsd-customFont-remotecontrol", "videoOsd-customFont-remotecontrol-buttons", "videoOsdBottom-buttons-topright-remotecontrol"),
                videoOsdButtomButtonsTopRight.classList.add("videoOsdBottom-buttons-topright-remotecontrol-tv"),
                btnOsdMoreTitle.classList.add("hide"),
                btnOsdMoreBottom.classList.remove("hide")) : (osdBottomElement.classList.add("videoOsdBottom-remotecontrol", "videoOsdBottom-safe", "padded-top-page"),
                view.classList.remove("justify-content-flex-end"),
                osdPosterContainer.classList.add("osdPosterContainer-autoexpand"),
                belowTransportButtonsContainer.classList.add("videoOsd-belowtransportbuttons-vertical"),
                videoOsdText.classList.add("videoOsdText-remotecontrol", "videoOsdText-autosmall"),
                videoOsdText.classList.remove("videoOsdText-remotecontrol-tv"),
                videoOsdBottomMaincontrols.classList.add("videoOsdBottomMaincontrols-autoexpand"),
                videoOsdPositionContainer.classList.add("videoOsdPositionContainer-autosmall"),
                videoOsdPositionContainer.classList.remove("focuscontainer-x"),
                tabContainersElem.classList.add("videoosd-tabcontainers-autosmall"),
                bottomTabs.classList.add("videoOsdBottom-tabs-remotecontrol"),
                videoOsdSecondaryText.classList.add("videoOsdSecondaryText-remotecontrol"),
                videoOsdBottomButtons.classList.add("videoOsdBottom-buttons-remotecontrol"),
                videoOsdBottomButtons.classList.remove("videoOsdBottom-buttons-remotecontrol-tv"),
                videoOsdPositionText.classList.add("videoOsd-customFont-remotecontrol"),
                videoOsdDurationText.classList.add("videoOsd-customFont-remotecontrol"),
                videoOsdBottomButtons.classList.add("videoOsd-customFont-remotecontrol", "videoOsd-customFont-remotecontrol-buttons"),
                videoOsdButtomButtonsTopRight.classList.add("videoOsd-customFont-remotecontrol", "videoOsd-customFont-remotecontrol-buttons"),
                videoOsdBottomContentbuttons.classList.remove("hide", "videoOsdBottom-contentbuttons-tv"),
                videoOsdBottomContentbuttons.classList.add("videoOsd-customFont-remotecontrol-buttons", "videoOsd-customFont-remotecontrol"),
                videoOsdVolumeControlsBottom.classList.remove("hide"),
                self.topVolumeControls && self.topVolumeControls.classList.add("hide"),
                videoOsdButtomButtonsTopRight.classList.add("videoOsdBottom-buttons-topright-remotecontrol"),
                videoOsdButtomButtonsTopRight.classList.remove("videoOsdBottom-buttons-topright-remotecontrol-tv"),
                videoOsdPositionContainer.classList.add("videoOsdPositionContainer-limitwidth"),
                btnOsdMoreTitle.classList.remove("hide"),
                btnOsdMoreBottom.classList.add("hide")),
                _approuter.default.setTransparency(0),
                hideOrShowAll(self, stopButtons, !1, null),
                self.enableStopOnBack = !1,
                self.enableBackOnStop = !0;
            hideTransportButtons ? (videoOsdBottomButtons.classList.add("hide"),
            self.bottomTabs.classList.add("videoOsdTabs-margintop")) : (videoOsdBottomButtons.classList.remove("hide"),
            self.bottomTabs.classList.remove("videoOsdTabs-margintop")),
            isLocalVideo ? (destroyPlayQueue(self),
            destroyLyricsRenderer(self)) : (self.lyricsRenderer || (self.lyricsRenderer = new _lyrics.default({
                parent: view.querySelector(".lyricsSection")
            })),
            self.playQueue || (instance = _usersettings.default.osdContentSection() || getDefaultOsdContentSection(),
            _layoutmanager.default.tv ? (self.playQueue = new _tvplayqueue.default({
                parent: view.querySelector(".videoOsdBottom")
            }),
            instance = "playqueue") : self.playQueue = new _playqueue.default({
                parent: view.querySelector(".videoOsdBottom")
            }),
            setContentSection(instance = "lyrics" === instance ? getDefaultOsdContentSection() : instance, !1)));
            player = self.btnPause;
            isLocalVideo && !_layoutmanager.default.tv ? (mainTransportButtons.classList.add("videoOsd-centerButtons-autolayout"),
            player.classList.add("videoOsd-btnPause-autolayout")) : (mainTransportButtons.classList.remove("videoOsd-centerButtons-autolayout"),
            player.classList.remove("videoOsd-btnPause-autolayout"))
        }
        function getDetailImageItemsSync() {
            var item = self.osdController.currentDisplayItem
              , items = [];
            return item && (item.SeriesPrimaryImageTag && (item = {
                Id: item.SeriesId,
                Name: item.SeriesName,
                ServerId: item.ServerId,
                ImageTags: {
                    Primary: item.SeriesPrimaryImageTag
                },
                IsFolder: !0,
                PrimaryImageAspectRatio: 2 / 3
            }),
            items.push(item)),
            {
                Items: items,
                TotalRecordCount: items.length
            }
        }
        function getDetailImageItems() {
            return Promise.resolve(getDetailImageItemsSync())
        }
        function getDetailImageListOptions(items) {
            var cardClass = "osdRemoteControlImageCard";
            return _layoutmanager.default.tv || (cardClass += " osdRemoteControlImageCard-automargin"),
            {
                renderer: _cardbuilder.default,
                options: {
                    overlayText: !0,
                    fields: [],
                    action: "none",
                    multiSelect: !1,
                    contextMenu: !_layoutmanager.default.tv,
                    ratingButton: !_layoutmanager.default.tv,
                    playedButton: !1,
                    cardClass: cardClass,
                    cardBoxClass: "osdRemoteControlImageCardBox",
                    cardContentClass: "osdRemoteControlImageCardContent legacyLazyLoadImmediate",
                    defaultIcon: !0,
                    typeIndicator: !1,
                    playedIndicator: !1,
                    syncIndicator: !1,
                    timerIndicator: !1,
                    randomDefaultBackground: !1,
                    staticElement: !0,
                    progress: !1,
                    hoverPlayButton: !1,
                    moreButton: !1,
                    enableUserData: !_layoutmanager.default.tv,
                    shape: "auto"
                },
                virtualScrollLayout: "vertical-grid"
            }
        }
        function onStateChanged(event, state) {
            state.NowPlayingItem && (isEnabled = !0,
            function(event, player, state) {
                var playState = (self.lastPlayerState = state).PlayState || {}
                  , supportedCommands = (updatePlayPauseState(playState.IsPaused, state.IsInitialRequest),
                _playbackmanager.default.getSupportedCommands(player));
                currentPlayerSupportedCommands = supportedCommands,
                updatePlayerVolumeState(0, playState.IsMuted, playState.VolumeLevel, supportedCommands),
                updatePlayerBrightnessState(player),
                self.osdController.updatePlayerState(event, player, state);
                for (var _i12 = 0, _length12 = fastForwardButtons.length; _i12 < _length12; _i12++)
                    fastForwardButtons[_i12].disabled = !playState.CanSeek;
                for (var _i13 = 0, _length13 = rewindButtons.length; _i13 < _length13; _i13++)
                    rewindButtons[_i13].disabled = !playState.CanSeek;
                var event = state.NowPlayingItem || {}
                  , displayingLocalVideo = isDisplayingLocalVideo(player, event.MediaType)
                  , focusedElement = (updateTransparency(player, state, event.MediaType, displayingLocalVideo),
                updateTimeDisplay(playState.PositionTicks, event.RunTimeTicks, playState.SeekableRanges || []),
                function(state) {
                    if (!state.NowPlayingItem) {
                        ratingTextNeedsUpdate = !(currentCreditsInfo = currentIntroInfo = null),
                        setPoster(null),
                        updateRecordingButton(null),
                        _appheader.default.setTitle(""),
                        self.nowPlayingVolumeSlider.disabled = !0;
                        for (var _i6 = 0, _length6 = fastForwardButtons.length; _i6 < _length6; _i6++)
                            fastForwardButtons[_i6].classList.add("hide");
                        for (var _i7 = 0, _length7 = rewindButtons.length; _i7 < _length7; _i7++)
                            rewindButtons[_i7].classList.add("hide");
                        btnSubtitles.classList.add("hide"),
                        btnAudio.classList.add("hide"),
                        ratingInfoContainer.classList.add("hide"),
                        updateButtomTabsVisibility(null, null),
                        osdTitle.innerHTML = "",
                        view.querySelector(".videoOsdMediaInfo").innerHTML = ""
                    }
                }(state),
                document.activeElement);
                state.MediaSource && !state.IsInitialRequest ? displayingLocalVideo || _layoutmanager.default.tv ? (hideButton(btnVideoOsdSettingsTransportButton, focusedElement),
                self.btnVideoOsdSettingsRight.classList.remove("hide")) : (btnVideoOsdSettingsTransportButton.classList.remove("hide"),
                hideButton(self.btnVideoOsdSettingsRight, focusedElement)) : (hideButton(self.btnVideoOsdSettingsRight, focusedElement),
                hideButton(btnVideoOsdSettingsTransportButton, focusedElement));
                !supportedCommands.includes("ToggleFullscreen") || !displayingLocalVideo || player.isLocalPlayer && _layoutmanager.default.tv && _playbackmanager.default.isFullscreen(player) ? hideButton(btnFullscreen, focusedElement) : btnFullscreen.classList.remove("hide");
                state.IsInitialRequest || !supportedCommands.includes("PictureInPicture") || _layoutmanager.default.tv || supportedCommands.includes("AutoPictureInPicture") ? hideButton(view.querySelector(".btnPip"), focusedElement) : view.querySelector(".btnPip").classList.remove("hide");
                updateRepeatModeDisplay(playState.RepeatMode),
                supportedCommands.includes("SetRepeatMode") && "Video" !== event.MediaType ? _layoutmanager.default.tv ? (btnRepeatModeTopRight.classList.remove("hide"),
                hideButton(btnRepeatModeBottom, focusedElement)) : (btnRepeatModeBottom.classList.remove("hide"),
                hideButton(btnRepeatModeTopRight, focusedElement)) : (hideButton(btnRepeatModeBottom, focusedElement),
                hideButton(btnRepeatModeTopRight, focusedElement));
                updateShuffleDisplay(playState.Shuffle),
                supportedCommands.includes("SetShuffle") && "Video" !== event.MediaType ? _layoutmanager.default.tv ? (btnShuffleTopRight.classList.remove("hide"),
                hideButton(btnShuffleBottom, focusedElement)) : (btnShuffleBottom.classList.remove("hide"),
                hideButton(btnShuffleTopRight, focusedElement)) : (hideButton(btnShuffleBottom, focusedElement),
                hideButton(btnShuffleTopRight, focusedElement));
                supportedCommands.includes("SetPlaybackRate") && "Video" === event.MediaType && !_layoutmanager.default.tv && event.RunTimeTicks ? btnPlaybackSpeed.classList.remove("hide") : hideButton(btnPlaybackSpeed, focusedElement);
                updateFullscreenIcon();
                displayingLocalVideo = state.PlaylistIndex,
                supportedCommands = state.PlaylistLength,
                updatePlaylistButtons(displayingLocalVideo, supportedCommands, focusedElement),
                event = self.playQueue;
                event && (focusedElement = state.PlaylistItemId,
                event.updatePlaylist(player, focusedElement, displayingLocalVideo, supportedCommands))
            }(event, this, state))
        }
        function onPlayPauseStateChanged(e) {
            isEnabled && updatePlayPauseState(this.paused())
        }
        function onVolumeChanged(e) {
            isEnabled && updatePlayerVolumeState(0, this.isMuted(), this.getVolume(), currentPlayerSupportedCommands)
        }
        function onBrightnessChanged(e) {
            isEnabled && updatePlayerBrightnessState(this)
        }
        function onPlaybackStart(e, state) {
            console.log("nowplaying event: " + e.type),
            self.osdController.onPlaybackStart(e, state);
            onStateChanged.call(this, e, state),
            resetUpNextDialog(),
            resetRatingText(),
            showHideSkipIntro(!1),
            "Video" !== (null == (e = state.NowPlayingItem) ? void 0 : e.MediaType) && setBottomTabIndex(self, -1)
        }
        function onShuffleChange(e) {
            updateShuffleDisplay(_playbackmanager.default.getShuffle(this))
        }
        function onRepeatModeChange(e) {
            updateRepeatModeDisplay(_playbackmanager.default.getRepeatMode(this))
        }
        function onSubtitleTrackChange() {
            destroySubtitleOffsetOverlay(self)
        }
        function onPlaylistItemAdd(e) {
            var playlistItemId, playlistIndex = _playbackmanager.default.getCurrentPlaylistIndex(this), playlistLength = _playbackmanager.default.getCurrentPlaylistLength(this), playQueue = (updatePlaylistButtons(playlistIndex, playlistLength, document.activeElement),
            self.playQueue);
            playQueue && (playlistItemId = _playbackmanager.default.getCurrentPlaylistItemId(this),
            playQueue.updatePlaylist(this, playlistItemId, playlistIndex, playlistLength))
        }
        function onPlaylistItemMove(e, info) {
            updatePlaylistButtons(_playbackmanager.default.getCurrentPlaylistIndex(this), _playbackmanager.default.getCurrentPlaylistLength(this), document.activeElement);
            var playQueue = self.playQueue;
            playQueue && playQueue.onPlaylistItemMoved(this, e, info)
        }
        function onPlaylistItemRemove(e, info) {
            updatePlaylistButtons(_playbackmanager.default.getCurrentPlaylistIndex(this), _playbackmanager.default.getCurrentPlaylistLength(this), document.activeElement);
            var playQueue = self.playQueue;
            playQueue && playQueue.onPlaylistItemRemoved(this, e, info)
        }
        function resetUpNextDialog() {
            showHideUpNext(comingUpNextDisplayed = !1),
            btnHideUpNext.classList.remove("hide")
        }
        function onPlaybackStopped(e, state) {
            hideWaiting(),
            self.osdController.onPlaybackStopped(e, state),
            currentRuntimeTicks = null,
            resetRatingText();
            var currentItem = self.osdController.currentItem
              , currentItem = (currentItem && showComingUpNextIfNeeded(0, currentItem, 1, 1, !0, currentCreditsInfo),
            btnHideUpNext === document.activeElement);
            btnHideUpNext.classList.add("hide"),
            currentItem && _focusmanager.default.autoFocus(self.upNextContainer),
            showHideSkipIntro(!1),
            console.log("nowplaying event: " + e.type),
            state.NextMediaType || ((currentItem = self.playQueue) && currentItem.onPlaybackStopped(),
            (e = self.lyricsRenderer) && e.onPlaybackStopped(),
            self.enableStopOnBack = !1,
            self.enableBackOnStop && (self.enableBackOnStop = !1,
            self.exit()))
        }
        function onMediaStreamsChanged(e) {
            var state = _playbackmanager.default.getPlayerState(this);
            onStateChanged.call(this, e, state)
        }
        function releaseCurrentPlayer() {
            null != (_self$osdController = self.osdController) && _self$osdController.releaseCurrentPlayer(),
            destroyStats(self),
            destroySubtitleOffsetOverlay(self),
            resetUpNextDialog(),
            resetRatingText(),
            showHideSkipIntro(!1);
            var _self$osdController = self.currentPlayer;
            _self$osdController && (hideWaiting(),
            _events.default.off(_self$osdController, "playbackrequest", onPlaybackStart),
            _events.default.off(_self$osdController, "playbackstart", onPlaybackStart),
            _events.default.off(_self$osdController, "playbackstop", onPlaybackStopped),
            _events.default.off(_self$osdController, "volumechange", onVolumeChanged),
            _events.default.off(_self$osdController, "brightnesschange", onBrightnessChanged),
            _events.default.off(_self$osdController, "pause", onPlayPauseStateChanged),
            _events.default.off(_self$osdController, "unpause", onPlayPauseStateChanged),
            _events.default.off(_self$osdController, "timeupdate", onTimeUpdate),
            _events.default.off(_self$osdController, "waiting", onWaiting),
            _events.default.off(_self$osdController, "playing", onPlaying),
            _events.default.off(_self$osdController, "fullscreenchange", updateFullscreenIcon),
            _events.default.off(_self$osdController, "mediastreamschange", onMediaStreamsChanged),
            _events.default.off(_self$osdController, "statechange", onStateChanged),
            _events.default.off(_self$osdController, "repeatmodechange", onRepeatModeChange),
            _events.default.off(_self$osdController, "shufflechange", onShuffleChange),
            _events.default.off(_self$osdController, "subtitletrackchange", onSubtitleTrackChange),
            _events.default.off(_self$osdController, "playlistitemadd", onPlaylistItemAdd),
            _events.default.off(_self$osdController, "playlistitemmove", onPlaylistItemMove),
            _events.default.off(_self$osdController, "playlistitemremove", onPlaylistItemRemove),
            self.currentPlayer = null)
        }
        function resetRatingText() {
            ratingInfoContainer.classList.add("hide"),
            ratingTextNeedsUpdate = !0
        }
        function showHideSkipIntro(show) {
            var needToRefocus;
            show ? skipIntroContainer._visible || (skipIntroContainer._visible = !0,
            skipIntroContainer.classList.remove("hide"),
            self.currentVisibleMenu) || (_focusmanager.default.focus(btnSkipIntro),
            enableAutoSkipIntro && btnSkipIntro.click()) : skipIntroContainer._visible && (skipIntroContainer._visible = !1,
            show = btnSkipIntro === document.activeElement,
            needToRefocus = !!self.currentVisibleMenu && show,
            skipIntroContainer.classList.add("hide"),
            needToRefocus ? focusMainOsdControls(self) : show && btnSkipIntro.blur())
        }
        function showHideUpNext(show, timeRemainingTicks) {
            var upNextContainer = self.upNextContainer;
            show ? upNextContainer._visible || (btnPlayNextFromUpNextProgress.style.transform = "scaleX(0)",
            upNextContainer._visible = !0,
            upNextContainer._timeRemainingTicks = timeRemainingTicks,
            upNextContainer.classList.remove("hide"),
            self.osdBottomElement.classList.add("videoosd-withupnext"),
            _focusmanager.default.focus(upNextContainer.querySelector(".btnPlayNextFromUpNext"))) : upNextContainer._visible && (upNextContainer._visible = !1,
            upNextContainer._timeRemainingTicks = null,
            show = !!self.currentVisibleMenu && upNextContainer.contains(document.activeElement),
            upNextContainer.classList.add("hide"),
            self.osdBottomElement.classList.remove("videoosd-withupnext"),
            show) && focusMainOsdControls(self)
        }
        function validateSkipIntroFeature(options, incrementAppSettings) {
            return Emby.importModule("./modules/registrationservices/registrationservices.js").then(function(registrationServices) {
                return registrationServices.validateFeature("dvr", Object.assign({
                    viewOnly: !0
                }, options)).then(function() {
                    skipIntroValidated = !0,
                    _appsettings.default.introSkipDisplayCount(0)
                }, function(err) {
                    return skipIntroValidated = !1,
                    incrementAppSettings && _appsettings.default.introSkipDisplayCount(_appsettings.default.introSkipDisplayCount() + 1),
                    Promise.reject(err)
                })
            })
        }
        self.updateTransparency = updateTransparency,
        (subtitleIconElement = osdPosterContainer).fetchData = getDetailImageItems,
        subtitleIconElement.getListOptions = getDetailImageListOptions,
        _dom.default.addEventListener(btnFullscreen, "click", function() {
            _playbackmanager.default.toggleFullscreen(self.currentPlayer)
        }, {
            passive: !0
        }),
        view.querySelector(".btnPip").addEventListener("click", function() {
            _playbackmanager.default.togglePictureInPicture(self.currentPlayer)
        }),
        self.btnVideoOsdSettingsRight.addEventListener("click", onSettingsButtonClick),
        btnVideoOsdSettingsTransportButton.addEventListener("click", onSettingsButtonClick),
        self.bindToPlayer = function(player, forceStateChange) {
            player === self.currentPlayer ? forceStateChange && player && onStateChanged.call(player, {
                type: "viewresume"
            }, _playbackmanager.default.getPlayerState(player)) : (releaseCurrentPlayer(),
            self.currentPlayer = player,
            self.osdController.bindToPlayer(player),
            player && (onStateChanged.call(player, {
                type: "init"
            }, _playbackmanager.default.getPlayerState(player)),
            _events.default.on(player, "playbackrequest", onPlaybackStart),
            _events.default.on(player, "playbackstart", onPlaybackStart),
            _events.default.on(player, "playbackstop", onPlaybackStopped),
            _events.default.on(player, "volumechange", onVolumeChanged),
            _events.default.on(player, "brightnesschange", onBrightnessChanged),
            _events.default.on(player, "pause", onPlayPauseStateChanged),
            _events.default.on(player, "unpause", onPlayPauseStateChanged),
            _events.default.on(player, "timeupdate", onTimeUpdate),
            _events.default.on(player, "waiting", onWaiting),
            _events.default.on(player, "playing", onPlaying),
            _events.default.on(player, "fullscreenchange", updateFullscreenIcon),
            _events.default.on(player, "mediastreamschange", onMediaStreamsChanged),
            _events.default.on(player, "statechange", onStateChanged),
            _events.default.on(player, "repeatmodechange", onRepeatModeChange),
            _events.default.on(player, "shufflechange", onShuffleChange),
            _events.default.on(player, "subtitletrackchange", onSubtitleTrackChange),
            _events.default.on(player, "playlistitemadd", onPlaylistItemAdd),
            _events.default.on(player, "playlistitemmove", onPlaylistItemMove),
            _events.default.on(player, "playlistitemremove", onPlaylistItemRemove),
            resetUpNextDialog(),
            resetRatingText(),
            showHideSkipIntro(!1)))
        }
        ,
        self.releaseCurrentPlayer = releaseCurrentPlayer;
        var IntroEndToleranceTicks = 2e7;
        function onWaiting(e) {
            self.timeWhenWaiting = _playbackmanager.default.currentTime(this),
            _loading.default.show()
        }
        function hideWaiting() {
            self.timeWhenWaiting = null,
            _loading.default.hide()
        }
        function onPlaying(e) {
            hideWaiting()
        }
        function onTimeUpdate(e) {
            var now, currentTime, item;
            !isEnabled || (now = Date.now()) - lastUpdateTime < 200 || ((currentTime = _playbackmanager.default.currentTime(this)) !== self.timeWhenWaiting && hideWaiting(),
            showComingUpNextIfNeeded(0, item = self.osdController.currentItem, currentTime, currentRuntimeTicks = _playbackmanager.default.duration(this), !1, currentCreditsInfo),
            now - lastUpdateTime < 400) || (lastUpdateTime = now,
            function(currentTime) {
                var introInfo = currentIntroInfo;
                introInfo && enableSkipIntro && currentTime >= introInfo.start && currentTime < introInfo.end - IntroEndToleranceTicks && (!1 !== skipIntroValidated || _appsettings.default.introSkipDisplayCount() < 5) ? (!0 === skipIntroValidated && _appsettings.default.introSkipDisplayCount(0),
                showHideSkipIntro(!0)) : showHideSkipIntro(!1)
            }(currentTime),
            function() {
                var item;
                ratingTextNeedsUpdate && (item = self.osdController.currentDisplayItem) && (ratingTextNeedsUpdate = !1,
                item.OfficialRating && "Trailer" !== item.Type && "Video" === item.MediaType && _usersettings.default.enableRatingInfoOnPlaybackStart() ? (ratingTextElement.innerHTML = _globalize.default.translate("RatedValue", item.OfficialRating),
                ratingInfoContainer.classList.add("hide"),
                ratingInfoContainer.offsetWidth,
                ratingInfoContainer.classList.remove("hide")) : ratingInfoContainer.classList.add("hide"))
            }(),
            updateTimeDisplay(currentTime, currentRuntimeTicks, _playbackmanager.default.getSeekableRanges(this)),
            function(player, item) {
                if ("TvChannel" === item.Type) {
                    item = item.CurrentProgram;
                    if (item && item.EndDate)
                        try {
                            var state, endDate = _datetime.default.parseISO8601Date(item.EndDate);
                            Date.now() >= endDate.getTime() && (console.log("program info needs to be refreshed"),
                            state = _playbackmanager.default.getPlayerState(player),
                            onStateChanged.call(player, {
                                type: "updatemetadata"
                            }, state))
                        } catch (e) {
                            console.log("Error parsing date: " + item.EndDate)
                        }
                }
            }(this, item))
        }
        var fiftyMinuteTicks = 3e10
          , fortyMinuteTicks = 24e9;
        function showComingUpNextIfNeeded(player, currentItem, currentTimeTicks, runtimeTicks, isStopped, creditsInfo) {
            (runtimeTicks && currentTimeTicks || isStopped) && "Episode" === currentItem.Type && self.hasNextTrack && (currentItem = runtimeTicks - currentTimeTicks,
            (!comingUpNextDisplayed || isStopped) && (creditsInfo = function(runtimeTicks, creditsInfo) {
                return (creditsInfo = (null == creditsInfo ? void 0 : creditsInfo.start) || 0) && creditsInfo < runtimeTicks ? creditsInfo : runtimeTicks - 1e3 * (fiftyMinuteTicks <= runtimeTicks ? 40 : fortyMinuteTicks <= runtimeTicks ? 35 : 30) * 1e4
            }(runtimeTicks, creditsInfo),
            isStopped || creditsInfo <= currentTimeTicks && 3e9 <= runtimeTicks && 2e8 <= currentItem && _usersettings.default.enableNextVideoInfoOverlay()) && (isStopped && btnHideUpNext.classList.add("hide"),
            showHideUpNext(comingUpNextDisplayed = !0, currentItem)),
            self.upNextContainer._visible) && (creditsInfo = self.upNextContainer._timeRemainingTicks) && (currentTimeTicks = isStopped ? 1 : (creditsInfo - currentItem + 15e6) / creditsInfo,
            currentTimeTicks *= 100,
            currentTimeTicks = (currentTimeTicks = Math.min(currentTimeTicks, 100)).toFixed(2),
            btnPlayNextFromUpNextProgress.style.transform = "scaleX(" + currentTimeTicks + "%)")
        }
        function updatePlayPauseState(isPaused, isInitialRequest) {
            var btnPause = self.btnPause
              , title = isPaused ? (btnPause.querySelector("i").innerHTML = "&#xe037;",
            _globalize.default.translate("Play")) : (btnPause.querySelector("i").innerHTML = "&#xe034;",
            _globalize.default.translate("Pause"))
              , title = (btnPause.title = title,
            btnPause.setAttribute("aria-label", title),
            btnPause.disabled = !0 === isInitialRequest,
            self.playQueue);
            title && title.setPausedState(isPaused)
        }
        function hideButton(btn, focusedElement) {
            focusedElement = btn === focusedElement;
            btn.classList.add("hide"),
            focusedElement && focusMainOsdControls(self)
        }
        function updatePlaylistButtons(playlistIndex, playlistLength, focusedElement) {
            playlistIndex ? btnPreviousTrack.classList.remove("hide") : hideButton(btnPreviousTrack, focusedElement),
            null != playlistIndex && playlistLength && playlistIndex < playlistLength - 1 ? (self.hasNextTrack = !0,
            btnNextTrack.classList.remove("hide")) : (self.hasNextTrack = !1,
            hideButton(btnNextTrack, focusedElement))
        }
        function updateRepeatModeDisplayForButton(button, repeatMode) {
            var icon = button.querySelector("i");
            "RepeatAll" === repeatMode ? (icon.innerHTML = "&#xe040;",
            icon.classList.add("toggleButtonIcon-active"),
            button.classList.add("toggleButton-active")) : "RepeatOne" === repeatMode ? (icon.innerHTML = "&#xe041;",
            icon.classList.add("toggleButtonIcon-active"),
            button.classList.add("toggleButton-active")) : (icon.innerHTML = "&#xe040;",
            icon.classList.remove("toggleButtonIcon-active"),
            button.classList.remove("toggleButton-active"))
        }
        function updateRepeatModeDisplay(repeatMode) {
            updateRepeatModeDisplayForButton(btnRepeatModeTopRight, repeatMode),
            updateRepeatModeDisplayForButton(btnRepeatModeBottom, repeatMode)
        }
        function updateShuffleDisplayForButton(button, shuffle) {
            var icon = button.querySelector("i");
            shuffle ? (icon.classList.add("toggleButtonIcon-active"),
            button.classList.add("toggleButton-active")) : (icon.classList.remove("toggleButtonIcon-active"),
            button.classList.remove("toggleButton-active"))
        }
        function updateShuffleDisplay(shuffle) {
            updateShuffleDisplayForButton(btnShuffleTopRight, shuffle),
            updateShuffleDisplayForButton(btnShuffleBottom, shuffle)
        }
        function updateTimeDisplay(positionTicks, runtimeTicks, seekableRanges) {
            self.osdController.onPlayerTimeUpdate(positionTicks, runtimeTicks, seekableRanges);
            for (var bottomTabControllers = self.bottomTabControllers, _i14 = 0, _length14 = bottomTabControllers.length; _i14 < _length14; _i14++)
                bottomTabControllers[_i14] && bottomTabControllers[_i14].onTimeUpdate(positionTicks, runtimeTicks);
            seekableRanges = self.lyricsRenderer;
            seekableRanges && seekableRanges.onTimeUpdate(positionTicks, currentRuntimeTicks)
        }
        function setSliderValue(slider, value) {
            slider.setValue ? slider.setValue(value) : function(slider, value) {
                slider.waitForCustomElementUpgrade().then(function() {
                    slider.setValue(value)
                })
            }(slider, value)
        }
        function updatePlayerBrightnessState(player) {
            var showSlider = !_layoutmanager.default.tv && currentPlayerSupportedCommands.includes("SetBrightness");
            brightnessSlider && (showSlider ? (brightnessSliderContainer.classList.remove("hide"),
            brightnessSlider.dragging || setSliderValue(brightnessSlider, _playbackmanager.default.getBrightness(player))) : brightnessSliderContainer.classList.add("hide"))
        }
        function setMuteButtonStatus(button, isMuted, showMuteButton) {
            isMuted ? (button.setAttribute("title", _globalize.default.translate("Unmute")),
            button.querySelector("i").innerHTML = "&#xe04F;") : (button.setAttribute("title", _globalize.default.translate("Mute")),
            button.querySelector("i").innerHTML = "&#xe050;"),
            showMuteButton ? button.classList.remove("hide") : button.classList.add("hide")
        }
        function setVolumeContainerVisibility(container, slider, showVolumeSlider, volumeLevel, isMuted) {
            (showVolumeSlider = _layoutmanager.default.tv && _servicelocator.appHost.supports("physicalvolumecontrol") ? !1 : showVolumeSlider) ? container.classList.remove("osdForceHide") : container.classList.add("osdForceHide"),
            slider.dragging || setSliderValue(slider, isMuted ? 0 : volumeLevel)
        }
        function updatePlayerVolumeState(player, isMuted, volumeLevel, supportedCommands) {
            var showMuteButton = !0
              , showVolumeSlider = !0
              , supportedCommands = (supportedCommands.includes("Mute") || (showMuteButton = !1),
            supportedCommands.includes("SetVolume") || (showVolumeSlider = !1),
            setMuteButtonStatus(buttonMute, isMuted, showMuteButton),
            self.topMuteButton && setMuteButtonStatus(self.topMuteButton, isMuted, showMuteButton),
            self.nowPlayingVolumeSlider);
            supportedCommands && setVolumeContainerVisibility(videoOsdVolumeControlsBottom, supportedCommands, showVolumeSlider, volumeLevel, isMuted),
            self.topVolumeControls && setVolumeContainerVisibility(self.topVolumeControls, self.topVolumeSlider, showVolumeSlider, volumeLevel, isMuted)
        }
        function onSettingsButtonClick(e) {
            var mediaType, player = self.currentPlayer;
            player && (mediaType = self.osdController.currentItem.MediaType,
            _playersettingsmenu.default.show(Object.assign(getBaseActionSheetOptions(this, isDisplayingLocalVideo(player)), {
                player: player,
                stats: !0,
                onOption: onSettingsOption,
                mediaType: mediaType,
                speed: "Video" !== mediaType || _layoutmanager.default.tv
            })).then(self.boundShowOsdDefaultParams, self.boundShowOsdDefaultParams))
        }
        function onSettingsOption(selectedOption) {
            "stats" === selectedOption ? toggleStats(self) : "subtitleoffset" === selectedOption && showSubtitleOffset()
        }
        function showSubtitleOffset() {
            require(["subtitleOffsetOverlay"], function(SubtitleOffsetOverlay) {
                var player = self.currentPlayer;
                player && !self.subtitleOffsetOverlay && (self.subtitleOffsetOverlay = new SubtitleOffsetOverlay(Object.assign(getBaseActionSheetOptions(btnSubtitles, !0), {
                    player: player
                })),
                SubtitleOffsetOverlay = function() {
                    var _self$subtitleOffsetO;
                    null != (_self$subtitleOffsetO = self.subtitleOffsetOverlay) && _self$subtitleOffsetO.destroy(),
                    self.subtitleOffsetOverlay = null
                }
                ,
                self.subtitleOffsetOverlay.show().then(SubtitleOffsetOverlay, SubtitleOffsetOverlay))
            })
        }
        var lastPointerEvent = 0;
        function onStop() {
            _playbackmanager.default.stop(self.currentPlayer)
        }
        _dom.default.addEventListener(view, window.PointerEvent && !_dom.default.supportsPointerTypeInClickEvent() ? "pointerup" : "click", function(e) {
            var isEnoughTimeSinceLastTap, pointerType = e.pointerType || DefaultPointerType;
            "touch" === (lastPointerUpType = pointerType) ? e.target.closest("BUTTON,INPUT,.videoosd-tabcontainers,.videoosd-tabsslider") ? self.showOsd() : !(isEnoughTimeSinceLastTap = 300 < (pointerType = Date.now()) - lastPointerEvent) && "click" !== e.type || (lastPointerEvent = pointerType,
            self.currentVisibleMenu ? setTimeout(self.boundHideOsd, 10) : self.currentVisibleMenu || isEnoughTimeSinceLastTap && setTimeout(self.boundShowOsdDefaultParams, 100)) : onOsdClick(e, self, null, !0)
        }, {
            passive: !0
        }),
        _dom.default.addEventListener(view, "dblclick", function(e) {
            e.target.closest("BUTTON,input") || "mouse" === lastPointerUpType && _playbackmanager.default.toggleFullscreen(self.currentPlayer)
        }, {
            passive: !0
        }),
        _dom.default.addEventListener(buttonMute, "click", onMuteButtonClick.bind(self), {
            passive: !0
        }),
        _dom.default.addEventListener(brightnessSlider, "change", function() {
            _playbackmanager.default.setBrightness(parseFloat(this.value), self.currentPlayer),
            self.showOsd()
        }, {
            passive: !0
        }),
        _dom.default.addEventListener(brightnessSlider, "input", function() {
            _playbackmanager.default.setBrightness(parseFloat(this.value), self.currentPlayer),
            self.showOsd()
        }, {
            passive: !0
        }),
        _dom.default.addEventListener(self.nowPlayingVolumeSlider, "change", onVolumeSliderInputOrChange.bind(self), {
            passive: !0
        }),
        _dom.default.addEventListener(self.nowPlayingVolumeSlider, "input", onVolumeSliderInputOrChange.bind(self), {
            passive: !0
        }),
        self.nowPlayingPositionSlider.getBubbleHtml = function(value) {
            return self.showOsd(),
            self.osdController.getPositionBubbleHtml(value, currentRuntimeTicks)
        }
        ,
        _dom.default.addEventListener(self.osdBottomElement, transitionEndEventName, function(e) {
            var elem = e.currentTarget;
            elem === e.target && elem.classList.contains("videoOsdBottom-hidden") && (elem.classList.add("hide"),
            headerElement.classList.add("hide"),
            setBottomTabIndex(self, -1),
            onTabTransitionEnd.call(tabContainersElem, {
                target: tabContainersElem,
                currentTarget: tabContainersElem
            }),
            2 === self.currentLockState && self.setLockState(1),
            view.dispatchEvent(new CustomEvent("video-osd-hide",{
                bubbles: !0
            })))
        }, {
            passive: !0
        }),
        _dom.default.addEventListener(btnPreviousTrack, "click", function() {
            _playbackmanager.default.previousTrack(self.currentPlayer)
        }, {
            passive: !0
        });
        for (var _i15 = 0, _length15 = stopButtons.length; _i15 < _length15; _i15++)
            stopButtons[_i15].addEventListener("click", onStop);
        function onNextTrackClick() {
            _playbackmanager.default.nextTrack(self.currentPlayer)
        }
        function onRewindButtonClick() {
            rewind(self, !0)
        }
        _dom.default.addEventListener(self.btnPause, "click", function() {
            _playbackmanager.default.playPause(self.currentPlayer)
        }, {
            passive: !0
        }),
        _dom.default.addEventListener(btnNextTrack, "click", onNextTrackClick, {
            passive: !0
        });
        for (var _i16 = 0, _length16 = rewindButtons.length; _i16 < _length16; _i16++)
            _dom.default.addEventListener(rewindButtons[_i16], "click", onRewindButtonClick, {
                passive: !0
            });
        function onFastForwardButtonClick() {
            fastForward(self, !0)
        }
        for (var _i17 = 0, _length17 = fastForwardButtons.length; _i17 < _length17; _i17++)
            _dom.default.addEventListener(fastForwardButtons[_i17], "click", onFastForwardButtonClick, {
                passive: !0
            });
        function onRepeatModeClick() {
            var player;
            (player = self.currentPlayer) && _playbackmanager.default.toggleRepeatMode(player)
        }
        function onShuffleClick() {
            var player;
            (player = self.currentPlayer) && _playbackmanager.default.toggleShuffle(player)
        }
        function onMoreClick() {
            showMoreMenu(self.osdController.currentItem, this, isDisplayingLocalVideo(self.currentPlayer))
        }
        function onCloseRequestedFromTab() {
            setBottomTabIndex(self, -1)
        }
        function onTabTransitionEnd(e) {
            var elem = e.currentTarget;
            elem === e.target && elem.classList.contains("videoosd-tabcontainers-hidden") && (elem.classList.add("hide"),
            self.osdBottomElement.classList.remove("videoosd-bottom-with-opentab"),
            (e = elem.querySelector(".videoosd-activetab")) && e.classList.remove("videoosd-activetab"),
            focusMainOsdControls(self))
        }
        function setContentSection(sectionName, saveToUserSettings) {
            currentOsdContentSectionName = sectionName;
            for (var sections = view.querySelectorAll(".osdContentSection"), _i18 = 0, _length18 = sections.length; _i18 < _length18; _i18++) {
                var section = sections[_i18];
                section.getAttribute("data-contentsection") === sectionName ? section.classList.remove("hide") : section.classList.add("hide")
            }
            for (var buttons = view.querySelectorAll(".osdContentSectionToggleButton"), _i19 = 0, _length19 = buttons.length; _i19 < _length19; _i19++) {
                var button = buttons[_i19]
                  , icon = button.querySelector("i");
                button.getAttribute("data-contentsection") === sectionName ? (button.classList.add("toggleButton-active"),
                icon.classList.add("toggleButtonIcon-active")) : (button.classList.remove("toggleButton-active"),
                icon.classList.remove("toggleButtonIcon-active"))
            }
            var playQueue = self.playQueue
              , playQueue = ("playqueue" === sectionName ? playQueue && playQueue.resume({}) : playQueue && playQueue.pause(),
            self.lyricsRenderer)
              , playQueue = ("lyrics" === sectionName ? playQueue && playQueue.resume({}) : playQueue && playQueue.pause(),
            self.osdBottomElement);
            _layoutmanager.default.tv ? (sectionName && "playqueue" !== sectionName && "art" !== sectionName ? playQueue.classList.add("videoOsdBottom-split") : playQueue.classList.remove("videoOsdBottom-split"),
            sectionName && "lyrics" !== sectionName && "art" !== sectionName ? playQueue.classList.remove("videoOsdBottom-art") : playQueue.classList.add("videoOsdBottom-art")) : sectionName && "art" !== sectionName ? (playQueue.classList.add("videoOsdBottom-split"),
            playQueue.classList.remove("videoOsdBottom-art")) : (playQueue.classList.remove("videoOsdBottom-split"),
            playQueue.classList.add("videoOsdBottom-art")),
            !1 !== saveToUserSettings && _usersettings.default.osdContentSection(sectionName)
        }
        function onContentSectionToggleButtonClick(e) {
            this.classList.contains("toggleButton-active") ? setContentSection("art") : setContentSection(this.getAttribute("data-contentsection"))
        }
        function onSkipIntroClickInternal() {
            var info = currentIntroInfo
              , player = self.currentPlayer;
            info && player && (_playbackmanager.default.seek(info.end, player),
            showHideSkipIntro(!1),
            self.hideOsd())
        }
        function onLockClick() {
            var lockState = self.currentLockState;
            switch (lockState) {
            case 0:
            case 1:
                lockState++;
                break;
            default:
                lockState = 0
            }
            self.setLockState(lockState)
        }
        _dom.default.addEventListener(btnPlaybackSpeed, "click", function() {
            var player = self.currentPlayer;
            player && _playersettingsmenu.default.showSpeedMenu(Object.assign(getBaseActionSheetOptions(this, isDisplayingLocalVideo(player)), {
                player: player,
                mediaType: self.osdController.currentItem.MediaType
            })).then(self.boundShowOsdDefaultParams, self.boundShowOsdDefaultParams)
        }, {
            passive: !0
        }),
        _dom.default.addEventListener(btnRepeatModeTopRight, "click", onRepeatModeClick, {
            passive: !0
        }),
        _dom.default.addEventListener(btnRepeatModeBottom, "click", onRepeatModeClick, {
            passive: !0
        }),
        _dom.default.addEventListener(btnShuffleTopRight, "click", onShuffleClick, {
            passive: !0
        }),
        _dom.default.addEventListener(btnShuffleBottom, "click", onShuffleClick, {
            passive: !0
        }),
        _dom.default.addEventListener(btnOsdMoreBottom, "click", onMoreClick, {
            passive: !0
        }),
        _dom.default.addEventListener(btnOsdMoreTitle, "click", onMoreClick, {
            passive: !0
        }),
        _dom.default.addEventListener(btnAudio, "click", function() {
            var currentIndex, audioTracks, player = self.currentPlayer;
            player && (audioTracks = _playbackmanager.default.audioTracks(player),
            currentIndex = _playbackmanager.default.getAudioStreamIndex(player),
            audioTracks = audioTracks.map(function(stream) {
                var opt = {
                    name: stream.DisplayTitle,
                    secondaryText: stream.Title && !(stream.DisplayTitle || "").toLowerCase().includes((stream.Title || "").toLowerCase()) ? stream.Title : null,
                    id: stream.Index
                };
                return stream.Index === currentIndex && (opt.selected = !0),
                opt
            }),
            self.showOsd(),
            showActionSheet(Object.assign(getBaseActionSheetOptions(this, !0), {
                items: audioTracks,
                title: _globalize.default.translate("Audio"),
                hasItemSelectionState: !0,
                fields: ["Name", "ShortOverview"],
                noTextWrap: !1
            })).then(function(id) {
                self.showOsd();
                id = parseInt(id);
                id !== currentIndex && _playbackmanager.default.setAudioStreamIndex(id, player)
            }, self.boundShowOsdDefaultParams))
        }, {
            passive: !0
        }),
        _dom.default.addEventListener(btnSubtitles, "click", function() {
            var player = self.currentPlayer
              , streams = _playbackmanager.default.subtitleTracks(player)
              , currentIndex = _playbackmanager.default.getSubtitleStreamIndex(player)
              , subtitleIcon = (null == currentIndex && (currentIndex = -1),
            streams.unshift({
                Index: -1,
                DisplayTitle: _globalize.default.translate("Off")
            }),
            _itemmanager.default.getDefaultIcon({
                Type: "MediaStream",
                StreamType: "Subtitle"
            }))
              , menuItems = streams.map(function(stream) {
                var opt = {
                    name: stream.DisplayTitle,
                    secondaryText: stream.Title && !(stream.DisplayTitle || "").toLowerCase().includes((stream.Title || "").toLowerCase()) ? stream.Title : null,
                    id: stream.Index,
                    icon: subtitleIcon
                };
                return stream.Index === currentIndex && (opt.selected = !0),
                opt
            })
              , positionTo = this
              , currentItem = self.osdController.currentItem;
            (streams = _connectionmanager.default.getApiClient(currentItem)).getCurrentUser().then(function(user) {
                supportsSubtitleDownloading() && _itemmanager.default.canDownloadSubtitles(currentItem, user) && menuItems.push({
                    name: _globalize.default.translate("SearchForSubtitles"),
                    id: "search",
                    icon: "&#xe8B6;"
                }),
                _playbackmanager.default.getSupportedCommands(player).includes("SetSubtitleOffset") && (user = _playbackmanager.default.getSubtitleStream(player)) && ("External" === user.DeliveryMethod || "Hls" === user.DeliveryMethod) && menuItems.unshift({
                    name: _globalize.default.translate("HeaderSubtitleOffset"),
                    id: "subtitleoffset",
                    secondaryText: (user = _playbackmanager.default.getSubtitleOffset(player),
                    1e3 <= Math.abs(user) ? (user /= 1e3).toFixed(1) + " seconds" : user + " ms"),
                    icon: "&#xe01b;",
                    dividerAfter: 0 < menuItems.length
                }),
                self.showOsd(),
                showActionSheet(Object.assign(getBaseActionSheetOptions(positionTo, !0), {
                    title: _globalize.default.translate("Subtitles"),
                    items: menuItems,
                    hasItemSelectionState: !0,
                    hasItemIcon: !0,
                    fields: ["Name", "ShortOverview"],
                    noTextWrap: !1
                })).then(function(id) {
                    var item, mediaSource;
                    self.showOsd(),
                    "search" === id ? (item = currentItem,
                    mediaSource = self.osdController.currentMediaSource,
                    require(["registrationServices", "subtitleEditor"]).then(function(responses) {
                        return responses[0].validateFeature("sync").then(function() {
                            return responses[1].show({
                                item: item,
                                mediaSource: mediaSource,
                                showCurrentSubtitles: !1,
                                autoSearch: !0,
                                closeOnDownload: !0
                            }).then(function(result) {
                                self.showOsd(),
                                _playbackmanager.default.setSubtitleStreamIndex(result.NewIndex, self.currentPlayer, !0)
                            }, self.boundShowOsdDefaultParams)
                        })
                    })) : "subtitleoffset" === id ? showSubtitleOffset() : (id = parseInt(id)) !== currentIndex && _playbackmanager.default.setSubtitleStreamIndex(id, player)
                }, self.boundShowOsdDefaultParams)
            })
        }, {
            passive: !0
        }),
        self.bottomTabs.getFocusableElements = videoOsdBottomButtons.getFocusableElements = function(parent, activeElement, direction, options) {
            switch (direction) {
            case 0:
            case 1:
            case 2:
            case 3:
                return null;
            default:
                return canSetBottomTabIndex(self, 0) ? [self.bottomTabs.querySelector(".videoosd-tab-button-info")] : null
            }
        }
        ,
        self.bottomTabs.addEventListener("beforetabchange", function(e) {
            var previousPanel, index = e.detail.selectedTabIndex, e = e.detail.previousIndex, newPanel = tabContainers[index];
            null != e && ((previousPanel = tabContainers[e]) && newPanel && previousPanel.classList.remove("videoosd-activetab"),
            previousPanel = self.bottomTabControllers[e]) && previousPanel.onPause(),
            newPanel ? (function(index, forceRefresh) {
                var tabResumeOptions = getTabOnItemUpdatedData(self)
                  , bottomTabControllers = (tabResumeOptions.refresh = forceRefresh,
                5 === index ? document.documentElement.classList.add("osd-tab-guide") : document.documentElement.classList.remove("osd-tab-guide"),
                self.bottomTabControllers);
                if (bottomTabControllers[index])
                    return bottomTabControllers[index].onResume(tabResumeOptions);
                Emby.importModule(["./videoosd/infotab.js", "./videoosd/chapterstab.js", "./videoosd/peopletab.js", "./videoosd/playqueuetab.js", "./videoosd/onnowtab.js", "./videoosd/guidetab.js"][index]).then(function(ControllerFactory) {
                    ControllerFactory = new ControllerFactory(tabContainers[index]);
                    return bottomTabControllers[index] = ControllerFactory,
                    tabResumeOptions.refresh = !0,
                    _events.default.on(ControllerFactory, "closerequested", onCloseRequestedFromTab),
                    ControllerFactory.onResume(tabResumeOptions)
                })
            }(index),
            newPanel.classList.add("videoosd-activetab"),
            tabContainersElem.classList.remove("hide"),
            tabContainersElem.offsetWidth,
            tabContainersElem.classList.remove("videoosd-tabcontainers-hidden"),
            self.osdBottomElement.classList.add("videoosd-bottom-with-opentab"),
            _layoutmanager.default.tv ? btnCloseTabContent.classList.add("hide") : btnCloseTabContent.classList.remove("hide"),
            null != e && enableTabAnimation && newPanel.animate && 5 !== index && 5 !== e && (index < e ? newPanel.animate([{
                opacity: "0",
                transform: "translate3d(-" + fadeSize + ", 0, 0)",
                offset: 0
            }, {
                opacity: "1",
                transform: "none",
                offset: 1
            }], {
                duration: fadeDuration,
                iterations: 1,
                easing: "ease-out"
            }) : e < index && function(elem) {
                elem.animate([{
                    opacity: "0",
                    transform: "translate3d(" + fadeSize + ", 0, 0)",
                    offset: 0
                }, {
                    opacity: "1",
                    transform: "none",
                    offset: 1
                }], {
                    duration: fadeDuration,
                    iterations: 1,
                    easing: "ease-out"
                })
            }(newPanel))) : (tabContainersElem.classList.add("videoosd-tabcontainers-hidden"),
            btnCloseTabContent.classList.add("hide"))
        }),
        btnCloseTabContent.addEventListener("click", function() {
            setBottomTabIndex(self, -1)
        }),
        _dom.default.addEventListener(tabContainersElem, transitionEndEventName, onTabTransitionEnd, {
            passive: !0
        }),
        _inputmanager.default.on(self.bottomTabs, function(e) {
            switch (e.detail.command) {
            case "up":
                -1 !== self.bottomTabs.selectedIndex() && (setBottomTabIndex(self, -1),
                e.preventDefault(),
                e.stopPropagation(),
                self.showOsd());
                break;
            case "down":
                var btn;
                -1 === self.bottomTabs.selectedIndex() && (btn = e.target.closest(".videoosd-tab-button"),
                setBottomTabIndex(self, btn ? parseInt(btn.getAttribute("data-index")) : -1))
            }
        });
        for (var lockButtons = view.querySelectorAll(".videoOsd-btnToggleLock"), _i21 = 0, _length21 = lockButtons.length; _i21 < _length21; _i21++)
            _dom.default.addEventListener(lockButtons[_i21], "click", onLockClick, {
                passive: !0
            });
        if (_dom.default.addEventListener(btnHideUpNext, "click", function() {
            showHideUpNext(!1)
        }, {
            passive: !0
        }),
        _dom.default.addEventListener(view.querySelector(".btnPlayNextFromUpNext"), "click", onNextTrackClick, {
            passive: !0
        }),
        _dom.default.addEventListener(btnSkipIntro, "click", function() {
            if (!skipIntroValidated)
                return validateSkipIntroFeature().then(onSkipIntroClickInternal);
            onSkipIntroClickInternal()
        }, {
            passive: !0
        }),
        _dom.default.addEventListener(view.querySelector(".btnPlayQueue"), "click", onContentSectionToggleButtonClick, {
            passive: !0
        }),
        _dom.default.addEventListener(btnLyrics, "click", onContentSectionToggleButtonClick, {
            passive: !0
        }),
        _dom.default.allowBackdropFilter())
            for (var toggleButtonIcons = view.querySelectorAll(".toggleButtonIcon"), _i22 = 0, _length22 = toggleButtonIcons.length; _i22 < _length22; _i22++)
                toggleButtonIcons[_i22].classList.add("toggleButtonIcon-backdropfilter");
        for (var sections = view.querySelectorAll(".osdContentSection"), _i20 = 0, _length20 = sections.length; _i20 < _length20; _i20++) {
            var section = sections[_i20];
            _layoutmanager.default.tv && "lyrics" !== section.getAttribute("data-contentsection") || section.classList.add("osdContentSection-split"),
            _layoutmanager.default.tv && "lyrics" === section.getAttribute("data-contentsection") && section.classList.add("osdContentSection-tv-split")
        }
        _shortcuts.default.on(this.videoOsdText),
        this.boundHideOsd = this.hideOsd.bind(this),
        this.boundShowOsdDefaultParams = function() {
            this.showOsd()
        }
        .bind(this),
        this.boundOnOsdHideTimeout = function() {
            _focusmanager.default.hasExclusiveFocusScope() || 0 <= this.bottomTabs.selectedIndex() ? startOsdHideTimer(this) : this.mouseOverButton || this.nowPlayingPositionSlider.dragging || this.nowPlayingVolumeSlider.dragging || this.hideOsd()
        }
        .bind(this)
    }
    function destroyOsdResizeObserver(instance) {
        instance._resizeObserver && (instance._resizeObserver.disconnect(),
        instance._resizeObserver = null)
    }
    Object.assign(VideoOsd.prototype, _baseview.default.prototype),
    VideoOsd.prototype.enableWindowInputCommands = function() {
        return !0
    }
    ,
    VideoOsd.prototype.onWindowInputCommand = function(e) {
        var mediaType;
        switch (e.detail.command) {
        case "back":
            var upNextContainer = e.target.closest(".upNextContainer");
            return upNextContainer ? (e.preventDefault(),
            void upNextContainer.querySelector(".btnHideUpNext").click()) : void (!_layoutmanager.default.tv || _focusmanager.default.hasExclusiveFocusScope() || (upNextContainer = null == (upNextContainer = e.detail.originalEvent) ? void 0 : upNextContainer.target) && headerElement.contains(upNextContainer) || (isDisplayingLocalVideo(this.currentPlayer) ? this.currentVisibleMenu && !this.upNextContainer._visible && (e.preventDefault(),
            this.hideOsd()) : !this.currentVisibleMenu && (upNextContainer = this.currentPlayer) && upNextContainer.isLocalPlayer && (mediaType || _playbackmanager.default.isPlaying(upNextContainer)) && (e.preventDefault(),
            this.showOsd())));
        case "left":
            return e.target.closest(".skipIntroContainer,.upNextContainer") ? void 0 : void ("rtl" === document.dir ? onFastForwardInputCommand : onRewindInputCommand)(e, this);
        case "rewind":
            return e.preventDefault(),
            void onRewindInputCommand(e, this);
        case "right":
            return e.target.closest(".skipIntroContainer,.upNextContainer") ? void 0 : void ("rtl" === document.dir ? onRewindInputCommand : onFastForwardInputCommand)(e, this);
        case "fastforward":
            return e.preventDefault(),
            void onFastForwardInputCommand(e, this);
        case "pageup":
            return void _playbackmanager.default.nextChapter(this.currentPlayer);
        case "pagedown":
            return void _playbackmanager.default.previousChapter(this.currentPlayer);
        case "playpause":
            e.preventDefault(),
            e.stopPropagation();
            var isPaused = null == (upNextContainer = this.currentPlayer) ? void 0 : upNextContainer.paused();
            return _playbackmanager.default.playPause(this.currentPlayer),
            void ((this.currentVisibleMenu || shouldOsdBeShown(this) && !isPaused) && this.showOsd());
        case "play":
            e.preventDefault(),
            e.stopPropagation();
            isPaused = null == (isPaused = this.currentPlayer) ? void 0 : isPaused.paused();
            return _playbackmanager.default.unpause(this.currentPlayer),
            void ((this.currentVisibleMenu || shouldOsdBeShown(this) && !isPaused) && this.showOsd());
        case "select":
            return void (onOsdClick(e, this, null, shouldOsdBeShown(this)) && e.preventDefault());
        case "up":
            return this.currentVisibleMenu,
            this.currentVisibleMenu,
            void (shouldOsdBeShown(this) && this.showOsd());
        case "down":
            return void (shouldOsdBeShown(this) && (this.currentVisibleMenu || e.preventDefault(),
            this.showOsd()));
        case "menu":
        case "pause":
        case "nowplaying":
            return void (shouldOsdBeShown(this) && this.showOsd());
        case "record":
            return shouldOsdBeShown(this) && this.showOsd(),
            void function(instance) {
                (instance = instance.btnRecord).classList.contains("hide") || instance.click()
            }(this);
        case "togglestats":
            return void toggleStats(this);
        case "movies":
        case "music":
        case "tv":
        case "settings":
        case "search":
        case "favorites":
            return void e.preventDefault();
        case "info":
            return setBottomTabIndex(this, 0),
            void e.preventDefault();
        case "livetv":
            return setBottomTabIndex(this, 4),
            void e.preventDefault();
        case "guide":
            return setBottomTabIndex(this, 5),
            void e.preventDefault()
        }
        _baseview.default.prototype.onWindowInputCommand.apply(this, arguments)
    }
    ,
    VideoOsd.prototype.setLockState = function(lockState) {
        ((this.currentLockState = lockState) ? (headerElement.classList.add("videoOsdHeader-locked"),
        this.osdBottomElement.classList.add("videoosd-bottom-locked"),
        this.view.querySelector(".videoOsdUnlockControls").classList.remove("hide"),
        1 === lockState ? (this.view.querySelector(".videoOsd-btnUnlock1").classList.remove("hide"),
        this.view.querySelector(".videoOsd-btnUnlock2").classList.add("hide")) : (this.view.querySelector(".videoOsd-btnUnlock1").classList.add("hide"),
        this.view.querySelector(".videoOsd-btnUnlock2").classList.remove("hide")),
        lockOrientation) : (headerElement.classList.remove("videoOsdHeader-locked"),
        this.osdBottomElement.classList.remove("videoosd-bottom-locked"),
        this.view.querySelector(".videoOsdUnlockControls").classList.add("hide"),
        this.view.querySelector(".videoOsd-btnUnlock1").classList.add("hide"),
        this.view.querySelector(".videoOsd-btnUnlock2").classList.add("hide"),
        unlockOrientation))()
    }
    ,
    VideoOsd.prototype.showOsd = function(timeoutMs, elementToFocus) {
        this.paused || (headerElement.classList.remove("hide"),
        headerElement.offsetWidth,
        headerElement.classList.remove("videoOsdHeader-hidden"),
        function(instance, elementToFocus) {
            var elem;
            instance.currentVisibleMenu || (elem = instance.osdBottomElement,
            instance.currentVisibleMenu = "osd",
            elem.classList.remove("hide"),
            elem.offsetWidth,
            elem.classList.remove("videoOsdBottom-hidden"),
            _focusmanager.default.hasExclusiveFocusScope() || (elementToFocus ? (console.log("showMainOsdControls - focus elementToFocus"),
            _focusmanager.default.focus(elementToFocus)) : focusMainOsdControls(instance)),
            instance.view.dispatchEvent(new CustomEvent("video-osd-show",{
                bubbles: !0
            })))
        }(this, elementToFocus),
        startOsdHideTimer(this, timeoutMs))
    }
    ,
    VideoOsd.prototype.hideOsd = function() {
        var instance, elem;
        isDisplayingLocalVideo(this.currentPlayer) && (headerElement.classList.add("videoOsdHeader-hidden"),
        (instance = this).currentVisibleMenu && ((elem = instance.osdBottomElement).offsetWidth,
        elem.classList.add("videoOsdBottom-hidden"),
        instance.currentVisibleMenu = null),
        elem = this.lyricsRenderer) && !elem.paused && _layoutmanager.default.tv && elem.focus()
    }
    ,
    VideoOsd.prototype.exit = function() {
        _approuter.default.back()
    }
    ,
    VideoOsd.prototype.onResume = function(options) {
        _baseview.default.prototype.onResume.apply(this, arguments),
        headerElement.classList.add("videoOsdHeader"),
        (elem = (instance = this).headerRightContainer) || (instance.headerRightContainer = elem = document.createElement("div"),
        elem.className = "hide headerSectionItem",
        elem.innerHTML = "",
        headerRight.insertBefore(elem, headerRight.firstElementChild),
        elem.innerHTML = '\n                <div class="videoOsdVolumeControls videoOsdVolumeControls-top hide osdForceHide videoOsd-hideWhenLocked flex flex-direction-row align-items-center hide-mouse-idle-tv">\n                    <button is="paper-icon-button-light" tabindex="-1" class="osdIconButton buttonMute flex-shrink-zero" title="Mute" aria-label="Mute" style="margin:0;">\n                        <i class="md-icon md-icon-fill osdIconButton-icon">&#xe050;</i>\n                    </button>\n\n                    <div class="videoOsdVolumeSliderWrapper videoOsdVolumeSliderWrapper-top flex-grow">\n                        <div class="sliderContainer flex-grow">\n                            <input is="emby-slider" data-bubble="false" type="range" step="1" min="0" max="100" value="0" class="videoOsdVolumeSlider" tabindex="-1" data-hoverthumb="true" />\n                        </div>\n                    </div>\n                </div>\n    ',
        instance.topVolumeControls = elem.querySelector(".videoOsdVolumeControls"),
        instance.topVolumeSlider = elem.querySelector(".videoOsdVolumeSlider"),
        instance.topMuteButton = elem.querySelector(".buttonMute"),
        instance.topMuteButton.addEventListener("click", onMuteButtonClick.bind(instance)),
        _dom.default.addEventListener(instance.topVolumeSlider, "change", onVolumeSliderInputOrChange.bind(instance), {
            passive: !0
        }),
        _dom.default.addEventListener(instance.topVolumeSlider, "input", onVolumeSliderInputOrChange.bind(instance), {
            passive: !0
        })),
        elem.classList.remove("hide");
        var instance = (instance = this.boundOnPlayerChange) || (this.boundOnPlayerChange = function(e, player) {
            this.bindToPlayer(player),
            setBottomTabIndex(this, -1)
        }
        .bind(this))
          , elem = (_events.default.on(_playbackmanager.default, "playerchange", instance),
        this.bindToPlayer(_playbackmanager.default.getCurrentPlayer(), !0),
        this.currentPlayer)
          , elem = (elem && !options.refresh && (isLocalVideo = isDisplayingLocalVideo(elem, instance = null == (instance = this.osdController.currentItem) ? void 0 : instance.MediaType),
        this.updateTransparency(elem, this.lastPlayerState || {}, instance, isLocalVideo)),
        this.view)
          , instance = (instance = this.boundPointerMove) || (this.boundPointerMove = function(e) {
            var eventX, obj;
            "touch" !== (e.pointerType || DefaultPointerType) && (eventX = e.screenX || 0,
            e = e.screenY || 0,
            (obj = this.lastPointerMoveData) ? Math.abs(eventX - obj.x) < 10 && Math.abs(e - obj.y) < 10 || (obj.x = eventX,
            obj.y = e,
            this.showOsd()) : (this.lastPointerMoveData = {
                x: eventX,
                y: e
            },
            this.showOsd()))
        }
        .bind(this));
        _dom.default.addEventListener(document, window.PointerEvent ? "pointermove" : "mousemove", instance, {
            passive: !0
        });
        var isLocalVideo = (isLocalVideo = this.boundPointerEnter) || (this.boundPointerEnter = function(e) {
            "touch" !== (e.pointerType || DefaultPointerType) && (this.mouseOverButton = null != e.target.closest("button,input,a"))
        }
        .bind(this));
        _dom.default.addEventListener(elem, window.PointerEvent ? "pointerenter" : "mouseenter", isLocalVideo, {
            passive: !0,
            capture: !0
        });
        instance = (instance = this.boundPointerLeave) || (this.boundPointerLeave = function(e) {
            this.mouseOverButton = null
        }
        .bind(this));
        _dom.default.addEventListener(elem, window.PointerEvent ? "pointerleave" : "mouseleave", instance, {
            passive: !0,
            capture: !0
        }),
        function(view) {
            var activeElement = document.activeElement;
            if (activeElement && !view.contains(activeElement))
                try {
                    activeElement.blur()
                } catch (err) {
                    console.log("Error blurring element from previous view: " + err)
                }
        }(elem);
        isLocalVideo = (isLocalVideo = this.boundWindowKeyDown) || (this.boundWindowKeyDown = function(e) {
            var key = _keyboard.default.normalizeKeyFromEvent(e)
              , target = e.target;
            switch (key) {
            case "Enter":
            case " ":
                return _focusmanager.default.hasExclusiveFocusScope() || this.currentVisibleMenu && !target.closest(".videoOsdPositionSlider") && (this.showOsd(),
                "Enter" === key) ? void 0 : void (target.closest("BUTTON") || e.repeat || this.nowPlayingPositionSlider.dragging || (_playbackmanager.default.playPause(this.currentPlayer),
                shouldOsdBeShown(this) && setTimeout(this.boundShowOsdDefaultParams, 100),
                _browser.default.edge && (e.preventDefault(),
                e.stopPropagation())));
            case "b":
            case "B":
                if (!_focusmanager.default.hasExclusiveFocusScope() && e.ctrlKey)
                    return e.shiftKey ? (e.preventDefault(),
                    void rewind(this)) : (e.preventDefault(),
                    void _playbackmanager.default.previousChapter(this.currentPlayer));
                break;
            case "f":
            case "F":
                if (!_focusmanager.default.hasExclusiveFocusScope()) {
                    if (e.ctrlKey)
                        return e.shiftKey ? (e.preventDefault(),
                        void fastForward(this)) : (e.preventDefault(),
                        void _playbackmanager.default.nextChapter(this.currentPlayer));
                    _playbackmanager.default.toggleFullscreen(this.currentPlayer)
                }
                break;
            case "m":
            case "M":
                _focusmanager.default.hasExclusiveFocusScope() || _playbackmanager.default.toggleMute(this.currentPlayer)
            }
        }
        .bind(this));
        _dom.default.addEventListener(window, "keydown", isLocalVideo, {}),
        _mouse.default.requestMouseListening("videoosd")
    }
    ,
    VideoOsd.prototype.onPause = function(options) {
        _baseview.default.prototype.onPause.apply(this, arguments),
        destroyOsdResizeObserver(this);
        for (var statsOverlay = this.statsOverlay, statsOverlay = (statsOverlay && statsOverlay.enabled(!1),
        destroySubtitleOffsetOverlay(this),
        this.boundWindowKeyDown), _instance$headerRight = (statsOverlay && _dom.default.removeEventListener(window, "keydown", statsOverlay, {}),
        null != (_instance$headerRight = (statsOverlay = this).headerRightContainer) && _instance$headerRight.remove(),
        statsOverlay.headerRightContainer = null,
        statsOverlay.topVolumeControls = null,
        statsOverlay.topVolumeSlider = null,
        statsOverlay.topMuteButton = null,
        headerElement.classList.remove("videoOsdHeader", "videoosd-header-safe", "videoOsdHeader-hidden", "videoOsdHeader-locked", "hide", "videoOsd-customFont-remotecontrol"),
        backdropContainer.classList.remove("nowplaying-backdropcontainer-blur", "nowplaying-backdropcontainer-blur-high", "nowplaying-backdropcontainer-blur-extrasaturation", "nowplaying-backdropcontainer-blur-backdropfilter"),
        backgroundContainer.classList.remove("nowplaying-backgroundcontainer-blur", "nowplaying-backgroundcontainer-brighter", "nowplaying-backgroundcontainer-blur-backdropfilter"),
        clearBlurFromDocumentElement(),
        this.boundPointerMove), statsOverlay = (_instance$headerRight && _dom.default.removeEventListener(document, window.PointerEvent ? "pointermove" : "mousemove", _instance$headerRight, {
            passive: !0
        }),
        this.boundOnPlayerChange), bottomTabControllers = (statsOverlay && _events.default.off(_playbackmanager.default, "playerchange", statsOverlay),
        this.bottomTabControllers), i = 0, length = bottomTabControllers.length; i < length; i++) {
            var controller = bottomTabControllers[i];
            controller && controller.onPause()
        }
        this.enableStopOnBack && "true" !== (null == (_instance$headerRight = options.newViewInfo) || null == (_instance$headerRight = _instance$headerRight.params) ? void 0 : _instance$headerRight.asDialog) && (document.documentElement.classList.remove("osd-tab-guide"),
        this.enableStopOnBack = !1,
        this.enableBackOnStop = !1,
        null != (statsOverlay = this.currentPlayer) && statsOverlay.isLocalPlayer && _usersettings.default.enableVideoUnderUI() ? _approuter.default.setTransparency("backdrop") : _playbackmanager.default.stop(statsOverlay)),
        this.releaseCurrentPlayer(),
        _mouse.default.releaseMouseListening("videoosd"),
        stopOsdHideTimer(this),
        _backdrop.default.clear(),
        this.setLockState(0),
        unlockOrientation(),
        setSystemUIHidden(!1)
    }
    ,
    VideoOsd.prototype.destroy = function() {
        _baseview.default.prototype.destroy.apply(this, arguments);
        var videoOsdText = this.videoOsdText
          , videoOsdText = (videoOsdText && (_shortcuts.default.off(videoOsdText),
        this.videoOsdText = null),
        destroyPlayQueue(this),
        destroyLyricsRenderer(this),
        this.recordingButtonManager)
          , bottomTabControllers = (videoOsdText && (videoOsdText.destroy(),
        this.recordingButtonManager = null),
        destroyStats(this),
        destroySubtitleOffsetOverlay(this),
        this.osdController && (this.osdController.destroy(),
        this.osdController = null),
        this.bottomTabControllers);
        if (bottomTabControllers) {
            for (var i = 0, length = bottomTabControllers.length; i < length; i++)
                bottomTabControllers[i] && bottomTabControllers[i].destroy();
            this.bottomTabControllers = null
        }
        this.boundPointerMove = null,
        this.boundWindowKeyDown = null,
        this.boundInputCommand = null,
        this.boundHideOsd = null,
        this.boundShowOsdDefaultParams = null,
        this.boundOnOsdHideTimeout = null,
        this.boundOnPlayerChange = null,
        this.upNextContainer = null,
        this.lastPlayerState = null
    }
    ;
    _exports.default = VideoOsd
});