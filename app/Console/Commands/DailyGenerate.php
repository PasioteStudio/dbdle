<?php

namespace App\Console\Commands;

use App\Http\Controllers\Information;
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
        Cache::delete("todays_splash");
        //PERKS
        $perks = Information::getPerks();
        Cache::delete("todays_perk");
        shuffle($perks);
        if(!Cache::get('todays_perk')){
            Cache::forever('todays_perk', $perks[rand(0, count($perks) - 1)]);
        }
        //QUOTE
        Cache::delete("todays_quote");
        shuffle($perks);
        if(!Cache::get('todays_quote')){
            $perk=$perks[rand(0, count($perks) - 1)];
            while (!array_key_exists("character",$perk) || !array_key_exists("quote",$perk)){
                $perk=$perks[rand(0, count($perks) - 1)];
            }
            Cache::forever('todays_quote',$perk );
        }
        //KILLER
        Cache::delete("todays_killer");
        $killers=[];
        $chars=Information::fetchCharacters();
        foreach($chars as $char){
            if(str_contains($char,"The")){
                array_push($killers,$char);
            }
        }
        shuffle($killers);

        if(!Cache::get('todays_killer')){
            $killer_name=$killers[rand(0, count($killers) - 1)];
            $datas=Information::fetchKiller($killer_name);
            $killer=array_merge(["name"=>$killer_name],$datas);
            Cache::forever('todays_killer',$killer );
        }
        //SPLASH
        Cache::delete("todays_splash");
        shuffle($chars);
        if(!Cache::get('todays_splash')){
            $chars=$chars[rand(0, count($chars) - 1)];
        Cache::forever('todays_splash',["character"=>$chars,"path"=>"","pos_x"=>"","pos_y"=>""]);
        }
    }

}
