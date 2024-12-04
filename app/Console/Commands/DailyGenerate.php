<?php

namespace App\Console\Commands;

use App\Http\Controllers\Information;
use App\Models\DailyThing;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class DailyGenerate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:daily-generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the things for the daily guessing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //Cache::delete("perks");
        //INIT
        $perks = Information::getPerks();
        $chars=Information::fetchCharacters();
        $killers=[];
        foreach($chars as $char){
            if(str_contains($char,"The")){
                array_push($killers,$char);
            }
        }
        if(DailyThing::query()->where("type","perk")->count() == count($perks)){
            DailyThing::query()->where("type","perk")->delete();
        }
        $allPerksThatHasQuoteAndChar = $perks;
        foreach($allPerksThatHasQuoteAndChar as $i=>$perk){
            if(!array_key_exists("character",$perk) || !array_key_exists("quote",$perk)){
                unset($allPerksThatHasQuoteAndChar[$i]);
            }
        }
        if(DailyThing::query()->where("type","quote")->count() == count($allPerksThatHasQuoteAndChar)){
            DailyThing::query()->where("type","quote")->delete();
        }
        if(DailyThing::query()->where("type","killer")->count() == count($killers)){
            DailyThing::query()->where("type","killer")->delete();
        }
        if(DailyThing::query()->where("type","splash")->count() == count($chars)){
            DailyThing::query()->where("type","splash")->delete();
        }

        //PERKS
        Cache::delete("todays_perk");
        shuffle($perks);
        $perk=$perks[rand(0, count($perks) - 1)];
        while(DailyThing::query()->where('type', "perk")->where('value', $perk["name"])->exists()){
            $perk=$perks[rand(0, count($perks) - 1)];
        }
        Cache::forever('todays_perk',$perk );
        DailyThing::query()->create([
            "value"=>$perk["name"],
            "type"=>"perk"
        ]);
        //QUOTE
        Cache::delete("todays_quote");
        shuffle($allPerksThatHasQuoteAndChar);
        $perk=$allPerksThatHasQuoteAndChar[rand(0, count($allPerksThatHasQuoteAndChar) - 1)];
        while (DailyThing::query()->where('type', "quote")->where('value', $perk["name"])->exists()){
            $perk=$allPerksThatHasQuoteAndChar[rand(0, count($allPerksThatHasQuoteAndChar) - 1)];
        }
        Cache::forever('todays_quote',$perk );
        DailyThing::query()->create([
            "value"=>$perk["name"],
            "type"=>"quote"
        ]);
        //KILLER
        Cache::delete("todays_killer");
        shuffle($killers);
        $killer_name=$killers[rand(0, count($killers) - 1)];
        while(DailyThing::query()->where('type', "killer")->where('value', $killer_name)->exists()){
            $killer_name=$killers[rand(0, count($killers) - 1)];
        }
        $datas=Information::fetchKiller($killer_name);
        $killer=array_merge(["name"=>$killer_name],$datas);
        Cache::forever('todays_killer',$killer );
        DailyThing::query()->create([
            "value"=>$killer["name"],
            "type"=>"killer"
        ]);
        //SPLASH
        Cache::delete("todays_splash");
        shuffle($chars);
        $char=$chars[rand(0, count($chars) - 1)];
        while(DailyThing::query()->where('type', "splash")->where('value', $char)->exists()){
            $char=$chars[rand(0, count($chars) - 1)];
        }
        Cache::forever('todays_splash',["character"=>$char,"path"=>"","pos_x"=>"","pos_y"=>""]);
        DailyThing::query()->create([
            "value"=>$char,
            "type"=>"splash"
        ]);
    }

}
