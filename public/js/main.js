$("#home-btn").on("click", function(){localStorage.setItem("inputText", "")});

//================
// Rating Handler
//================
function resetStarsHandler(){
    let stars = $(".star");
    for(let i=0; i<stars.length; i++){
        $(stars[i]).removeClass("fas selected-star");
        $(stars[i]).addClass("far");
    }
}

function mouseOverStarsHandler(selectedItem){
    selectedItem.on("mouseover", function(){
        let stars = $(".star");
        for(let i=0; i<=Number($(this).attr("id")); i++){
            $(stars[i]).removeClass("far");
            $(stars[i]).addClass("fas selected-star");
        }
    });
}

function mouseLeaveStarsHandler(selectedItem){
    selectedItem.on("mouseleave", function(){
        let stars = $(".star");
        for(let i=0; i<=Number($(this).attr("id")); i++){
            $(stars[i]).removeClass("fas selected-star");
            $(stars[i]).addClass("far");
        }
    });
}

function mouseClickStarsHandler(selectedItem){
    selectedItem.on("click", function(){
        let stars = $(".star");
        stars.off();
        for(let i=0; i<=Number($(this).attr("id")); i++){
            $(stars[i]).removeClass("far");
            $(stars[i]).addClass("fas selected-star");
        }

        for(let j=0; j<stars.length; j++){
            let id = "#" + j;
            mouseDoubleClickStarsHandler($(id));
        }
    });
}

function mouseDoubleClickStarsHandler(selectedItem){
    selectedItem.on("dblclick", function(){
        resetStarsHandler();
        let stars = $(".star");
        stars.off();
        for(let i=0; i<stars.length; i++){
            let id = "#" + i;
            mouseOverStarsHandler($(id));
            mouseLeaveStarsHandler($(id));
            mouseClickStarsHandler($(id));
        }
    });
}

function addEventOnStars(){
    for(let i=0; i<$(".star").length; i++){
        let id = "#" + i;
        mouseOverStarsHandler($(id));
        mouseLeaveStarsHandler($(id));
        mouseClickStarsHandler($(id));
        mouseDoubleClickStarsHandler($(id));
    }
}

addEventOnStars();

//========================================================
//=====================
// More button Handler
//=====================
function getIds(){
    let ids = [];
    let kimochis = $(".kimochi");
    for(let i=0; i<kimochis.length; i++){
        ids.push($(kimochis[i]).attr("id"));
    }
    return ids;
}

//Handle data without searching and filtering.
function handleData1(ids){
    $.get("/kimochis", {ids: ids}, function(data){
        $("#main").append(data);
        if(data.indexOf("kimochi") === -1 || !ids.length){
            $("#more-btn").attr({"disabled": true, "hidden": true});
        }
    });
}

//Handle data with searching.
function handleData2(ids){
    $.get("/kimochis/search", {ids: ids, name: localStorage.getItem("inputText")}, function(data){
        $("#main").append(data);
        if(data.indexOf("kimochi") === -1 || !ids.length){
            $("#more-btn").attr({"disabled": true, "hidden": true});
        }
    });
}

//Handle data with filtering and (searching).
function handleData3(ids){
    $.get("/kimochis/filter", 
        {ids: ids, selection: $("#sort").val(), name: localStorage.getItem("inputText")}, 
        function(data){
        $("#main").append(data);
        if(data.indexOf("kimochi") === -1 || !ids.length){
            $("#more-btn").attr({"disabled": true, "hidden": true});
        }
    });
}

function mouseClickMoreButtonHandler(){
    $("#more-btn").on("click", function(){
        if(getIds().length === 0) return;
        let ids = getIds();
        let inputText = localStorage.getItem("inputText");
        let selection = $("#sort").val();

        if(selection === "newest" || selection === "oldest" || selection === "rating"){
            handleData3(ids)
        }
        else if(inputText !== null && inputText.length !==0 &&
            selection !== "newest" && selection !== "oldest" && selection !== "rating"){
            handleData2(ids);
        }
        else{
            handleData1(ids);
        }
    });
}

mouseClickMoreButtonHandler();
//========================================================
//=====================
// Filter Handler
//=====================

function filterHandler(){
    $("#filter-btn").on("click", function(){
        let selection = $("#sort").val();
        if(selection === "oldest" || selection === "newest" || selection === "rating"){
            if(!getIds().length) return;
            let ids = getIds();
            $.get("/kimochis/filter", 
                {selection: selection, name: localStorage.getItem("inputText")}, function(data){
                $("#main").html(data);
                $("#more-btn").attr({"disabled": false, "hidden": false});
            });
        }
    });
}

filterHandler();