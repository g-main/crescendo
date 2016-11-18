import { INSTRUMENTS } from 'constants';
import AbstractState from './AbstractState';

export default class PlayerSetupState extends AbstractState {
    constructor(player, socket, nextState) {
        super(player, socket, nextState);

        this._dom = {
            page: document.getElementById('page-wrapper'),
            wrapper: document.getElementById('player-setup-wrapper'),
            name: document.getElementById('player-name'),
            playerMetadata: document.getElementById('metadata-player'),
            playerName: document.getElementById('metadata-player-name'),
            instrumentMetadata: document.getElementById('metadata-instrument'),
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
        super.show();
        this._dom.page.classList.add('player-setup');
    }

    hide() {
        super.hide();
        this._dom.page.classList.remove('player-setup');
    }

    next() {
        super.next();
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
            instrument: this._player.instrument,
            calibration: this._player.calibration,
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
