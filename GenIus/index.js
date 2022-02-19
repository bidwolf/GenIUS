//Adicionando a biblioteca puppeteer ao projeto
const puppeteer = require('puppeteer');
const generator = require('./generator');
const config = require('./config.json');
const { response } = require('express');

function delay(n) {
    return new Promise(function(resolve) {
        setTimeout(resolve, n * 1000);
    });
}
(async() => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const emailOrPhone = config.email;
    const fullname = generator.generateFullName();
    const password = config.password;
    const username = generator.generateUserName(fullname);
    async function verify(inputIndex) {
        if ((((await page.$$('span.coreSpriteInputError.gBp1f')).length == 0))) return false;
        else {
            let qtdError = (await page.$$('span.coreSpriteInputError.gBp1f')).length;
            return qtdError;

        }
    }
    async function verifier(inputIndex) {
        let numberOfErrors = await verify(inputIndex);
        console.log(numberOfErrors);
        if (numberOfErrors === false) {
            console.log("NOTHING WAS WRONG");
            return false();
        } else {
            console.log(page.$$('span.coreSpriteInputError.gBp1f')[0]);


        }

    }

    async function preencherCampo(campo, conteudo, inputIndex) {

        campo = "[name=\"" + campo + "\"]";
        await page.type(campo, conteudo);
        //console.log(page.$$('input')[inputIndex].parentNode.parentNode == page.$$('span.coreSpriteInputError.gBp1f')[0].parentNode);

        await delay(4);
    }
    async function AcessarInstagram() {
        await page.goto('https://instagram.com/');
        await delay(2);
        await page.click('[href="/accounts/emailsignup/"]');
        await delay(4);
    }

    await AcessarInstagram();
    await preencherCampo("emailOrPhone", emailOrPhone, 0);
    await preencherCampo("fullName", fullname, 1);
    console.log(await verify(1));
    await preencherCampo("username", username, 2);
    console.log(await verify(2));
    await preencherCampo("password", password, 3);
    console.log(await verify(3));

})();