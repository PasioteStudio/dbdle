const express = require('express');
const myCache = require("../cache")
const [getPerks,getCharacters,getCharacter] = require("../util/scrapping")

const router = express.Router();
module.exports = router

router.get("/",async(req, res)=>{
    const characters = await getCharacters();
    const killers = characters.filter(character=>character.includes("The"))
    res.status(200).json(killers);
})

router.get("/:name",async(req, res)=>{
    const killer = await getCharacter(req.params.name)
    const dailyKiller = await getCharacter(myCache.get("daily").killer)
    if(req.params.name == myCache.get("daily").killer){
        res.status(202).json({selected:{
            gender:killer.gender,
            origin:killer.origin,
            height:killer.height,
            movement_speed:killer.movement_speed,
            power_attack_type:killer.power_attack_type,
            release_date:killer.release_date
        }})
    }
    else{
        res.status(200).json({
            selected:{
            gender:killer.gender,
            origin:killer.origin,
            height:killer.height,
            movement_speed:killer.movement_speed,
            power_attack_type:killer.power_attack_type,
            release_date:killer.release_date 
        },difference:{
            gender:dailyKiller.gender == killer.gender,
            origin:dailyKiller.origin == killer.origin,
            height:dailyKiller.height == killer.height,
            movement_speed:dailyKiller.movement_speed == killer.movement_speed ? "true" : (dailyKiller.movement_speed.includes(killer.movement_speed) ? "inc" : "false"),
            power_attack_type:dailyKiller.power_attack_type == killer.power_attack_type,
            release_date:dailyKiller.release_date == killer.release_date ? "true" : (dailyKiller.release_date > killer.release_date ? "UP" : "DOWN")
        }
        })
    }
})