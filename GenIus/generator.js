const fs = require('fs');

function load(contentFilePath) {
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8', (err, arq) => { console.log("err"); });
    let names = fileBuffer.split('\r\n');
    return names;
}

function generateRandom(max) {
    return Math.floor(Math.random() * max);
}

function generateAleatoryName(name) {
    let fileRow = generateRandom(name.length);
    return (name[fileRow]);
}

function capitalize(string) {
    return string.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

function generateFullName() {
    const MAX_Characters = 30;
    const names = load('Nomes.txt');
    const surnames = load('Sobrenomes.txt');
    const qtdSurnames = generateRandom(3) + 1;
    let name = generateAleatoryName(names);
    for (let i = 0; i < qtdSurnames; i++) {
        name = name + " " + generateAleatoryName(surnames);
    }
    if (name.length > MAX_Characters) {
        for (let index = name.length - 1; name[index] != ' '; index--) {
            name = name.slice(0, index);

        }
    }
    return capitalize(name.toLowerCase());
}

function generateUserName(name) {

    for (let i = 0; i < name.length; i++) name = name.replace(' ', '_');

    return name;
}
console.log(generateUserName(generateFullName()));
module.exports = {
    generateFullName,
    generateUserName
};