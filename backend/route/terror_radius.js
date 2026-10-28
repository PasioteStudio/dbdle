import express from "express";
import { pipeline } from "node:stream/promises";
import myCache from "../util/cache.js";
import { getCharacter, getKillers, getPerks } from "../util/scrapping.js";
import axios from "axios";

const router = express.Router();
export default router;

router.get("/",async(req, res)=>{
    res.status(200).json(await getKillers());
})

router.get("/sound", async (req, res) => {
  const controller = new AbortController();
  res.on("close", () => {
    if (!res.writableEnded) controller.abort();
  });

  try {
    const killer = await getCharacter(myCache.get("daily").terror_radius);

    const response = await axios.get(killer.terror_radius, {
      signal: controller.signal,
      responseType: "stream",
      headers: {
        "User-Agent": "DbDle/2.0",
        "Accept": "audio/*",
        "Referer": "https://deadbydaylight.wiki.gg/"
      }
    });

    res.status(200);
    res.setHeader("Content-Type", response.headers["content-type"] ?? "audio/ogg");
    res.setHeader("Accept-Ranges", "none");

    await pipeline(response.data, res, { signal: controller.signal });

  } catch (err) {
    if (!controller.signal.aborted) {
      console.error("Terror-radius audio fetch failed:", err);
      if (!res.headersSent) {
        res.sendStatus(502);
      } else {
        res.destroy(err);
      }
    }
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