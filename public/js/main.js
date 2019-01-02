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



