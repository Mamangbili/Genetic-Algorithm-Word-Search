import { Chromosome } from "./Chromosome.mjs"
import { random } from "./utils.mjs"

export class Crossover{
    #parent1  
    #parent2   

    constructor(parent1,parent2){
        this.#parent1 = parent1
        this.#parent2 = parent2
    }

    recombine(){
        const i = random(1,this.#parent1.get().length-1) 
        const offspring1 = this.#parent1.get().slice(0,i).concat(  this.#parent2.get().slice(i))
        const offspring2 = this.#parent1.get().slice(i).concat(  this.#parent2.get().slice(0,i) )
        return [new Chromosome(offspring1),new Chromosome(offspring2)]
    }
}