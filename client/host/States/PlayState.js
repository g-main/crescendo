import { GAME_STATES, SOCKET_EVENTS } from 'constants';
import GameState from './GameState';
import Song from '../Models/Song';
import PlayView from '../Views/PlayView';
import NoteView from '../Views/NoteView';
import Score from '../Models/Score';

const TRACK_KEY = 'track';

export default class PlayState extends GameState {
    constructor(game, socket, playerGroup) {
        super(game);

        this.socket = socket;
        this.socket.on(SOCKET_EVENTS.HANDLE_NOTE, this.handleNotePlayed.bind(this));
        this.playerGroup = playerGroup;
    }

    init(gameInfo) {
        const { track } = gameInfo;
        this.song = new Song(track);

        this.playing = false;
        this.bottomBar = null;
        this.gameTrack = null;
        this.musicReady = false;
        this.startTime = null;
    }

    handleNotePlayed({ id, color, timestamp }) {
        const colorMap = {
            blue: 0,
            green: 1,
            yellow: 2,
            red: 3,
        };
        const lineIndex = colorMap[color];
        const relativeTime = timestamp - this.startTime;

        const missedEveryNote = this.noteViews[id][lineIndex].every((noteView) => {
            const score = noteView.isHit(relativeTime);
            if (score !== Score.MISS) {
                this.playerGroup.getById(id).addScore(score);
                return false;
            }
            return true;
        });
        if (missedEveryNote) {
            this.socket.emit(SOCKET_EVENTS.MISSED_NOTE, { id, color });
        }
    }

    preload() {
        this.game.load.audio('track', `tracks/${this.song.file}`);

        // Load assets
        this.game.stage.disableVisibilityChange = true;

        // Enable FPS
        this.game.time.advancedTiming = true;
    }

    create() {
        this.playView = new PlayView(this.game, this.playerGroup, this.song);
        this.noteViews = {};
        this.playerGroup.forEach((player, playerIndex) => {
            const track = this.song.getTrack(player.instrument);
            const playerNotesByLine = [];

            track.forEach((line, lineIndex) => {
                const notesInLine = [];

                line.forEach((note) => {
                    notesInLine.push(new NoteView(this.game, {
                        playAt: note,
                        lineIndex,
                        lineCount: track.length,
                        playerIndex,
                        playerCount: this.playerGroup.getNumPlayers(),
                        bottomBarOffset: this.playView.bottomBarOffset,
                        globalNoteTrackPositiveOffset: this.playView.globalNoteTrackPositiveOffset,
                    }));
                });
                playerNotesByLine.push(notesInLine);
            });
            this.noteViews[player.id] = playerNotesByLine;
        });
        this.playView.noteViews = this.noteViews;

        this.game.input.keyboard.addKey(Phaser.Keyboard.L)
            .onDown.add(this.transitionToSummary, this);

        this.gameTrack = this.game.add.audio(TRACK_KEY);
        this.game.sound.setDecodedCallback(
            [this.gameTrack],
            () => { this.musicReady = true; },
            this,
        );
    }

    update() {
        if (this.musicReady) {
            this.gameTrack.play();
            this.playing = true;
            this.musicReady = false;
            this.startTime = Date.now();
        }

        if (!this.playing) {
            return;
        }

        const relativeTime = Date.now() - this.startTime;
        this.playView.update(relativeTime);

        if ((this.gameTrack.totalDuration * 1000) - this.gameTrack.currentTime <= 0) {
            this.gameTrack.restart();
            this.transitionToSummary();
        }
    }

    render() {
        this.playView.debug();
    }

    shutdown() {
        this.gameTrack.stop();
        this.gameTrack.destroy();
        this.gameTrack = null;
    }

    transitionToSummary() {
        this.game.state.start(GAME_STATES.SUMMARY, true, false, this.playerGroup);
    }
}
