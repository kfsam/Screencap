const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const userAgent = require('user-agents');
exports.handler = async (event, context, callback) => {
    let result = null;
    let browser = null;
    // let para = JSON.parse(event)
    // return callback(null, event.url);
    let screencapUrl = "";
    if (event.url) {
        screencapUrl = event.url;
    } else {
        return callback(null, "Invalid Access");
    }
    // return callback(null, event.url);
    try {
        // return callback(null,  chromium.args);
        puppeteer.use(StealthPlugin())
        await chromium.font('https://raw.githubusercontent.com/googlefonts/noto-cjk/main/google-fonts/NotoSansHK%5Bwght%5D.ttf')
        browser = await chromium.puppeteer.launch({
            // args: chromium.args,
            args: ['--no-sandbox', '--disable-dev-shm-usage', '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0', "--allow-running-insecure-content", "--autoplay-policy=user-gesture-required", "--disable-component-update", "--disable-domain-reliability", "--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process", "--disable-print-preview", "--disable-setuid-sandbox", "--disable-site-isolation-trials", "--disable-speech-api", "--disable-web-security", "--disk-cache-size=33554432", "--enable-features=SharedArrayBuffer", "--hide-scrollbars", "--ignore-gpu-blocklist", "--in-process-gpu", "--mute-audio", "--no-default-browser-check", "--no-pings", "--no-sandbox", "--no-zygote", "--use-gl=swiftshader", "--window-size=1920,1080", "--single-process"],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ["--enable-automation"]
        });

        let page = await browser.newPage();
        await page.setUserAgent(userAgent.random().toString())
        await page.evaluateOnNewDocument(() => {
            const newProto = navigator.__proto__
            delete newProto.webdriver
            navigator.__proto__ = newProto
        });

        await page.goto(screencapUrl);

        // result = await page.title();
        result = await page.screenshot({
            // path: 'imgs/screenshot.jpg',
            encoding: "base64",
            fullPage: true
        });
        // result = result.slice(0, 10);
    } catch (error) {
        return callback(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return callback(null, result);
};