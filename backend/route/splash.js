const express = require('express');
const myCache = require("../cache")
const [getPerks,getCharacters,getCharacter] = require("../util/scrapping")
const {Jimp} = require("jimp");
const [nameVariations,invalidNames,splash] = require("../util/constants")
const router = express.Router();
module.exports = router

router.get("/",async(req, res)=>{
    const characters = await getCharacters();
    res.status(200).json(characters);
})

router.get("/image",async(req, res)=>{
    /*if(Number.isNaN(req.params.size)){
        return
    }
    let size = Number.parseInt(req.params.size);
    if(size > number_of_tries){
        size = number_of_tries
    }else if(size < 0){
        size = 0
    }
    const image = await Jimp.read("splash/splash.png");
    const toSize = max_width - (step * (number_of_tries - size))
    let x = myCache.get("daily").splash.x
    x = x - (step * size) / 2
    if(x + toSize > max_width){
        x = max_width - toSize
    }else if(x < 0){
        x = 0
    }
    let y = myCache.get("daily").splash.y
    y = y - (step * size) / 2
    if(y + toSize > max_width){
        y = max_width - toSize
    }else if(y < 0){
        y = 0
    }
    const newImage = image.crop({x:x,y:y,w:toSize,h:toSize})

    res.set('Content-Type', 'image/png');
    res.status(200).send(Buffer.from(await newImage.getBuffer("image/png")));*/
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