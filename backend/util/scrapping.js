const [nameVariations,invalidNames] = require("./constants")
const myCache = require("../cache")

module.exports = [getPerks,getCharacters,getCharacter]

async function getPerks(){
    if(myCache.get("perks")){
        return myCache.get("perks")
    }
    const perks = []
    await fetch("https://deadbydaylight.fandom.com/wiki/Perks")
        .then(res => res.text())
        .then(html => {
            // Example: log the HTML length
            const survTable = html.split("<tbody><tr>\n<th>Icon</th>\n<th>Name</th>\n<th>Description</th>\n<th>Character\n</th></tr>")[1].split('</th></tr></tbody></table>')[0].split("<tr>");
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
            const killerTable = html.split("<tbody><tr>\n<th>Icon</th>\n<th>Name</th>\n<th>Description</th>\n<th>Character\n</th></tr>")[2].split('</th></tr></tbody></table>')[0].split("<tr>");
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
            // You can use a library like cheerio to parse HTML if needed
        })
        .catch(err => {
            console.error("Error fetching perks page:", err);
        });
    myCache.set("perks",perks,60*60*24)
    return perks
}
async function getCharacters(){
    let perks = await getPerks()
    perks = perks.filter(perk=>perk.character != null)
    const characters = []
    for(let i = 0; i<perks.length;i++){
        if(!characters.includes(perks[i].character)){
            characters.push(perks[i].character)
        }
    }
    return characters
}
async function getCharacter(character){
    if(myCache.get("character_"+character)){
        return myCache.get("character_"+character)
    }
    let lore = null
    let gender = null
    let origin = null
    let height = null
    let movement_speed = null
    let alt_movement_speed = null
    let power_attack_type = null
    let release_date = null
    let icon = null
    await fetch("https://deadbydaylight.fandom.com/wiki/"+character)
        .then(res => res.text())
        .then(html => {
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
                if(killerTable.includes('<td class="titleColumn">Power <a href="/wiki/Attack"')){
                    power_attack_type = killerTable.split('<td class="titleColumn">Power <a href="/wiki/Attack"')[1].split('<td class="valueColumn">')[1].split('\n</td>')[0].split(" (")[0].split("\n<p>")[0]
                }else{
                    power_attack_type = "Basic Attack"
                }
            }
            // You can use a library like cheerio to parse HTML if needed
            let temp = html.split('<table class="infoboxtable charInfoboxTable')[1].split("</table>")[1]
            if(temp.includes("<p>")){
                temp = temp.split("<p>")[2].split("</p>")[0].split(".")
            }else{
                temp = html.split('<table class="infoboxtable charInfoboxTable')[1].split("</table>")[2].split("<p>")[2].split("</p>")[0].split(".")
            }
            if(temp[temp.length - 2].includes("retired")){
                release_date = temp[temp.length - 2].split(" and retired")[0].slice(-4)
            }else{
                release_date = temp[temp.length - 2].slice(-4)
            }
        })
        .catch(err => {
            console.error("Error fetching perks page:", err);
        });
    const killer = {
        name:character,
        lore,
        gender,
        origin,
        height,
        movement_speed: alt_movement_speed != null ? movement_speed + " "+ alt_movement_speed : movement_speed,
        power_attack_type,
        release_date:Number.parseInt(release_date),
        icon
    }
    myCache.set("character_"+character,killer,60*60*24)
    return killer
}