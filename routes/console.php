<?php

use App\Console\Commands\DailyGenerate;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    $gen = new DailyGenerate();
    $gen->handle();
})->daily();
