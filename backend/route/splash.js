const express = require('express');
const myCache = require("../cache")
const {getPerks,getCharacters,getCharacter} = require("../util/scrapping")
const {nameVariations,invalidNames,splash} = require("../util/constants")
const router = express.Router();
module.exports = router

router.get("/",async(req, res)=>{
    res.status(200).json(await getCharacters());
})

router.get("/image",async(req, res)=>{
    res.status(200).json({x:myCache.get("daily").splash.x,y:myCache.get("daily").splash.y})
})

router.get("/:name",async(req, res)=>{
    req.params.name = req.params.name.replaceAll("_"," ").replace("Elodie","Élodie").replaceAll("ryo","ryō")
    if(!(await getCharacters()).includes(req.params.name)){
        res.status(404).json("Character not found")
        return
    }
    if(req.params.name == myCache.get("daily").splash.character){
        res.sendStatus(202)
    }
    else{
        res.sendStatus(200)
    }
})