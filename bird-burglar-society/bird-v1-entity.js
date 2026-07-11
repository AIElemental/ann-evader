BEHAVIOR_TRUST="BEHAVIOR_TRUST"
BEHAVIOR_RECIPROCAL="BEHAVIOR_RECIPROCAL"
BEHAVIOR_DECEIT="BEHAVIOR_DECEIT"

class Bird {

    constructor(behavior) {
        this.behavior = behavior;

        this.age = 0;
        this.fitness = 0;
    }

    clone() {
        return new Bird(this.behavior);
    }

}

function birdFitness(entity, population) {
    let fitness = entity.fitness
    entity.fitness = 0
    return fitness
}

function birdInteractionPair(a, b) {
    if (a.behavior === BEHAVIOR_TRUST && b.behavior === BEHAVIOR_TRUST) {
        a.fitness++
        b.fitness++
    } else if (a.behavior === BEHAVIOR_TRUST && b.behavior === BEHAVIOR_RECIPROCAL) {
        a.fitness++
        b.fitness++
    } else if (a.behavior === BEHAVIOR_TRUST && b.behavior === BEHAVIOR_DECEIT) {
        b.fitness++
    } else if (a.behavior === BEHAVIOR_RECIPROCAL && b.behavior === BEHAVIOR_TRUST) {
        a.fitness++
        b.fitness++
    } else if (a.behavior === BEHAVIOR_RECIPROCAL && b.behavior === BEHAVIOR_RECIPROCAL) {
    } else if (a.behavior === BEHAVIOR_RECIPROCAL && b.behavior === BEHAVIOR_DECEIT) {
    } else if (a.behavior === BEHAVIOR_DECEIT && b.behavior === BEHAVIOR_TRUST) {
        a.fitness++
    } else if (a.behavior === BEHAVIOR_DECEIT && b.behavior === BEHAVIOR_RECIPROCAL) {
    } else if (a.behavior === BEHAVIOR_DECEIT && b.behavior === BEHAVIOR_DECEIT) {
    }
}
function birdInteraction(population) {
    for (const a of population) {
        let meet = getRandomItems(population, 5)

        for (const b of meet) {
            birdInteractionPair(a, b)
        }
    }
}

function birdCrossover(a, b) {
    let childBehavior = Math.random() < 0.5 ? a.behavior : b.behavior
    return new Bird(
        childBehavior
    );
}

function birdMutate(entity) {

    const child = entity.clone();

    if (Math.random() < 0.05) {
        if (child.behavior === BEHAVIOR_TRUST) {
            child.behavior = BEHAVIOR_RECIPROCAL
        } else if (child.behavior === BEHAVIOR_RECIPROCAL) {
            if (Math.random() < 0.5) {
                child.behavior = BEHAVIOR_TRUST
            } else {
                child.behavior = BEHAVIOR_DECEIT
            }
        } else if  (child.behavior === BEHAVIOR_DECEIT) {
            child.behavior = BEHAVIOR_RECIPROCAL
        }
    }

    return child;
}

function randomBird() {
    let random = Math.random()
    if (random < 0.333333) {
        return new Bird(BEHAVIOR_TRUST);
    } else if (random < 0.666666) {
        return new Bird(BEHAVIOR_RECIPROCAL);
    } else {
        return new Bird(BEHAVIOR_DECEIT);
    }
}