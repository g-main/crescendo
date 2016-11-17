import { INSTRUMENTS } from 'constants';

export default class PlayerSetupState {
    constructor(player, socket, nextState) {
        this._player = player;
        this._socket = socket;
        this._nextState = nextState || null;

        this._dom = {
            page: document.getElementById('page-wrapper'),
            wrapper: document.getElementById('player-setup-wrapper'),
            name: document.getElementById('player-name'),
            playerMetadata: document.getElementById('metadata-player'),
            playerName: document.getElementById('metadata-player-name'),
            instrumentMetadata: document.getElementById('metadata-instrument')
        };
    }

    initialize() {
        const instrumentButtons = document.querySelectorAll('.instrument-selector-instrument');

        instrumentButtons.forEach((button) => {
            button.addEventListener('click', this.onInstrumentSelected.bind(this));
        });

        this.show();
    }

    show() {
        this._dom.page.classList.add('player-setup');
        this._dom.wrapper.classList.remove('hidden');
    }

    hide() {
        this._dom.page.classList.remove('player-setup');
        this._dom.wrapper.classList.add('hidden');
    }

    next() {
        this.hide();
        if (this._nextState) this._nextState.initialize();
    }

    onInstrumentSelected(ev) {
        const selectedInstrument = ev.target;

        this.setName(this._dom.name.value);
        this.setInstrument(selectedInstrument.dataset.instrument);

        // Set selected on clicked button.
        selectedInstrument.classList.add('instrument-selected');

        this._socket.joinGame({
            id: this._player.id,
            name: this._player.name,
            instrument: this._player.instrument
        });

        setTimeout(this.next.bind(this), 1000);
    }

    setName(name) {
        // Update "model".
        this._player.name = name || this._player.name;

        // Update "view".
        this._dom.playerName.innerHTML = this._player.name;
    }

    setInstrument(instrument) {
        // Update "model".
        this._player.instrument = instrument;

        // Update "view".
        this._dom.instrumentMetadata.innerHTML = this._player.instrument;
        switch (instrument) {
            case INSTRUMENTS.DRUMS:
                this._dom.instrumentMetadata.classList.add('instrument-drums');
                break;
            case INSTRUMENTS.GUITAR:
                this._dom.playerMetadata.classList.add('instrument-guitar');
                break;
            default:
                break;
        }
    }
}
