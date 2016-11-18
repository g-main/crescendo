import { GAME_STATES, SOCKET_EVENTS } from 'constants';
import GameState from './GameState';
import Player from '../Models/Player';
import Song from '../Models/Song';
import PlayView from '../Views/PlayView';
import NoteView from '../Views/NoteView';

const TRACK_KEY = 'track';

// The amount of time (in note travel distance) after which the
// last note moves offscreen before we move to the next state
// const END_GAME_OFFSET = 240;

export default class PlayState extends GameState {
    constructor(game, socket, playerGroup) {
        super(game);
        this.initializeSocket(socket);

        // Declare class members here
        this.playing = false;
        this.bottomBar = null;
        this.gameTrack = null;
        this.musicReady = false;
        // this.playerCount = 0;
        // this.initNotes();

        this.player = new Player('mah name');
        this.startTime = null;
        this.playerGroup = playerGroup;
    }

    // initNotes() {
    //     this.notes = [];
    //     for (let u = 0; u < this.playerCount; u++) {
    //         this.notes.push([]);
    //     }
    //     this.lastNoteInSong = null;
    // }

    initializeSocket(socket) {
        socket.on(SOCKET_EVENTS.HANDLE_NOTE, this.handleNotePlayed.bind(this));
    }

    init(gameInfo) {
        const { track } = gameInfo;

        this.song = new Song(track);
        // this.playerCount = playerGroup.getNumPlayers();
        // this.initNotes();
    }

    handleNotePlayed(data) {
        // const color = {
        //     blue: 0,
        //     green: 1,
        //     yellow: 2,
        //     red: 3,
        // };

        // const trackIndex = color[data.color];
        // const relativeTime = data.timestamp - this.startTime;

        // this.trackNotes[trackIndex].forEach(note => {
        //     if (relativeTime > note - 250 && relativeTime <= note + 250) {
        //         this.player.score += 10;
        //     }
        // });
        // TODO: delete note on success (if implemented, need to keep last note)
        // Suggsted: don't delete the note, there are only so many ever drawn on screen
        // and not enough remain in memory for a leak (if properly destroyed)
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

        this.game.input.keyboard.addKey(Phaser.Keyboard.L).onDown.add(this.transitionToSummary, this);

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
        // for (let u = 0; u < this.playerCount ; u++) {
        //     for (let i = 0; i < this.notes[u].length; i++) {
        //         const note = this.notes[u][i];
        //         note.recalculatePosition(relativeTime);
        //     }
        // }
        this.playView.update(relativeTime);

        if (this.gameTrack.totalDuration * 1000 - this.gameTrack.currentTime <= 0) {
            this.transitionToSummary();
        }

        // Check for last note having moved off screen ( plus an offset )
        // if (this.lastNoteInSong.y > this.game.camera.y +
        //         this.game.camera.height + END_GAME_OFFSET) {
        //     this.transitionToSummary();
        // }
    }

    render() {
        // Debug / text
        // TODO: Turn this into an actual rectangle (using graphics)
        this.playView.debug();
        // this.game.debug.geom(this.bottomBar, '#ffffff');
        // this.game.debug.text(this.player.score, 40, 160);

        // this.game.debug.text(`FPS: ${this.game.time.fps}`, 40, 30);
    }

    shutdown() {
        this.gameTrack.stop();
        this.gameTrack.destroy();
        this.gameTrack = null;
        // this.bottomBar = null;
        // this.notes.forEach(noteArray => { noteArray.forEach( note => { note.graphics.destroy(); }); });
        // this.notes = null;
        // this.lastNoteInSong = null;
        // this.playerCount = 0;
    }

    transitionToSummary() {
        this.game.state.start(GAME_STATES.SUMMARY, true, false, this.playerGroup);
    }
}
