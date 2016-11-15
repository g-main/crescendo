(function() {
    // Force screen to be in landscape orientation. Do not remove!
    if (screen && screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape');
    }

    const io = require('socket.io-client');

    const roomId = window.location.pathname.split('/')[1].toLowerCase();
    const socket = io.connect(`/${roomId}`);

    // The "model".
    let playerData = {
        instrument: null,
        name: 'Werner' // cuz we on a first name basis.
    };

    // On load, initialize player setup state.
    initializePlayerSetup();

    /****************
    Initializers.
    ****************/

    function initializePlayerSetup() {
        let instrumentButtons = document.querySelectorAll('.instrument-selector-instrument');
        instrumentButtons.forEach(function(button) {
            button.addEventListener('click', onInstrumentSelected);
        });
    }

    function initializePlay() {
        let controllerButtons = document.querySelectorAll('.button');
        controllerButtons.forEach(function(button) {
            button.addEventListener('click', onNotePlayed);
        });
    }

    /****************
    Event handlers.
    ****************/

    function onInstrumentSelected(ev) {
        let page = document.getElementById('page-wrapper');
        let playerSetup = document.getElementById('player-setup-wrapper');
        let nameInput = document.getElementById('player-name');
        let play = document.getElementById('play-wrapper');

        let target = ev.target;

        setName(nameInput.value);
        setInstrument(target.dataset.instrument);

        // Set selected on clicked button.
        target.classList.add('instrument-selected');

        setTimeout(function() {
            // Remove gradient background.
            page.classList.remove('player-setup');

            // Hide player setup content.
            playerSetup.classList.add('hidden');

            // Initialize play content and show.
            initializePlay();
            play.classList.remove('hidden');
        }, 1000);
    }

    function onNotePlayed(ev) {
        let button = ev.target;
        while (button.className !== 'button') button = button.parentNode;
        socket.emit('playNote', {
            color: button.dataset.ring,
            timestamp: Date.now()
        });
    }

    /****************
    Helpers.
    ****************/

    function setInstrument(instrument) {
        let playerMetadata = document.getElementById('metadata-player');
        let playerInstrument = document.getElementById('metadata-instrument');

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

    function setName(name) {
        let playerName = document.getElementById('metadata-player-name');

        playerData.name = name || playerData.name;
        playerName.innerHTML = playerData.name;
    }
})();
