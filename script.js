document.addEventListener('DOMContentLoaded', initPlayer);

function initPlayer() {
    DZ.init({
        appId: '390144',
        channelUrl: 'https://developers.deezer.com/examples/channel.php',
        player: {
            container: 'dz-root',
            width: 650,
            height: 650,
            format: 'square',
            onload: function () {
                new PlayerSearch('#search');
            }
        }
    });
}


const SEARCH_URL = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/search';
const playlist = null;

class Playlist {
    constructor (domContainerSelector) {
        this.domContainer = document.querySelector(domContainerSelector);
        this.tracks = [];
    }

    addTrack (track) {
        this.tracks.push(track);
        this.renderTrack(track)
    }

    renderTrack (track) {
        const domElement = document.createElement('li');   
        domElement.className = 'list-group-item';
        domElement.innerText = track.title_short;
        domElement.onclick = this.playTrack.bind(this, track.id);
        this.domContainer.appendChild(domElement);
    }

    playTrack (trackId) {
        DZ.player.playTracks([trackId]);
    }
}

class PlayerSearch {
    constructor (domContainerSelector) {
        this.playlist = new Playlist('.playlist-items');
        this.container = document.querySelector(domContainerSelector);  
        this.container.querySelector('.find-track').onclick = this.searchTrack.bind(this);
    }

    searchTrack() {
        const searchQuery = this.container.querySelector('#search-query').value;
    
        const url = encodeURI(SEARCH_URL + `?q=${searchQuery}`);
        fetch(url)
            .then(response => response.json())
            .then(tracks => this.putTrackToPlaylist(tracks.data));
    }

    putTrackToPlaylist(tracks) {
        tracks.length >  0 ?  
            this.playlist.addTrack(tracks[0]) : 
            this.showTrackNotFoundMessage();
    }

    showTrackNotFoundMessage() {
        const message = document.createElement('div');
        message.className = 'alert alert-warning alert-dismissible fade show';

        message.innerHTML = `
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Not found!</strong>
        `;

        this.container.insertAdjacentElement('afterbegin', message);
    }
}