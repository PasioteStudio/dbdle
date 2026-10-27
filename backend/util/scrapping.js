import axios from "axios";
import path from "node:path";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { fileURLToPath } from "node:url";
import { nameVariations, invalidNames } from "./constants.js";
import myCache from "./cache.js";
import { writeAutomatedNews } from "./newsStatus.js";

puppeteer.use(StealthPlugin());

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
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
                console.error("Failed to reinitialize browser");
            })
        });
        browserReady = true;
    }
}

async function reportScrapingFailure(context, error) {
    await writeAutomatedNews(context, error);
}

function decodeHtmlEntities(value) {
    return value
        .replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_match, hex, decimal) =>
            String.fromCodePoint(Number.parseInt(hex ?? decimal, hex ? 16 : 10))
        )
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&apos;/gi, "'")
        .replace(/&nbsp;/gi, " ")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");
}

function stripHtml(value) {
    return decodeHtmlEntities(
        value
            .replace(/<br\b[^>]*>/gi, " ")
            .replace(/<\/(?:p|li|div)>/gi, " ")
            .replace(/<[^>]*>/g, " ")
    ).replace(/\s+/g, " ").trim();
}

function getAttribute(tag, name) {
    const match = tag.match(new RegExp(`\\b${name}=(["'])(.*?)\\1`, "i"));
    return match ? decodeHtmlEntities(match[2]) : null;
}

function getPerkTables(html) {
    const tables = [...html.matchAll(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/gi)];
    const perkTables = tables.filter(({ 1: table }) => {
        const header = table.match(/<tr\b[^>]*>([\s\S]*?)<\/tr>/i)?.[1];
        if (!header) {
            return false;
        }
        const columns = [...header.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)]
            .map(([, cell]) => stripHtml(cell).toLowerCase());
        return columns.join("|") === "icon|name|description|character";
    });

    if (perkTables.length < 2) {
        throw new Error("Could not find both perk tables in the wiki page");
    }
    return perkTables.slice(0, 2).map(({ 1: table }) => table);
}

function parsePerkTable(table, isKillerTable) {
    const perks = [];
    const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];

    for (const [, row] of rows.slice(1)) {
        const cells = [...row.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)]
            .map(([, cell]) => cell);
        if (cells.length < 4) {
            continue;
        }

        const name = stripHtml(cells[1]);
        const rawDescription = stripHtml(cells[2]);
        if (!name || !rawDescription) {
            continue;
        }

        let quote = null;
        let description = rawDescription.replaceAll(" ", " ");
        if (description.includes('"') && description.includes('" —')) {
            let quoteFrom = description.split('" —')[1].split(' "')[0].trim().split(",")[0];
            const variation = nameVariations.find(({ from }) => from === quoteFrom);
            if (variation) {
                quoteFrom = variation.to;
            }
            if (!invalidNames.includes(quoteFrom)) {
                quote = {
                    text: description.split('"')[1].split('"')[0],
                    from: quoteFrom,
                };
            }
            description = description.split('"')[0];
        }

        description = description.replaceAll("\n\n", "\n").replaceAll("\n", " ");
        if (description.includes(name)) {
            description = description.replaceAll(name, "____");
        }
        if (description.includes("This description is based on")) {
            description = description.substring(description.indexOf(".") + 4);
        }

        const portraitLink = cells[3].match(
            /<div\b[^>]*class=["'][^"']*\bcharPortraitImage\b[^"']*["'][\s\S]*?<a\b[^>]*>/i
        )?.[0];
        const characterLink = portraitLink ?? cells[3].match(/<a\b[^>]*>/i)?.[0];
        let character = characterLink ? getAttribute(characterLink, "title") : null;
        if (isKillerTable && character && !character.startsWith("The ")) {
            character = `The ${character}`;
        }
        const variation = nameVariations.find(({ from }) => from === character);
        if (variation) {
            character = variation.to;
        }

        const imageTag = cells[0].match(/<img\b[^>]*>/i)?.[0];
        const imagePath = imageTag
            && (getAttribute(imageTag, "data-src") ?? getAttribute(imageTag, "src"));
        if (!imagePath) {
            continue;
        }

        perks.push({
            name,
            character: character || null,
            icon: new URL(imagePath, "https://deadbydaylight.wiki.gg").href,
            description,
            quote,
        });
    }
    return perks;
}

function getCharacterInfobox(html) {
    const table = html.match(
        /<table\b(?=[^>]*class=["'][^"']*\bcharInfoboxTable\b)[^>]*>([\s\S]*?)<\/table>/i
    )?.[1];
    if (!table) {
        throw new Error("Could not find the character infobox");
    }

    const tableRows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
    const rows = new Map();
    for (const [index, [, row]] of tableRows.entries()) {
        const cells = [...row.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)];
        if (cells.length < 2) {
            const label = stripHtml(cells[0]?.[1] ?? "").toLowerCase();
            if (label === "terror radius music") {
                const nextRow = tableRows[index + 1]?.[1];
                const nextCell = nextRow?.match(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/i)?.[1];
                rows.set(label, nextCell ?? cells[0]?.[1] ?? "");
            }
            continue;
        }
        rows.set(stripHtml(cells[0][1]).toLowerCase(), cells[1][1]);
    }

    const getValue = (label) => rows.get(label.toLowerCase()) ?? "";
    const getPlainValue = (label) => stripHtml(getValue(label));
    const imageTag = table.match(/<img\b[^>]*>/i)?.[0];
    const imagePath = imageTag
        && (getAttribute(imageTag, "data-src") ?? getAttribute(imageTag, "src"));
    const loreHeading = html.match(
        /<span\b(?=[^>]*id=["']Lore["'])[^>]*>\s*Lore\s*<\/span>/i
    );
    let lore = null;
    if (loreHeading) {
        const headingEnd = html.indexOf("</h2>", loreHeading.index);
        const loreStart = headingEnd === -1 ? loreHeading.index + loreHeading[0].length : headingEnd + 5;
        const nextHeading = html.slice(loreStart).search(/<h[23]\b/i);
        const loreHtml = nextHeading === -1
            ? html.slice(loreStart)
            : html.slice(loreStart, loreStart + nextHeading);
        lore = stripHtml(loreHtml);
    }

    const descriptionTag = html.match(/<meta\b[^>]*name=["']description["'][^>]*>/i)?.[0];
    const description = descriptionTag ? getAttribute(descriptionTag, "content") ?? "" : "";
    const releaseDate = description.match(
        /\breleased\s+(?:on\s+)?\d{1,2}\s+[a-z]+\s*,?\s*(\d{4})/i
    ) ?? description.match(/\breleased\s+(?:in\s+)?(\d{4})/i)
        ?? stripHtml(html.slice(0, html.indexOf(table))).match(
            /\breleased\s+(?:on\s+)?\d{1,2}\s+[a-z]+\s*,?\s*(\d{4})/i
        );
    const movementSpeed = getPlainValue("Movement Speed").match(/([\d.]+)\s*m\/s/i)?.[1];
    const alternateSpeed = getPlainValue("Alternate Movement speed").match(/([\d.]+)\s*m\/s/i)?.[1];
    const terrorRadiusRow = getValue("Terror Radius Music");
    const audioSource = terrorRadiusRow.match(/<source\b[^>]*>/i)?.[0];
    const audioPath = audioSource ? getAttribute(audioSource, "src") : null;
    const powerAttackType = getPlainValue("Power Attack Type").split(" (")[0];

    return {
        lore,
        gender: getPlainValue("Gender").split(" (")[0] || null,
        origin: getPlainValue("Origin").split(" (")[0].split(" of")[0] || null,
        height: getPlainValue("Height").split(" (")[0] || null,
        movementSpeed: movementSpeed ? `${movementSpeed}m/s` : null,
        alternateMovementSpeed: alternateSpeed ? `${alternateSpeed}m/s (power)` : null,
        terrorRadius: audioPath ? new URL(audioPath, "https://deadbydaylight.wiki.gg").href : null,
        powerAttackType: powerAttackType || null,
        releaseDate: Number.parseInt(releaseDate?.[1], 10),
        icon: imagePath ? new URL(imagePath, "https://deadbydaylight.wiki.gg").href : null,
    };
}


async function getHTML(link) {
    while (scrapingInProgress) {
        await wait(2500);
    }

    scrapingInProgress = true;
    let page;
    try {
        await initBrowser();
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
                const response = await page.goto(link, { waitUntil: "domcontentloaded", timeout: 90000 });
                if (response && response.status() >= 400) {
                    throw new Error(`Wiki request returned HTTP ${response.status()} for ${link}`);
                }
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
                        console.warn(`Fallback fetch attempt ${attempt} failed`);
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
            throw new Error("Bot-protection page detected");
        }

        return html;
    } finally {
        if (page) await page.close().catch(() => {});
        scrapingInProgress = false;
    }
}

async function getPerks(){
    const cached = myCache.get("perks");
    if(cached){
        return cached
    }

    try {
        const html = await getHTML("https://deadbydaylight.wiki.gg/wiki/Perks");
        const [survivorTable, killerTable] = getPerkTables(html);
        const perks = [
            ...parsePerkTable(survivorTable, false),
            ...parsePerkTable(killerTable, true),
        ].filter((perk) => !perk.description.includes("Jouki"));
        if (perks.length === 0) {
            throw new Error("The wiki page contained no parseable perks");
        }

        myCache.set("perks", perks, 60 * 60 * 24);
        return perks;
    } catch (err) {
        await reportScrapingFailure("Failed to fetch or parse the perks page", err);
        throw err;
    }
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
        throw new Error(`Unknown character "${character}" in scraped character list`);
    }
    try {
        const html = await getHTML("https://deadbydaylight.wiki.gg/wiki/"+character);
        const details = getCharacterInfobox(html);
        if (character === "The Legion" || character === "The Twins") {
            details.gender = "Woman, Man";
        }
        if (character.includes("The") && !details.powerAttackType) {
            details.powerAttackType = "Basic Attack";
        }

        const killer = {
            name: character,
            lore: details.lore,
            gender: details.gender,
            origin: details.origin,
            height: details.height,
            terror_radius: details.terrorRadius,
            movement_speed: details.alternateMovementSpeed
                ? `${details.movementSpeed} ${details.alternateMovementSpeed}`
                : details.movementSpeed,
            power_attack_type: details.powerAttackType,
            release_date: details.releaseDate,
            icon: details.icon,
        };
        myCache.set("character_" + character, killer, 60 * 60 * 24);
        return killer;
    } catch(err) {
        await reportScrapingFailure(`Failed to fetch or parse the ${character} page`, err);
        throw err;
    }
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

export { getPerks, getCharacters, getCharacter, getKillers };