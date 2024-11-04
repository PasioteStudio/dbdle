<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyThing extends Model
{
    protected $fillable = [
        "value",
        "type"
    ];
}
