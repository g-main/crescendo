import io from 'socket.io-client';
import { SOCKET_EVENTS } from 'constants';

const roomId = window.location.pathname.split('/')[1].toLowerCase();
const socket = io.connect(`/${roomId}`);

(() => {
    // The "model".
    const playerData = {
        instrument: null,
        name: 'Werner', // cuz we on a first name basis.
    };

    function setName(name) {
        const playerName = document.getElementById('metadata-player-name');

        playerData.name = name || playerData.name;
        playerName.innerHTML = playerData.name;
    }

    function setInstrument(instrument) {
        const playerMetadata = document.getElementById('metadata-player');
        const playerInstrument = document.getElementById('metadata-instrument');

        playerData.instrument = instrument;
        playerInstrument.innerHTML = playerData.instrument;

        switch (instrument) {
        case 'drums':
            playerMetadata.classList.add('instrument-drums');
            break;
        case 'guitar':
            playerMetadata.classList.add('instrument-guitar');
            break;
        default:
            break;
        }
    }

    function onNotePlayed(ev) {
        let button = ev.target;
        while (button.className !== 'button') button = button.parentNode;
        socket.emit(SOCKET_EVENTS.PLAY_NOTE, {
            color: button.dataset.ring,
            timestamp: Date.now(),
        });
    }

    function initializePlay() {
        const controllerButtons = document.querySelectorAll('.button');
        controllerButtons.forEach((button) => {
            button.addEventListener('click', onNotePlayed);
        });
    }

    function joinGame() {
        socket.emit(SOCKET_EVENTS.JOIN_GAME_REQUEST, playerData);
    }

    function onInstrumentSelected(ev) {
        const page = document.getElementById('page-wrapper');
        const playerSetup = document.getElementById('player-setup-wrapper');
        const nameInput = document.getElementById('player-name');
        const play = document.getElementById('play-wrapper');

        const target = ev.target;

        setName(nameInput.value);
        setInstrument(target.dataset.instrument);

        // Set selected on clicked button.
        target.classList.add('instrument-selected');

        setTimeout(() => {
            // Remove gradient background.
            page.classList.remove('player-setup');

            // Hide player setup content.
            playerSetup.classList.add('hidden');

            // Initialize play content, join game, and show.
            initializePlay();
            joinGame();
            play.classList.remove('hidden');
        }, 1000);
    }

    function initialize() {
        // Force screen to be in landscape orientation. Do not remove!
        if (screen && screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape');
        }

        const instrumentButtons = document.querySelectorAll('.instrument-selector-instrument');
        instrumentButtons.forEach((button) => {
            button.addEventListener('click', onInstrumentSelected);
        });
    }

    // On load, initialize player setup state.
    initialize();
})();
