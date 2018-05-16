
$(function () {
    let getTimeLink = function(videoIDKey, time){
        let timeAddString = "?t=" + hhmmssformal(time);
        return `https://youtu.be/${videoIDKey}${timeAddString}`;
    }
    $(document).on("click.percentage", ".percentage-button", function(e){
        e.preventDefault();
        var percentage = $(this).data("percentage");
        videoPlayer.seekToPercentage(percentage);
        setAppInfo(setPageDom);
    });
    $(document).on("click.beforeend", '.before-end-button', function (e) {
        e.preventDefault();
        var secondsBeforeEnd = $(this).data("secondsbeforeend");
        videoPlayer.seekToSecondsBeforeEnd(secondsBeforeEnd);
        setAppInfo(setPageDom);
    });
    
    $(document).on("click.startstop", '#startOrStop',function () {
        binarySearcher.startOrStop();
        setAppInfo(setPageDom);
    });
    $(document).on("click.goleft", '#goLeft',function () {
        binarySearcher.goLeft();
        setAppInfo(setPageDom);
    });
    
    $(document).on("click.goright", '#goRight',function () {
        binarySearcher.goRight();
        setAppInfo(setPageDom);
    });
    $(document).on("click.undo", '#undo',function () {
        binarySearcher.undoLastStep();
        setAppInfo(setPageDom);
    });
    $(document).on("click.send", ".time-link", function(e){
        e.preventDefault();
        var time = $(this).data("time");
        videoPlayer.seekToTime(time);
        setAppInfo(setPageDom);
    });
    $(document).on("click.showdelete", ".show-delete-button", function(e){
        e.preventDefault();
        var time = $(this).data("time");
        let deletePopup = getDeletePopup("#delete-panel", $(this).closest(".bookmark-row"));
        deletePopup.setTime(time);
        deletePopup.show();
    });
    var getShareLinkPopup = function(selector, $jQpositionElement){
        let $wholeUI = $(".yjt-html");
        let $positionElement = $jQpositionElement;
        let $mainEl = $(selector);
        let $closeButton = $mainEl.find("#share-close-button");
        let $linkTextBox = $mainEl.find(".share-link-text");
        let link = "";
        let setLink = function(newLink){
            link = newLink;
            $linkTextBox.val(link);
        }
        //set the position below the bookmark row where the initial button was clicked.
        let setPopupPosition = function(){
            let mainUIOffset = $wholeUI.offset();
            let positionTop = $positionElement.offset().top - mainUIOffset.top + 25;
            let positionLeft = $positionElement.offset().left - mainUIOffset.left;
            $mainEl.css({top:positionTop, left:positionLeft});
        };
        let stopPropagation = function(e){ e.stopPropagation();}
        let bindEvents = function(){
            $closeButton.on("click.close", hide);
            $(document).on("click.showshare", "html", hide);
            $(document).on("click.showshareblock", selector, stopPropagation);
        }
        let unbindEvents = function(){
            $closeButton.off("click.close", hide);
            $(document).off("click.showshare", "html", hide);
            $(document).off("click.showshareblock", selector, stopPropagation);
        }
        let show = function(){
            $mainEl.removeClass(hiddenClass);
            bindEvents()
        }
        let hide = function(e){
            e.preventDefault();
            $mainEl.addClass(hiddenClass);
            unbindEvents();
        }
        let init = function(){
            setPopupPosition();
        }
        init();
        return{setLink:setLink, show:show};

    };
    var getDeletePopup = function(selector, $jQpositionElement){
        let $wholeUI = $(".yjt-html");
        let $positionElement = $jQpositionElement;
        let $mainEl = $(selector);
        let $closeButton = $mainEl.find(".delete-close-button");
        let $deleteButton = $mainEl.find("#delete-button");
        let time = 0;
        let setTime = function(newTime){
            time = newTime;
            $deleteButton.attr("data-time", time);
        }
        let deleteBookmark = function(e){
            e.preventDefault();
            bookmarks.deleteBookmark(time, function(saveResult){
                setAppInfo(setPageDom);
                hide(e);
            });
        }
        //set the position below the bookmark row where the initial button was clicked.
        let setPopupPosition = function(){
            let mainUIOffset = $wholeUI.offset();
            let positionTop = $positionElement.offset().top - mainUIOffset.top + 25;
            let positionLeft = $positionElement.offset().left - mainUIOffset.left;
            $mainEl.css({top:positionTop, left:positionLeft});
        };
        let stopPropagation = function(e){ e.stopPropagation();}
        const clickShowEvent = "click.showdelete";
        const clickCloseEvent = "click.deleteclose";
        const clickPropogationEvent = "click.showdeleteblock";
        const clickDeleteEvent = "click.delete";
        let bindEvents = function(){
            $closeButton.on(clickCloseEvent, hide);
            $(document).on(clickShowEvent, "html", hide);
            $(document).on(clickPropogationEvent, selector, stopPropagation);
            $deleteButton.on(clickDeleteEvent, deleteBookmark)
        }
        let unbindEvents = function(){
            $closeButton.off(clickCloseEvent, hide);
            $(document).off(clickShowEvent, "html", hide);
            $(document).off(clickPropogationEvent, selector, stopPropagation);
            $deleteButton.off(clickDeleteEvent, deleteBookmark)
        }
        let show = function(){
            $mainEl.removeClass(hiddenClass);
            bindEvents()
        }
        let hide = function(e){
            e.preventDefault();
            $mainEl.addClass(hiddenClass);
            unbindEvents();
        }
        let init = function(){
            setPopupPosition();
        }
        init();
        return{setTime:setTime, show:show};

    };

    $(document).on("click.share", ".share-button", function(e){
        e.preventDefault();
        var time = $(this).data("time");
        var videoID = youtubeIDSource.getVideoID();
        var link = getTimeLink(videoID, time);
        shareLinkPopup = getShareLinkPopup("#share-link", $(this).closest(".bookmark-row"));
        shareLinkPopup.setLink(link);
        shareLinkPopup.show();
        
    });
    $(document).on("click.update", ".cancel-button", function (e) {
        setAppInfo(setPageDom);
    });
    const bookmarkEditPopupSelector = "#bookmark-edit-section";
    var changeHTMLBasedOnMode = function(mode){
        const $popupTitle = $("#popup-title");
        const $updateButton = $("#bookmark-update");
        const $createButton = $("#saveBookmark");
        if(mode == "edit"){
            $popupTitle.text("Edit Bookmark");
            $updateButton.removeClass(hiddenClass);
            $createButton.addClass(hiddenClass);
        }else if(mode == "create"){
            $popupTitle.text("Create Bookmark");
            $updateButton.addClass(hiddenClass);
            $createButton.removeClass(hiddenClass);
        }
    }
    var setBookmarkEditPopupFromBookmarkData = function(bookmarkData, mode){
        var $descriptionTextBox = $("#description-text");
        var $timeTextBox = $("#time-text");
        $timeTextBox.attr("data-currenttime", bookmarkData.time);
        $descriptionTextBox.val(bookmarkData.description);
        $timeTextBox.val(hhmmss(bookmarkData.time));
        changeHTMLBasedOnMode(mode);
    };
    var setBookmarkEditPopupPosition = function($jQpositionElement){
        var $jQpositionElement = $jQpositionElement || $("#table-section");
        let mainUIOffset = $(".yjt-html").offset();
        let positionTop = $jQpositionElement.offset().top - mainUIOffset.top + 25;
        let positionLeft = $jQpositionElement.offset().left - mainUIOffset.left;
        $(bookmarkEditPopupSelector).css({top:positionTop, left:positionLeft});
    };
    var getBookmarkFromAppDataBookmarks = function(time){
        var bookmarkArray = appInfo.bookmarkInfo;
        var bookmarkToReturn = bookmarkArray[time.toString()];
        return bookmarkToReturn;
    };
    var getBookmarkFromPopupData = function(){
        return {
            time: hhmmssToSeconds($.trim($("#time-text").val())),
            description: $.trim($("#description-text").val()) || ""
        }
    }
    var showEditPopup = function(){
        $(bookmarkEditPopupSelector).removeClass(hiddenClass);
    };
    
    $(document).on("click.edit", ".edit-button", function (e) {
        e.preventDefault();
        var time = $(this).data("time");
        var bookmarkData = getBookmarkFromAppDataBookmarks(time);
        if(!bookmarkData){ return; }
        setBookmarkEditPopupFromBookmarkData(bookmarkData, "edit");
        setBookmarkEditPopupPosition($(this).closest(".bookmark-row"));
        showEditPopup();
    });
    $(document).on("click.update", "#bookmark-update", function (e) {
        e.preventDefault();
        let oldTime = $("#time-text").attr("data-currenttime");
        var updateBookmarkData = getBookmarkFromPopupData();
        bookmarks.updateBookmark(oldTime, updateBookmarkData, function(saveResult){
            setAppInfo(setPageDom);
            $(bookmarkEditPopupSelector).addClass(hiddenClass);
        });
    });
    
    $(document).on("click.closeedit", ".bookmark-edit-close-button", function (e) {
        e.preventDefault();
        $(bookmarkEditPopupSelector).addClass(hiddenClass);
    });
    $(document).on("click.savebookmark", '#saveBookmark', function(){
        let bookmark = getBookmarkFromPopupData();
        bookmarks.saveCustomBookmarkAndVideoInfo(bookmark, function(saveResult){
            setAppInfo(setPageDom);
            $(bookmarkEditPopupSelector).addClass(hiddenClass);
        });
        
    })
    $(document).on("click.showsavebookmark", '#showSaveBookmark', function(e){
        e.preventDefault();
        var time = $(this).data("time");
        var bookmarkData = {time: Math.floor(videoPlayer.getCurrentTime()), description:""};
        if(!bookmarkData){ return; }
        setBookmarkEditPopupFromBookmarkData(bookmarkData, "create");
        setBookmarkEditPopupPosition();
        showEditPopup();
        
    })

    $(document).on("click.rewind", ".rewind-button", function(e){
        e.preventDefault();
        var time = $(this).data("time");
        videoPlayer.rewind(time);
        setAppInfo(setPageDom);
    });
    $(document).on("click.fastForward", ".fastForward-button", function(e){
        e.preventDefault();
        var time = $(this).data("time");
        videoPlayer.fastForward(time);
        setAppInfo(setPageDom);
    });
    
    $(document).on("click.playpause", '#playOrPause', function () {
        if(videoPlayer.isPlaying()){ videoPlayer.pause(); }
        else{ videoPlayer.play(); }
        setAppInfo(setPageDom);
    });
    var hiddenClass = "hidden";
    var decideBasHelpButtonHTML = function(){
        var showHideObject = {
            "true":{tooltip:"Show instructions.", text:"?"}
            , "false":{tooltip:"Hide instructions.", text:"X"}};
        var $helpNote = $("#bas-help-note");
        var controlSectionIsHidden = $helpNote.hasClass(hiddenClass).toString();
        var $helpButton = $('#bas-help-button');
        $helpButton.html(showHideObject[controlSectionIsHidden]["text"]);
        $helpButton.attr("tooltip", showHideObject[controlSectionIsHidden]["tooltip"]);
    };
    $(document).on("click.togglehelp", '#bas-help-button',function(){
        var $helpNote = $("#bas-help-note");
        $helpNote.toggleClass(hiddenClass);
        decideBasHelpButtonHTML();
    });
    $(document).on("click", "html", function() {
        $('#bas-help-note').addClass(hiddenClass);
        decideBasHelpButtonHTML();
     })
    
    $(document).on("click.showhelp", '#bas-help-section', function(e){
         e.stopPropagation();
     });
     $(document).on("click.closehelp", '#bas-help-close-button',function(){
        var $helpNote = $("#bas-help-note");
        $helpNote.addClass(hiddenClass);
        decideBasHelpButtonHTML();
    });
    $(document).on("click.togglecontrols", '#show-hide-button',function(){
        var showHideObject = {"true":"Show YouTube Spot Finder", "false":"Hide YouTube Spot Finder"};
        var $wrap = $("#wrap");
        $wrap.toggleClass(hiddenClass);
        var controlSectionIsHidden = $wrap.hasClass(hiddenClass).toString();
        $(this).html(showHideObject[controlSectionIsHidden]);
    });
});