import AbstractState from './AbstractState';
import { SOCKET_EVENTS } from 'constants';

const NUM_TRIPS = 7;

export default class CalibrationState extends AbstractState {
    constructor(player, socket, nextState) {
        super(player, socket, nextState);

        this._trips = [];
        this._dom = {
            page: document.getElementById('page-wrapper'),
            wrapper: document.getElementById('calibration-wrapper'),
            progress: document.getElementById('calibration-progress'),
        };
    }

    initialize() {
        this.show();

        this._socket.addListener(
            SOCKET_EVENTS.CALIBRATION_RESPONSE,
            this.onCalibrationResponse.bind(this)
        );

        this.sendCalibrationRequest();
    }

    show() {
        super.show();
        this._dom.page.classList.add('calibration');
    }

    hide() {
        super.hide();
        this._dom.page.classList.remove('calibration');
    }

    next() {
        super.next();
    }

    sendCalibrationRequest() {
        this._socket.calibrationRequest({
            id: this._player.id,
            reqTimestamp: Date.now(),
        });
    }

    onCalibrationResponse({ id, reqTimestamp }) {
        this._trips.push(Date.now() - reqTimestamp);

        if (this._trips.length < NUM_TRIPS) { // More trips?
            // Update progress view with %.
            const percent = (this._trips.length / NUM_TRIPS) * 100;
            this._dom.progress.innerHTML = `${percent.toFixed(2)}%`;

            this.sendCalibrationRequest();
        } else { // Last trip?
            this.onCalibrationFinished();
        }
    }

    onCalibrationFinished() {
        const average = this._trips.reduce((a, b) => a + b, 0) / (this._trips.length * 2);

        // Update player model with calibration.
        this._player.calibration = Math.floor(average);

        // Update progress view with average ms.
        this._dom.progress.innerHTML = `${average.toFixed(2)} ms`;

        // Go to next state.
        setTimeout(this.next.bind(this), 1000);
    }
}
