'use strict';

class Sample {
    constructor() {
    }

    survive() {
        return true
    }

    mutate() {
        return this
    }

    interact(other) {
        return
    }

    offspring(other) {

    }
}

class Bird extends Sample {
    constructor(traits) {
        this.traits = traits;
        this.reciprocalTrust = []
        this.reciprocalDistrust = []
    }

    constructor() {
        this.traits = {
            age: 0,
            ageLimit: 1,
            points: 0,
            pointsToLive: 10,
            trust: Math.random(),
            reciprocalTrust: 1.0,
            reciprocalDistrust: 1.0
        };
    }

    survive() {
        let ageOk = this.traits["age"] <= this.traits["ageLimit"]
        let pointsOk = this.traits["points"] >= this.traits["pointsToLive"]
        return ageOk && pointsOk
    }

    mutate() {
        this.traits[trust] = Math.min(1.0, Math.max(0.0, Math.random() / 20.0))
        return this
    }

    interact(other) {
        if (Math.random() < this.traits[trust]) {
            // trusting

        } else if () {

        }
        return
    }

    offspring(other) {
        return Bird(
            {
                age: 0,
                ageLimit: (this.ageLimit + other.ageLimit) / 2.0,
                points: 0,
                pointsToLive: (this.pointsToLive + other.pointsToLive) / 2.0,
                trust: (this.trust + other.trust) / 2.0
            }
        ).mutate()
    }
}