const {nameVariations,invalidNames} = require("./constants")
const myCache = require("../cache")
const axios = require("axios")
const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")

puppeteer.use(StealthPlugin())

let browser;
let browserReady = false;
let scrapingInProgress = false;

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
];

const randomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function initBrowser() {
    if (!browserReady) {
        browser = await puppeteer.launch({
            headless: true,
            ignoreDefaultArgs: ['--enable-automation'],
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security',
                '--disable-features=site-per-process,TranslateUI',
                '--disable-background-networking',
                '--disable-client-side-phishing-detection',
                '--disable-component-extensions-with-background-pages',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-extensions-file-access-check',
                '--disable-geolocation',
                '--disable-popup-blocking',
                '--disable-prompt-on-repost',
                '--disable-translate',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-default-browser-check',
                '--no-first-run',
                '--safebrowsing-disable-auto-update',
                '--window-position=0,0',
                '--window-size=1920,1080',
                '--enable-automation=false'
            ],
            defaultViewport: null
        });
        browser.on('disconnected', () => {
            console.error("Browser disconnected. Attempting to reinitialize...");
            browserReady = false;
            initBrowser().catch(err => {
                console.error("Failed to reinitialize browser:", err);
            })
        });
        browserReady = true;
    }
}


async function getHTML(link) {
    while (scrapingInProgress) {
        await wait(2500);
    }

    scrapingInProgress = true;
    await initBrowser();
    let page;
    try {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(90000);
        const setupPage = async (p) => {
            const userAgent = randomUserAgent();
            await p.setUserAgent(userAgent);
            await p.setViewport({ width: 1920, height: 1080 });
            await p.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Referer': 'https://www.google.com/',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0',
                'Sec-CH-UA': '"Chromium";v="120", "Not A(Brand";v="24", "Google Chrome";v="120"',
                'Sec-CH-UA-Mobile': '?0',
                'Sec-CH-UA-Platform': '"Windows"',
                'Sec-CH-UA-Arch': '"x86"',
                'Sec-CH-UA-Bitness': '"64"',
                'Sec-CH-UA-Model': '""'
            });
            await p.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false
                });
                window.chrome = {
                    runtime: {},
                    loadTimes: () => ({}),
                    csi: () => ({})
                };
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en']
                });
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5]
                });
                Object.defineProperty(navigator, 'platform', {
                    get: () => 'Win32'
                });
                Object.defineProperty(navigator, 'vendor', {
                    get: () => 'Google Inc.'
                });
                Object.defineProperty(navigator, 'product', {
                    get: () => 'Gecko'
                });
                Object.defineProperty(navigator, 'hardwareConcurrency', {
                    get: () => 8
                });
                Object.defineProperty(navigator, 'deviceMemory', {
                    get: () => 8
                });
                Object.defineProperty(navigator, 'maxTouchPoints', {
                    get: () => 0
                });
                const originalQuery = window.navigator.permissions.query;
                window.navigator.permissions.__proto__.query = (parameters) =>
                    parameters.name === 'notifications'
                        ? Promise.resolve({ state: Notification.permission })
                        : originalQuery(parameters);
            });
            await p.setJavaScriptEnabled(true);
        };
        await setupPage(page);

        const maxNavRetries = 4;
        let navigated = false;
        for (let attempt = 1; attempt <= maxNavRetries && !navigated; attempt++) {
            try {
                await page.goto(link, { waitUntil: "domcontentloaded", timeout: 90000 });
                await page.waitForSelector('body', { timeout: 15000 }).catch(() => {});
                await wait(2200 + Math.floor(Math.random() * 1800));
                navigated = true;
            } catch (err) {
                const msg = (err && err.message) || '';
                if (/Execution context was destroyed/.test(msg)) {
                    await page.close().catch(() => {});
                    page = await browser.newPage();
                    await setupPage(page);
                    if (attempt === maxNavRetries) throw err;
                    continue;
                }
                if (/ERR_TOO_MANY_REDIRECTS/.test(msg) || /Too many redirects/.test(msg)) {
                    const axios = require('axios');
                    try {
                        // Allow axios to follow redirects (default). Don't force maxRedirects:0.
                        const resp = await axios.get(link, { 
                            timeout: 15000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                'Accept-Language': 'en-US,en;q=0.9',
                                'Accept-Encoding': 'gzip, deflate, br',
                                'Referer': 'https://www.google.com/'
                            }
                        });
                        if (!resp || resp.status >= 400 || !resp.data) {
                            throw new Error('Fallback fetch returned bad status: ' + (resp && resp.status));
                        }
                        await page.setContent(resp.data, { waitUntil: 'load' });
                        navigated = true;
                        break;
                    } catch (fetchErr) {
                        navigated = true;
                        console.warn(`Fallback fetch attempt ${attempt} failed:`, fetchErr.message);
                        await page.setContent("", { waitUntil: 'load' });
                        break;
                    }
                }
                if (attempt === maxNavRetries) throw err;
                await wait(1000 * attempt);
            }
        }

        let html = await page.content();
        const blockedSignals = ["Just a moment", "Checking your browser", "blocked by Chromium", "verify you are human", "captcha"];
        let retries = 0;
        while (blockedSignals.some(signal => html.includes(signal)) && retries < 5) {
            await wait(3000 + retries * 2000 + Math.floor(Math.random() * 2000));
            html = await page.content();
            retries++;
        }

        if (blockedSignals.some(signal => html.includes(signal))) {
            console.log(html)
            throw new Error("Bot-protection page detected");
        }

        return html;
    } catch (err) {
        console.error("Error fetching page:", err);
        throw err;
    } finally {
        if (page) await page.close().catch(() => {});
        scrapingInProgress = false;
    }
}

module.exports = {getPerks,getCharacters,getCharacter,getKillers}

async function getPerks(){
    const cached = myCache.get("perks");
    if(cached){
        return cached
    }
    const perks = []
    
    try {
        const html = await getHTML("https://deadbydaylight.fandom.com/wiki/Perks");
        // Example: log the HTML length
        const survTable = html.split("<tbody>")[1].split('</tbody>')[0].split("<tr>");
        for(let i = 1; i<survTable.length;i++){
            let name = survTable[i].split(' title="')[1].split('">')[0].replaceAll("&amp;","&").replaceAll("&#39;","'")
            let desc = survTable[i].split("<td>")[1].split("</td>")[0]
            desc = desc.replaceAll("&#160;"," ")
            desc = desc.replaceAll("&#37;","%")
            while(desc.includes("<")){
                desc = desc.replace("<"+desc.split("<")[1].split(">")[0]+">","")
            }
            let quote = null
            if(desc.includes('"') && desc.includes('" —')){
                let quoteFrom = desc.split('" —')[1].split(' "')[0].trim().split(",")[0]
                if(nameVariations.map(name=>name.from).includes(quoteFrom)){
                    quoteFrom = nameVariations.filter(name=>name.from == quoteFrom)[0].to
                }
                if(!invalidNames.includes(quoteFrom)){
                    quote = {
                        text:desc.split('"')[1].split('"')[0],
                        from:quoteFrom
                    }
                }
                desc = desc.split('"')[0]
            }
            desc = desc.trim().replaceAll("\n\n","\n")
            desc = desc.replaceAll("\n"," ")
            if(desc.includes(name)){
                desc = desc.replaceAll(name,"____")
            }
            if(desc.includes("This description is based on")){
                desc = desc.substring(desc.indexOf(".")+4)
            }
            let character = null
            if(survTable[i].split("<td>")[1].split("</td>")[1].split('title="').length > 1){
                character = survTable[i].split("<td>")[1].split("</td>")[1].split('title="')[1].split('">')[0]
            }
            if(nameVariations.map(name=>name.from).includes(character)){
                character = nameVariations.filter(name=>name.from == character)[0].to
            }
            if(desc.includes("Jouki"))continue
            let perk = {
                name:name,
                character:character,
                icon:survTable[i].split('<span typeof="mw:File"><a href="')[1].split('" class')[0],
                description:desc,
                quote:quote
            }
            perks.push(perk)
        }
        const killerTable = html.split("<tbody>")[2].split('</tbody>')[0].split("<tr>");
        for(let i = 1; i<killerTable.length;i++){
            let name = killerTable[i].split(' title="')[1].split('">')[0].replaceAll("&amp;","&").replaceAll("&#39;","'")
            let desc = killerTable[i].split("<td>")[1].split("</td>")[0]
            desc = desc.replaceAll("&#160;"," ")
            desc = desc.replaceAll("&#37;","%")
            while(desc.includes("<")){
                desc = desc.replace("<"+desc.split("<")[1].split(">")[0]+">","")
            }
            let quote = null
            if(desc.includes('"') && desc.includes('" —')){
                let quoteFrom = desc.split('" —')[1].split(' "')[0].trim().split(",")[0]
                if(nameVariations.map(name=>name.from).includes(quoteFrom)){
                    quoteFrom = nameVariations.filter(name=>name.from == quoteFrom)[0].to
                }
                if(!invalidNames.includes(quoteFrom)){
                    quote = {
                        text:desc.split('"')[1].split('"')[0],
                        from:quoteFrom
                    }
                }
                desc = desc.split('"')[0]
            }
            desc = desc.trim().replaceAll("\n\n","\n")
            desc = desc.replaceAll("\n"," ")
            if(desc.includes(name)){
                desc = desc.replaceAll(name,"____")
            }
            if(desc.includes("This description is based on")){
                desc = desc.substring(desc.indexOf(".")+4)
            }
            let character = null
            if(killerTable[i].split("<td>")[1].split("</td>")[1].split('title="').length > 1){
                character = "The " + killerTable[i].split("<td>")[1].split("</td>")[1].split('title="')[1].split('">')[0]
            }
            if(nameVariations.map(name=>name.from).includes(character)){
                character = nameVariations.filter(name=>name.from == character)[0].to
            }
            if(desc.includes("Jouki"))continue
            let perk = {
                name:name,
                character:character,
                icon:killerTable[i].split('<span typeof="mw:File"><a href="')[1].split('" class')[0],
                description:desc,
                quote:quote
            }
            perks.push(perk)
        }
    } catch(err) {
        console.error("Error fetching perks page:", err);
        throw err;
    }
    myCache.set("perks",perks,60*60*24)
    return perks
}
async function getCharacters(){
    const cachedCharacters = myCache.get("characters");
    if(cachedCharacters){
        return cachedCharacters
    }
    let perks = await getPerks()
    perks = perks.filter(perk=>perk.character != null)
    const characters = []
    for(let i = 0; i<perks.length;i++){
        if(!characters.includes(perks[i].character)){
            characters.push(perks[i].character)
        }
    }
    myCache.set("characters", characters, 60*60*24)
    return characters
}
async function getCharacter(character){
    const cachedCharacter = myCache.get("character_"+character);
    if(cachedCharacter){
        return cachedCharacter
    }
    const characters = await getCharacters();
    if(!characters.includes(character)){
        return "Not Found"
    }
    let lore = null
    let gender = null
    let origin = null
    let height = null
    let movement_speed = null
    let terror_radius = null
    let alt_movement_speed = null
    let power_attack_type = null
    let release_date = null
    let icon = null
    try {
        const html = await getHTML("https://deadbydaylight.fandom.com/wiki/"+character);     
        if(html.split('<span class="mw-headline" id="Lore">Lore</span>')[1] == undefined){
            const killer = {
                name:character,
                lore,
                gender,
                origin,
                height,
                terror_radius,
                movement_speed: alt_movement_speed != null ? movement_speed + " "+ alt_movement_speed : movement_speed,
                power_attack_type,
                release_date:Number.parseInt(release_date),
                icon
            }
            myCache.set("character_"+character,killer,60*60*24)
            return killer
        } 
        // Example: log the HTML length
        lore = html.split('<span class="mw-headline" id="Lore">Lore</span>')[1].split("</h2>")[1].split('<div style="clear:both"></div>')[0].split("<h3>")[0]
        if(lore.includes("<dl>"))lore = lore.split("</dl>")[1]
        while(lore.includes("<")){
            lore = lore.replace("<"+lore.split("<")[1].split(">")[0]+">","")
        }
        lore = lore.trim()
        const killerTable = html.split('<table class="infoboxtable charInfoboxTable')[1].split("</tbody>")[0]
        if(killerTable.split("<img")[1].split('" />')[0].includes("data-src")){
            icon = killerTable.split("<img")[1].split('data-src="')[1].split('"')[0]
        }else{
            icon = killerTable.split("<img")[1].split('src="')[1].split('"')[0]
        }
        gender = killerTable.split('<td class="titleColumn">Gender</td>\n<td class="valueColumn">')[1].split('</td>')[0].split(" (")[0].trim()
        if(character == "The Legion" || character == "The Twins"){
            gender = "Woman, Man"
        }
        origin = killerTable.split('<td class="titleColumn">Origin</td>\n<td class="valueColumn">')[1].split('</td>')[0].split(" (")[0].split(" of")[0].trim()
        if(character.includes("The")){
            height = killerTable.split('<td class="titleColumn">Height')[1].split('<td class="valueColumn">')[1].split('\n</td>')[0].split(" (")[0]
            movement_speed = killerTable.split('<td class="titleColumn"><a href="/wiki/Movement_Speed"')[1].split('</b> ')[1].split('\n</td>')[0].split(" (")[0].replace(" ","")
            if(killerTable.includes('Alternate Movement speed')){
                alt_movement_speed = killerTable.split('<td class="titleColumn"><a href="/wiki/Movement_Speed"')[1].split('<td class="titleColumn">Alternate Movement speed</td>')[1].split(" m/s")[0].split("</b>")[1].replaceAll(" ","") + "m/s (power)"
            }
            if(killerTable.includes('colspan="2">Terror Radius Music')){
                terror_radius = killerTable.split('colspan="2">Terror Radius Music')[1].split('<audio src="')[1].split('"')[0]
            }
            if(killerTable.includes('<td class="titleColumn">Power <a href="/wiki/Attack"')){
                power_attack_type = killerTable.split('<td class="titleColumn">Power <a href="/wiki/Attack"')[1].split('<td class="valueColumn">')[1].split('\n</td>')[0].split(" (")[0].split("\n<p>")[0]
            }else{
                power_attack_type = "Basic Attack"
            }
        }
        // You can use a library like cheerio to parse HTML if needed
        let temp = html.split('<table class="infoboxtable charInfoboxTable')[1].substring(html.split('<table class="infoboxtable charInfoboxTable')[1].indexOf("</table>"))
        if(temp.includes("<p>")){
            if(temp.split("<p>")[2].includes("released")){
                temp = temp.split("<p>")[2].split("</p>")[0].split(".")
            }else if(temp.split("<p>").length > 2 && temp.split("<p>")[3].includes("released")){
                temp = temp.split("<p>")[3].split("</p>")[0].split(".")
            }
        }else{
            temp = html.split('<table class="infoboxtable charInfoboxTable')[1].split("</table>")[2].split("<p>")[2].split("</p>")[0].split(".")
        }
        if(temp[temp.length - 2].includes("retired")){
            release_date = temp[temp.length - 2].split(" and retired")[0].slice(-4)
        }else{
            release_date = temp[temp.length - 2].slice(-4)
        }
    } catch(err) {
        console.error("Error fetching character page:", err);
        throw err;
    }
    const killer = {
        name:character,
        lore,
        gender,
        origin,
        height,
        terror_radius,
        movement_speed: alt_movement_speed != null ? movement_speed + " "+ alt_movement_speed : movement_speed,
        power_attack_type,
        release_date:Number.parseInt(release_date),
        icon
    }
    myCache.set("character_"+character,killer,60*60*24)
    return killer
}
async function getKillers() {
    const cachedKillers = myCache.get("killers");
    if(cachedKillers){
        return cachedKillers
    }
    const characters = await getCharacters();
    const killers = characters.filter(character=>character.includes("The"))
    myCache.set("killers",killers,60*60*24)
    return killers
}