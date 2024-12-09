<x-trivia-layout>
<x-slot name="question">Guess the random perk!</x-slot>
<x-slot name="description">{{config("dbd.fields.Perk")[0]}}</x-slot>
<x-slot name="title">DBDLE - Perk guessing</x-slot>
<x-slot name="page">perk</x-slot>
<x-slot name="content2">
    <div class="d-none" id="Allperks">
        @foreach($perks as $perk)
        <p>{{$perk["name"]}}</p>
        @endforeach
    </div>
    <p class="text-decoration-none text-white m-0">Which perk has this icon?</p>
    <div class="p-3 sm:pt-5 w-100 h-100 d-grid" style="justify-items: center; background: url('{{\App\Http\Controllers\Information::$veryrare_perk_bg}}') no-repeat center;background-size: contain;">
        <img class="w-50" src="{{route("perk.image_src")}}" alt="">
    </div>
    <div class="grid gap-3 w-50 text-white center mx-auto justify-content-center">
        <input type="text" oninput="search(this.value)" autocomplete="off" name="guess" id="guessInput" class="bg-dark rounded  p-1">
        <p id="description" class="pt-0 pb-0 position-relative" style="width: 200%;
    left: -50%;
    background: url(/ui_cloud.png) no-repeat center;
    background-size: 100% 100%;
    padding: 100px;">
        </p>

    </div>
</x-slot>
<x-slot name="already">
    <div class="grid gap-3 w-50 text-white center mx-auto">
        <div class="bg-black rounded d-grid overflow-y-scroll overflow-x-hidden" id="foundPerks" style="max-height: calc(43.05px * 6);width: 200px;margin:auto">
        </div>
        <div class="bg-black rounded d-grid gap-3" id="alreadyGuessedPerks">
        </div>
    </div>
</x-slot>
</x-trivia-layout>
