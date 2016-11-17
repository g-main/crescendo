import PlayerProxy from './PlayerProxy';
import ConnectingState from './States/ConnectingState';
import PlayerSetupState from './States/PlayerSetupState';
import PlayState from './States/PlayState';
import Socket from './Socket';

(() => {
    const socket = new Socket();
    const player = new PlayerProxy();

    // Initialize states in reverse order.
    const playState = new PlayState(player, socket, null);
    const playerSetupState = new PlayerSetupState(player, socket, playState);
    const connectingState = new ConnectingState(player, socket, playerSetupState);

    // Force screen to be in landscape orientation. Do not remove!
    if (screen && screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape');
    }

    // Initialize the first state.
    connectingState.initialize();
})();
