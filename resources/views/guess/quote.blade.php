@extends("layouts.trivia",["question"=>"Guess the random quote!","description"=>config("dbd.fields.Quote")[0],"title"=>"DBDLE - Quote guessing","page"=>"quote"])
@section("content2")
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
        <input type="text" oninput="search(this.value)" name="guess" autocomplete="off"  id="guessInput" class="bg-dark rounded  p-1">
        <p id="description"></p>


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
