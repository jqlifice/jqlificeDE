let contentBox = document.getElementById("contentBox");
let contentBoxContent = document.getElementById("contentBoxContent");
let contentBoxOpen = false;
let contentBoxHistory = [];
let contentBoxHistoryCurrentIndex = -1;
let sliders = document.querySelectorAll(".sliderDiv");

//control elements contentBox
document.getElementById("contentBoxClose").onclick = function(){
    prepareContent();
    contentBoxHistory=[];
    contentBoxHistoryCurrentIndex=-1;
    contentBox.style.animationDelay="1s";
    contentBox.style.animation="closeContentBox 1s";
    contentBox.style.opacity="0%";
    contentBox.style.visibility="hidden";
    sliders.forEach(function(slider){
        slider.classList.remove("sliderDivClicked");
    });
    document.getElementById("backgroundVideo").style.animation="raiseTheLight 2s";
    document.getElementById("backgroundVideo").style.opacity="75%";
    contentBoxOpen = false;
};
document.getElementById("contentBoxReload").onclick = function(){
    loadPage(contentBoxHistory[contentBoxHistoryCurrentIndex], true, false);
};
document.getElementById("contentBoxBack").onclick = function(){
    if(contentBoxHistoryCurrentIndex>0){
        loadPage(contentBoxHistory[--contentBoxHistoryCurrentIndex], false, true);
    }
};
document.getElementById("contentBoxForward").onclick = function (){
    if(contentBoxHistoryCurrentIndex<contentBoxHistory.length-1){
        loadPage(contentBoxHistory[++contentBoxHistoryCurrentIndex], false, true);
    }
};
//adressbar submit
document.getElementById("contentBoxTitleWrapper").addEventListener('submit', e => {
    e.preventDefault();
    const regex = /((http(s|):\/\/)|)((www.)|)jqlifice.de\//gis
    let calledPage = e.target[0].value.replace(regex, "");
    loadPage(calledPage, false, false, e.target[0].value);
});

//sliders On Click
document.getElementById("sliderWhoAmI").onclick = function (){
    loadPage("WhoAmI", false, false);
};
document.getElementById("sliderYoutube").onclick = function (){
    loadPage("Youtube", false, false);
};
document.getElementById("sliderProgram").onclick = function (){
    loadPage("Program", false, false);
};
document.getElementById("sliderCSGO").onclick = function (){
    loadPage("CSGO", false, false);
};
document.getElementById("sliderYugi").onclick = function (){
    loadPage("Yugi", false, false);
};
document.getElementById("sliderGaming").onclick = function (){
    loadPage("Gaming", false, false);
};
document.getElementById("sliderMusic").onclick = function (){
    loadPage("Music", false, false);
};
document.getElementById("sliderCredits").onclick = function (){
    loadPage("Credits", false, false);
};



//checks weather the contentBox is open, if it isn't prepareContent() darkens the background video and opens the content box; also prepareContent() clears the content(regardless of the box being open)
function prepareContent (){
    destroyShell();
    let childNodesContentBox = document.getElementById("contentBoxContent").childNodes;
    for(let i=0; i<childNodesContentBox.length; i++){
        if(childNodesContentBox[i].nodeName.toLowerCase()==="div"){
            childNodesContentBox[i].style.display="none";
        }
    }
    sliders.forEach(function(slider){
        slider.classList.remove("sliderDivClicked");
    });
    if(!contentBoxOpen){
        contentBox.style.animationDelay="1s";
        contentBox.style.animation="openContentBox 1s";
        contentBox.style.visibility="visible";
        contentBox.style.opacity="100%";
        document.getElementById("backgroundVideo").style.animation="dimTheLight 2s";
        document.getElementById("backgroundVideo").style.opacity="30%";
        contentBoxOpen = true;
    }
}


//loads the in pageID specified page into the contentBox; reload prevents any interaction with the history; inHistory stops from overwriting history
function loadPage(pageID, reload, inHistory, setURL){
    //updating history to allow using back and forward arrows to navigate
    if(!reload && !inHistory){
        if(contentBoxHistoryCurrentIndex<contentBoxHistory.length-1){
            contentBoxHistory.splice(contentBoxHistoryCurrentIndex+1, contentBoxHistory.length-contentBoxHistoryCurrentIndex-1);
        }
        //this needs to be separate as we need to write even when the contentBox isn't open when loadPage is called
        contentBoxHistory.push(pageID);
        contentBoxHistoryCurrentIndex++;
    }
    prepareContent();
    contentBoxContent.style.visibility="hidden";
    if(setURL){
        document.getElementById("contentBoxTitle").value = setURL;
    }else{
        document.getElementById("contentBoxTitle").value = "https://jqlifice.de/".concat(pageID);
    }
    let loadingBar = document.getElementById("contentBoxLoadingBar");
    loadingBar.style.animation="none";
    setTimeout(function(){
        loadingBar.style.opacity="100%";
        loadingBar.style.animationDelay="2s";
        loadingBar.style.animation="loadPage 2s";
        loadingBar.style.width="100%";
        loadingBar.style.visibility="visible";
    }, 10);
    setTimeout(function(){
        loadingBar.style.animationDelay="0.5s";
        loadingBar.style.animation="closeContentBox 1s";
        loadingBar.style.opacity="0%";
    },1000)
    setTimeout(function(){
        switch(pageID){
            case "WhoAmI":
                    document.getElementById("contentBoxWhoAmI").style.display="flex";
                    document.getElementById("contentBoxWhoAmI").style.visibility="visible";
                break;

            case "Youtube":
                    document.getElementById("contentBoxYouTube").style.display="grid";
                    document.getElementById("contentBoxYouTube").style.visibility="visible";
                break;

            case "Program":
                    document.getElementById("contentBoxProgram").style.display="block";
                    document.getElementById("contentBoxProgram").style.visibility="visible";
                    createShell();
                break;

            case "Credits":
                    document.getElementById("contentBoxCredits").style.display="flex";
                    document.getElementById("contentBoxCredits").style.visibility="visible";
                break;

            default:
                    document.getElementById("contentBox404").style.display="flex";
                    document.getElementById("contentBox404").style.visibility="visible";
                break;
        }
    },1100);


    //update clickable arrows
    if(contentBoxHistoryCurrentIndex > 0){
        document.getElementById("contentBoxBack").style.opacity="100%";
        document.getElementById("contentBoxBack").style.cursor="pointer";
    }else{
        document.getElementById("contentBoxBack").style.opacity="20%";
        document.getElementById("contentBoxBack").style.cursor="auto";
    }
    if(contentBoxHistoryCurrentIndex < contentBoxHistory.length-1){
        document.getElementById("contentBoxForward").style.opacity="100%";
        document.getElementById("contentBoxForward").style.cursor="pointer";
    }else{
        document.getElementById("contentBoxForward").style.opacity="20%";
        document.getElementById("contentBoxForward").style.cursor="auto";
    }

    //update slider
    let slider = document.getElementById("slider".concat(pageID));
    if(slider) slider.classList.add("sliderDivClicked")

}
