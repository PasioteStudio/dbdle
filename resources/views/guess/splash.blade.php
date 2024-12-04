<x-trivia-layout>
    <x-slot name="question">Guess the random character by a splash art!</x-slot>
    <x-slot name="description">{{config("dbd.fields.Splash")[0]}}</x-slot>
    <x-slot name="title">DBDLE - Splash guessing</x-slot>
    <x-slot name="page">splash</x-slot>
    <x-slot name="content2">
    @vite(["resources/js/splash.js"])
    <div class="d-none" id="Allperks">
        @foreach($chars as $char)
            <p>{{$char}}</p>
        @endforeach
    </div>
    <p class="text-decoration-none text-white">Which character has the whole splash art?</p>
        <div class="pt-3 sm:pt-5 w-100 d-grid" style="justify-items: center;">

            <img class="w-50 " src="{{route("splash.splash_src",[0])}}" alt="" id="splash_img">
            <button class="border-2 rounded-circle w-10 bg-warning p--2" onclick="zoomOut()"><img src="/zoom.webp" alt="" class="" ></button>
            <p class="text-decoration-none text-white">Each try zooms out a bit.</p>
        </div>
        <div class="grid gap-3 w-50 text-white center mx-auto mb-5">
            <input type="text" oninput="search(this.value)" name="guess" autocomplete="off" id="guessInput" class="bg-dark rounded  p-1 w-100">
            <p id="description" class="visually-hidden"></p>
        </div>
    </x-slot>
<x-slot name="already">
    <div class="grid gap-3 w-50 text-white center mx-auto">
    <div class="bg-black rounded d-grid overflow-y-scroll overflow-x-hidden" id="foundPerks" style="max-height: calc(43.05px * 6)">
    </div>
    <div class="bg-black rounded d-grid gap-3" id="alreadyGuessedPerks">
    </div>
    </div>
</x-slot>
</x-trivia-layout>
