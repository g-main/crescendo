(function() {
  const io = require('socket.io-client'),
        constants = require('../constants.js'),

        roomId = window.location.pathname.split('/')[1].toLowerCase(),
        socket = io.connect(`/${roomId}`),

        spotlightEl = document.getElementById('spotlight');

  document.body.style.backgroundColor = constants.DEFAULT_COLOR;

  socket.on('sections', function (data) {
    socket.emit('joinSection', data.sections[0]);
  });

  socket.on('changeColor', function(data) {
    spotlightEl.style.backgroundColor = data.color;
  });
})();
