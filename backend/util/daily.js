
const [getPerks,getCharacters,getCharacter] = require("./scrapping")
const [nameVariations,invalidNames,splashC] = require("./constants")
const myCache = require("../cache")
const sharp = require('sharp');
const axios = require('axios')
const { PrismaClient } = require('../prisma/generated/prisma')

const prisma = new PrismaClient()
module.exports = [doDaily]

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}
const types = ["KILLER","SPLASH","QUOTE","PERK"]
async function doDaily(){
  //flush mem and db if needed
  myCache.flushAll()
  const characters = await getCharacters()
  const killers = characters.filter(character=>character.includes("The"))
  const perks = await getPerks()

  for(let i =0; i<types.length;i++){
    const count = await prisma.daily.count({where:{type:{equals:types[i]}}})
    if(types[i] == "PERK" && count == perks.length){
      await prisma.daily.deleteMany({where:{type:{equals:"PERK"}}})
    }else if(types[i] == "KILLER" && count == killers.length){
      await prisma.daily.deleteMany({where:{type:{equals:"KILLER"}}})
    }else if(types[i] == "QUOTE" && count == perks.length){
      await prisma.daily.deleteMany({where:{type:{equals:"QUOTE"}}})
    }else if(types[i] == "SPLASH" && count == characters.length){
      await prisma.daily.deleteMany({where:{type:{equals:"SPLASH"}}})
    }
  }
  //Perk
  const used_perks = (await prisma.daily.findMany({where:{type:"PERK"}})).map(data=>data.value)
  let dailyPerk = perks.filter(perk=>used_perks.findIndex(name=>name==perk.name) == -1).random()
  const perk_image = await sharp((await axios({ url: dailyPerk.icon, responseType: "arraybuffer" })).data)
  perk_image.webp().toFile("perk/image.webp")
  dailyPerk=dailyPerk.name
  //Quote
  const used_quotes = (await prisma.daily.findMany({where:{type:"QUOTE"}})).map(data=>data.value)
  const dailyQuote = perks.filter(perk=>used_quotes.findIndex(name=>name==perk.name) == -1 && perk.quote != null).random()
  //Lore
  const used_lores = (await prisma.daily.findMany({where:{type:"LORE"}})).map(data=>data.value)
  const loreCharacter = characters.filter(character=>used_lores.findIndex(name=>name==character) == -1).random()
  const jaja = (await getCharacter(loreCharacter)).lore.replaceAll("\n","")
  const randomIndex = Math.floor(Math.random() * (jaja.length-250))
  const start = jaja.slice(undefined,randomIndex).lastIndexOf(" ")
  const end = jaja.slice(randomIndex+250).indexOf(" ") + randomIndex+250
  let text = jaja.substring(start,end)
  for(let i =0;i<nameVariations.length;i++){
    text = text.replaceAll(nameVariations[i],"____")
    for(let j =0;j<nameVariations[i].from.split(" ").length;j++){
      if(nameVariations[i].from.split(" ")[j].toLowerCase() == "the") continue
      if(nameVariations[i].from.split(" ")[j].toLowerCase() == "by") continue
      if(nameVariations[i].from.split(" ")[j].toLowerCase() == "in") continue
      if(nameVariations[i].from.split(" ")[j].toLowerCase() == "of") continue
      if(nameVariations[i].from.split(" ")[j].toLowerCase() == "final") continue
      if(nameVariations[i].from.split(" ")[j].toLowerCase() == "notebook") continue
      if(nameVariations[i].from.split(" ")[j].toLowerCase() == "journal") continue
      if(nameVariations[i].from.split(" ")[j].toLowerCase() == "entry") continue
      text = text.replaceAll(nameVariations[i].from.split(" ")[j],"____")
    }
  }
  for(let i =0;i<(await getCharacters()).length;i++){
    
    text = text.replaceAll((await getCharacters())[i],"____")
    for(let j =0;j<(await getCharacters())[i].split(" ").length;j++){
      if((await getCharacters())[i].split(" ")[j].toLowerCase() == "the") continue
      text = text.replaceAll((await getCharacters())[i].split(" ")[j],"____")
    }
  }
  const lore = {
    character:loreCharacter,
    text:text
  }
  console.log(lore.character)
  //Killer
  const used_killers = (await prisma.daily.findMany({where:{type:"KILLER"}})).map(data=>data.value)
  const killer = killers.filter(perk=>used_killers.findIndex(name=>name==perk) == -1).random()
  //Splash
  const used_splashes = (await prisma.daily.findMany({where:{type:"SPLASH"}})).map(data=>data.value)
  const character = characters.filter(character=>used_splashes.findIndex(name=>name==character) == -1).random()
  let x = 0
  let y = 0
  const icon = (await getCharacter(character)).icon
  const image = await sharp((await axios({ url: icon, responseType: "arraybuffer" })).data)
  image.webp().toFile("splash/splash.webp")
  let notOkay = true
  const min_pixel = splashC.width - (splashC.number_of_tries * splashC.step)
  while(notOkay){
    x=Math.floor(Math.random()*(splashC.width-min_pixel))
    y=Math.floor(Math.random()*(splashC.width-min_pixel))
    const newImage = await sharp(await image.toBuffer("image/png"))
    const { data: _buf, info: _info } = await newImage
      .extract({ left: x, top: y, width: min_pixel, height: min_pixel })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // emulate Jimp's getPixelColor(px,py) on the extracted region
    newImage.getPixelColor = (px, py) => {
      const idx = (py * _info.width + px) * _info.channels;
      const r = _buf[idx];
      const g = _buf[idx + 1];
      const b = _buf[idx + 2];
      const a = _buf[idx + 3];
      return ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
    };
    let nullPixel = 0
    for(let i = 0; i<min_pixel;i++){
      for(let j = 0; j<min_pixel;j++){
        if(newImage.getPixelColor(i,j) == 4294967040){
          nullPixel++
        }
      }
    }
    if(nullPixel < (min_pixel*min_pixel) / 4){
      notOkay = false
    }
  }

  const splash = {
    character,
    x,
    y
  }
  await prisma.daily.createMany({data:[
    {type:"KILLER",value:killer},
    {type:"PERK",value:dailyPerk},
    {type:"SPLASH",value:character},
    {type:"QUOTE",value:dailyQuote.name},
    {type:"LORE",value:lore.character},
  ]})
  myCache.set("daily",{quote:dailyQuote.name,perk:dailyPerk,killer,splash,lore},60*60*24)
}