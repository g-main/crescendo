(function() {
    class Player {
        constructor(name) {
            this.name = name;
            this.score = 0;
        }

        incrementPoints(inc) {
            if (inc > 0) {
                this.score += inc;
            }
        };
    }

    module.exports = Player;
})();
