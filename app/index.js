//Adicionando a biblioteca puppeteer ao projeto
const puppeteer = require('puppeteer');
const generator = require('./src/model/generatePeople');
const { createAccount, createGmail } = require('./src/controllers/create_Account');
require('dotenv').config();

(async() => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const page2 = await browser.newPage();
    const people = generator.generatePeople();
    try {
        await createAccount(people, page);
        await createGmail(people, page2);
    } catch (error) {
        console.error(error);
    }


})();