const SOCKET_EVENTS = {
    PLAY_NOTE: 'PlayNote',
    HANDLE_NOTE: 'Noted',
};

const INSTRUMENTS = {
    DRUMS: 'drums',
};

const GAME_STATES = {
    LOAD: 'Load',
    MENU: 'Menu',
    PLAY: 'Play',
    JOIN: 'Join',
    SUMMARY: 'Summary',
};

const TEXT_STYLES = {
    TITLE_FONT_STYLE: {
        font: '100px Lato',
        fill: '#ffffff',
    },
    TEXT_FONT_STYLE: {
        font: '40px Lato',
        fill: '#ffffff',
    },
    CALL_TO_ACTION_FONT_STYLE: {
        font: '50px Lato',
        fill: '#ffffff',
    },
    PLAYER_NAME_CARD: {
        font: '25px Lato',
        fill: '#000000',
    },
};

export { SOCKET_EVENTS, INSTRUMENTS, GAME_STATES, TEXT_STYLES };
