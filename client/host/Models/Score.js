class ScoreException {
    toString() {
        return 'Expected one of { Score.MISS, Score.GOOD, Score.EXCELLENT }.';
    }
}

const DEFAULT_SCORE_TYPES = {
    MISS: {
        name: 'Miss',
        value: -5,
    },
    BAD: {
        name: 'Bad',
        value: -5,
    },
    GOOD: {
        name: 'Good',
        value: 10,
    },
    EXCELLENT: {
        name: 'Excellent',
        value: 20,
    },
};

export default class Score {
    constructor(types) {
        this.types = types || DEFAULT_SCORE_TYPES;
        this.scores = {};
        this.currentScore = 0;

        this.reset();
    }

    reset() {
        Object.keys(this.types).forEach(type => {
            this.scores[type] = 0;
        });
        this.currentScore = 0;
    }

    get score() {
        return this.currentScore;
    }

    increment(type) {
        if (type in this.types) {
            this.scores[type]++;
            this.currentScore = Math.max(this.currentScore + this.types[type].value, 0);
        } else {
            throw new ScoreException();
        }
    }
}
