const fs = require('fs');
const People = require('./people');

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
    let surname = '';
    for (let i = 0; i < qtdSurnames; i++) {
        surname = surname + generateAleatoryName(surnames) + ' ';
    }
    let fullName = name + ' ' + surname;
    if (fullName.length > MAX_Characters) {
        for (let index = surname.length - 1; surname[index] != ' '; index--) {
            surname = surname.slice(0, index);
        }
    }
    return { name: capitalize(name.toLowerCase()), surname: capitalize(surname.toLowerCase()) };
}

function generateUserName(name) {

    for (let i = 0; i < name.length; i++) name = name.replace(' ', '_');

    return name;
}

function generateRandomBirthday() {
    let dia = generateRandom(30) + 1;
    let mes = generateRandom(11) + 1;
    let ano = generateRandom(20) + 1980;
    let day = new Date();
    day.setFullYear(ano, mes, dia);
    return day;
}

function generatePeople() {

    let fullName = generateFullName();
    let birthday = generateRandomBirthday();
    return new People(fullName.name, fullName.surname, birthday);

}
module.exports = {
    generatePeople
};