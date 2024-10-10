@extends("layouts.main")
@section("content")
    <style>
        .foundPerk:hover{
            background-color: #0d6efd;
        }
        .foundPerk{
            padding-top: 10px;;
            padding-bottom: 10px;;
        }
        .alreadyGuessed{
            background-color: red;
        }
        .goodGuess{
            background-color: green;
        }
    </style>
    <div class="d-none" id="Allperks">
        @foreach($chars as $char)
            <p>{{$char}}</p>
        @endforeach
    </div>
    <div class="row">
        <div class="grid gap-6 lg:grid-cols-1 lg:gap-8 text-center col-lg-4 mx-auto col-md-12 ">
            <a
                class="text-decoration-none text-center  w-100 m-auto flex items-start gap-4 rounded-lg bg-dark p-3 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
            >

                <div class="pt-3 sm:pt-5 w-100">
                    <h2 class="fs-3 font-semibold text-white dark:text-white  ">Guess the random quote!</h2>
                </div>
            </a>
            <a

                class="text-decoration-none text-center  w-100 m-auto grid items-start gap-4 rounded-lg bg-dark p-3 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
            >

                <div class="pt-3 sm:pt-5 w-100 d-grid " style="justify-items: center">
                    <h1 class="text-decoration-none text-white">❝{{\Illuminate\Support\Facades\Cache::get("todays_quote")["quote"]}}❞</h1>
                </div>
                <div class="grid gap-3 w-50 text-white center mx-auto">
                    <input type="text" oninput="search(this.value)" name="guess" id="guessInput" class="bg-black rounded  p-1">
                    <div class="bg-black rounded d-grid overflow-y-scroll overflow-x-hidden" id="foundPerks" style="max-height: calc(43.05px * 6)">
                    </div>
                    <div class="bg-black rounded d-grid gap-3" id="alreadyGuessedPerks">
                    </div>
                </div>
            </a>
        </div>
    </div>
@endsection
