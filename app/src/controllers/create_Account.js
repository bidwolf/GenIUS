function delay(n) {
    return new Promise(function(resolve) {
        setTimeout(resolve, n * 1000);
    });
}
async function verify(inputIndex, page) {
    if ((await page.$$("span.coreSpriteInputError.gBp1f")) == []) {
        return false;
    } else if ((await page.$$("span.coreSpriteInputAccepted")).length > 2) {
        return false;
    } else {
        console.log((await page.$$("span.coreSpriteInputError.gBp1f")).length);
        const result = await page.evaluate(() => {
            const inputNode = Array.from(document.querySelectorAll('input')).map((inputNode) => {
                return inputNode.parentNode.parentNode; //Pega o nodeList referente ao input observado e captura o elemento pai de seu elemento pai no DOM
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
async function insertInput(input, content, page) {

    input = "[name=\"" + input + "\"]";
    await page.type(input, content);
    await delay(4);
}
async function signupPage(page, url, selector) {
    await page.goto(url);
    await delay(2);
    await page.click(selector);
    await delay(4);
}
async function stateInputRefresh(page) {
    let status = await verify(2, page);
    console.log("In state input refresh " + status);
    if (status) {
        await (await page.$('span.coreSpriteInputRefresh.Szr5J')).click();
        await delay(2);
        await (await page.$('input')).click();
        stateInputRefresh(page);
    } else return;
}
async function createAccount(people, page) {
    let url = 'https://instagram.com/';
    let button = '[href="/accounts/emailsignup/"]';
    await signupPage(page, url, button);
    await insertInput("emailOrPhone", process.env.PRIVATE_EMAIL, page);
    await insertInput("fullName", people.fullName, page);
    await insertInput("username", people.userName, page);
    await insertInput("password", process.env.PRIVATE_PASSWORD, page);
    await stateInputRefresh(page);
    await delay(2);
    if (!(await verify(2, page))) {
        await send(page);
        await delay(2);
        await setBirthdayAccount(people.birthday.getDate(), people.birthday.getMonth(), people.birthday.getFullYear(), page);
        await delay(2);
        await send(page);
        try {
            await page.waitForSelector('line', { 'timeout': 2000 });
            await (await page.$('line')).click();

        } catch (err) {
            console.log('não há pop-up aberta, continuando');
        }
        await send(page);
    }
}
async function setBirthdayAccount(day, month, year, page) {
    let options = Array.from(await page.$$('select'));
    try {

        options[0].select(month.toString());
        options[1].select(day.toString());
        options[2].select(year.toString());
    } catch (error) {
        console.error(error);
    }
}
async function send(page) {
    await page.$$eval('button', (buttons) => {
        let submitIndex = buttons.findIndex(el => el.type == "submit" || el.innerText.toLowerCase() == 'avançar');
        buttons[submitIndex].click();

    });
}

async function createGmail(people, page) {
    const url = 'https://www.google.com/intl/pt-PT/gmail/about/';
    const button = '[href="https://accounts.google.com/signup/v2/webcreateaccount?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&flowName=GlifWebSignIn&flowEntry=SignUp"]';
    await signupPage(page, url, button);
    await insertInput("firstName", people.firstName, page);
    await insertInput("lastName", people.lastName, page);
    // await insertInput("Username", people.userName2, page);
    await insertInput("Passwd", process.env.PRIVATE_PASSWORD, page);
    await insertInput("ConfirmPasswd", process.env.PRIVATE_PASSWORD, page);

}
async function getEmail(page) {
    const url = 'https://tempail.com/pt/';
    await page.waitForNavigation();
    const email = Array.from(await page.$$('input'))[0].value;
    return email;
}
async function getCode(page) {
    await page.waitForSelector('a>div.baslik', { timeout: 0, visible: true }).then(() => console.log('código de verificação recebido'));
    let code = Array.from(await page.$$('a>div.baslik'))[0].innerText.split(' ')[0];
    return code;
}
module.exports = {
    createAccount,
    createGmail,
    getEmail,
    getCode
};