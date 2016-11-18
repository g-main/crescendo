import PlayerProxy from './PlayerProxy';
import ConnectingState from './States/ConnectingState';
import CalibrationState from './States/CalibrationState';
import PlayerSetupState from './States/PlayerSetupState';
import PlayState from './States/PlayState';
import Socket from './Socket';

(() => {
    const socket = new Socket();
    const player = new PlayerProxy();

    // Initialize states in reverse order.
    const playState = new PlayState(player, socket, null);
    const playerSetupState = new PlayerSetupState(player, socket, playState);
    const calibrationState = new CalibrationState(player, socket, playerSetupState);
    const connectingState = new ConnectingState(player, socket, calibrationState);

    // Force screen to be in landscape orientation. Do not remove!
    if (typeof screen !== 'undefined' && screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape');
    }

    // Initialize the first state.
    connectingState.initialize();
})();
