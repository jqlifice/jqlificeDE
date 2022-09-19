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


//checks weather the contentBox is open, if it isn't prepareContent() darkens the background video and opens the content box; also prepareContent() clears the content(regardless of the box being open)
function prepareContent (){
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
function loadPage(pageID, reload, inHistory){
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
    document.getElementById("contentBoxTitle").innerHTML = "https://jqlifice.de/"+pageID;
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
            case "whoAmI":
                    document.getElementById("contentBoxWhoAmI").style.display="flex";
                    document.getElementById("contentBoxWhoAmI").style.visibility="visible";
                break;

            case "credits":
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
}

//sliders On Click
document.getElementById("sliderWhoAmI").onclick = function (){
    loadPage("whoAmI", false, false);
    this.classList.add("sliderDivClicked");
};
document.getElementById("sliderYoutube").onclick = function (){
    loadPage("youtube", false, false);
    this.classList.add("sliderDivClicked");
};
document.getElementById("sliderProgram").onclick = function (){
    loadPage("program", false, false);
    this.classList.add("sliderDivClicked");
};
document.getElementById("sliderCSGO").onclick = function (){
    loadPage("csgo", false, false);
    this.classList.add("sliderDivClicked");
};
document.getElementById("sliderYugi").onclick = function (){
    loadPage("yugi", false, false);
    this.classList.add("sliderDivClicked");
};
document.getElementById("sliderGaming").onclick = function (){
    loadPage("gaming", false, false);
    this.classList.add("sliderDivClicked");
};
document.getElementById("sliderMusic").onclick = function (){
    loadPage("music", false, false);
    this.classList.add("sliderDivClicked");
};
document.getElementById("sliderCredits").onclick = function (){
    loadPage("credits", false, false);
    this.classList.add("sliderDivClicked");
};