
export function random(min,max){
    return Math.floor(Math.random()*(max-min+1))+min
}

export function chromosomeToString(genes){
    let word = ''
    genes.forEach(gen => {
        word += String.fromCharCode(gen)
    });
    return word
}
