$(function () {
    $(document).on("click.go14", '#goTo1-4', function () {
        videoPlayer.goTo1_4thPoint();
    });
    $(document).on("click.go24", '#goTo2-4', function () {
        videoPlayer.goTo2_4thPoint();
    });
    $(document).on("click.go34", '#goTo3-4', function () {
        videoPlayer.goTo3_4thPoint();
    });
    $(document).on("click.go30", '#goTo30', function () {
        videoPlayer.goTo30Point();
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
    $(document).on("click.send", ".time-link", function(e){
        e.preventDefault();
        var time = $(this).data("time");
        videoPlayer.seekToTime(time);
        setAppInfo(setPageDom);
    });
    $(document).on("click.delete", ".delete-button", function(e){
        e.preventDefault();
        if (confirm("Are you sure you want to delete this bookmark?")) {
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
    
    $(document).on("click.togglehelp", '#bas-help-button',function(){
        var hiddenClass = "hidden";
        $("#bas-help-note").toggleClass(hiddenClass);
    });
});