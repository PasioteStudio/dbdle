const express = require('express');
const myCache = require("../cache")
const { Readable } = require("stream");
const  {getPerks,getCharacters,getCharacter,getKillers}= require("../util/scrapping")

const router = express.Router();
module.exports = router

router.get("/",async(req, res)=>{
    res.status(200).json(await getKillers());
})

router.get("/sound",async(req, res)=>{
    const killer = await getCharacter(myCache.get("daily").terror_radius)
    try {
        const response = await fetch(killer.terror_radius, {
        headers: {
            ...req.headers,
            host: undefined
        }
        });

        res.status(response.status);
        response.headers.forEach((value, key) => {
        res.setHeader(key, value);
        });

        // 🔥 Convert Web stream to Node stream
        Readable.fromWeb(response.body).pipe(res);
    }catch(err){
        
    }
})

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