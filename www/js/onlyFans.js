document.getElementById("onlyFans").onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ?autoplay=1", '_blank').focus();
    let updateCounter = new XMLHttpRequest();
    updateCounter.open("GET", "/onlyFans.php");
    updateCounter.onload = () => {
        console.log(updateCounter.response);
        loadPage("RickRoll", false, false);
        document.getElementById("RickRollText").innerText="Congrats you have been RickRolled! RickRoll Counter: "+updateCounter.response;
    }
    updateCounter.send();
}