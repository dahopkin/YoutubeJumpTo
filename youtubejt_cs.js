
var currentTabURL = window.location.href;
var getYoutubeVideoIDFromURL = function (url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return undefined;
    }
};

var getNetflixVideoIDFromURL = function (url) {
    var regExp = /^.*(netflix\.com\/watch\/)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 8) {
        return match[2];
    } else {
        return undefined;
    }
};


var getVideoPlayerButtonFunctionObject = function (videoObject) {
    var seekToTime = videoObject.seekToTime;
    var getVideoDuration = videoObject.getVideoDuration;
    var getCurrentTime = videoObject.getCurrentTime;
    var rewind = videoObject.rewind;
    var fastForward = videoObject.fastForward;
    var play = videoObject.play;
    var pause = videoObject.pause;
    var isPlaying = videoObject.isPlaying;
    var goTo1_4thPoint = function () { videoObject.seekToPercentage((1 / 4)); };
    var goTo2_4thPoint = function () { videoObject.seekToPercentage((2 / 4)); };
    var goTo3_4thPoint = function () { videoObject.seekToPercentage((3 / 4)); };
    var goTo30Point = function () { videoObject.seekToSecondsBeforeEnd(30); };
    return {
        goTo1_4thPoint: goTo1_4thPoint,
        goTo2_4thPoint: goTo2_4thPoint,
        goTo3_4thPoint: goTo3_4thPoint,
        goTo30Point: goTo30Point,
        seekToTime: seekToTime,
        getVideoDuration: getVideoDuration,
        getCurrentTime: getCurrentTime,
        rewind:rewind,
        fastForward:fastForward,
        play:play,
        pause:pause,
        isPlaying:isPlaying
    };
};
var pageHasHTML5Video = function(){return typeof(document.getElementsByTagName("video")[0]) !== 'undefined';}
var getHtml5VideoObject = function (videoDomElement) {
    var innerPlayer = videoDomElement || document.getElementsByTagName("video")[0];
    var getVideoDuration = function () { return Number(innerPlayer.duration); };
    var seekToTime = function (seconds) { innerPlayer.currentTime = seconds; };
    var getCurrentTime = function(){return innerPlayer.currentTime; };
    var seekToPercentage = function(percentage){ seekToTime(getVideoDuration() * percentage); };
    var seekToSecondsBeforeEnd = function (seconds) {
        if (getVideoDuration() > seconds) {
            seekToTime(getVideoDuration() - seconds);
        }
    };
    var rewind = function(seconds){
        var rewindTime = getCurrentTime() - seconds;
        if(rewindTime > 0) seekToTime(rewindTime);
    };
    var fastForward = function(seconds){
        var fastForwardTime = getCurrentTime() + seconds;
        if(fastForwardTime < getVideoDuration()) seekToTime(fastForwardTime);
    };
    var play = function(){innerPlayer.play();};
    var pause = function(){innerPlayer.pause();};
    var isPlaying = function(){ return !innerPlayer.paused;}
    return {
        seekToTime: seekToTime,
        getVideoDuration: getVideoDuration,
        getCurrentTime:getCurrentTime,
        seekToPercentage:seekToPercentage,
        seekToSecondsBeforeEnd:seekToSecondsBeforeEnd,
        rewind:rewind,
        fastForward:fastForward,
        play:play,
        pause:pause,
        isPlaying:isPlaying
    };
};
var html5VideoObject = getHtml5VideoObject();

var html5VideoPlayer = function () {
    return getVideoPlayerButtonFunctionObject(html5VideoObject);
}();
var pageHasFlashVideo = function(){return typeof(document.getElementById("movie_player")) !== 'undefined';}
var flashVideoObject = function () {
    var innerPlayer = document.getElementById("movie_player");
    var getVideoDuration = function () { return Number(innerPlayer.getDuration()); };
    var seekToTime = function (seconds) { innerPlayer.seekTo(seconds); };
    var getCurrentTime = function(){ return innerPlayer.getCurrentTime(); };
    var seekToPercentage = function(percentage){ seekToTime(getVideoDuration() * percentage); };
    var seekToSecondsBeforeEnd = function (seconds) {
        if (getVideoDuration() > seconds) {
            seekToTime(getVideoDuration() - seconds);
        }
    };
    var rewind = function(seconds){
        var rewindTime = getCurrentTime() - seconds;
        if(rewindTime > 0) seekToTime(rewindTime);
    };
    var fastForward = function(seconds){
        var fastForwardTime = getCurrentTime() + seconds;
        if(fastForwardTime < getVideoDuration()) seekToTime(fastForwardTime);
    };
    var play = function(){innerPlayer.playVideo();};
    var pause = function(){innerPlayer.pauseVideo();};
    var isPlaying = function(){
        var playerStatePlaying = 1;
        return innerPlayer.getPlayerState() == playerStatePlaying;
    }
    return {
        seekToTime: seekToTime,
        getVideoDuration: getVideoDuration,
        getCurrentTime:getCurrentTime,
        seekToPercentage:seekToPercentage,
        seekToSecondsBeforeEnd:seekToSecondsBeforeEnd,
        rewind:rewind,
        fastForward:fastForward,
        play:play,
        pause:pause,
        isPlaying:isPlaying
    };
}();

var flashVideoPlayer = function () {
    return getVideoPlayerButtonFunctionObject(flashVideoObject);
}();

var netflixVideoObject = function () {
    var innerPlayer = function () {
        var tempPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
        var playerSessionId = tempPlayer.getAllPlayerSessionIds()[0];
        var player = tempPlayer.getVideoPlayerBySessionId(playerSessionId);
        return player;
    };
    var getVideoDuration = function () { return Number(innerPlayer().getDuration()/1000); };
    var seekToTime = function (seconds) { innerPlayer().seek(seconds*1000); };
    var getCurrentTime = function(){ return innerPlayer().getCurrentTime()/1000; };
    var seekToPercentage = function(percentage){ seekToTime(getVideoDuration() * percentage); };
    var seekToSecondsBeforeEnd = function (seconds) {
        var milliseconds = seconds * 1000;
        if (getVideoDuration() > milliseconds) {
            seekToTime(getVideoDuration() - milliseconds);
        }
    };
    var rewind = function(seconds){
        var rewindTime = getCurrentTime() - seconds;
        if(rewindTime > 0) seekToTime(rewindTime);
    };
    var fastForward = function(seconds){
        var fastForwardTime = getCurrentTime() + seconds;
        if(fastForwardTime < getVideoDuration()) seekToTime(fastForwardTime);
    };
    var play = function(){innerPlayer.play();};
    var pause = function(){innerPlayer.pause();};
    var isPlaying = function(){ return !innerPlayer.getPaused() }
    return {
        seekToTime: seekToTime,
        getVideoDuration: getVideoDuration,
        getCurrentTime:getCurrentTime,
        seekToPercentage:seekToPercentage,
        seekToSecondsBeforeEnd:seekToSecondsBeforeEnd,
        rewind:rewind,
        fastForward:fastForward,
        play:play,
        pause:pause,
        isPlaying:isPlaying
    };
}();
var netflixVideoPlayer = function () {
    return getVideoPlayerButtonFunctionObject(netflixVideoObject);
}();


var huluVideoObject = getHtml5VideoObject(document.getElementById("content-video-player"));
var huluVideoPlayer = function () { return getVideoPlayerButtonFunctionObject(huluVideoObject);}();

var getURLIDSourceSettingsObject = function(urlRegex, urlIDLength, urlRegexMatchNumber, bookmarkPrefix){
    return{
        urlRegex: urlRegex,
        urlIDLength: urlIDLength,
        urlRegexMatchNumber: urlRegexMatchNumber,
        bookmarkPrefix:bookmarkPrefix
    }
};
/*
settings:
-urlRegex - regex to use on url for matching.
-urlIDLength - length of the id within the URL.
-urlRegexMatchNumber - regex match index number to return if valid
 as the ID when the matching happens.
-bookmarkPrefix - prefix for the bookmark key.
*/
var getURLIDSource = function(settings){
    var getVideoIDFromURL = function (url) {
        url = url || currentTabURL;
        var regExp = settings.urlRegex;
        var match = url.match(regExp);
        if (match && match[settings.urlRegexMatchNumber].length == settings.urlIDLength) {
            return match[settings.urlRegexMatchNumber];
        } else {
            return undefined;
        }
    };
    var pageMatches = function(){
        return typeof getVideoIDFromURL(currentTabURL) !== "undefined";
    };
    var getBookmarkKey = function(videoID){
        var videoID = videoID || getVideoIDFromURL(currentTabURL);
        return settings.bookmarkPrefix+"-" + videoID.toString() +  "-bookmarks";
    };
    return{
        pageMatches:pageMatches,
        getBookmarkKey:getBookmarkKey,
        getVideoID:getYoutubeVideoIDFromURL
    };
};
var youtubeIDSource = getURLIDSource(
    getURLIDSourceSettingsObject(
        /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
        11, 2, "youtube"
    )
);
var netflixIDSource = getURLIDSource(
    getURLIDSourceSettingsObject(
        /^.*(netflix\.com\/watch\/)([^#\&\?]*).*/,
        8, 2, "netflix"
    )
);
var huluIDSource = getURLIDSource(
    getURLIDSourceSettingsObject(
        /^.*(hulu\.com\/watch\/)([^#\&\?]*).*/,
        6, 2, "hulu"
    )
);
var getIdSource = function(){
    var potentialIDSources = [youtubeIDSource, netflixIDSource, huluIDSource]
    for(var i=0; i < potentialIDSources.length; i++){
        if(potentialIDSources[i].pageMatches()) return potentialIDSources[i];
    }
}
var youtubeVideoPlayer = function(){
    if(pageHasHTML5Video()) return html5VideoPlayer;
    if(pageHasFlashVideo()) return flashVideoPlayer;
}();
var getVideoPlayer = function () { 
    var potentialIDSources = [youtubeIDSource, netflixIDSource, huluIDSource];
    var potentialPlayers = [youtubeVideoPlayer, netflixVideoPlayer, huluVideoPlayer];
    for(var i=0; i < potentialIDSources.length; i++){
        if(potentialIDSources[i].pageMatches()) return potentialPlayers[i];
    }
}
var appInfo;
var getMultipleDataAndSend = function(sendResponse){
    bookmarks.getBookmarkData(function(bookmarkData){
        var appData = {
            "binarySearchStatusInfo":binarySearcher.getBinarySearchStatus(),
            "bookmarkInfo":bookmarkData,
            "isPlaying":videoPlayer.isPlaying()
        };
        sendResponse(appData);
    });
}
var setAppInfo = function(appInfoCallback){
    bookmarks.getBookmarkData(function(bookmarkData){
        appInfo = {
            "binarySearchStatusInfo":binarySearcher.getBinarySearchStatus(),
            "bookmarkInfo":bookmarkData,
            "isPlaying":videoPlayer.isPlaying()
        };
        appInfoCallback(appInfo);
    });
}
var videoPlayer, idSource, binarySearcher, bookmarks;
var embedUIOnPage = function (functionToRunAfter) {
    $.get(chrome.runtime.getURL('ui-inject.html'), function(data) {
        var html = $.parseHTML(data);
        $("#info").prepend(html);
        functionToRunAfter();
    });
};
function initializeVariables(callback){
    videoPlayer = getVideoPlayer();
    idSource = getIdSource();
    binarySearcher = getBinarySearcher(videoPlayer);
    bookmarks = getBookmarksModule(videoPlayer, idSource);
    callback()
}
function initialize() {
    chrome.runtime.sendMessage({ action: "show" });
    videoPlayer = getVideoPlayer();
    idSource = getIdSource();
    binarySearcher = getBinarySearcher(videoPlayer);
    bookmarks = getBookmarksModule(videoPlayer, idSource);
    embedUIOnPage(function () {
        setAppInfo(setPageDom);
    });
}
function waitForElementToDisplay(selector, time, functionToRun) {
    if(document.querySelector(selector)!=null) {
        functionToRun();
        return;
    }
    else {
        setTimeout(function() {
            waitForElementToDisplay(selector, time, functionToRun);
        }, time);
    }
}
$(window).on("load", function() { 
    waitForElementToDisplay("#info", 500, initialize);
});
function setPageDom(newAppInfo){
    appInfo = newAppInfo || appInfo;
    setBinarySearchDom(appInfo.binarySearchStatusInfo);
    setBookmarkDom(appInfo.bookmarkInfo);
    setPlayButton(appInfo.isPlaying);
}
function setPlayButton(isPlaying){
    if(isPlaying){
        $("#playOrPause").val("Pause").removeClass("btn-red").addClass("btn-red-inverse");
    } else{
        $("#playOrPause").val("Play").removeClass("btn-red-inverse").addClass("btn-red");
    }
};
function setBinarySearchDom(binarySearchStatusInfo){
    if(binarySearchStatusInfo){
        if(binarySearchStatusInfo.isRunning){
            $("#startOrStop").val("Stop").removeClass("btn-red").addClass("btn-red-inverse");
            $("#goLeft, #goRight").prop("disabled",false).removeClass("btn-disabled");
        } else{
            $("#startOrStop").val("Start").removeClass("btn-red-inverse").addClass("btn-red");
            $("#goLeft, #goRight").prop("disabled",true).addClass("btn-disabled");
        }
    }
    
}

function getTableContentsFromBookmarks(bookmarkInfo){
    var currentBookmark, html, time, formattedTime, description;
    html = "";
    for (var i = 0; i < bookmarkInfo.length; i++) {
        currentBookmark = bookmarkInfo[i];
        if(i === 0){
            html += "<tr><th>Time (hh:mm:ss)</th><th>Description</th><th>Actions</th><tr>";    
        }
        time = currentBookmark.time;
        description = currentBookmark.description == "" ? "No Description" : currentBookmark.description;
        formattedTime = hhmmss(currentBookmark.time);
        html += `<tr>
        <td><a class='time-link' data-time='${time}'>${formattedTime}</a></td>
        <td><span class='description' data-time='${time}'>${description}</span></td>
        <td><button data-time='${time}' class='edit-button btn btn-small btn-primary'>Edit</button></td>
        <td><button data-time='${time}' class='delete-button btn btn-small btn-primary'>Delete</button></td>
        <tr>`;
        //Do something
    }
    return html;
}
function setBookmarkDom(bookmarkInfo){
    $('#description').val("");
    $('#time').text('');
    $('#bookmark-table').html(getTableContentsFromBookmarks(bookmarkInfo));
}
function resetDataForNewPage(){
    binarySearcher.reset();
    setAppInfo(setPageDom);
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (currentTabURL != request.data.url) {
        currentTabURL = request.data.url;
        resetDataForNewPage();
    }
});