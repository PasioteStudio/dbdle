@extends("layouts.trivia",["page"=>"splash","question"=>"Guess the random character by a splash art!","description"=>config("dbd.fields.Splash")[0],"title"=>"DBDLE - Splash guessing"])
@section("content2")
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
            <input type="text" oninput="search(this.value)" name="guess" autocomplete="off" id="guessInput" class="bg-dark rounded  p-1">
            <p id="description" class="visually-hidden"></p>
        </div>
@endsection
@section("already")
    <div class="grid gap-3 w-50 text-white center mx-auto">
    <div class="bg-black rounded d-grid overflow-y-scroll overflow-x-hidden" id="foundPerks" style="max-height: calc(43.05px * 6)">
    </div>
    <div class="bg-black rounded d-grid gap-3" id="alreadyGuessedPerks">
    </div>
    </div>
@endsection
