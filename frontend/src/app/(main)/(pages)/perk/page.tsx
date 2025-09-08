"use client"
import Image from "next/image";
import { perkBg } from "@/util/constants";
import SearchInput from "@/component/input/search";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [missCount,setMissCount] = useState<number>(6)
  const router = useRouter()
  const nextMode = useRef<HTMLDivElement | null>(null)
  const [hint,setHint] = useState<string>()
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
    setMissCount(number => number - 1)
  }
  const handleHintClick = async() => {
    if(missCount > 0 && !isFound)return
    const data = await axios.get(process.env.NEXT_PUBLIC_HOST + "/perk/hint").then(res => res.data)
    setHint(data)
    setIsHintShown(!isHintShown)
  }
  return (
    <div>
      <div className="grid w-full text-center">
        <Image src={"/imgs/effects/ui_cloud.png"} alt="" width={500} height={500} className="grid-column-1 w-full h-40 overflow-visible -z-10 " />
        <h1 className="text-4xl grid-column-1 content-center">Guess the random perk!</h1>
      </div>
      <div className="grid text-center -mt-20">
        <Image src={"/imgs/effects/ui_cloud.png"} alt="" width={500} height={500} className="grid-column-1 w-full overflow-visible -z-10 " />
        <div className="grid-column-1 mt-25">
          <p>Which perk has this icon?</p>
          <div className="p-5 w-[50%] mx-auto aspect-square justify-items-center items-center grid bg-no-repeat bg-contain bg-center" style={{backgroundImage:`url('${perkBg}')`}}>
            <Image src={process.env.NEXT_PUBLIC_HOST + "/perk/image"} className="w-full" alt="unknown perk" width={500} height={500} />
          </div>
          {missCount < 6 || isFound ? 
          <div className='grid h-28 w-full'>
            <Image src={"/imgs/effects/ui_cloud.png"} alt="" width={500} height={500} className="grid-column-1 w-full overflow-visible -z-10 -mt-64" />
            <div className={`grid-column-1 h-20 w-[40%] mx-auto ${missCount > 0 && !isFound ? "" : "cursor-pointer"}`} onClick={handleHintClick}>
              <Image src={"/imgs/logos/random_perk.png"} className="w-15 mx-auto" alt="hint icon" width={160} height={160} />
              <p>Perk Description Clue {missCount > 0 && !isFound ? `after ${missCount} tries` : ""}</p>
            </div>
          </div> : null}
          <div className="mx-auto">
            <SearchInput onFound={handleFound} onMissed={handleMissed} from="/perk" >
            {isHintShown ? <div className="grid -mb-8 bg-no-repeat bg-cover bg-center bg-size-100 p-10" style={{backgroundImage:`url('/imgs/effects/ui_cloud.png')`}}>
              <p className="grid-column-1 text-sm">
                Perk description: {hint}
              </p>
            </div> : null}
            </SearchInput>
          </div>
        </div>
      </div>
      {isFound ? 
      <div className="text-center grid mt-10 cursor-pointer" ref={nextMode} onClick={()=>{router.push("/quote")}}>
        <Image src={"/imgs/effects/ui_cloud.png"} alt="" width={500} height={500} className="grid-column-1 w-full h-20 overflow-visible -z-10" />
        <h1 className="text-3xl grid-column-1 py-4 content-center">Next Mode: Quote</h1>
      </div> : null}
    </div>
  );
}
