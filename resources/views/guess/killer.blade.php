
<x-trivia-layout>
    <x-slot name="description">{{config("dbd.fields.Killer")[0]}}</x-slot>
    <x-slot name="title">DBDLE - Killer guessing</x-slot>
    <x-slot name="question">Guess today's Dead by Daylight killer!</x-slot>
    <x-slot name="page">killer</x-slot>
    <x-slot name="noBgForCard"></x-slot>
    <x-slot name="already">
    </x-slot>
    <x-slot name="content2">
    @vite(["resources/js/character.js"])
    <style>
        #attributes{
            overflow-x: auto;
        }
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
            min-width: 64px !important;
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
        @media (max-width: 993px) {
            .fullos{
                min-height:60px
            }
        }
        @media (min-width: 936px) {
            .card-killer{
                width:175% !important;
                left:-37.5%;
                position: relative
            }
        }
    </style>
    <div class="d-none" id="Allperks">
        @foreach($killers as $killer)
            <p>{{$killer}}</p>
        @endforeach
    </div>
    <a

        class="card-killer text-decoration-none text-center  w-100 m-auto grid items-start gap-4 rounded-lg bg-dark p-3 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"

    >

        <div class="grid gap-3 text-white center mx-auto" >
            <p class="text-decoration-none text-white">Type any killer to begin.</p>
            <div class="w-50 mx-auto">
                <input type="text" oninput="search(this.value)" name="guess" autocomplete="off" id="guessInput" class="bg-black rounded p-1">
                <div class="bg-black position-absolute rounded d-grid overflow-y-scroll overflow-x-hidden w-25 mt-2" id="foundPerks" style="max-height: calc(43.05px * 6);z-index: 1000;width: 200px !important;margin:auto;    left: 35%;">
                </div>
            </div>
            <div id="attributes">
                <div  class="foundPerk bg-dark rounded d-flex gap-4 align-items-end" >
                    <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">Character<hr></div>
                    <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">Gender<hr></div>
                    <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">Origin<hr></div>
                    <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">Height<hr></div>
                    <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">Movement speed<hr></div>
                    <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">Power attack type<hr></div>
                    <div  class="foundPerk alreadyGuessed bg-transparent flex-basis">Release date<hr></div>
                </div>
                <div class="bg-black rounded d-grid gap-3" id="alreadyGuessedPerks">

                </div>
            </div>

        </div>
    </a>
    </x-slot>
</x-trivia-layout>
