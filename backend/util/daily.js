
const [getPerks,getCharacters,getCharacter] = require("./scrapping")
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
  let notOkay = true
  while(notOkay){
    x=Math.floor(Math.random()*(512-92))
    y=Math.floor(Math.random()*(512-92))
    const newImage = await Jimp.read(await image.getBuffer("image/png"))
    newImage.crop({x:x,y:y,w:92,h:92})
    let nullPixel = 0
    for(let i = 0; i<92;i++){
      for(let j = 0; j<92;j++){
        if(newImage.getPixelColor(i,j) == 4294967040){
          nullPixel++
        }
      }
    }
    if(nullPixel < (92*92) / 4){
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