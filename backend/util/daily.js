
const [getPerks,getCharacters,getCharacter] = require("./scrapping")
const [nameVariations,invalidNames,splashC] = require("./constants")
const myCache = require("../cache")
const {Jimp} = require("jimp");

module.exports = [doDaily]

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}
async function doDaily(){
  //flush mem
  //myCache.flushAll()
  const characters = await getCharacters()
  //Perk
  const perks = await getPerks()
  const dailyPerk = perks.random().name
  //Quote
  let dailyQuote = perks.random()
  while(dailyQuote.quote == null){
      dailyQuote = perks.random()
  }
  //Killer
  const killers = characters.filter(character=>character.includes("The"))
  const killer = killers.random()
  //Splash
  const character = characters.random()
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
  myCache.set("daily",{quote:dailyQuote.name,perk:dailyPerk,killer,splash},60*60*24)
}