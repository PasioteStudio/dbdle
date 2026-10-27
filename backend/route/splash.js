import express from "express";
import myCache from "../util/cache.js";
import { getCharacters } from "../util/scrapping.js";

const router = express.Router();
export default router;

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