export default class PlayState {
    constructor(player, socket, nextState) {
        this._player = player;
        this._socket = socket;
        this._nextState = nextState || null;

        this._dom = {
            page: document.getElementById('page-wrapper'),
            wrapper: document.getElementById('play-wrapper'),
            trackArtist: document.getElementById('metadata-track-artist'),
            trackName: document.getElementById('metadata-track-title')
        };
    }

    initialize() {
        const controllerButtons = document.querySelectorAll('.button');

        controllerButtons.forEach((button) => {
            button.addEventListener('click', this.onNotePlayed.bind(this));
        });

        this.show();
    }

    show() {
        this._dom.page.classList.add('play');
        this._dom.wrapper.classList.remove('hidden');
    }

    hide() {
        this._dom.page.classList.remove('play');
        this._dom.wrapper.classList.add('hidden');
    }

    next() {
        this.hide();
        if (this._nextState) this._nextState.initialize();
    }

    onNotePlayed(ev) {
        let button = ev.target;
        while (button.className !== 'button') button = button.parentNode;
        this._socket.playNote({
            id: this._player.id,
            color: button.dataset.ring,
            timestamp: Date.now()
        });
    }

    onTrackChange(track) {
        // TODO: implement once server sends event.
    }
}
