const baseUrl = "https://api.lyrics.ovh/";
const songSearch = document.getElementById('song-search');
const lyricsError = document.getElementById('lyrics-error');
const songContainer = document.getElementById('song-container');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const singleLyrics = document.getElementById('single-lyrics');

const getSongData = () => {
    songTitle.innerText = "";
    songArtist.innerText = "";
    singleLyrics.innerText = "";
    songContainer.innerHTML = "";
    handleError("");
    if (!songSearch.value) {
        handleError("Please, Enter your artist or song name..");
    }
    else {
        toggleSpinner();
        const url = `${baseUrl}suggest/${songSearch.value}`;
        fetch(url)
       .then(res => res.json())
       .then(data => displaySong(data.data))
       .catch(() => handleError("Something went wrong!! Please try again later!."));
    }
};

const enterKeypress = (e) => {
    if (e.key === "Enter") {
        getSongData();
    }
};
songSearch.addEventListener("keypress", enterKeypress)

const displaySong = songs => {
    songSearch.value = "";
    songContainer.innerHTML = "";
    toggleSpinner();
    if (!songs.length) {
        handleError("No Matching Songs Here.");
    }
    else{
        songs.forEach(song => {
            const {title, artist, preview} = song;
            const songDiv = document.createElement("div");
            songDiv.className = "single-result row align-items-center my-3 p-3 mx-1";
            songDiv.innerHTML = `
            <div class="col-lg-9">
                <h3 class="lyrics-name">${title}</h3>
                <p class="author lead">Album by <span>${artist.name}</span></p>
                <h5 class="py-2">Preview This Song</h5>
                <audio controls>
                    <source src="${preview}" type="audio/ogg">
                </audio>
            </div>
            <div class="col-lg-3 text-md-right text-center mt-2 mt-lg-0">
                <button onClick="getLyrics('${artist.name}', '${title}')" class="btn btn-success">Get Lyrics</button>
            </div>
            `
            songContainer.appendChild(songDiv);
        })
    }
};

const getLyrics = async (artist, title) => {
    songTitle.innerText = "";
    songArtist.innerText = "";
    singleLyrics.innerText = "";
    handleError("");
    toggleSpinner();
    const url = `${baseUrl}v1/${artist}/${title}`;
    try{
        const res = await fetch(url);
        const data = await res.json();
        displayLyrics(data.lyrics, artist, title);
    }
    catch{
        handleError("Something went wrong!! Please try again later!.")
    }
};

const displayLyrics = (lyrics, artist, title) => {
    toggleSpinner();
    if (lyrics) {
        songTitle.innerText = title;
        songArtist.innerText = artist;
        singleLyrics.innerText = lyrics;
    }
    else{
        handleError("Sorry The lyrics Not Found");
    }
}

const toggleSpinner = () => {
    const spinnerToggle = document.getElementById('spinner-toggle');
    spinnerToggle.classList.toggle("d-none");
}

const handleError = err => {
    lyricsError.innerText = err;
}