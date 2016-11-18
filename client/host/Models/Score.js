const MISS_SCORE = -5;
const GOOD_SCORE = 10;
const EXCELLENT_SCORE = 20;

class ScoreException {
    toString() {
        return 'Expected one of { Score.MISS, Score.GOOD, Score.EXCELLENT }.';
    }
}

export default class Score {

    constructor() {
        this.numMiss = 0;
        this.numGood = 0;
        this.numExcellent = 0;
    }

    get score() {
        return (MISS_SCORE * this.numMiss) +
                (GOOD_SCORE * this.numGood) +
                (EXCELLENT_SCORE * this.numExcellent);
    }

    increment(score) {
        if (score === Score.MISS) {
            this.numMiss++;
        } else if (score === Score.GOOD) {
            this.numGood++;
        } else if (score === Score.EXCELLENT) {
            this.numExcellent++;
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
Score.GOOD = new ScoreEnum('GOOD');
Score.EXCELLENT = new ScoreEnum('EXCELLENT');

Object.freeze(Score);
