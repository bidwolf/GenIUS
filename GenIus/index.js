//Adicionando a biblioteca puppeteer ao projeto
const puppeteer = require('puppeteer');

function delay(n) {
    return new Promise(function(resolve) {
        setTimeout(resolve, n * 1000);
    });
}
(async() => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://instagram.com/');
    await delay(2);
    await page.click('[href="/accounts/emailsignup/"]');
    await delay(4);
    await page.type('[name="emailOrPhone"]', 'sexo@gmail.com');
    await delay(4);
    await page.type('[name="fullName"]', 'DRdolittle de paula rodrigues');

    await delay(4);
    await page.type('[name="username"]', 'Drdolittledosexo');

    await delay(4);
    await page.type('[name="password"]', 'Ziguiriguidum14');

})();