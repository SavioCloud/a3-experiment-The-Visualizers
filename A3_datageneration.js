
const chartTypes = ["bar", "pie", "stacked-bar"];

// Shuffling the data into a random order
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function generateTrial(chartType, targetPercent) {
    while (true) {
        // This generates 5 random numbers
        let values = Array.from({length: 5}, () => Math.random());

        // Add them up to 100
        const total = values.reduce((a, b) => a + b, 0);
        values = values.map(v => v * 100 / total);

        // Cleveland-McGill constraints
        if (values.some(v => v <= 3 || v >= 39) ||
            values.some((v, i) =>
                values.slice(i + 1).some(x => Math.abs(v - x) <= 0.1))) {
            continue;
        }


        const pairs = [];

        for (let i = 0; i < 5; i++) {
            for (let j = i + 1; j < 5; j++) {
                const percent = 100 * Math.min(values[i], values[j])
                                  / Math.max(values[i], values[j]);

                if (Math.abs(percent - targetPercent) <= 2.5) {
                    pairs.push([i, j]);
                }
            }
        }

        if (pairs.length > 0) {
            const markedIndices = pairs[Math.floor(Math.random() * pairs.length)];
            const [i, j] = markedIndices;

            return {
                chartType,
                values,
                markedIndices,
                correctPercentage: 100 * Math.min(values[i], values[j])
                                      / Math.max(values[i], values[j])
            };
        }
    }
}


// Make experiment, has the percentage calculation done here 
function generateExperiment() {
    const trials = [];

    for (const chart of chartTypes) {
        for (let i = 0; i < 20; i++) {
            const percentage = 10 + (i % 18) * 5;
            trials.push(generateTrial(chart, percentage));
        }
    }

    return shuffle(trials);
}

// accessing the function the webpage
if (typeof window !== "undefined") {
    window.generateExperiment = generateExperiment;
}

// Only run this test when using Node.js
if (typeof require !== "undefined" && require.main === module) {
    const trials = generateExperiment();
    console.log("Total Trials:", trials.length);
    console.log("First Trial:", trials[0]);
}


// Testing the experiment
const trials = generateExperiment();

console.log("Total Trials:", trials.length);
console.log("First Trial:", trials[0]);



