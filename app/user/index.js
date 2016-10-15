(function() {
    const io = require('socket.io-client');
    const constants = require('../constants.js');

    // const roomId = window.location.pathname.split('/')[1].toLowerCase();
    // const socket = io.connect(`/${roomId}`);

    let buttons = document.querySelectorAll('.button');
    buttons.forEach(function(button) {
        button.addEventListener('click', function(ev) {
            let button = ev.target;
            while (button.className !== 'button') button = button.parentNode;
            console.log(button.dataset.ring);
        });
    });
})();
