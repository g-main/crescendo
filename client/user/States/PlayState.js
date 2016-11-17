import AbstractState from './AbstractState';

export default class PlayState extends AbstractState {
    constructor(player, socket, nextState) {
        super(player, socket, nextState);

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
        super.show();
        this._dom.page.classList.add('play');
    }

    hide() {
        super.hide();
        this._dom.page.classList.remove('play');
    }

    next() {
        super.next();
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
