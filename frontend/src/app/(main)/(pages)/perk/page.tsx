"use client"
import ExportedImage from "next-image-export-optimizer";
import { perkBg } from "@/util/constants";
import SearchInput from "@/component/input/search";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function sameDay(d1:Date, d2:Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function generateRotation(){
  const number = Math.random()
  return number < .25 ? "rotate-0" : (number < .5 ? "rotate-90" : (number < .75 ? "-rotate-90" : "rotate-180"))
}

export default function Home() {
  const [missCount,setMissCount] = useState<number>(6)
  const router = useRouter()
  const nextMode = useRef<HTMLDivElement | null>(null)
  const [hint,setHint] = useState<string>()
  const [isFound,setFound] = useState<boolean>(false)
  const [isHintShown,setIsHintShown] = useState<boolean>(false)
  const [isIridescentModeOpen,setIridescentModeOpen] = useState<boolean>(false)
  const [iridescentMode, setIridescentMode] = useState<{blur:boolean,rotation:boolean,rotationDeg:string}>({blur:true,rotation:true,rotationDeg:""})
  const iridescentRotation = useRef<HTMLInputElement | null>(null)
  const iridescentBlur = useRef<HTMLInputElement | null>(null)

  useEffect(()=>{
    if(localStorage.getItem("iridescentMode")){
      const iriMode = JSON.parse(localStorage.getItem("iridescentMode") || "")
      setIridescentMode(iriMode)
      iridescentRotation.current!.checked = iriMode.rotation
      iridescentBlur.current!.checked = iriMode.blur

      const newIri = {...iriMode,rotationDeg:generateRotation()}
      if(!iriMode.rotationDeg || !iriMode.rotationDeg.includes("rotate")){
        if(localStorage.getItem("/perk") && !sameDay(new Date(JSON.parse(localStorage.getItem("/perk")!).date),new Date())){
          localStorage.setItem("iridescentMode",JSON.stringify(newIri))
          setIridescentMode(newIri)
        }
      }
    }else{
      const newIri = {...iridescentMode,rotationDeg:generateRotation()}
      localStorage.setItem("iridescentMode",JSON.stringify(newIri))
      setIridescentMode(newIri)
    }
    
  },[iridescentMode])
  
  const handleFound = () => {
    setFound(true)
    if(!nextMode.current){
      setTimeout(()=>{
        window.scrollTo({ top: nextMode.current!.offsetTop, behavior: "smooth" });
      },500)
    }else{
      window.scrollTo({ top: nextMode.current!.offsetTop, behavior: "smooth" });
    }
  }
  const handleMissed = () => {
    setMissCount(number => number - 1)
  }
  const handleHintClick = async() => {
    if(missCount > 0 && !isFound)return
    const data = await axios.get(process.env.NEXT_PUBLIC_HOST + "/perk/hint").then(res => res.data)
    setHint(data)
    setIsHintShown(!isHintShown)
  }

  const handleIridescentMode = (blur?:boolean,rotation?:boolean) => {
    if(blur != undefined){
      setIridescentMode({...iridescentMode,blur:blur})
      localStorage.setItem("iridescentMode",JSON.stringify({...iridescentMode,blur:blur}))
    }else if(rotation != undefined){
      setIridescentMode({...iridescentMode,rotation:rotation})
      localStorage.setItem("iridescentMode",JSON.stringify({...iridescentMode,rotation:rotation}))
    }
  }
  return (
    <div>
      <div className="grid w-full text-center">
        <ExportedImage  src={"/imgs/effects/ui_cloud_stretched.webp"} unoptimized alt="" width={500} height={500} className="select-none grid-column-1 w-full h-40   -z-10 " />
        <h1 className="text-4xl grid-column-1 content-center my-outline">Guess the random perk!</h1>
      </div>
      <div className="grid text-center -mt-20">
        <ExportedImage  src={"/imgs/effects/ui_cloud.webp"} fetchPriority="high" priority unoptimized alt="" width={500} height={500} className="select-none grid-column-1 w-full   -z-10 " />
        <div className="grid-column-1 mt-25">
          <label htmlFor="input" className="my-outline">Which perk has this icon?</label>
          <div className="p-5 w-[50%] mx-auto aspect-square justify-items-center items-center grid bg-no-repeat bg-contain bg-center" style={{backgroundImage:`url('${perkBg}')`}}>
            <ExportedImage draggable={false} src={process.env.NEXT_PUBLIC_HOST + "/perk_image"} alt="unknown perk" width={500} height={500} fetchPriority="high" priority unoptimized 
            className={`w-full select-none ${iridescentMode.rotationDeg == "" ? "hidden" : ""} ${iridescentMode.blur && "blur-xs"} ${iridescentMode.rotation && iridescentMode.rotationDeg}`} />
          </div>
          <div className={`fixed left-0 z-20 top-0 w-full ${isIridescentModeOpen ? "flex" : "hidden"} h-full items-center justify-center`}>
            <div className='bg-gray-700 relative flex flex-col gap-2 text-white w-[80%] md:w-[50%] border border-black rounded p-4'>
              <button onClick={()=>setIridescentModeOpen(!isIridescentModeOpen)} className='cursor-pointer select-none text-red-500 font-bold absolute text-4xl border-t border-r border-black -right-3 md:-right-8 -top-5 md:-top-10 rounded-full p-2 md:p-5 bg-gray-700'>X</button>
              <h2 className='text-4xl text-start'>🔴 Iridescent zone</h2>
              <div className='w-full h-1 bg-white'></div>
              <p className="text-start mb-2">Show your real skills with harder options. Disable it any time.</p>
              <h3 className="text-center text-3xl">Blur</h3>
              <label className="switch mx-auto mb-8" htmlFor="blur">
                <input ref={iridescentBlur} type="checkbox" id="blur" onInput={(value)=>handleIridescentMode(value.currentTarget.checked)} />
                <div className="slider round"></div>
              </label>
              <h3 className="text-center text-3xl">Random rotation</h3>
              <label className="switch mx-auto mb-14" htmlFor="rotation">
                <input ref={iridescentRotation} type="checkbox" id="rotation" onInput={(value)=>handleIridescentMode(undefined, value.currentTarget.checked)} />
                <div className="slider round"></div>
              </label>
            </div>
          </div>
          <button onClick={()=>setIridescentModeOpen(!isIridescentModeOpen)} className="bg-[rgb(0,0,0,0.7)] mb-2 text-center cursor-pointer rounded-lg p-1 border-2 border-red-700">
            <p>{iridescentMode.blur && iridescentMode.rotation ? "✔️" : "❌"}</p>
            <p>Iridescent mode</p>
          </button>
          {missCount < 6 || isFound ? 
          <div className='grid h-28 w-full my-outline'>
            <ExportedImage  src={"/imgs/effects/ui_cloud.webp"} unoptimized alt="" width={500} height={500} className="grid-column-1 w-full select-none  -z-10 -mt-20 md:-mt-64" />
            <div className={`grid-column-1 h-20 md:w-[40%] mx-auto ${missCount > 0 && !isFound ? "" : "cursor-pointer"}`} onClick={handleHintClick}>
              <ExportedImage  src={"/imgs/logos/random_perk.png"} className="w-15 mx-auto select-none" alt="hint icon" width={160} height={160} />
              <p>Perk Description Clue {missCount > 0 && !isFound ? `after ${missCount} tries` : ""}</p>
            </div>
          </div> : null}
          <div className="mx-auto">
            <SearchInput splashVisible={false} onFound={handleFound} onMissed={handleMissed} from="/perk" >
            {isHintShown ? <div className="grid -mb-8 bg-no-repeat bg-cover bg-center bg-size-100 p-10" style={{backgroundImage:`url('/imgs/effects/ui_cloud.webp')`}}>
              <p className="grid-column-1 text-sm my-outline">
                Perk description: {hint}
              </p>
            </div> : null}
            </SearchInput>
          </div>
        </div>
      </div>
      {isFound ? 
      <div className="text-center grid mt-10 cursor-pointer" ref={nextMode} onClick={()=>{router.push("/quote")}}>
        <ExportedImage  src={"/imgs/effects/ui_cloud.webp"} unoptimized alt="" width={500} height={500} className="select-none grid-column-1 w-full h-20   -z-10" />
        <h2 className="text-3xl grid-column-1 py-4 content-center">Next Mode: Quote</h2>
      </div> : null}
    </div>
  );
}
