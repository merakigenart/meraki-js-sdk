// shuffles an array using the Fisher-Yates algorithm and returns a new copy of the array.
// randomFunc is a function that returns a random number between 0 and 1.
// source: https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/sets/fisher-yates/fisherYates.js
export default function fisherYatesShuffle(randomFunc: CallableFunction, originalArray: any[]) {
    const result = originalArray.slice(0);

    for (let i = result.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(randomFunc() * (i + 1));
        [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
    }

    return result;
}
