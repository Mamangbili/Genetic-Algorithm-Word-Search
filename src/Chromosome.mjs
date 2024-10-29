import { random } from "./utils.mjs"


export class Chromosome {
    #chromosome

    constructor(chromosome) {
        this.#chromosome = chromosome
    }

    mutate(mutation_rate) {
        const r = Math.random()
        if (r < mutation_rate) {
            for(let i = 0; i < this.#chromosome.length; i++){
                this.#chromosome[i] = random(64,90)
                if(this.#chromosome[i]===64) this.#chromosome[i] = 32
            }
            return 1
        }
        return 0
    }


    get() {
        return this.#chromosome
    }
}
