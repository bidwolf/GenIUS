//Adicionando a biblioteca puppeteer ao projeto
const puppeteer = require('puppeteer');
const generator = require('./src/model/generatePeople');
const { createAccount, getEmail, getCode } = require('./src/controllers/create_Account');
const fs = require('fs');
require('dotenv').config();

(async() => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const people = generator.generatePeople();
    const pageMail = await browser.newPage();
    try {
        people.email = await getEmail(pageMail);
        console.log(people.email);
        await createAccount(people, page);
        const code = await getCode(pageMail).then();
        console.log(code);
        await pageMail.close();
        await page.type('input', code);
        Array.from(await page.$$('button'))[1].click();
        fs.appendFile('accounts.txt', JSON.stringify(people), err => {
            if (err) console.error(err);
            else
                console.log('Perfil salvo.');
        });
    } catch (error) {
        console.error(error);
    }

})();