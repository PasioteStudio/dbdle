const express = require('express');
const myCache = require("../cache")
const {getPerks,getCharacters,getCharacter,getKillers} = require("../util/scrapping")

const router = express.Router();
module.exports = router

router.get("/",async(req, res)=>{
    res.status(200).json(await getKillers());
})

router.get("/:name",async(req, res)=>{
    req.params.name = req.params.name.replaceAll("_"," ").replaceAll("ryo","ryō")
    if(!(await getKillers()).includes(req.params.name)){
        res.status(404).json("Killer not found")
        return
    }
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
        let isMS = dailyKiller.movement_speed == killer.movement_speed ? "true" : "false"
        if(isMS == "false"){
            try {
                const ms = killer.movement_speed.replace(" (alt)","").replace(" (power)","").split(" ")
                for(let i = 0; i<ms.length;i++){
                    if(dailyKiller.movement_speed.includes(ms[i])){
                        isMS = "inc"
                    }
                }
            } catch (error) {
                
            }
        }
        res.status(200).json({
            selected:{
            gender:killer.gender,
            origin:killer.origin,
            height:killer.height,
            movement_speed:killer.movement_speed,
            power_attack_type:killer.power_attack_type,
            release_date:killer.release_date 
        },difference:{
            gender:dailyKiller.gender == killer.gender ? "true" : (dailyKiller.gender.includes(killer.gender) ? "inc" : "false"),
            origin:dailyKiller.origin == killer.origin ? "true" : (dailyKiller.origin.includes(killer.origin) ? "inc" : "false"),
            height:dailyKiller.height == killer.height,
            movement_speed:isMS,
            power_attack_type:dailyKiller.power_attack_type == killer.power_attack_type,
            release_date:dailyKiller.release_date == killer.release_date ? "true" : (dailyKiller.release_date > killer.release_date ? "UP" : "DOWN")
        }
        })
    }
})