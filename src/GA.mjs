import { Crossover } from "./Crossover.mjs"
import { Chromosome } from "./Chromosome.mjs"
import { chromosomeToString, random } from "./utils.mjs"

export class GeneticAlgorithm{
    #population = []
    #target = ""
    #fitnesses = []
    #pop_size = 0
    #latestGeneration = 0
    #cumulativeProbability = []
    #observer = []
    #mutation = 0

    constructor(){
    }

    target(word){
        this.#target = word
    }

    initialize(population_size){
        if(this.#target === "") throw new Error("Choose the target first")
        this.#pop_size = population_size
        const chromosome_length = this.#target.length

        for(let n = population_size; n > 0; n--) { 
            const chromosome = []
            for(let i = chromosome_length; i > 0; i--){
                let randomChar = random(64,90)
                if(randomChar === 64) randomChar = 32 // biar ada spasi
                chromosome.push(randomChar)       
            } 
            this.#population.push(new Chromosome(chromosome))
        }

    }
    
    #fitness(target,chromosome){
        let fitness_val = 0 
        const kromosom = chromosome.get()
        for(let i = 0 ; i < target.length ; i++){
            if(kromosom[i]===target.charCodeAt(i)) fitness_val += 1
        }
        return fitness_val/target.length
    }
    
    #evaluate(){
        const new_fitness = []
        this.#population.forEach(chromosome => {
            const fitness_val = this.#fitness(this.#target, chromosome)
            new_fitness.push(fitness_val)
        });

        this.#fitnesses = new_fitness
        

        const totalFitness = new_fitness.reduce((prev,curr)=>prev+curr,0)
        let prevCumulative = 0
        const newProbCum = []
        for(let i = 0; i < this.#population.length; i++){ 
            const currentProb = new_fitness[i]/totalFitness
            newProbCum.push(currentProb + prevCumulative)
            prevCumulative += currentProb 
        }
        
        this.#cumulativeProbability = newProbCum
        this.#fitnesses = this.#fitnesses.slice(0,this.#pop_size)
    }
    
    get(){
        return {
            pop_size:this.#population.length,
            population : this.#population,
            fitnesses : this.#fitnesses,
            generation : this.#latestGeneration,
            best_individual : this.#bestIndividual()
        }
    }
    
    #recombine(recombine_rate,mutation_rate){
        const maximum = this.#population.length/2 * recombine_rate 
        for(let i = 0; i < maximum; i++) { 
            const parent1 = random(0,this.#pop_size-1)
            const parent2 = random(0,this.#pop_size-1)
            
            const co = new Crossover(this.#population[parent1],this.#population[parent2])
            const [offspring1,offspring2] = co.recombine()
            this.#mutation += offspring1.mutate(mutation_rate)
            this.#mutation += offspring2.mutate(mutation_rate)
            this.#population.push(offspring1,offspring2)
        }
    }
    
    run(mutation_rate,crossover_rate,n,shouldStop){
        let i = 1;
        
        const updateGA = () => {
            if(shouldStop() === false) return
            if (i > n) return; 
            
            this.#recombine(crossover_rate, mutation_rate);
            this.#evaluate();
            this.#selection();
            this.#latestGeneration = i;

            const params = {
                population: this.#population,
                fitnesses: this.#fitnesses,
                pop_size: this.#pop_size,
                generation: this.#latestGeneration,
                mutation: this.#mutation,
                bestIndividual: this.#bestIndividual(),
            };
            this.#observer.forEach(obs => obs(params));
            
            if(this.#fitness(this.#target,this.#bestIndividual()) === 1) return

            i++;

            requestAnimationFrame(updateGA);
        };

        requestAnimationFrame(updateGA);
    }
        
    #selection(){
        const newGen = []
        for(let i = 0 ;i < this.#pop_size; i++){
            const r = Math.random()
            let lastCumulative = 0
            let added = false
            for(let j = 0; j < this.#population.length-2; j++){
                const condition = r <= this.#cumulativeProbability[j] && r > lastCumulative 
                if(condition){
                    added = true
                    newGen.push(this.#population[j])
                    lastCumulative = this.#population[j]
                    break
                }
            }
            if(!added) newGen.push(this.#population[this.#population.length-1])
            
        }
        this.#population = newGen
    }
    
    #bestIndividual(){
        for(let i = 0; i < this.#population; i++){
            const fitVal = this.#fitness(this.#target,this.#population[i])
            if(fitVal === 1) return this.#population[i]
        }
        return this.#population[0]
    }
    
    subscribe(fn){
        this.#observer.push(fn) 
    }
}

function generation(params){
    console.log("Generasi ke-",params.generation)
}

function printPopKe100(params){
    if(params.generation === 100){
        console.log(params.population)
    }
}

const ga = new GeneticAlgorithm()

// ga.target("HABIL RAHMAN GANTENG SEKALI")
// ga.initialize(300)
// ga.subscribe(generation)
// ga.subscribe(printPopKe100)
// ga.run(0.2,3,10000)
// console.log((ga.get()))

// console.log("kromosom :",ga.get().population[0].get())
// console.log(chromosomeToString(ga.get().best_individual.get()))

