<x-main-layout>
<x-slot name="description">Guess in multiple categories of the Dead by Daylight game</x-slot>
<x-slot name="title">Dead By Daylight Daily</x-slot>
<x-slot name="page">welcome</x-slot>
<x-slot name="content">
<div class="grid  lg:grid-cols-1">
    <style>
        .vh-10{
            height: 16vh!important;
        }
        .w-110{
            width: 120% !important;
            margin-left: -20% !important;
        }
        .img-container{
            position:relative;
            width: 100%;
            overflow:hidden;
            padding-bottom: 100%;
            display: grid;
            align-items: center;

        }
        @media screen and (max-width: 576px) {
            .w-sm-1{
                width: 20%;
                height: 100%;
            }
        }
        .bg-purple{
            background-color: {{\App\Http\Controllers\Information::$veryrare_perk_color}};
        }
    </style>
    <h1 class="text-white fw-bold ">Guess dbd things daily</h1>
@foreach(config("dbd.fields") as $index=>$field)
    @if($index == "Terror Radius" || $index == "Survivor")
        @continue
    @endif
    <a
        href="{{route("view",$field[1])}}"
        class="text-decoration-none d-grid items-start
        @if(array_key_last(config("dbd.fields"))!=$index)
         vh-10
       @endif
          w-110 mb-5 gap-4 rounded-lg p-1  transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"

        style="max-height: 150px;"
    >
        <div src="/ui_cloud.png"  class="h-100 w-100" style="grid-column: 1;grid-row: 1;background: url('/ui_cloud.png') no-repeat center;background-size: 100% 100%;overflow: visible">
        </div>
        <div style="grid-column: 1;grid-row: 1;" class=" d-flex p-5 gap-4 items-start ">
            <div class="flex shrink-0 items-center justify-center rounded-full bg-purple  position-relative z-2 w-sm-1 w-25">
                <div class="img-container">
                    <img class="ratio ratio-1x1 position-absolute" src="{{$field[2]}}" alt="">
                </div>
            </div>
            <div class="pt-3 sm:pt-5">
                <h2 class="fs-3 font-semibold text-white dark:text-white">{{$index}}</h2>

                <p class="fs-6 text-white-50">
                    {{$field[0]}}
                </p>
            </div>
        </div>
    </a>
@endforeach



</div>
</x-slot>
</x-main-layout>
