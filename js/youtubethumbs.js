Array.from(document.getElementsByClassName("contentBoxYouTubeThumbContainer")).forEach(thumb => {
   thumb.onclick = function(){
       let vid = this.id.split('contentBoxYouTubeThumbContainer').join("");
       let contentBoxPlay = document.getElementById("contentBoxPlay");
       while(contentBoxPlay.firstChild){
           contentBoxPlay.removeChild(contentBoxPlay.firstChild);
       }
       let newVideo = document.createElement("video");
       newVideo.classList.add("contentBoxPlayVideo");
       newVideo.setAttribute("controls", "controls");
       switch(vid){
           case "LPALLNIGHT":
                newVideo.src="vid/youtube/01_LPALLNIGHT.mp4";
           break;

           case "NaturNerd":
               newVideo.src="vid/youtube/02_NaturNerd.mp4";
           break;

           case "JQLiFiCE1":
               newVideo.src="vid/youtube/03_JQLiFiCE.mp4";
           break;

           case "JQLiFiCE2":
               newVideo.src="vid/youtube/04_jqlifice.mp4";
           break;
       }
       setTimeout(function(){
           newVideo.setAttribute("autoplay", "autoplay");
           contentBoxPlay.appendChild(newVideo);
       }, 1000);
       loadPage("Play", false, false, null);
   };
});