<?php

namespace App\Http\Controllers;

use App\Console\Commands\DailyGenerate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class Information extends Controller
{

    public static $veryrare_perk_bg="data:image/png;base64,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";
    public static $veryrare_perk_color="#482154";

    public static function getPerks(){
        if(!Cache::get("perks")){
            Cache::forever("perks", self::fetchPerks());
        }
        return Cache::get("perks");
    }
    public static function getCharacters(){
        return self::fetchCharacters();
    }
    public static function fetchCharacters() : array
    {
        $characters=[];
        foreach(self::getPerks() as $perk) {
            if(!array_key_exists("character",$perk)){continue;}
            if(!in_array($perk["character"],$characters)){
                array_push($characters,$perk["character"]);

            };
        }
        return $characters;
    }
    public static function fetchPerks() : array
    {
        $content = file_get_contents('https://deadbydaylight.fandom.com/wiki/Perks');
        $table_start = strpos($content, '<tbody>');
        $table_end = strpos($content, '</tbody>');

        $table = substr($content,$table_start,$table_end-$table_start);

        $table2_start = strpos($content, '<tbody>',$table_end);
        $table2_end = strpos($content, '</tbody>',$table2_start);
        $table2=substr($content,$table2_start,$table2_end-$table2_start);

        $my = explode('</tr>',$table);
        $my2 = explode('</tr>',$table2);
        $perks=[

        ];
        foreach ($my as $i=>$perk) {
            if ($i==0){continue;}
            elseif ($i==count($my)-1){continue;}
            $perkToPush=[];

            foreach (explode("</th>",$perk) as $j=> $perkInfo) {
                switch ($j) {
                    case 0:
                        $image_start = strpos($perkInfo, 'href="')+6;
                        $image_end = strpos($perkInfo, '" class="image" ');
                        $image =substr($perkInfo,$image_start,$image_end-$image_start);
                        $image=explode('.png',$image)[0].".png";
                        $perkToPush = array_merge($perkToPush,["image_src"=>$image]);
                        break;
                    case 1:
                        $name_start = strpos($perkInfo, 'title="')+7;
                        $name_end = strpos($perkInfo, '">');
                        $name =substr($perkInfo,$name_start,$name_end-$name_start);
                        $name=str_replace('&#39;',"'",$name);
                        $perkToPush = array_merge($perkToPush,["name"=>$name]);
                        break;
                    case 2:
                        $description = "";
                        foreach (explode('<',$perkInfo) as $k=> $element) {
                            if ($k==0){continue;}
                            if ($k==1){continue;}
                            switch ($k) {
                                case 2 || 3:
                                    $tmp_end = strpos($element, '>')+1;
                                    $tmp4=substr($element,$tmp_end);
                                    $description=$description.$tmp4;
                                    break;
                            }
                        }
                        $description=str_replace("\n","",$description);
                        $description=str_replace("&#160;","",$description);
                        $description=str_replace("&#37;","%",$description);

                        $quote_start = strpos($description, '"')+1;
                        //van quote
                        if(strpos($description, '"')){
                            $quote_end = strpos($description, '"',strpos($description, '"')+1);
                            $quote = substr($description,$quote_start,$quote_end-$quote_start);
                            $perkToPush = array_merge($perkToPush,["quote"=>$quote]);
                        }



                        $section="";
                        $section2="";

                        foreach (array_reverse(explode("</div>",$perkInfo)) as $divs){
                            if ($divs=="\n"){continue;}
                            $section=$divs;

                            break;
                        }
                        $character_start=strpos($section, 'title="')+7;
                        $character_end = strpos($section, '"',$character_start+1);

                        $character = substr($section,$character_start,$character_end-$character_start);
                        if(count(explode("</div>",$perkInfo))!=1){
                            if($character=="The Troupe"){$character="Aestri Yazar & Baermar Uraz";}
                            $perkToPush = array_merge($perkToPush,["character"=>$character]);
                        }



                        if(!strpos($description, '"')){
                            $description= substr($description,0,strlen($description)-strlen(explode(" ",$character)[0]));
                        }

                        $description = explode('"',$description)[0];
                        $perkToPush = array_merge($perkToPush,["description"=>$description]);
                        break;
                }


            }
            array_push($perks,$perkToPush);

        }
        foreach ($my2 as $i=>$perk) {
            if ($i==0){continue;}
            elseif ($i==count($my2)-1){continue;}
            $perkToPush=[];

            foreach (explode("</th>",$perk) as $j=> $perkInfo) {
                switch ($j) {
                    case 0:
                        $image_start = strpos($perkInfo, 'href="')+6;
                        $image_end = strpos($perkInfo, '" class="image" ');
                        $image =substr($perkInfo,$image_start,$image_end-$image_start);
                        $image=explode('.png',$image)[0].".png";
                        $perkToPush = array_merge($perkToPush,["image_src"=>$image]);
                        break;
                    case 1:
                        $name_start = strpos($perkInfo, 'title="')+7;
                        $name_end = strpos($perkInfo, '">');
                        $name =substr($perkInfo,$name_start,$name_end-$name_start);
                        $name=str_replace('&#39;',"'",$name);
                        $perkToPush = array_merge($perkToPush,["name"=>$name]);
                        break;
                    case 2:
                        $description = "";
                        foreach (explode('<',$perkInfo) as $k=> $element) {
                            if ($k==0){continue;}
                            if ($k==1){continue;}
                            switch ($k) {
                                case 2 || 3:
                                    $tmp_end = strpos($element, '>')+1;
                                    $tmp4=substr($element,$tmp_end);
                                    $description=$description.$tmp4;
                                    break;
                            }
                        }
                        $description=str_replace("\n","",$description);
                        $description=str_replace("&#160;","",$description);
                        $description=str_replace("&#37;","%",$description);

                        $quote_start = strpos($description, '"')+1;
                        //van quote
                        if(strpos($description, '"')){
                            $quote_end = strpos($description, '"',strpos($description, '"')+1);
                            $quote = substr($description,$quote_start,$quote_end-$quote_start);
                            $perkToPush = array_merge($perkToPush,["quote"=>$quote]);
                        }



                        $section="";
                        foreach (array_reverse(explode("</div>",$perkInfo)) as $divs){
                            if ($divs=="\n"){continue;}
                            $section=$divs;
                            break;
                        }
                        $character_start=strpos($section, 'title="')+7;

                        $character_end = strpos($section, '"',$character_start+1);
                        $character = substr($section,$character_start,$character_end-$character_start);
                        if(count(explode("</div>",$perkInfo))!=1){
                            $perkToPush = array_merge($perkToPush,["character"=>$character]);

                        }


                        if(!strpos($description, '"')){
                            $description= substr($description,0,strlen($description)-strlen(explode(" ",$character)[0]));
                        }

                        $description = explode('"',$description)[0];
                        $perkToPush = array_merge($perkToPush,["description"=>$description]);
                        break;
                }


            }
            array_push($perks,$perkToPush);

        }

        return $perks;
    }
    public static function fetchKiller(String $killer):array{
        $content = file_get_contents('https://deadbydaylight.fandom.com/wiki/'.rawurlencode($killer));
        $year_start=strpos($content, ' 20');
        $year=substr($content,$year_start+1,4);

        $table_start = strpos($content, '<tbody>');
        $table_end = strpos($content, '</tbody>');
        $table = substr($content,$table_start,$table_end-$table_start);
        $plus=10;
        while(str_contains($table,"small")){
            $table_start = strpos($content, '<tbody>',$table_start+$plus);
            $table_end = strpos($content, '</tbody>',$table_end+$plus);

            $table = substr($content,$table_start,$table_end-$table_start);
            $plus+=10;
        }
        $my = explode('</tr>',$table);
        $infos=[
            "year"=>$year,
        ];
        foreach ($my as $i=>$info) {
            if(str_contains($info, 'Gender')){
                $search='<td class="valueColumn">';
                $gender_start = strpos($info, $search)+strlen($search);
                $gender_end = strpos($info, '</td>',$gender_start);
                $gender =substr($info,$gender_start,$gender_end-$gender_start);
                $gender=str_replace("\n","",$gender);
                $infos = array_merge($infos,["gender"=>$gender]);
            }else if(str_contains($info, 'Origin')){
                $search='<td class="valueColumn">';
                $origin_start = strpos($info, $search)+strlen($search);
                $origin_end = strpos($info, '</td>',$origin_start);
                $origin =substr($info,$origin_start,$origin_end-$origin_start);
                $origin=str_replace("\n","",$origin);
                if(str_contains($origin, '(')){
                    $origin=explode(" (",$origin)[0];
                }

                $infos = array_merge($infos,["origin"=>htmlspecialchars_decode($origin)]);
            }else if(str_contains($info, 'Attack</a> Type')){
                $search='<td class="valueColumn">';
                $power_attack_type_start = strpos($info, $search)+strlen($search);
                $power_attack_type_end = strpos($info, '</td>',$power_attack_type_start);
                $power_attack_type =substr($info,$power_attack_type_start,$power_attack_type_end-$power_attack_type_start);
                $power_attack_type=str_replace("\n","",$power_attack_type);
                $power_attack_type=explode("<p>",$power_attack_type)[0];
                $infos = array_merge($infos,["power_attack_type"=>htmlspecialchars_decode($power_attack_type)]);
            }else if(str_contains($info, 'Movement Speed')){
                $search='<td class="valueColumn">';
                $movement_speed_start = strpos($info, $search)+strlen($search);
                $movement_speed_end = strpos($info, '</td>',$movement_speed_start);
                $movement_speed =substr($info,$movement_speed_start,$movement_speed_end-$movement_speed_start);
                $movement_speed=str_replace("\n","",$movement_speed);
                $movement_speed=substr($movement_speed,strpos($movement_speed,"</b>")+5);
                $infos = array_merge($infos,["movement_speed"=>htmlspecialchars_decode($movement_speed)]);
            }else if(str_contains($info, 'Height')){
                $search='<td class="valueColumn">';
                $height_start = strpos($info, $search)+strlen($search);
                $height_end = strpos($info, '</td>',$height_start);
                $height =substr($info,$height_start,$height_end-$height_start);
                $height=str_replace("\n","",$height);
                $infos = array_merge($infos,["height"=>htmlspecialchars_decode($height)]);
            }

        }
        if(!str_contains($table, 'Attack</a> Type')){
            $infos = array_merge($infos,["power_attack_type"=>"None"]);
        }
        return $infos;
    }

    public function privacyView()
    {
        return view('misc.privacy_policy');
    }
}
