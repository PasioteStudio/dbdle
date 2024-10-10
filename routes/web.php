<?php

use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Information;
use \App\Http\Controllers\Guessing;

Route::get('/', function () {
    return view('welcome');
});
Route::get("/api",[Information::class,'getPerks']);
Route::get("/{guess}",[Guessing::class,'view'])->whereIn('guess', ['perk', 'quote', 'killer','survivor','terror_radius','splash'])->name("view");
Route::get("/perk/image_src",[Guessing::class,'image_src'])->name("perk.image_src");
Route::get("/perk/{selected}",[Guessing::class,'findPerk']);
Route::get("/quote/{selected}",[Guessing::class,'findQuote']);
Route::get("/killer/{selected}",[Guessing::class,'findKiller']);
