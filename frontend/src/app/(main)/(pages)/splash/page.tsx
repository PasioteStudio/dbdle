"use client"
import ExportedImage from "next-image-export-optimizer";
import SearchInput from "@/component/input/search";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { splash } from "@/util/constants";

export default function Home() {
  const [missCount,setMissCount] = useState<number>(0)
  const [missCountT,setMissCountT] = useState<number>(0)
  const router = useRouter()
  const nextMode = useRef<HTMLDivElement | null>(null)
  const [defaultValues,setDefaultValues] = useState<{x:number,y:number}>({x:0,y:0})
  const [isFound,setFound] = useState<boolean>(false)
  const [isHintShown,setIsHintShown] = useState<boolean>(false)
  useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_HOST + "/splash/image").then(res=>{
      setDefaultValues(res.data)
    })
  },[])
  const handleFound = () => {
    setFound(true)
    setMissCount(splash.number_of_tries)
    setMissCountT(0)
    setIsHintShown(false)
    if(!nextMode.current){
      setTimeout(()=>{
        window.scrollTo({ top: nextMode.current!.offsetTop, behavior: "smooth" });
      },500)
    }else{
      window.scrollTo({ top: nextMode.current!.offsetTop, behavior: "smooth" });
    }
  }
  const handleMissed = () => {
    setIsHintShown(false)
    if(isHintShown){
      setMissCount(missCountT)
      setMissCountT(0)
    }
    setMissCount(number => {
      if(number + 1 > splash.number_of_tries){
        number = splash.number_of_tries - 1
      }
      return number + 1
    })
  }
  const handleHintClick = async() => {
    if(missCount <= 0 && missCountT <= 0)return
    setIsHintShown(!isHintShown)
    if(!isHintShown){
      setMissCountT(missCount)
      setMissCount(0)
    }else{
      setMissCountT(0)
      setMissCount(missCountT)
    }
    
  }
  return (
    <div>
      <div className="grid w-full text-center">
        <ExportedImage  src={"/imgs/effects/ui_cloud_stretched.webp"} unoptimized alt="" width={500} height={500} className="select-none grid-column-1 w-full h-40   -z-10 " />
        <h1 className="text-4xl grid-column-1 content-center my-outline">Guess the random character by a splash art!</h1>
      </div>
      <div className="grid text-center -mt-20">
        <ExportedImage  src={"/imgs/effects/ui_cloud.webp"} unoptimized alt="" width={500} height={500} className="select-none grid-column-1 w-full   -z-10 s:mt-15 sm:mt-10 md:mt-0" />
        <div className="grid-column-1 mt-25">
          <label htmlFor="input" className="my-outline">Which character has the whole splash art?</label>
            <div className="p-5 w-[50%] mx-auto flex items-center justify-center aspect-square overflow-hidden mb-4">
            <ExportedImage 
              src={process.env.NEXT_PUBLIC_HOST + "/splash_image_src"}
              className={`w-full select-none relative ${missCount > 0 ? "transition-all duration-200 ease-linear": ""}`} //left: -950% - 950% top:-950% - 950% minWidth: 2000% - 100%
              style={{
                minWidth: `${(splash.width + 100) - Math.min(missCount * (splash.width / splash.number_of_tries), splash.width)}%`,
                left: `${((-950 + (defaultValues.x * 1900 / 512)) * (1 - ((Math.min(missCount * (splash.width / splash.number_of_tries), splash.width)) / splash.width))) * -1}%`,
                top: `${((-950 + (defaultValues.y * 1900 / 512)) * (1 - ((Math.min(missCount * (splash.width / splash.number_of_tries), splash.width)) / splash.width))) * -1}%`,
              }}
              alt="unknown splash art"
              width={500}
              draggable={false}
              height={500}
              fetchPriority="high" priority
              unoptimized // disables next/image caching
            />
            </div>
          <div>
            <div className="bg-yellow-500 rounded-full aspect-square w-[10%] mx-auto cursor-pointer" onClick={handleHintClick}>
              <ExportedImage  src={"/imgs/logos/zoom.webp"} width={128} height={128} alt="hint" className="select-none" />
            </div>
            <p className="my-outline">Each try zooms out a bit.</p>
          </div>
          <div className="mx-auto">
            <SearchInput splashVisible={false} onFound={handleFound} onMissed={handleMissed} from="/splash" >
            </SearchInput>
          </div>
        </div>
      </div>
      {isFound ? 
      <div className="text-center grid mt-10 cursor-pointer" ref={nextMode} onClick={()=>{router.push("/perk")}}>
        <ExportedImage  src={"/imgs/effects/ui_cloud.webp"} unoptimized alt="" width={500} height={500} className="select-none grid-column-1 w-full h-20   -z-10" />
        <h1 className="text-3xl grid-column-1 py-4 content-center">Next Mode: Perk</h1>
      </div> : null}
    </div>
  );
}