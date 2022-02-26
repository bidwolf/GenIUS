//Adicionando a biblioteca puppeteer ao projeto
const puppeteer = require('puppeteer');
const generator = require('./lib/generator');
require('dotenv').config();

function delay(n) {
    return new Promise(function(resolve) {
        setTimeout(resolve, n * 1000);
    });
}
(async() => {
    async function verify(inputIndex) {
        if ((await page.$$("span.coreSpriteInputError.gBp1f")) == []) {
            return false;
        } else if (await (await page.$$("span.coreSpriteInputAccepted")).length > 2) {
            return false;
        } else {
            console.log((await page.$$("span.coreSpriteInputError.gBp1f")).length);
            const result = await page.evaluate(() => {
                const inputNode = Array.from(document.querySelectorAll('input')).map((inputNode) => {
                    return inputNode.parentNode.parentNode; //Pega o nodelist referente ao input observado e captura o elemento pai de seu elemento pai no DOM
                });
                const result = [];
                for (let i = 0; i < inputNode.length - 1; i++) {

                    result[i] = Array.from(Array.from(inputNode[i].childNodes)[1].childNodes)[0].className; // Pega o atributo filho que se refere ao Sprite que referencia se ha ou nao um erro na entrada inserida
                }
                return result;
            });
            return (result[inputIndex] == 'coreSpriteInputError gBp1f'); //retorna true para erro de entrada e false para entrada aceita

        }

    }
    async function insertInput(input, content) {

        input = "[name=\"" + input + "\"]";
        await page.type(input, content);
        await delay(4);
    }
    async function signupInstagram() {
        await page.goto('https://instagram.com/');
        await delay(2);
        await page.click('[href="/accounts/emailsignup/"]');
        await delay(4);
    }
    async function stateInputRefresh() {
        let status = await verify(2);
        console.log("EM state input refresh " + status);
        if (status) {
            await (await page.$('span.coreSpriteInputRefresh.Szr5J')).click();
            await delay(2);
            await (await page.$('input')).click();
            stateInputRefresh();
        } else return;
    }
    async function createAccount() {

        await signupInstagram();
        await insertInput("emailOrPhone", process.env.PRIVATE_EMAIL);
        await insertInput("fullName", fullName);
        await insertInput("username", username);
        await insertInput("password", process.env.PRIVATE_PASSWORD);
        await stateInputRefresh();
    }
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const fullName = generator.generateFullName();
    const username = generator.generateUserName(fullName);
    await createAccount();
    await delay(2);
    console.log(await verify(2));

})();