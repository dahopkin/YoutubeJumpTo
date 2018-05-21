
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
            bookmarks.deleteBookmark(time, function(ActionResult){
                if(ActionResult.displayErrorIfPresent(displayMessageWithPopup)) return;
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
    var getMessagePopup = function(selector){
        var selector = selector || "#message-popup";
        let $wholeUI = $(".yjt-html");
        let $positionElement = $wholeUI;
        let $mainEl = $(selector);
        let $closeButton = $mainEl.find(".message-close-button");
        let $messageEl = $mainEl.find(".message-text");
        let message = 0;
        let setMessage = function(newMessage){
            message = escapeHTMLString(newMessage);
            $messageEl.text(message);
        }
        //set the position somewhere below the top of the main ui.
        let setPopupPosition = function(){
            let mainUIWidthHalf = $wholeUI.width()/2;
            let mainElWidthHalf = $mainEl.width()/2;
            let desiredLeftPush = mainUIWidthHalf - mainElWidthHalf;
            let mainUIOffset = $wholeUI.offset();
            let positionTop = $positionElement.offset().top - mainUIOffset.top + 25;
            let positionLeft = $positionElement.offset().left - mainUIOffset.left + desiredLeftPush;
            $mainEl.css({top:positionTop, left:positionLeft});
        };
        let stopPropagation = function(e){ e.stopPropagation();}
        const clickShowEvent = "click.showmessage";
        const clickCloseEvent = "click.messageclose";
        const clickPropogationEvent = "click.showmessageblock";
        let bindEvents = function(){
            $closeButton.on(clickCloseEvent, hide);
            $(document).on(clickShowEvent, "html", hide);
            $(document).on(clickPropogationEvent, selector, stopPropagation);
        }
        let unbindEvents = function(){
            $closeButton.off(clickCloseEvent, hide);
            $(document).off(clickShowEvent, "html", hide);
            $(document).off(clickPropogationEvent, selector, stopPropagation);
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
        let showMessage = function(newMessage){
            setMessage(newMessage);
            show();
        }
        let init = function(){
            setPopupPosition();
        }
        init();
        return{showMessage:showMessage};

    };
    var getBookmarkChangePopup = function(selector, $jQpositionElement){
        let $wholeUI = $(".yjt-html");
        var selector = selector || "#bookmark-edit-section";
        let $mainEl = $(selector);
        let $positionElement = $jQpositionElement || $wholeUI.find("#table-section");
        let $closeButton = $mainEl.find(".bookmark-edit-close-button");
        let $updateButton = $mainEl.find("#bookmark-update");
        let $createButton = $mainEl.find("#saveBookmark");
        let $timeEl = $mainEl.find("#time-text");
        let $popupTitle = $mainEl.find("#popup-title");
        let $descriptionEl = $mainEl.find("#description-text");
        let $messageEl = $mainEl.find("#edit-result-message")
        let oldTime = 0;
        let bookmark = {};
        let mode = "create";
        let setOldTime = function(time){
            oldTime = time;
        }
        let setMode = function(newMode){
            mode = newMode;
        }
        let setBookmark = function(newBookmark){
            bookmark = newBookmark;
        } 
        let getBookmarkFromForm = function(){
            return {
                time: hhmmssToSeconds($.trim($timeEl.val())),
                description: $.trim($descriptionEl.val()) || ""
            }
        }
        let setForm = function(){
            $descriptionEl.val(bookmark.description);
            $timeEl.val(hhmmss(bookmark.time));
        }
        let displayMessageInForm = function(message){
            $messageEl.text(message);
            $messageEl.removeClass(hiddenClass);
        }
        let hideMessage = function(){$messageEl.addClass(hiddenClass);}
        let updateBookmark = function(e){
            displayMessageInForm("Updating bookmark...");
            setBookmark(getBookmarkFromForm());
            bookmarks.updateBookmark(oldTime, bookmark, function(ActionResult){
                if(ActionResult.displayErrorIfPresent(displayMessageInForm)) return;
                setAppInfo(setPageDom);
                hide(e);
            });
        }
        let createBookmark = function(e){
            displayMessageInForm("Creating bookmark...");
            setBookmark(getBookmarkFromForm());
            bookmarks.saveCustomBookmarkAndVideoInfo(bookmark, function(ActionResult){
                if(ActionResult.displayErrorIfPresent(displayMessageInForm)) return;
                setAppInfo(setPageDom);
                hide(e);
            });
        }
        let stopPropagation = function(e){ e.stopPropagation();}
        const clickShowEvent = "click.showbookmarkedit";
        const clickCloseEvent = "click.bookmarkeditclose";
        const clickPropogationEvent = "click.showbookmarkeditblock";
        const clickUpdateEvent = "click.updatebookmark";
        const clickCreateEvent = "click.createbookmark";
        let changeHTMLBasedOnMode = function(){
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
        let eventList = new jQEventList();
        let setUpEvents = function(){
            eventList.addEventToList($closeButton, clickCloseEvent, hide);
            eventList.addEventToList($(document), clickShowEvent, hide);
            eventList.addEventToList($(document), clickPropogationEvent, stopPropagation, selector);
            eventList.addEventToList($updateButton, clickUpdateEvent, updateBookmark);
            eventList.addEventToList($createButton, clickCreateEvent, createBookmark);
            //eventList.addEventToList($(window), "resize.bookmarkedit", center);
        };
        let show = function(){
            setForm();
            hideMessage();
            changeHTMLBasedOnMode()
            $mainEl.removeClass(hiddenClass);
            eventList.bindEvents();
        }
        let hide = function(e){
            e.preventDefault();
            $mainEl.addClass(hiddenClass);
            eventList.unbindEvents();
        }
        let init = function(){
            setUpEvents();
        }
        init();
        return{show:show, setOldTime:setOldTime, setBookmark:setBookmark, setMode:setMode};

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

    var getBookmarkFromAppDataBookmarks = function(time){
        var bookmarkArray = appInfo.bookmarkInfo;
        var bookmarkToReturn = bookmarkArray[time.toString()];
        return bookmarkToReturn;
    };

    $(document).on("click.edit", ".edit-button", function (e) {
        e.preventDefault();
        var time = $(this).data("time");
        var bookmarkData = getBookmarkFromAppDataBookmarks(time);
        if(!bookmarkData){ return; }
        let bookmarkChangePopup = getBookmarkChangePopup("#bookmark-edit-section", $(this).closest(".bookmark-row"));
        bookmarkChangePopup.setBookmark(bookmarkData);
        bookmarkChangePopup.setMode("edit");
        bookmarkChangePopup.setOldTime(time);
        bookmarkChangePopup.show();
    });
    var displayMessageWithPopup = function(message){
        let messagePopup = getMessagePopup();
        messagePopup.showMessage(message);
    }
    $(document).on("click.showsavebookmark", '#showSaveBookmark', function(e){
        e.preventDefault();
        var time = $(this).data("time");
        var bookmarkData = {time: Math.floor(videoPlayer.getCurrentTime()), description:""};
        if(!bookmarkData){ return; }
        let bookmarkChangePopup = getBookmarkChangePopup("#bookmark-edit-section");
        bookmarkChangePopup.setBookmark(bookmarkData);
        bookmarkChangePopup.setMode("create");
        bookmarkChangePopup.show();
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