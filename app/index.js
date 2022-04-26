//Adicionando a biblioteca puppeteer ao projeto
const puppeteer = require('puppeteer');
const generator = require('./src/model/generatePeople');
const { createAccount } = require('./src/controllers/createAccount');
require('dotenv').config();

(async() => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const people = generator.generatePeople();
    try {
        await createAccount(people, page);

    } catch (error) {
        console.error(error);
    }


})();