const express = require('express');
const myCache = require("../cache")
const { Readable } = require("stream");
const  {getPerks,getCharacters,getCharacter,getKillers}= require("../util/scrapping")

const router = express.Router();
module.exports = router

router.get("/",async(req, res)=>{
    res.status(200).json(await getKillers());
})

router.get("/sound", async (req, res) => {
  const controller = new AbortController();

  try {
    const killer = await getCharacter(myCache.get("daily").terror_radius);

    req.on("close", () => controller.abort());

    const response = await fetch(killer.terror_radius, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "audio/ogg"
      }
    });

    if (!response.ok) {
      console.error("Upstream status:", response.status);
      return res.sendStatus(502);
    }

    res.status(200);
    res.setHeader("Content-Type", "audio/ogg");
    res.setHeader("Accept-Ranges", "none");

    const stream = Readable.fromWeb(response.body);

    stream.on("error", err => {
      if (err.name !== "AbortError") {
        console.error("Stream error:", err);
      }
    });

    stream.pipe(res);

  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Fetch error:", err);
    }
    res.end();
  }
});
router.get("/hint",async(req, res)=>{
    const perks = await getPerks();
    const selectedOne = perks.filter(perk=>perk.character == myCache.get("daily").terror_radius)[0]
    res.status(200).json(selectedOne.name)
})

router.get("/:name",async(req, res)=>{
    req.params.name = req.params.name.replaceAll("_"," ").replaceAll("ryo","ryō")
    if(!(await getKillers()).includes(req.params.name)){
        res.status(404).json("Killer not found")
        return
    }
    if(req.params.name == myCache.get("daily").terror_radius){
        res.sendStatus(202)
    }
    else{
        res.sendStatus(200)
    }
})