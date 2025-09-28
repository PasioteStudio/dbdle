"use client"
import ExportedImage from "next-image-export-optimizer";
import SearchInput from "@/component/input/search";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [missCount,setMissCount] = useState<number>(0)
  const router = useRouter()
  const nextMode = useRef<HTMLDivElement | null>(null)
  const [isFound,setFound] = useState<boolean>(false)
  const [isHintShown,setIsHintShown] = useState<boolean>(false)
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
    setMissCount(number => number + 1)
  }
  const handleHintClick = async() => {
    if(missCount <= 0)return
    setIsHintShown(!isHintShown)
  }
  return (
    <div>
      <div className="grid w-full text-center">
        <ExportedImage  src={"/imgs/effects/ui_cloud_stretched.webp"} unoptimized alt="" width={500} height={500} className="grid-column-1 w-full h-40   -z-10 " />
        <h1 className="text-4xl grid-column-1 content-center my-outline">Guess the random character by a splash art!</h1>
      </div>
      <div className="grid text-center -mt-20">
        <ExportedImage  src={"/imgs/effects/ui_cloud.webp"} unoptimized alt="" width={500} height={500} className="grid-column-1 w-full   -z-10 s:mt-15 sm:mt-10 md:mt-0" />
        <div className="grid-column-1 mt-25">
          <label htmlFor="input" className="my-outline">Which character has the whole splash art?</label>
            <div className="p-5 w-[50%] mx-auto">
            <ExportedImage 
              key={`${missCount}-${isHintShown}`} // force re-render on change
              src={process.env.NEXT_PUBLIC_HOST + "/splash/image_src/" + (isHintShown ? 0 : (isFound ? 51 : missCount))}
              className="w-full"
              alt="unknown splash art"
              width={500}
              height={500}
              fetchPriority="high" priority
              unoptimized // disables next/image caching
            />
            </div>
          <div>
            <div className="bg-yellow-500 rounded-full aspect-square w-[10%] mx-auto cursor-pointer" onClick={handleHintClick}>
              <ExportedImage  src={"/imgs/logos/zoom.webp"} width={128} height={128} alt="hint" />
            </div>
            <p className="my-outline">Each try zooms out a bit.</p>
          </div>
          <div className="mx-auto">
            <SearchInput onFound={handleFound} onMissed={handleMissed} from="/splash" >
            </SearchInput>
          </div>
        </div>
      </div>
      {isFound ? 
      <div className="text-center grid mt-10 cursor-pointer" ref={nextMode} onClick={()=>{router.push("/perk")}}>
        <ExportedImage  src={"/imgs/effects/ui_cloud.webp"} unoptimized alt="" width={500} height={500} className="grid-column-1 w-full h-20   -z-10" />
        <h1 className="text-3xl grid-column-1 py-4 content-center">Next Mode: Perk</h1>
      </div> : null}
    </div>
  );
}