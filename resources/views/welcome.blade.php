@extends("layouts.main")
@section("content")
<div class="grid gap-6 lg:grid-cols-1 lg:gap-8">
@php
    $fields=[
        "Perk"=>["Guess the random perk by icon","perk","https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/7/74/IconHelp_perks.png"],
        "Quote"=>["Guess the character by a quote of their","quote","https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/7/72/IconHelp_archivesCollection.png"],
        "Killer"=>["Guess the killer by clues","killer","https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/0/06/IconHelpLoading_killer.png"],
        "Survivor"=>["Guess the survivor by clues","survivor","https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/b/b3/IconHelpLoading_survivor.png"],
        "Terror Radius"=>["Guess the killer by their terror radius","terror_radius","https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/5/5b/IconHelp_skills.png"],
        "Splash"=>["Guess the character by a splash of their","splash","https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/6/69/OutfitIcon.png"]
        ]
//TODO: configba
@endphp
@foreach($fields as $index=>$field)
    <a
        href="{{route("view",$field[1])}}"
        class="text-decoration-none flex items-start gap-4 rounded-lg bg-white p-1 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
    >
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-danger sm:size-16">
            <img class="size-1 sm:size-16" src="{{$field[2]}}" alt="">
        </div>

        <div class="pt-3 sm:pt-5">
            <h2 class="fs-3 font-semibold text-black dark:text-white">{{$index}}</h2>

            <p class="fs-6 text-black">
                {{$field[0]}}
            </p>
        </div>
    </a>
@endforeach



</div>
@endsection
