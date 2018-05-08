$(function () {

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
    $(document).on("click.delete", ".delete-button", function(e){
        e.preventDefault();
        if (confirm("Are you sure you want to delete this bookmarked time?")) {
            var time = $(this).data("time");
            bookmarks.deleteBookmark(time, function(saveResult){
                setAppInfo(setPageDom);
            });
        }
    });
    $(document).on("click.update", ".update-button", function (e) {
        e.preventDefault();
        var updateData = {};
        var time = $(this).data("time");
        updateData["oldTime"] = time;
        updateData["newTime"] = time;
        var newDescription = $(".edit-description[data-time='"+time+"']").val();
        updateData["newDescription"] = newDescription;
        var updateBookmarkData = {time:updateData.newTime, description:updateData.newDescription};
        bookmarks.updateBookmark(updateData.oldTime, updateBookmarkData, function(saveResult){
            setAppInfo(setPageDom);
        });

    });
    $(document).on("click.update", ".cancel-button", function (e) {
        setAppInfo(setPageDom);
    });
    $(document).on("click.edit", ".edit-button", function (e) {
        e.preventDefault();
        var time = $(this).data("time");
        var originalText = $(".description[data-time='"+time+"']").html();
        var editHtml = `<input type='text' class='edit-description' data-time='${time}' maxlength=100 value='${originalText}'\>
        <button data-time='${time}' class='btn btn-small btn-primary update-button'>Update</button>
        <button class='btn btn-small btn-primary cancel-button'>Cancel</button>`;
        $(".description[data-time='"+time+"']").html(editHtml);
        $(".edit-description[data-time='"+time+"']").focus();


    });
    
    $(document).on("click.savebookmark", '#saveBookmark', function(){
        bookmarks.saveDefaultBookmark(function(saveResult){
            setAppInfo(setPageDom);
        });
        
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
        var showHideObject = {"true":"Show Youtube Spot Finder", "false":"Hide Youtube Spot Finder"};
        var $wrap = $("#wrap");
        $wrap.toggleClass(hiddenClass);
        var controlSectionIsHidden = $wrap.hasClass(hiddenClass).toString();
        $(this).html(showHideObject[controlSectionIsHidden]);
    });
});