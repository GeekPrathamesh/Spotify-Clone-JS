let currentAudio = new Audio();
let playBtn = document.querySelector("#play");

async function callSong() {
  const response = await fetch("http://127.0.0.1:3000/songs/");
  const responseText = await response.text();

  let div = document.createElement("div");
  div.innerHTML = responseText;
  let anchors = div.getElementsByTagName("a");
  // console.log(anchors);
  let songs = [];
  for (let anchor of anchors) {
    if (anchor.href.endsWith(".mp3")) {
      songs.push(anchor.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playsong = (audioName, pause = false) => {
  // audioName = encodeURIComponent(audioName);
  const audioURL = "/songs/" + audioName;

  console.log("Playing:", audioURL);

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(audioURL);
  if (!pause) {
    currentAudio.play();
    playBtn.classList.remove("fa-circle-play");
    playBtn.classList.add("fa-circle-pause");
  } else {
    playBtn.classList.remove("fa-circle-pause");
    playBtn.classList.add("fa-circle-play");
  }

  document.querySelector(".song-Name").innerText = audioName;
  document.querySelector(".song-time").innerText = "00:00 / 00:00";

  currentAudio.addEventListener("timeupdate", () => {
    const current = formatTime(currentAudio.currentTime);
    const total = formatTime(currentAudio.duration);
    document.querySelector(".song-time").innerText = `${current} / ${total}`;
    document.querySelector(".creekerball").style.left =
      (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
  });

  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
};

const main = async () => {
  let songs = await callSong();
  playsong(songs[0], true);

  // console.log(songs);
  let songsUL = document.querySelector(".list-songs ul");

  for (let song of songs) {
    songsUL.innerHTML += `<li>
      <i class="fa-solid fa-music"></i>
      <div class="song-info">
        <p>${decodeURIComponent(song)}</p>
        <p><i>Bandu</i></p>
      </div>
      <i class="fa-solid fa-circle-play"></i>
    </li>`;
  }

  let lists = Array.from(document.querySelectorAll(".list-songs ul li"));
  lists.forEach((list) => {
    list.addEventListener("click", (event) => {
      let audioName = list
        .querySelector(".song-info")
        .firstElementChild.innerHTML.trim();
      console.log(audioName);
      playsong(audioName);
    });
  });

  ////////////////ataching event listner to each previous play next song to access

  playBtn.addEventListener("click", () => {
    // if (!currentAudio) {
    //   alert("Play kar pehle song..");
    //   return;
    // }
    if (currentAudio.paused) {
      currentAudio.play();
      playBtn.classList.remove("fa-circle-play");
      playBtn.classList.add("fa-circle-pause");
    } else {
      currentAudio.pause();
      playBtn.classList.remove("fa-circle-pause");
      playBtn.classList.add("fa-circle-play");
    }
  });

  /////////////seeker movement

  document.querySelector(".creeker").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".creekerball").style.left = percent + "%";
    currentAudio.currentTime= ((currentAudio.duration)*percent)/100;
  });


  ///////////////hamberger event listner
document.querySelector(".hamberger").addEventListener("click",()=>{
  document.querySelector(".left").style.left="0%";
})

/////////close x button for hamberger

document.querySelector(".xmark").addEventListener("click",()=>{
  document.querySelector(".left").style.left="-100%";
})

};
main();
