const express = require('express');
const myCache = require("../cache")
const [getPerks,getCharacters] = require("../util/scrapping")

const router = express.Router();
module.exports = router


router.get("/",async(req, res)=>{
    const characters = await getCharacters();
    res.status(200).json(characters);
})

router.get("/text",async(req, res)=>{
    const perks = await getPerks();
    let selectedOne = perks.filter(perk=>perk.name == myCache.get("daily").quote)[0]
    res.status(200).json(selectedOne.quote.text);
})

router.get("/hint",async(req, res)=>{
    const perks = await getPerks();
    const selectedOne = perks.filter(perk=>perk.name == myCache.get("daily").quote)[0]
    res.status(200).json(selectedOne.name)
})

router.get("/:name",async(req, res)=>{
    req.params.name = req.params.name.replaceAll("_"," ").replace("Elodie","Élodie")
    if(!(await getCharacters()).includes(req.params.name)){
        res.status(404).json("Character not found")
        return
    }
    const perks = await getPerks();
    if(req.params.name == perks.filter(perk=>perk.name == myCache.get("daily").quote)[0].quote.from){
        res.sendStatus(202)
    }
    else{
        res.sendStatus(200)
    }
})