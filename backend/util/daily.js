
const [getPerks,getCharacters,getCharacter] = require("./scrapping")
const [nameVariations,invalidNames,splashC] = require("./constants")
const myCache = require("../cache")
const path = require('path');
const fs = require('fs');
const {Jimp} = require("jimp");
const { PrismaClient } = require('../prisma/generated/prisma')

const prisma = new PrismaClient()
module.exports = [doDaily]
const outputDir = './perk';

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
  let dailyPerk = perks.random()
  while((await prisma.daily.findFirst({where:{AND:[{type:{equals:"PERK"}},{value:{equals:dailyPerk.name}}]}})) != null){
    dailyPerk = perks.random()
  }
  const response = await fetch(dailyPerk.icon);
  const buffer = await response.arrayBuffer();
  const outputFile = path.join(outputDir, "image" + response.headers.get('content-type').replace("image/","."));
  fs.writeFileSync(outputFile, Buffer.from(buffer));
  
  dailyPerk=dailyPerk.name
  //Quote
  let dailyQuote = perks.random()
  while(dailyQuote.quote == null || (await prisma.daily.findFirst({where:{AND:[{type:{equals:"QUOTE"}},{value:{equals:dailyQuote.name}}]}})) != null){
      dailyQuote = perks.random()
  }
  //Killer
  let killer = killers.random()
  while((await prisma.daily.findFirst({where:{AND:[{type:{equals:"KILLER"}},{value:{equals:killer}}]}})) != null){
    killer = killers.random()
  }
  //Splash
  let character = characters.random()
  while((await prisma.daily.findFirst({where:{AND:[{type:{equals:"SPLASH"}},{value:{equals:character}}]}})) != null){
    character = characters.random()
  }
  let x = 0
  let y = 0
  const icon = (await getCharacter(character)).icon
  const image = await Jimp.read(icon);
  image.write("splash/splash.png")
  let notOkay = true
  const min_pixel = splashC.width - (splashC.number_of_tries * splashC.step)
  while(notOkay){
    x=Math.floor(Math.random()*(splashC.width-min_pixel))
    y=Math.floor(Math.random()*(splashC.width-min_pixel))
    const newImage = await Jimp.read(await image.getBuffer("image/png"))
    newImage.crop({x:x,y:y,w:min_pixel,h:min_pixel})
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
  ]})
  myCache.set("daily",{quote:dailyQuote.name,perk:dailyPerk,killer,splash},60*60*24)
}