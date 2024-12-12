<?php

use App\Http\Controllers\Guessing;
use App\Http\Controllers\Information;
use Illuminate\Support\Facades\Route;
use \Silber\PageCache\Middleware\CacheResponse;

Route::get('/', function () {
    return view('welcome');
})->middleware(CacheResponse::class);

Route::get('/privacy_policy',[Information::class,'privacyView'])->middleware(CacheResponse::class)->name("privacy_policy");


Route::get("/{guess}",[Guessing::class,'view'])->whereIn('guess', ['perk', 'quote', 'killer','splash'])->middleware(CacheResponse::class)->name("view");
Route::get("/perk/image_src",[Guessing::class,'image_src'])->name("perk.image_src");
Route::get("/perk/hint",[Guessing::class,'hintPerk']);
Route::get("/perk/{selected}",[Guessing::class,'findPerk']);
Route::get("/quote/hint",[Guessing::class,'hintQuote']);
Route::get("/quote/{selected}",[Guessing::class,'findQuote']);
Route::get("/killer/hint",[Guessing::class,'hintKiller']);
Route::get("/killer/{selected}",[Guessing::class,'findKiller']);
Route::get("/splash/splash_src/{tries}",[Guessing::class,'splash_src'])->name("splash.splash_src");
Route::get("/splash/hint",[Guessing::class,'hintSplash']);
Route::get("/splash/{selected}",[Guessing::class,'findSplash']);

Route::get("/api",[Information::class,'getPerks'])->name("api");
