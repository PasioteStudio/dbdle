<x-trivia-layout>
    <x-slot name="question">Guess the random quote!</x-slot>
    <x-slot name="description">{{config("dbd.fields.Quote")[0]}}</x-slot>
    <x-slot name="title">DBDLE - Quote guessing</x-slot>
    <x-slot name="page">quote</x-slot>
    <x-slot name="content2">
    <div class="d-none" id="Allperks">
        @foreach($chars as $char)
            <p>{{$char}}</p>
        @endforeach
    </div>
    <div class="pt-3 sm:pt-5 w-100 d-grid " style="justify-items: center">
        <p class="text-decoration-none text-white">Which character says</p>
        <h1 class="text-decoration-none text-white">❝{{\Illuminate\Support\Facades\Cache::get("todays_quote")["quote"]}}❞</h1>
    </div>
    <div class="grid gap-3 w-50 text-white center mx-auto justify-content-center">
        <div id="hint" onclick="hint()" class="d-none cursor-pointer">
            <img src="/random_perk.png" alt="" class="w-25 mx-auto">
            <p>Perk Clue after <span id="hintTries">5</span> tries</p>
        </div>
        <input type="text" oninput="search(this.value)" name="guess" autocomplete="off"  id="guessInput" class="bg-dark rounded  p-1">
        <p id="description"></p>


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
