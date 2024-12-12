<x-main-layout>
<x-slot name="question">{{ $question }}</x-slot>
<x-slot name="description">{{ $description }}</x-slot>
<x-slot name="title">{{ $title }}</x-slot>
<x-slot name="page">{{ $page }}</x-slot>
<x-slot name="howto">
<div id="howtobg" class="position-fixed bg-black w-100 h-100 z-1 opacity-50 visually-hidden left-0 top-0">
</div>
<div id="howto" class="position-absolute w-100 z-3 row opacity-100 visually-hidden pe-3 pt-3 ps-3 left-0 top-0">
    <div class="text-white col-lg-4 mx-auto col-md-12 justify-center border-2 bg-dark border-black h-100 mt-sm-2 mt-lg-5 ">
        <button class="position-relative float-end bg-danger px-2 border-2 border-black exit" onclick="showHowto()">X</button>
        <h1 class="mt-2">How to play?</h1>
        <div class="w-100 bg-white fs-7 mb-3">.</div>
        <p>{{$description}} from Behavior's game "Dead by Daylight". It changes every 24h.</p>
        <div class="w-100 justify-center text-center">
            <p>Next {{ $page }} in</p>
            <h1 id="timer">
                00:00:00
            </h1>
            <p class="text-white-50"><i>Time zone: Europe (Midnight at UTC{{str_replace(["0",":"],"",date('P'))}})</i></p>
        </div>
        <h1>{{strtoupper($page->toHtml()[0]).substr($page,1)}} mode</h1>
        <div class="w-100 bg-white fs-7 mb-3">.</div>
        <p>
            @php
                echo config("dbd.fields.".strtoupper($page->toHtml()[0]).substr($page,1))[3];
            @endphp
        </p>
    </div>
</div>
</x-slot>
<x-slot name="content">
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

    .cheeky{
        margin-left: -25% !important;
        padding:100px !important;
        width: 150% !important;
        margin-top: -10vh !important;
        padding-bottom: 0 !important;
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
    .h-10{
        height: 10% !important;
    }
    .img-container{
        position:relative;
        width: 100%;
        overflow:hidden;
        padding-bottom: 100%;
        display: grid;
        align-items: center;

    }
    .fullos{
        min-height: 34.81px;
    }
    .fs-7{
        font-size: 0.2rem !important;
    }
    .exit{
        right: -25px !important;
        top: -15px;
    }
</style>

<div
    class="text-decoration-none position-relative text-center m-auto mt--2 d-grid items-start gap-4 rounded-lg p-3 transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
    style="background: url('/ui_cloud.png') no-repeat center;background-size: 100% 100%;"
>
    <div class=" sm:pt-5 w-100 d-flex justify-content-center gap-2" >
        <div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
            <div class="img-container p-0">
                <a href="{{route("view",["perk"])}}"><img class="ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/7/74/IconHelp_perks.png" alt=""></a>
            </div>
        </div>
        <div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
            <div class="img-container p-0">
                <a href="{{route("view",["quote"])}}"><img class=" ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/7/72/IconHelp_archivesCollection.png" alt=""></a>
            </div>
        </div>
        <div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
            <div class="img-container p-0">
                <a href="{{route("view",["killer"])}}"><img class=" ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/0/06/IconHelpLoading_killer.png" alt=""></a>
            </div>
        </div>
        <div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
            <div class="img-container p-0">
                <a href="{{route("view",["splash"])}}"><img class=" ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/6/69/OutfitIcon.png" alt=""></a>
            </div>
        </div>
        <div class="position-absolute fs-3 border-3 rounded border-warning right-8">
            <button onclick="showHowto()">📄</button>
        </div>
    </div>
</div>
<a
    class="text-decoration-none position-relative text-center w-100 m-auto d-grid items-start gap-4 rounded-lg p-3 transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
    style="background: url('/ui_cloud.png') no-repeat center;background-size: 100% 100%;width: 120% !important; margin-left: -10% !important;"
>
    <div class=" sm:pt-5 w-100 " >
        <h1 class="fs-1 font-semibold text-white dark:text-white  ">{{ $question }}</h1>
    </div>
</a>
<a

    class="text-decoration-none text-center cheeky w-100 m-auto grid items-start gap-4 rounded-lg p-3 transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
    @if( !isset($noBgForCard))
        style="background: url('/ui_cloud.png') no-repeat center;background-size: 100% 100%;overflow: visible"
    @endif
>
    {{$content2}}
</a>
<a class="minus-gap text-decoration-none">
    {{$already}}
</a>
</x-slot>
</x-main-layout>
