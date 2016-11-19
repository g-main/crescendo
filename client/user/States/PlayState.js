import { SOCKET_EVENTS } from 'constants';
import AbstractState from './AbstractState';

export default class PlayState extends AbstractState {
    constructor(player, socket, nextState) {
        super(player, socket, nextState);

        this._dom = {
            page: document.getElementById('page-wrapper'),
            wrapper: document.getElementById('play-wrapper'),
            trackArtist: document.getElementById('metadata-track-artist'),
            trackName: document.getElementById('metadata-track-title'),
        };
    }

    initialize() {
        const controllerButtons = document.querySelectorAll('.button-target');

        controllerButtons.forEach((button) => {
            if ('ontouchstart' in document.documentElement) {
                button.addEventListener('touchend', this.onNotePlayed.bind(this));
            } else {
                button.addEventListener('click', this.onNotePlayed.bind(this));
            }
        });

        this._socket.addListener(SOCKET_EVENTS.MISSED_NOTE, this.onMissedNote.bind(this));
        this._socket.addListener(SOCKET_EVENTS.CHANGE_TRACK, this.onTrackChange.bind(this));

        this._socket.playerReady({ id: this._player.id });

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
        while (button.className !== 'button-target') button = button.parentNode;

        this._socket.playNote({
            id: this._player.id,
            color: button.dataset.ring,
        });
    }

    onMissedNote() {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(200);
        }
    }

    onTrackChange(track) {
        this._dom.trackArtist.innerHTML = track.artist;
        this._dom.trackName.innerHTML = track.name;
    }
}
