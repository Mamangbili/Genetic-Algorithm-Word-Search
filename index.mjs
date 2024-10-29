import { GeneticAlgorithm } from "./src/GA.mjs"
import { chromosomeToString } from "./src/utils.mjs"
console.log('nyala!')

const wordElement = document.querySelector("section.genetic-information span:nth-child(2)")
const wordTarget = document.querySelector("#word-target")
const resultElement = document.querySelector("#word-search")
const generationElement = document.querySelector("tbody tr:first-child td:nth-child(3)")
const mutationElement = document.querySelector("tbody tr:nth-child(2) td:nth-child(3)")
const avgFitnessElement = document.querySelector("tbody tr:nth-child(3) td:nth-child(3)")
const runButton = document.querySelector('#run')
const stopButton = document.querySelector('#stop')

const individualHistoryList = document.querySelector("#individual-history")
const inputElement = document.querySelector("#word-target-input")

const populationInput = document.querySelector("#population-input")
const iterationInput = document.querySelector("#iteration-input")
const mutationInput = document.querySelector("#mutation-input")

inputElement.addEventListener('input',(e)=>{
    wordElement.innerHTML = inputElement.value.toUpperCase() 
    console.log('press!')
})


function subscribeToGAInformation(params){
    console.log(params)
    generationElement.innerHTML = params.generation
    avgFitnessElement.innerHTML = ( params.fitnesses.reduce((prev,next)=>prev+next,0)/params.fitnesses.length ).toFixed(5)
    mutationElement.innerHTML = params.mutation
    resultElement.innerHTML = chromosomeToString(params.bestIndividual.get())

    let listPopulation = ''
    params.population.forEach(chromosome => {
            listPopulation += `<li>${ chromosomeToString(chromosome.get()) }<li>`
    })
    
    individualHistoryList.innerHTML = listPopulation
}

let isRunning = true

runButton.addEventListener('click',()=>{
    isRunning = true
    const ga = new GeneticAlgorithm()
    const input = wordElement.innerHTML
    ga.target(input)
    ga.subscribe(subscribeToGAInformation)
    ga.initialize(populationInput.value)
    const mutation_rate = mutationInput.value 
    const crossover_rate = 3
    const n = iterationInput.value

    ga.run(mutation_rate,crossover_rate,n,()=>{
        return isRunning
    })
    console.log("run!")
})

stopButton.addEventListener('click',(e)=>{
    e.stopPropagation()
    isRunning = false
})


