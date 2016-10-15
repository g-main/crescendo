(function() {
  const io = require('socket.io-client'),
        constants = require('../constants.js'),

        playerEl = document.getElementById('player'),
        joinUrlEl = document.getElementById('join-url'),

        urlParts = window.location.pathname.split('/'),
        roomId = urlParts[1].substring(0, 4).toLowerCase(),
        hostId = urlParts[1].toLowerCase(),

        socket = io.connect(`/${roomId}`),

        audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
        analyser = audioCtx.createAnalyser(),
        SAMPLE_FREQUENCY = 5;

  let timeoutCtx,
      dataArray,
      currentColorIndex,
      changeCounter,
      previousAmount,
      isAmountIncreasing;

  function initialize() {
    setColor(constants.DEFAULT_COLOR);
    joinUrlEl.innerHTML = `Join at /${roomId}`;

    source.addEventListener('change', (event) => {
      playerEl.src = URL.createObjectURL(source.files[0]);
      setupPlayer();
      playerEl.play();
    });

    player.addEventListener('pause', (event) => {
      timeoutCtx && clearTimeout(timeoutCtx);
    });

    player.addEventListener('playing', (event) => {
      timeoutCtx = setTimeout(analyze, SAMPLE_FREQUENCY);
    });
  }

  function setupPlayer() {
    const source = audioCtx.createMediaElementSource(playerEl),
          filter = audioCtx.createBiquadFilter();

    currentColorIndex = -1;
    previousAmount = 0;
    isAmountIncreasing = true;

    filter.type = 'peaking';
    filter.frequency.value = 100;
    filter.Q.value = 0.01;
    filter.gain.value = 20;

    analyser.fftSize = 4096;
    analyser.minDecibels = -40;
    analyser.maxDecibels = -20;

    source.connect(filter);
    source.connect(audioCtx.destination);

    filter.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }

  function analyze() {
    let change = false;

    analyser.getByteFrequencyData(dataArray);

    if (isAmountIncreasing && dataArray[0] < previousAmount) {
      change = true;
      isAmountIncreasing = false;
    }

    if (!isAmountIncreasing && dataArray[0] > previousAmount) {
      isAmountIncreasing = true;
    }

    previousAmount = dataArray[0];

    if (change) {
      changeColor();
    }

    timeoutCtx = setTimeout(analyze, SAMPLE_FREQUENCY);

    // Too Good: 110
    // Hotline Bling: 20
    // Come and See Me: 75
    // Stronger: 35
    // Trophies: 50
  }

  function setColor(color) {
    document.body.style.backgroundColor = color;
    socket.emit('setColor', { roomId, hostId, color, section: constants.DEFAULT_SECTION });
  }

  function changeColor() {
    currentColorIndex++;
    currentColorIndex %= constants.COLORS.length;
    setColor(constants.COLORS[currentColorIndex]);
  }

  initialize();
})();
