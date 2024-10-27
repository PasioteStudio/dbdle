@extends("layouts.trivia",['question'=>"Guess the random perk!"])
@section("content2")
    <div class="d-none" id="Allperks">
        @foreach($perks as $perk)
        <p>{{$perk["name"]}}</p>
        @endforeach
    </div>
    <div class="pt-3 sm:pt-5 w-100 h-100 d-grid" style="justify-items: center; background: url('{{$veryrare_perk_bg}}') no-repeat center;background-size: contain;">
        <img class="w-50 " src="{{route("perk.image_src")}}" alt="">
    </div>
    <div class="grid gap-3 w-50 text-white center mx-auto justify-content-center">
        <input type="text" oninput="search(this.value)" autocomplete="off" name="guess" id="guessInput" class="bg-dark rounded  p-1">
        <p id="description">
        </p>

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
