class Prism {

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;

        this.age = 0;
        this.fitness = 0;
    }

    clone() {
        return new Prism(this.r, this.g, this.b);
    }

}

function prismFitness(entity, population) {

    let score = 0;

    for (const other of population) {

        if (other === entity)
            continue;

        const dr = entity.r - other.r;
        const dg = entity.g - other.g;
        const db = entity.b - other.b;

        score -= Math.sqrt(
            dr * dr +
            dg * dg +
            db * db
        );
    }

    return score;
}

function prismInteraction(population) {

    let r = 0;
    let g = 0;
    let b = 0;

    for (const p of population) {
        r += p.r;
        g += p.g;
        b += p.b;
    }

    r /= population.length;
    g /= population.length;
    b /= population.length;

    for (const p of population) {

        p.r += (r - p.r) * 0.05;
        p.g += (g - p.g) * 0.05;
        p.b += (b - p.b) * 0.05;

        p.r = clamp(p.r);
        p.g = clamp(p.g);
        p.b = clamp(p.b);
    }
}

function prismCrossover(a, b) {

    return new Prism(

        Math.floor((a.r + b.r) / 2),
        Math.floor((a.g + b.g) / 2),
        Math.floor((a.b + b.b) / 2)

    );
}

function prismMutate(entity) {

    const child = entity.clone();

    function mutateValue(v) {

        if (Math.random() < 0.2) {
            v += (Math.random() * 40) - 20;
        }

        return clamp(v);
    }

    child.r = mutateValue(child.r);
    child.g = mutateValue(child.g);
    child.b = mutateValue(child.b);

    return child;
}

function randomPrism() {
    return new Prism(
        random255(),
        random255(),
        random255()
    );
}
