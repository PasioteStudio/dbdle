const express = require('express');
const myCache = require("../cache")
const {getPerks,getCharacters,getCharacter} = require("../util/scrapping")

const router = express.Router();
module.exports = router


router.get("/",async(req, res)=>{
    const characters = await getCharacters();
    res.status(200).json(characters);
})

router.get("/text",async(req, res)=>{
    res.status(200).json(myCache.get("daily").lore.text);
})

router.get("/hint",async(req, res)=>{
    const perks = await getPerks();
    const selectedOne = perks.filter(perk=>perk.character == myCache.get("daily").lore.character)[0]
    res.status(200).json(selectedOne.name)
})

router.get("/:name",async(req, res)=>{
    req.params.name = req.params.name.replaceAll("_"," ").replace("Elodie","Élodie").replaceAll("ryo","ryō")
    if(!(await getCharacters()).includes(req.params.name)){
        res.status(404).json("Character not found")
        return
    }
    if(req.params.name == myCache.get("daily").lore.character){
        res.sendStatus(202)
    }
    else{
        res.sendStatus(200)
    }
})