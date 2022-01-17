const d = document,
formulario = d.getElementById("song-search"),
loader = d.querySelector(".loader"),
error = d.querySelector(".error"),
main = d.querySelector("main"),
$artist = d.querySelector(".artist"),
$song = d.querySelector(".song");

//Cuando se ejecuta el submit del formulario
formulario.addEventListener("submit",async e =>{
    
    e.preventDefault();
    

    try {
        //Hacemos aparecer la imagen del loader
        loader.style.display = "block";

        //obtener el valor de los inputs
        let artistValue = e.target.artist.value.toLowerCase();
        let songValue = e.target.song.value.toLowerCase(),
        //almacenar en codigo html los datos
        artistTemplate = "",
        songTemplate = "",
        artisAPI = `https://theaudiodb.com/api/v1/json/2/search.php?s=${artistValue}`,
        songAPI = `https://api.lyrics.ovh/v1/${artistValue}/${songValue}`,
        artistFetch = fetch(artisAPI),
        songFetch = fetch(songAPI),
        //Destructuracion vamos a recibir dos respuestas
        [artistRes,songRes] =await Promise.all([artistFetch,songFetch]),
        artistData = await artistRes.json(),
        songData = await  songRes.json();

        // console.log(artistRes,songRes);
        console.log(artistData,songData);

        //Si no existe la cancion o el artista
        if(artistData.artists === null){
            artistTemplate = `<h2>No existe el interprete <mark>${artistValue}</mark></h2>`;
        }else{ //si existe el artista llenamos nuestro html
            let artist = artistData.artists[0];
            artistTemplate = `
            <h2>${artist.strArtist}</h2>
            <img src = "${artist.strArtistThumb}" alt = "${artist.strArtist}">
            <p>${artist.intBornYear}-${(artist.intDiedYear || "presente")}</p>
            <p>${artist.strCountry}</p>
            <p>${artist.strGenre}-${artist.strStyle}</p>
            <a href = "http://${artist.strWebsite}" target = _blank> Sitio Web </a>
            <p>${(artist.strBiographyEn|| "")}</p>
            `;
        }

        if(songData.error){
            songTemplate = `<h2>No existe la cancion <mark>${songValue}</mark></h2>`;
        }else{
            songTemplate = `
            <h2>${songValue.toUpperCase()}</h2>
            <blockquote>${songData.lyrics} </blockquote>
            `
        }


        loader.style.display = "none";
        $artist.innerHTML = artistTemplate;
        $song.innerHTML = songTemplate;

    } catch (error) {
        console.log(error);
        let message = error.statusText || "Ocurrio un error";
        error.innerHTML = `<p> Error ${error.status}:${message}`;
        //Volvemos a ocultar la imagen de loader
        loader.style.display = "none";
    }
})