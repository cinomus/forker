const puppeteer = require(`puppeteer`);
const {performance} = require('perf_hooks');

let olimpPage;
let fonbetPage;

async function live_parsing() {


    await workWithFonbet();
    await workWithOlimp();


    async function workWithFonbet() {
        const browser = await puppeteer.launch({headless: false});
        fonbetPage = await browser.newPage();
        await fonbetPage.setViewport({width: 1920, height: 1080});
        await fonbetPage.goto('https://www.fonbet.ru/live/');
        await fonbetPage.waitForSelector('#page__wrap > div.page__container.js-scroll-container.js-page-container._device_desktop._theme_red > div.page-layout--qkduQ > div > div.coupon-layout__content--gGzha > div > div.line-filter-layout__content--q-JdM > section > div.table__flex-container > table')
        setInterval(async () => {
            let t0 = performance.now();
            let fonbetMatches = await live()
            let t1 = performance.now();
            console.log('Took', (t1 - t0).toFixed(4), 'milliseconds fonbet');
        }, 1000)

        async function live() {
            let result = await fonbetPage.evaluate((discip) => {
                let data = [];
                let matches = document.querySelector('#page__wrap > div.page__container.js-scroll-container.js-page-container._device_desktop._theme_red > div.page-layout--qkduQ > div > div.coupon-layout__content--gGzha > div > div.line-filter-layout__content--q-JdM > section > div.table__flex-container > table').children;
                for (let match of matches) {
                    for (let str = 0; str < match.children.length; str++) {
                        let mch = {};
                        mch.discipline = '';
                        mch.country = '';
                        mch.tournament = '';
                        mch.platform = 'fonbet';
                        if (match.children[str].children[0].classList[2] === '_indent_1') {
                            if (match.children[0].children[0].innerText.split('. ').length < 3) {
                                mch.discipline = match.children[0].children[0].innerText.split('. ')[0].toLowerCase();
                                mch.tournament = match.children[0].children[0].innerText.split('. ')[1].toLowerCase();
                            } else {
                                mch.discipline = match.children[0].children[0].innerText.toLowerCase().split('. ')[0];
                                mch.country = match.children[0].children[0].innerText.toLowerCase().split('. ')[1];
                                mch.tournament = match.children[0].children[0].innerText.toLowerCase().split('. ')[2];
                            }
                            if (mch.discipline !== 'лошадиные скачки' &&
                                mch.discipline !== 'лотереи' &&
                                mch.discipline !== 'собачьи бега'
                            ) {
                                mch.href = match.children[str].children[1].children[0].children[1].href;
                                mch.id = mch.href.match(/\d+\/\d+/)[0].replace(/\//, '');
                                mch.team_1 = match.children[str].children[1].children[0].innerText.toLowerCase().split(' — ')[0];
                                mch.team_2 = match.children[str].children[1].children[0].innerText.toLowerCase().split(' — ')[1];
                                mch.koef_1 = match.children[str].children[2].innerText;
                                mch.koef_2 = match.children[str].children[3].innerText;
                                mch.fora = {
                                    fora_value: `${match.children[str].children[4].innerText} ${match.children[str].children[6].innerText}`,
                                    fora_koef1: match.children[str].children[5].innerText,
                                    fora_koef2: match.children[str].children[7].innerText,
                                }
                                mch.total = {
                                    total_value: match.children[str].children[8].innerText,
                                    total_tb: match.children[str].children[9].innerText,
                                    total_tm: match.children[str].children[10].innerText,
                                }
                                if (match.children[0].children.length > 13) {
                                    mch.koef_2 = match.children[str].children[4].innerText;
                                    mch.drawn_game = match.children[str].children[3].innerText;
                                    mch.winner1_or_noWinners = match.children[str].children[5].innerText;
                                    mch.winner1_or_winner2 = match.children[str].children[6].innerText;
                                    mch.winner2_or_noWinners = match.children[str].children[7].innerText;
                                    mch.fora = {
                                        fora_value: `${match.children[1].children[8].innerText} ${match.children[1].children[10].innerText}`,
                                        fora_koef1: match.children[1].children[9].innerText,
                                        fora_koef2: match.children[1].children[11].innerText,
                                    }
                                    mch.total = {
                                        total_value: match.children[1].children[12].innerText,
                                        total_tb: match.children[1].children[13].innerText,
                                        total_tm: match.children[1].children[14].innerText,
                                    }
                                }
                                data.push(mch.id)
                                sessionStorage.setItem(mch.id, JSON.stringify(mch))
                            }
                        }
                    }
                }
                let keys = Object.keys(sessionStorage);
                deleteMathes(data, keys)

                async function deleteMathes(received_matches, saved_matches) {
                    console.log('g ', received_matches.length);
                    console.log('s ', saved_matches.length);
                    let uselessMatches = [];
                    for (let saved_match of saved_matches) {
                        let result = await received_matches.filter((received_match) => {
                            if (saved_match === received_match) {
                                return saved_match;
                            }
                        })
                        if (result.length === 0) {
                            uselessMatches.push(saved_match);
                        }
                    }
                    for (let uselessMatch of uselessMatches) { // не работает цикл запускается и пробегает раньше чем выполняется предыдущий
                        sessionStorage.removeItem(uselessMatch)
                    }

                }
            });

        }
    }

    async function workWithOlimp() {
        const browser = await puppeteer.launch({headless: true});
        olimpPage = await browser.newPage();
        await olimpPage.setViewport({width: 1920, height: 1080});
        await olimpPage.goto('https://www.olimp.bet/live');
        await olimpPage.waitForSelector('#root > div > div.routes__StyledApp-sc-1q7p8dg-0.oVDye > div > div.content > div')
        setInterval(async () => {
            let t0 = performance.now();
            let matches = await live()
            //await preparing(matches);
            let t1 = performance.now();
            console.log('Took', (t1 - t0).toFixed(4), 'milliseconds olimp');
        }, 1000)

        async function live() {
            let result = await olimpPage.evaluate(() => {
                let data = [];
                let disciplines = document.querySelector('#root > div > div.routes__StyledApp-sc-1q7p8dg-0.oVDye > div > div.content > div').children;
                let discipline = '';
                let platform = '';
                let team_1 = '';
                let team_2 = '';
                let koef_1 = '';
                let koef_2 = '';
                let href = '';
                let id = '';
                let fora = {};
                let total = {};
                let tournament = '';
                let drawn_game = '';
                let winner1_or_noWinners = '';
                let winner1_or_winner2 = '';
                let winner2_or_noWinners = '';
                for (let element of disciplines) {
                    if (element.classList[0] != 'matches__Handler-sc-1tpetmk-0' && element.classList[0] != 'styled__OuterWrap-sc-1m8ylsn-1') {
                        if (element.classList[0] === 'head__StyledWrap-h49frn-0') {
                            discipline = element.textContent.toLowerCase();
                            platform = 'olimp';
                        }
                        if (element.classList[0] === 'styled__Matches-sc-14faxw8-2') {
                            for (let elem of element.children[0].children) {
                                if (elem.classList[0] === 'styled__ShotItem-sc-14faxw8-3') {
                                    tournament = elem.children[0].textContent.toLowerCase()
                                }
                                if (elem.classList[0] === 'common__Item-sc-1p0w8dw-0') {
                                    team_1 = elem.children[0].children[0].children[0].textContent.split(' - ')[0].toLowerCase().replace(/\./g, '');
                                    team_2 = elem.children[0].children[0].children[0].textContent.split(' - ')[1].toLowerCase().replace(/\./g, '');
                                    href = elem.children[0].children[0].children[0].children[0].children[0].href;
                                    id = elem.children[0].children[0].children[0].children[0].children[0].href.match(/\d+\/\d+\/\d+/g)[0].replace(/\//g, '');
                                    if (elem.children[0].children.length > 2) { // ставки закрыты
                                        koef_1 = '';
                                        koef_2 = '';
                                        fora = {
                                            fora_value: ' ',
                                            fora_koef1: '',
                                            fora_koef2: '',
                                        }
                                        total = {
                                            total_value: '',
                                            total_tb: '',
                                            total_tm: '',
                                        }
                                        data.push(id)
                                        sessionStorage.setItem(id, JSON.stringify(removeMinus({
                                            id,
                                            team_1,
                                            koef_1,
                                            team_2,
                                            koef_2,
                                            fora,
                                            total,
                                            platform,
                                            tournament,
                                            discipline,
                                            href,
                                        })))
                                    } else {
                                        if (elem.children[0].children[1].children[0].children.length > 10) {
                                            koef_1 = elem.children[0].children[1].children[0].children[0].innerText;
                                            koef_2 = elem.children[0].children[1].children[0].children[2].innerText;
                                            drawn_game = elem.children[0].children[1].children[0].children[1].innerText;
                                            winner1_or_noWinners = elem.children[0].children[1].children[0].children[3].innerText;
                                            winner1_or_winner2 = elem.children[0].children[1].children[0].children[4].innerText;
                                            winner2_or_noWinners = elem.children[0].children[1].children[0].children[5].innerText;
                                            fora = {
                                                fora_value: `${elem.children[0].children[1].children[0].children[6].innerText} ${elem.children[0].children[1].children[0].children[8].innerText}`,
                                                fora_koef1: elem.children[0].children[1].children[0].children[7].innerText,
                                                fora_koef2: elem.children[0].children[1].children[0].children[9].innerText,
                                            }
                                            total = {
                                                total_value: elem.children[0].children[1].children[0].children[10].innerText,
                                                total_tb: elem.children[0].children[1].children[0].children[11].innerText,
                                                total_tm: elem.children[0].children[1].children[0].children[12].innerText,
                                            }
                                            data.push(id)
                                            sessionStorage.setItem(id, JSON.stringify(removeMinus({
                                                id,
                                                team_1,
                                                koef_1,
                                                team_2,
                                                koef_2,
                                                drawn_game,
                                                winner1_or_noWinners,
                                                winner1_or_winner2,
                                                winner2_or_noWinners,
                                                fora,
                                                total,
                                                platform,
                                                tournament,
                                                discipline,
                                                href
                                            })))
                                        } else {
                                            koef_1 = elem.children[0].children[1].children[0].children[0].innerText;
                                            koef_2 = elem.children[0].children[1].children[0].children[1].innerText;
                                            fora = {
                                                fora_value: `${elem.children[0].children[1].children[0].children[2].innerText} ${elem.children[0].children[1].children[0].children[4].innerText}`,
                                                fora_koef1: elem.children[0].children[1].children[0].children[3].innerText,
                                                fora_koef2: elem.children[0].children[1].children[0].children[5].innerText,
                                            }
                                            total = {
                                                total_value: elem.children[0].children[1].children[0].children[6].innerText,
                                                total_tb: elem.children[0].children[1].children[0].children[7].innerText,
                                                total_tm: elem.children[0].children[1].children[0].children[8].innerText,
                                            }
                                            data.push(id)
                                            sessionStorage.setItem(id, JSON.stringify(removeMinus({
                                                id,
                                                team_1,
                                                koef_1,
                                                team_2,
                                                koef_2,
                                                fora,
                                                total,
                                                platform,
                                                tournament,
                                                discipline,
                                                href,
                                            })))
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //end
                }
                let keys = Object.keys(sessionStorage);
                deleteMathes(data, keys)

                function removeMinus(obj) {
                    for (let key in obj) {
                        if (obj[key] == '—') {
                            obj[key] = '';
                        }
                        if (typeof obj[key] === 'object') {
                            if (key === 'fora') {
                                for (let key2 in obj[key]) {
                                    if (key2 === 'fora_value') {
                                        if (obj[key][key2] == '— —') {
                                            obj[key][key2] = ' ';
                                        }
                                    }
                                    if (obj[key][key2] == '—') {
                                        obj[key][key2] = '';
                                    }
                                }
                            }
                            if (key === 'total') {
                                for (let key2 in obj[key]) {
                                    if (obj[key][key2] == '—') {
                                        obj[key][key2] = '';
                                    }
                                }
                            }
                        }
                    }
                    return obj
                }

                async function deleteMathes(received_matches, saved_matches) {
                    console.log('g ', received_matches.length);
                    console.log('s ', saved_matches.length);
                    let uselessMatches = [];
                    for (let saved_match of saved_matches) {
                        let result = await received_matches.filter((received_match) => {
                            if (saved_match === received_match) {
                                return saved_match;
                            }
                        })
                        if (result.length === 0) {
                            uselessMatches.push(saved_match);
                        }
                    }
                    for (let uselessMatch of uselessMatches) { // не работает цикл запускается и пробегает раньше чем выполняется предыдущий
                        sessionStorage.removeItem(uselessMatch)
                    }

                }
            })
            return result
        }
    }
}

let i = 0;          // хрень которая меняет кэфы при отсутсивии инета МОЖНО БУДЕТ УБРАТЬ
async function getM(site) {
    if (site === 'olimp') {
        return await olimpPage.evaluate(() => {
            let kekw = []
            let keys = Object.keys(sessionStorage);
            for (let key of keys) {
                kekw.push(JSON.parse(sessionStorage.getItem(key)));
            }
            return kekw
        })
    }
    if (site === 'fonbet') {
        return await fonbetPage.evaluate(() => {
            let kekw = []
            let keys = Object.keys(sessionStorage);
            for (let key of keys) {
                kekw.push(JSON.parse(sessionStorage.getItem(key)));
            }
            return kekw
        })
    }
}


module.exports = {live_parsing, getM}
