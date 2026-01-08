const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

const path = require('path');
const schedule = require('node-schedule');
const [doDaily] = require("./util/daily")
const {getPerks,getCharacters,getCharacter} = require("./util/scrapping")
const perkRouter = require("./route/perk")
const quoteRouter = require("./route/quote")
const killerRouter = require("./route/killer")
const loreRouter = require("./route/lore")
const splashRouter = require("./route/splash")
const terrorRadiusRouter = require("./route/terror_radius")

dotenv.config({ path: path.join(__dirname, './.env') });
const app = express();
//express trust proxy if behind one (eg. when using vercel)
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
  message: "Too many requests from this IP, please try again after 5 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use((err, req, res, next) => {
  if (err) {
    return res.sendStatus(500);
  }
  next();
});
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
  exposedHeaders: ['Set-Cookie']
}));
app.use(function (req, res, next) {
  res.set('Cache-Control', 'public, max-age=600, immutable');
  next();
});
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/perk",perkRouter)
app.use("/quote",quoteRouter)
app.use("/killer",killerRouter)
app.use("/splash",splashRouter)
app.use("/lore",loreRouter)
app.use("/terror_radius",terrorRadiusRouter)

const job = schedule.scheduleJob({hour:0,minute:0,tz:"Etc/GMT-2"}, function(){
  doDaily()
});

app.use("/splash_image_src", express.static(__dirname + '/splash/splash.webp'));
app.use("/perk_image", express.static(__dirname + '/perk/image.webp'));

app.get(/(.*)/,function (req, res, next) {
  res.status(404).json({ error: "not found" });
})


app.listen(process.env.PORT, async () => {  
  /*const characters = await Promise.all((await getCharacters()).map(async (character)=>{
    const char = await getCharacter(character)
    return char
  }));
  const perks = await getPerks()*/
  //write to file
  //fs.writeFileSync("characters_lore.json",JSON.stringify(characters.map(character=>{return {name:character.name,lore:character.lore}})).split("}").join("}\n"))
  /*fs.writeFileSync("characters_wLore.json",JSON.stringify(characters.map(character=>{
    return {name:character.name,terror_radius:character.terror_radius
    }
  })).split("}").join("}\n"))
  fs.writeFileSync("perks.json",JSON.stringify(perks).split("}").join("}\n"))*/
  await doDaily()
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
})