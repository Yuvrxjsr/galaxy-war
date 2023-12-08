'use strict';

export default class Score {
    #date;
    #points;
    #percentage;

    constructor(date, points, totalWords) {
        this.#date = date;
        this.#points = points;
        this.#percentage = this.calculatePercentage(points, totalWords);
    }

    get date() {
        return this.#date;
    }

    get points() {
        return this.#points;
    }

    get percentage() {
        return this.#percentage;
    }

    calculatePercentage(points, totalWords) {
        return totalWords === 0 ? 0 : ((points / totalWords) * 100).toFixed(2);
    }
}