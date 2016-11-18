export default class Observable {
    constructor() {
        this.observers = [];
    }

    update() {
        this.observers.forEach(obs => { obs.notify(); });
    }
}
