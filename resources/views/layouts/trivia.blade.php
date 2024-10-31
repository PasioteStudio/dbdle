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
</style>
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
        <div class="flex size-1 shrink-0 items-center justify-center rounded-full bg-danger  position-relative z-2 w-sm-1 w-10 h-10">
            <div class="img-container p-0">
                <a href="{{route("view",["splash"])}}"><img class="size-1 ratio ratio-1x1 fullos" src="https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/6/69/OutfitIcon.png" alt=""></a>
            </div>
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
    style="background: url('/ui_cloud.png') no-repeat center;background-size: 100% 100%;overflow: visible"
>
    @yield("content2")
</a>
<a class="minus-gap text-decoration-none">
    @yield("already")
</a>
@endsection
