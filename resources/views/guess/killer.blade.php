@extends("layouts.main")
@section("content")
    @vite(["resources/js/character.js"])
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
        .bg-green{
            background-color: green;
        }
        .bg-yellow{
            background-color: #666600;
        }
        .flex-basis{
            flex-basis: calc(14.28% - 4px);
            height: fit-content;
            padding-top: 0;
        }
    </style>
    <div class="d-none" id="Allperks">
        @foreach($killers as $killer)
            <p>{{$killer}}</p>
        @endforeach
    </div>
    <div class="row">
        <div class="grid gap-6 lg:grid-cols-1 lg:gap-8 text-center col-lg-6 mx-auto col-md-12 ">
            <a
                class="text-decoration-none text-center  w-100 m-auto flex items-start gap-4 rounded-lg bg-dark p-3 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
            >

                <div class="pt-3 sm:pt-5 w-100">
                    <h2 class="fs-3 font-semibold text-white dark:text-white  ">Guess the random killer!</h2>
                </div>
            </a>
            <a

                class="text-decoration-none text-center  w-100 m-auto grid items-start gap-4 rounded-lg bg-dark p-3 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
            >

                <div class="grid gap-3 text-white center mx-auto">
                    <div class="w-50 mx-auto">
                        <input type="text" oninput="search(this.value)" name="guess" id="guessInput" class="bg-black rounded w-100 p-1">
                        <div class="bg-black position-absolute rounded d-grid overflow-y-scroll overflow-x-hidden w-25 mt-2" id="foundPerks" style="max-height: calc(43.05px * 6);z-index: 1000">
                        </div>
                    </div>
                    <div  class="foundPerk bg-dark rounded d-flex gap-4 align-items-end" >
                        <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">Character<hr></div>
                        <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">gender<hr></div>
                        <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">origin<hr></div>
                        <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">height<hr></div>
                        <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">movement speed<hr></div>
                        <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">power attack type<hr></div>
                        <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">release date<hr></div>
                    </div>
                    <div class="bg-black rounded d-grid gap-3" id="alreadyGuessedPerks">

                    </div>
                </div>
            </a>
        </div>
    </div>
@endsection
