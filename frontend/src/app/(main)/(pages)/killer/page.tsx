"use client"
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import KillerSearchInput from "@/component/input/killerSearch";

export default function Home() {
  const router = useRouter()
  const nextMode = useRef<HTMLDivElement | null>(null)
  const [isFound,setFound] = useState<boolean>(false)
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
    
  }
  return (
    <div className="w-[90%] md:w-[110%]">
      <div className="grid w-full text-center">
        <Image src={"/imgs/effects/ui_cloud.png"} alt="" width={500} height={500} className="grid-column-1 w-full h-40 overflow-visible -z-10 " />
        <h1 className="text-4xl grid-column-1 content-center">Guess today&apos;s Dead by Daylight killer!</h1>
      </div>
      <div className="text-center mt-5 pt-3 bg-gray-500 rounded-xl">
          <p className="mb-3">Type any killer to begin.</p>
          <div className="mx-auto">
            <KillerSearchInput onFound={handleFound} onMissed={handleMissed} from="/killer" >
            </KillerSearchInput>
          </div>
      </div>
      {isFound ? 
      <div className="text-center grid mt-10 cursor-pointer" ref={nextMode} onClick={()=>{router.push("/splash")}}>
        <Image src={"/imgs/effects/ui_cloud.png"} alt="" width={500} height={500} className="grid-column-1 w-full h-20 overflow-visible -z-10" />
        <h1 className="text-3xl grid-column-1 py-4 content-center">Next Mode: Splash</h1>
      </div> : null}
    </div>
  );
}
