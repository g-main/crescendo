const MISS_SCORE = -5;
const BAD_SCORE = -5;
const GOOD_SCORE = 10;
const EXCELLENT_SCORE = 20;

class ScoreException {
    toString() {
        return 'Expected one of { Score.MISS, Score.GOOD, Score.EXCELLENT }.';
    }
}

export default class Score {
    constructor() {
        this.reset();
    }

    reset() {
        this.numMiss = 0;
        this.numBad = 0;
        this.numGood = 0;
        this.numExcellent = 0;
        this.currentScore = 0;
    }

    get score() {
        return this.currentScore;
    }

    increment(score) {
        if (score === Score.MISS) {
            this.numMiss++;
            this.currentScore = Math.max(this.currentScore + MISS_SCORE, 0);
        } else if (score === Score.BAD) {
            this.numBad++;
            this.currentScore = Math.max(this.currentScore + BAD_SCORE, 0)
        } else if (score === Score.GOOD) {
            this.numGood++;
            this.currentScore += GOOD_SCORE;
        } else if (score === Score.EXCELLENT) {
            this.numExcellent++;
            this.currentScore += EXCELLENT_SCORE;
        } else {
            throw new ScoreException();
        }
    }
}

class ScoreEnum {
    constructor(name) {
        this.name = name;
    }

    toString() {
        return `Score.${this.name}`;
    }
}

Score.MISS = new ScoreEnum('MISS');
Score.BAD = new ScoreEnum('BAD');
Score.GOOD = new ScoreEnum('GOOD');
Score.EXCELLENT = new ScoreEnum('EXCELLENT');

Object.freeze(Score);
