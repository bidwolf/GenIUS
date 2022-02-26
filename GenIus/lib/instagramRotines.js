async function verify(inputIndex, page) {
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

async function insertInput(input, content, page) {

    input = "[name=\"" + input + "\"]";
    await page.type(input, content);
}

async function signup(page) {
    await page.goto('https://instagram.com/');
    Promise.all([
        await page.waitForNavigation().then(() => {
            page.click('[href="/accounts/emailsignup/"]');
        })
    ]);
}

async function stateInputRefresh(page) {
    const inputIndexUsername = 2;
    let status = await verify(inputIndexUsername, page);
    console.log("EM state input refresh " + status);
    if (status) {
        Promise.all(
            [await (await page.$('span.coreSpriteInputRefresh.Szr5J')).click(),
                await (await page.$('input')).click(),
            ]);
        stateInputRefresh();
    } else return;
}
async function createAccount(emailOrPhone, fullName, username, password, page) {
    Promise.all([

        await signup(page),
        await insertInput("emailOrPhone", emailOrPhone),
        await insertInput("fullName", fullName),
        await insertInput("username", username),
        await insertInput("password", password),
        await stateInputRefresh(page),

    ]);
}
module.exports = {
    verify,
    createAccount,
};