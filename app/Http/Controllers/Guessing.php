<?php

namespace App\Http\Controllers;

use App\Console\Commands\DailyGenerate;
use App\Http\Controllers\Information;
use App\Providers\AppServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class Guessing extends Controller
{

    public function index(){

    }
    public function view(String $page){
        $handle = new DailyGenerate();
        $handle->handle();
        $veryrare_perk_bg=Information::$veryrare_perk_bg;
        $perks=[];
        $chars=[];
        $killers=[];
        switch($page){
            case "perk":
                $perks=Information::getPerks();
                break;
            case "quote":
                $chars=Information::getCharacters();
                break;
            case "killer":
                $chars=Information::getCharacters();
                foreach($chars as $char){
                    if(str_contains($char,"The")){
                        array_push($killers,$char);
                    }
                }

                break;
        }
        return view("guess.".$page,compact('chars',"killers","veryrare_perk_bg",'perks'));
    }
    public function findPerk(String $selected){
        if($selected == Cache::get('todays_perk')["name"]){
            return json_encode("YES");
        }
        return json_encode("NO");
    }
    public function findKiller(String $selected)
    {
        $selected_killer=Information::fetchKiller($selected);
        $response=[
            "name"=>"NO",
            "year"=>"NO",
            "origin"=>"NO",
            "movement_speed"=>"NO",
            "height"=>"NO",
            "power_attack_type"=>"NO",
            "gender"=>"NO"
        ];
        if($selected_killer["year"] == Cache::get('todays_killer')["year"]){
            $response["year"]="YES";//TODO Le fel
        }else if(intval($selected_killer["year"]) < intval(Cache::get('todays_killer')["year"])){
            $response["year"]="HIGHER";
        }else if(intval($selected_killer["year"]) > intval(Cache::get('todays_killer')["year"])){
            $response["year"]="LOWER";
        }
        foreach (explode(" ",$selected_killer["origin"]) as  $value) {
            if(str_contains(Cache::get('todays_killer')["origin"],$value)){
                $response["origin"]="MAYBE";
            }
        }
        if($selected_killer["origin"] == Cache::get('todays_killer')["origin"]){
            $response["origin"]="YES";
        }

        if($selected_killer["movement_speed"] == Cache::get('todays_killer')["movement_speed"]){
            $response["movement_speed"]="YES";
        }if($selected_killer["height"] == Cache::get('todays_killer')["height"]){
            $response["height"]="YES";
        }
        $selected_killer["gender"]=str_replace(">","> ",$selected_killer["gender"]);
        foreach (explode(" ",$selected_killer["gender"]) as  $value) {

            if(str_contains(Cache::get('todays_killer')["gender"],$value)){
                $response["gender"]="MAYBE";
            }
            if($value=="Men"){
                if(str_contains(Cache::get('todays_killer')["gender"],"Man")){
                    $response["gender"]="MAYBE";
                }
            }else if($value=="Women"){
                if(str_contains(Cache::get('todays_killer')["gender"],"Woman")){
                    $response["gender"]="MAYBE";
                }
            }
        }
        if($selected_killer["gender"] == Cache::get('todays_killer')["gender"]){
            $response["gender"]="YES";
        }

        if($selected_killer["power_attack_type"] == Cache::get('todays_killer')["power_attack_type"]){
            $response["power_attack_type"]="YES";
        }if($selected == Cache::get('todays_killer')["name"]){
            $response["name"]="YES";
        }
        $response=array_merge($response,["selected_killer"=>$selected_killer]);
        return json_encode($response);
    }
    public function findQuote(String $selected){
        if($selected == Cache::get('todays_quote')["character"]){
            return json_encode("YES");
        }
        return json_encode("NO");
    }
    public function image_src()
    {
        $file = file_get_contents(Cache::get('todays_perk')["image_src"]);
        $response = Response::make($file, 200);
        $response->header('Content-Type', 'image/png');
        return $response;
    }
}
