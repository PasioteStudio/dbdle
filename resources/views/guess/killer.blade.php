@extends("layouts.main",["description"=>config("dbd.fields.Killer")[0],"title"=>"DBDLE - Killer guessing","page"=>"killer"])
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
        .minus-gap{
            margin-top: -4rem !important;
        }
        .mt--2{
            margin-top: -7.5vh !important;
        }
        .w-10{
            width: 10% !important;
        }
        .fullos{
            min-height: 46.69px;
        }
    </style>
    <div class="d-none" id="Allperks">
        @foreach($killers as $killer)
            <p>{{$killer}}</p>
        @endforeach
    </div>
    <div
        class="text-decoration-none position-relative text-center m-auto mt--2 d-grid items-start gap-4 rounded-lg p-3 transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
        style="background: url('/ui_cloud.png') no-repeat center;background-size: 100% 100%;"
    >
        <div class=" sm:pt-5 w-100 d-flex justify-content-center gap-2" >
            <div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
                <div class="img-container p-0">
                    <a href="{{route("view",["perk"])}}"><img class="size-1 ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/7/74/IconHelp_perks.png" alt=""></a>
                </div>
            </div>
            <div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
                <div class="img-container p-0">
                    <a href="{{route("view",["quote"])}}"><img class="size-1 ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/7/72/IconHelp_archivesCollection.png" alt=""></a>
                </div>
            </div>
            <div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
                <div class="img-container p-0">
                    <a href="{{route("view",["killer"])}}"><img class="size-1 ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/0/06/IconHelpLoading_killer.png" alt=""></a>
                </div>
            </div>
            <!--<div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
            <div class="img-container p-0">
                <a href="{{route("view",["survivor"])}}"><img class="size-1 ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/b/b3/IconHelpLoading_survivor.png" alt=""></a>
            </div>
        </div>
        <div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
            <div class="img-container p-0">
                <a href="{{route("view",["terror_radius"])}}"><img class="size-1 ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/5/5b/IconHelp_skills.png" alt=""></a>
            </div>
        </div>-->
            <div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
                <div class="img-container p-0">
                    <a href="{{route("view",["splash"])}}"><img class="size-1 ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/6/69/OutfitIcon.png" alt=""></a>
                </div>
            </div>
        </div>
    </div>
    <a
        class="text-decoration-none text-center  w-100 m-auto flex items-start gap-4 rounded-lg bg-dark p-3 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
    >

        <div class="pt-3 sm:pt-5 w-100">
            <h2 class="fs-3 font-semibold text-white dark:text-white  ">Guess today's Dead by Daylight killer!</h2>
            <p class="text-decoration-none text-white">Type any killer to begin.</p>
        </div>
    </a>
    <a

        class="text-decoration-none text-center  w-100 m-auto grid items-start gap-4 rounded-lg bg-dark p-3 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
    >

        <div class="grid gap-3 text-white center mx-auto" >
            <div class="w-50 mx-auto">
                <input type="text" oninput="search(this.value)" name="guess" autocomplete="off" id="guessInput" class="bg-black rounded w-100 p-1">
                <div class="bg-black position-absolute rounded d-grid overflow-y-scroll overflow-x-hidden w-25 mt-2" id="foundPerks" style="max-height: calc(43.05px * 6);z-index: 1000">
                </div>
            </div>
            <div id="attributes">
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

        </div>
    </a>
@endsection
