const express = require('express');
const myCache = require("../cache")
const [getPerks,getCharacters,getCharacter] = require("../util/scrapping")
const {Jimp} = require("jimp");

const router = express.Router();
module.exports = router
const number_of_tries = 12
const step = 35
const minSize = 512 - (step * number_of_tries)

router.get("/",async(req, res)=>{
    const characters = await getCharacters();
    res.status(200).json(characters);
})

router.get("/image_src/:size",async(req, res)=>{
    if(Number.isNaN(req.params.size)){
        return
    }
    let size = Number.parseInt(req.params.size)
    if(size > number_of_tries){
        size = number_of_tries
    }
    const icon = (await getCharacter(myCache.get("daily").splash.character)).icon
    const image = await Jimp.read(icon);
    const toSize = 512 - (step * (number_of_tries - size))
    let x = myCache.get("daily").splash.x
    if(x + toSize > 512){
        x = 512 - toSize
    }
    let y = myCache.get("daily").splash.y
    if(y + toSize > 512){
        y = 512 - toSize
    }
    const newImage = image.crop({x:x,y:y,w:toSize,h:toSize})

    res.set('Content-Type', 'image/png');
    res.status(200).send(Buffer.from(await newImage.getBuffer("image/png")));
})

router.get("/:name",async(req, res)=>{
    if(req.params.name == myCache.get("daily").splash.character){
        res.sendStatus(202)
    }
    else{
        res.sendStatus(200)
    }
})