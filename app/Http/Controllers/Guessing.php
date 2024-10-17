<?php

namespace App\Http\Controllers;

use App\Console\Commands\DailyGenerate;
use App\Http\Controllers\Information;
use App\Providers\AppServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

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
            case "killer" || "splash":
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
            return json_encode(Cache::get('todays_perk')["description"]);
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
            return json_encode("Perk that contains it: ".Cache::get('todays_quote')["name"]);
        }
        return json_encode("NO");
    }
    public function findSplash(String $selected){
        if($selected == Cache::get('todays_splash')["character"]){
            return json_encode(Cache::get('todays_splash')["character"]);
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
    public function splash_src($tries)
    {
        $return_file="";
        if(Cache::get('todays_splash')["path"]){
            $return_file = Cache::get('todays_splash')["path"];
        }else{
            $path = realpath(storage_path()."/app/private/splashes");

            $chars=[];
            if ($path !== false && $path != '' && file_exists($path)) {
                foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path)) as $file) {
                    if($file->getFilename() == '.' || $file->getFilename() == '..'){continue;}
                    $matches="";
                    $name=explode("_", $file->getFilename())[1];
                    preg_match( '/[A-Z]/', substr($name,1), $matches, PREG_OFFSET_CAPTURE );
                    $name_end=substr($name,$matches[0][1]+1);
                    $name_start=substr($name,0,$matches[0][1]+1);
                    $name=$name_start." ".$name_end;
                    if($name=="The Troupe"){$name="Aestri Yazar & Baermar Uraz";}
                    if($name=="Yun- Jin Lee"){$name="Yun-Jin Lee";}
                    if($name == Cache::get('todays_splash')["character"]){
                        $return_file = file_get_contents($file->getPathname());
                        Cache::set('todays_splash',["character"=>$name,"path"=>$file->getPathname(),"pos_x"=>Cache::get("todays_splash")["pos_x"],"pos_y"=>Cache::get("todays_splash")["pos_y"]]);
                    }
                }
            }
        }
        $manager = new ImageManager(\Intervention\Image\Drivers\Gd\Driver::class,blendingColor: '21252900');
        $max_tries=19;
        if($tries>$max_tries){
            $tries=$max_tries;
        }
        $image=$manager->read($return_file);
        if(abs($tries-$max_tries) == 0){
            $scale=$image->height();
        }else{
            $scale=intval($image->height()/abs($tries-$max_tries));
        }

        if(!Cache::get('todays_splash')["pos_x"]){
            $width=$image->width()-$scale;
            if($width<0){
                $width=0;
            }
            $cache=Cache::get('todays_splash');
            $cache["pos_x"]=rand(0,$width);
            $cache["pos_y"]=rand(0,$image->height()-$scale);
            $isTooMuchBg=true;
            while($isTooMuchBg){
                $colors=[];
                for($i=0;$i<$scale;$i++){
                    for($j=0;$j<$scale;$j++){
                        $colors[] = $image->pickColor($cache["pos_x"] + $i, $cache["pos_y"] + $j)->toHex();
                    }
                }
                $all=0;

                foreach (array_count_values($colors) as $i=>$color) {
                    if(str_contains(strval($i),"212529")){
                        $all+= $color;
                    }else if(abs(intval($i)-21252900) < 10000){
                        $all+=$color;
                    }
                }
                $pos=["x"=>$cache["pos_x"],"y"=>$cache["pos_y"]];
                if($pos["x"]+$scale > $image->width()){
                    $pos["x"] -= $pos["x"]+$scale-$image->width();
                }
                if($pos["y"]+$scale > $image->height()){
                    $pos["y"] -= $pos["y"]+$scale-$image->height();
                }
                if($image->crop($scale, $scale,$pos["x"],$pos["y"],'000000')->toJpeg()->size()>704){
                    $isTooMuchBg=false;
                }else{
                    $width=$image->width()-$scale;
                    if($width<0){
                        $width=0;
                    }
                    $cache["pos_x"]=rand(0,$width);
                    $cache["pos_y"]=rand(0,$image->height()-$scale);
                }
            }
            Cache::set('todays_splash',$cache);
        }
        $pos=["x"=>Cache::get('todays_splash')["pos_x"],"y"=>Cache::get('todays_splash')["pos_y"]];
        if($pos["x"]+$scale > $image->width()){
            $pos["x"] -= $pos["x"]+$scale-$image->width();
        }
        if($pos["y"]+$scale > $image->height()){
            $pos["y"] -= $pos["y"]+$scale-$image->height();
        }
        $cropped=$image->crop($scale, $scale,$pos["x"],$pos["y"],'000000');
        if($cropped->height()*$cropped->width() != $scale*$scale){
            dd($cropped->height(),$cropped->width(),$scale);
        }
        return $cropped->toJpeg();

    }
}
