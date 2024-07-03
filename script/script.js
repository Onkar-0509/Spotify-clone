console.log("javascript of spotify song playlist")
let currentSong = new Audio();
let song;
let currFolder;

function secondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = Math.floor(remainingSeconds).toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {

    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000${currFolder}`)
    let response = await a.text()   //all the data is into html

    let div = document.createElement("div")
    div.innerHTML = response

    let as = div.getElementsByTagName("a")


    song = []
    for (let i = 0; i < as.length; i++) {
        const Element = as[i]
        if (Element.href.endsWith(".mp3")) {
            song.push(Element.href.split(`${currFolder}`)[1])//the split function divide the string into to form of array. from /song/ into two parts we want second part 
        }

    }
    //display playlist of songs in library
    let songUl = document.querySelector(".songplaylist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const songlist of song) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                                           <img class="invert" src="music.svg" alt="">
                                   <div class="songinfo">
                                       <div>${songlist.replaceAll("%20", " ")}</div>
                                       <div>Omii</div>
                                   </div>
                                    <div class="playbutton">
                                       <span>play now</span>
                                       <img class="invert" src="img/playbutton.svg" alt="" height="25px" width="25px">
                                   </div>
       
               </li>`
    } 

    //Attach an eventlistner to each song in library.

    Array.from(document.querySelector(".songplaylist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", Element => {
            playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim())
        })


    })



}

const playMusic = (track, pause = false) => {
    currentSong.src = `${currFolder}` + track
    if (!pause) {
        currentSong.play()
        playId.src = "img/pause.svg"
    }

    document.querySelector(".song").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 /00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/song/`)
    let response = await a.text()   //all the data is into html

    let div = document.createElement("div")
    div.innerHTML = response

    let anchor = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer") 
    let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/song")) {
            let folder = e.href.split("/")[4]
            let a = await fetch(`http://127.0.0.1:3000/song/${folder}/info.json`)
            let response = await a.json()
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div  data-folder="${folder}"class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"
                                color="#000000" fill="#1ed760">
                                <circle cx="12" cy="12" r="10" stroke="#1ed760" stroke-width="1.5" />
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="currentcolor" />
                            </svg>
                        </div>

                        <img src="song/${folder}/cover.png" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
            `

        }


    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            await getSongs(`/song/${item.currentTarget.dataset.folder}/`)
        })
    
    
    })






}
async function main() {

    await getSongs(`/song/ncs/`)
    playMusic(song[0], true)

    await displayAlbums()



    //Attach an eventlistner for play ,next,previous

    playId.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playId.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            playId.src = "img/play.svg"
        }
    })
}
//
currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToTime(currentSong.currentTime)}/${secondsToTime(currentSong.duration)}`
    document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%"
})

//

document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%"
    currentSong.currentTime = (currentSong.duration * percent) / 100
})

//click to prev song

prev.addEventListener("click", () => {
    let index = song.indexOf(currentSong.src.split("/")[5])
    if ((index - 1) >= 0) {
        playMusic(song[index - 1])
    }

})
//click to next song
next.addEventListener("click", () => {
    let index = song.indexOf(currentSong.src.split("/")[5])

    if ((index + 1) < song.length) {
        playMusic(song[index + 1])
    }


})

// for volume increase decrease
range.addEventListener("change", e => {
    currentSong.volume = parseInt(e.target.value) / 100;
})





main()