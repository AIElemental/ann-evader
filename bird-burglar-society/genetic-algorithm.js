// ================================
// Generic Genetic Algorithm
// ================================

class GeneticAlgorithm {
    constructor({
                    populationSize,
                    maxAge,

                    createRandomEntity,
                    fitnessFunction,
                    interactionRound,
                    crossover,
                    mutate
                }) {
        this.populationSize = populationSize;
        this.maxAge = maxAge;

        this.createRandomEntity = createRandomEntity;
        this.fitnessFunction = fitnessFunction;
        this.interactionRound = interactionRound;
        this.crossover = crossover;
        this.mutate = mutate;

        this.population = [];

        for (let i = 0; i < populationSize; i++) {
            const e = createRandomEntity();
            e.age = 0;
            e.fitness = 0;
            this.population.push(e);
        }
    }

    step() {

        // ----------------
        // Custom interaction
        // ----------------
        this.interactionRound(this.population);

        // ----------------
        // Fitness
        // ----------------
        for (const e of this.population) {
            e.fitness = this.fitnessFunction(e, this.population);
        }

        // ----------------
        // Sort best first
        // ----------------
        this.population.sort((a, b) => b.fitness - a.fitness);

        // ----------------
        // Age
        // ----------------
        for (const e of this.population) {
            e.age++;
        }

        // ----------------
        // Survivors
        // ----------------
        const survivors = this.population.filter(
            e => e.age < this.maxAge
        );

        // ----------------
        // Reproduce
        // ----------------
        while (survivors.length < this.populationSize) {

            const p1 = this.selectParent(survivors);
            const p2 = this.selectParent(survivors);

            let child = this.crossover(p1, p2);
            child = this.mutate(child);

            child.age = 0;
            child.fitness = 0;

            survivors.push(child);
        }

        this.population = survivors;
    }

    // very simple tournament selection
    selectParent(pop) {

        const a = pop[Math.floor(Math.random() * pop.length)];
        const b = pop[Math.floor(Math.random() * pop.length)];

        return (a.fitness > b.fitness) ? a : b;
    }
}