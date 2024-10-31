<?php

use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Information;
use \App\Http\Controllers\Guessing;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/privacy_policy',[Information::class,'privacyView'])->name("privacy_policy");

Route::get("/api",[Information::class,'getPerks']);
Route::get("/{guess}",[Guessing::class,'view'])->whereIn('guess', ['perk', 'quote', 'killer','splash'])->name("view");
Route::get("/perk/image_src",[Guessing::class,'image_src'])->name("perk.image_src");
Route::get("/perk/{selected}",[Guessing::class,'findPerk']);
Route::get("/quote/{selected}",[Guessing::class,'findQuote']);
Route::get("/killer/{selected}",[Guessing::class,'findKiller']);
Route::get("/splash/{selected}",[Guessing::class,'findSplash']);
Route::get("/splash/splash_src/{tries}",[Guessing::class,'splash_src'])->name("splash.splash_src");
