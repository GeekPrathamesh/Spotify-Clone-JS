let listSongs = document.querySelector(".list-songs ul");
let audio;
let play;
let hrefs;
const loadSongs = async () => {
  let response = await fetch("/songs");
  let data = await response.text();
  let div = document.createElement("div");
  div.innerHTML = data;
  //   console.log(div);
  let anchors = Array.from(div.getElementsByTagName("a"));
  // console.log(anchors);
  hrefs = anchors.map((anchor) => {
    return anchor.href;
  });
  hrefs = hrefs.filter((eachhref) => {
    return eachhref.includes(".mp3");
  });
  hrefs = hrefs.map((href) => {
    return href.split("/songs/")[1];
  });
  console.log(hrefs);
  updateSidelist(hrefs);
  clickList();
};

// task 1 updating side list

function updateSidelist(hrefs) {
  for (let href of hrefs) {
    // let songName = href.split("/songs/")[1];
    let songName = href.split(".mp3")[0];
    songName = decodeURI(songName);
    // console.log(songName)
    // "http://127.0.0.1:3000/songs/128-Sairat%20Zaala%20Ji%20-%20Sairat%20128%20Kbps.mp3"
    listSongs.innerHTML += `<li>
      <i class="fa-solid fa-music"></i>
      <div class="song-info">
        <p>${songName}</p>
        <p>Bandu artist</p>
      </div>
      <i class="fa-solid fa-circle-play"></i>
    </li>`;
  }
}

function clickList() {
  let lists = Array.from(document.querySelectorAll(".list-songs ul li"));
  lists.forEach((list) => {
    list.addEventListener("click", () => {
      let songUrl =
        list.querySelector(".song-info").firstElementChild.textContent + ".mp3";
      console.log(songUrl);
      audioPlay(songUrl);
    });
  });
}

function audioPlay(songUrl, value = false) {
  link = "/songs/" + songUrl;

  if (audio) {
    audio.pause();
  }
  audio = new Audio(link);
  if (!value) {
    audio.play();
    play = true;
    playSongBtn.classList.remove("fa-circle-play");
    playSongBtn.classList.add("fa-circle-pause");
  } else {
    audio.pause();
  }

  let songnameDisplay = document.querySelector(".song-Name");
  let decodedSongname = decodeURI(songUrl);
  decodedSongname = decodedSongname.replace(".mp3","");
songnameDisplay.innerText =decodedSongname ;


}

///////////pause btn//////////////////////
let playSongBtn = document.querySelector("#play");
playSongBtn.addEventListener("click", () => {
  if (play) {
    audio.pause();
    play = false;
    playSongBtn.classList.remove("fa-circle-pause");
    playSongBtn.classList.add("fa-circle-play");
  } else {
    audio.play();
    play = true;
    playSongBtn.classList.remove("fa-circle-play");
    playSongBtn.classList.add("fa-circle-pause");
  }
});

/////////next song play//////
let nextsongBtn = document.querySelector("#next");
nextsongBtn.addEventListener("click", () => {

 let CurraudioSrc = audio.src.split("/songs/")[1];
 let index = hrefs.indexOf(CurraudioSrc);

if(index+1<hrefs.length){
    audioPlay(hrefs[index+1])
}

});

//////////////previous song button///////
let previoussongBtn = document.querySelector("#previous");
previoussongBtn.addEventListener("click", () => {

 let CurraudioSrc = audio.src.split("/songs/")[1];
 let index = hrefs.indexOf(CurraudioSrc);

if(index>0){
    audioPlay(hrefs[index-1])
}

});


//////////songnameupdate///



async function main() {
  await loadSongs();
  audioPlay(hrefs[0], true);
}
main();
