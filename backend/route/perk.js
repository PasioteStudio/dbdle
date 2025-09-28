const express = require('express');
const fs = require('fs');
const path = require('path');
const myCache = require("../cache")
const [getPerks] = require("../util/scrapping")

const router = express.Router();
module.exports = router
router.get("/",async(req, res)=>{
    const perks = await getPerks();
    res.status(200).json(perks.map(perk => perk.name));
})
const outputDir = './perk';
router.get("/image",(req, res)=>{
    const fileName = fs.readdirSync(path.join(outputDir)).filter(file => file.startsWith("image"))[0];
    const fileBuffer = fs.readFileSync(path.join(outputDir, fileName ));
    res.appendHeader('Content-Type','image/'+fileName.split(".")[fileName.split(".").length-1]);
    res.status(200).send(fileBuffer);
})

router.get("/hint",async(req, res)=>{
    const perks = await getPerks();
    const selectedOne = perks.filter(perk=>perk.name == myCache.get("daily").perk)[0]
    res.status(200).json(selectedOne.description)
})

router.get("/:name",async(req, res)=>{
    req.params.name = req.params.name.replaceAll("_"," ")
    if(!(await getPerks()).map(perk=>perk.name).includes(req.params.name)){
        res.status(404).json("Perk not found")
        return
    }
    if(req.params.name == myCache.get("daily").perk){
        res.sendStatus(202)
    }
    else{
        res.sendStatus(200)
    }
})