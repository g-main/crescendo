import { GAME_STATES, SOCKET_EVENTS, TEXT_STYLES } from 'constants';
import GameState from './GameState';
import Song from '../Models/Song';
import PlayView from '../Views/PlayView';
import NoteView from '../Views/NoteView';
import TrackView from '../Views/TrackView';
import Score from '../Models/Score';

const TRACK_KEY = 'track';
const colorMap = {
    blue: 0,
    green: 1,
    yellow: 2,
    red: 3,
};

export default class PlayState extends GameState {
    constructor(game, socket, playerGroup) {
        super(game);

        this.socket = socket;
        this.socket.on(SOCKET_EVENTS.HANDLE_NOTE, this.handleNotePlayed.bind(this));
        this.playerGroup = playerGroup;
    }

    handleNotePlayed({ id, color, timestamp }) {
        const lineIndex = colorMap[color];
        const relativeTime = Date.now() - this.startTime - this.playerGroup.getById(id).calibration;
        this.trackViews[id].indicateLinePressed(lineIndex);

        const missedEveryNote = this.noteViews[id][lineIndex].every((noteView) => {
            const score = noteView.isHit(relativeTime);
            if (score !== Score.MISS) {
                noteView.hide();
                this.playerGroup.getById(id).addScore(score);
                this.trackViews[id].displayScoreTextFeedback(score);
                return false;
            }
            return true;
        });
        if (missedEveryNote) {
            this.socket.emit(SOCKET_EVENTS.MISSED_NOTE, { id, color });
        }
    }

    init(gameInfo) {
        const { track } = gameInfo;
        this.song = new Song(track);

        this.bottomBar = null;
        this.gameTrack = null;
        this.startTime = null;
    }

    preload() {
        this.game.load.audio('track', `tracks/${this.song.file}`);
        this.game.stage.disableVisibilityChange = true;
        this.game.time.advancedTiming = true;
    }

    create() {
        // Create views
        this.playView = new PlayView(this.game, this.playerGroup, this.song);
        this.noteViews = {};
        this.trackViews = {};

        this.playerGroup.forEach((player, playerIndex) => {
            const track = this.song.getTrack(player.instrument);
            this.trackViews[player.id] = new TrackView(this.game, {
                track,
                globalNoteTrackPositiveOffset: this.playView.globalNoteTrackPositiveOffset,
                bottomBarY: this.game.world.height - this.playView.bottomBarOffset,
                playerIndex,
                playerCount: this.playerGroup.getNumPlayers()
            });
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

        // Initialize input listeners
        this.game.input.keyboard.addKey(Phaser.Keyboard.L)
            .onDown.add(this.transitionToSummary, this);

        // Initialize audio
        this.gameTrack = this.game.add.audio(TRACK_KEY);
        this.game.sound.setDecodedCallback(
            [this.gameTrack],
            () => {
                this.gameTrack.play();
                this.startTime = Date.now();
            }, this);
    }

    update() {
        if (!this.startTime) {
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
