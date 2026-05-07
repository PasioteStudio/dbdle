"use client"
import ExportedImage from "next-image-export-optimizer";
import SearchInput from "@/component/input/search";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { splash } from "@/util/constants";

export default function Home() {
  const [missCount, setMissCount] = useState<number>(0);
  const [missCountT, setMissCountT] = useState<number>(0);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const router = useRouter();
  const nextMode = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [defaultValues, setDefaultValues] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFound, setFound] = useState<boolean>(false);
  const [isHintShown, setIsHintShown] = useState<boolean>(false);

  const splashImageUrl = `${process.env.NEXT_PUBLIC_HOST}/splash_image_src`;

  const drawSplashCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = -1;
    canvas.height = -1;
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.max(1, Math.floor(rect.width));
    const displayHeight = Math.max(1, Math.floor(rect.height));

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const minPixel = splash.minPixel;
    const visibleSize = Math.min(splash.baseSize, minPixel + missCount * splash.step);
    const sourceScale = img.naturalWidth / splash.baseSize;
    const sourceSize = visibleSize * sourceScale;
    const sourceCenterX = (defaultValues.x + minPixel / 2) * sourceScale;
    const sourceCenterY = (defaultValues.y + minPixel / 2) * sourceScale;

    let sourceX = sourceCenterX - sourceSize / 2;
    let sourceY = sourceCenterY - sourceSize / 2;
    sourceX = Math.max(0, Math.min(img.naturalWidth - sourceSize, sourceX));
    sourceY = Math.max(0, Math.min(img.naturalHeight - sourceSize, sourceY));

    ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, displayWidth, displayHeight);
  }, [defaultValues, missCount]);

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_HOST + "/splash/image").then((res) => {
      setDefaultValues(res.data);
    });
  }, []);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = splashImageUrl;
    image.onload = () => {
      imageRef.current = image;
      setImageLoaded(true);
    };
  }, [splashImageUrl]);

  useEffect(() => {
    if (imageLoaded && imageRef.current) {
      drawSplashCanvas(imageRef.current);
    }
  }, [imageLoaded, drawSplashCanvas]);

  useEffect(() => {
    if (!imageLoaded || !imageRef.current) return;

    const handleResize = () => {
      drawSplashCanvas(imageRef.current!);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [imageLoaded, drawSplashCanvas]);
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
        <ExportedImage  src={"/imgs/effects/ui_cloud.webp"} loading="eager" unoptimized alt="" width={500} height={500} className="select-none grid-column-1 w-full   -z-10 s:mt-15 sm:mt-10 md:mt-0" />
        <div className="grid-column-1 mt-25">
          <label htmlFor="input" className="my-outline">Which character has the whole splash art?</label>
            <div className="w-[50%] mx-auto flex items-center justify-center aspect-square overflow-hidden mb-4">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                draggable={false}
                title="unknown splash art"
              />
            </div>
          <div>
            <div className="bg-[rgba(240,177,0,0.7)] cloud aspect-square w-[10%] mx-auto cursor-pointer" onClick={handleHintClick}>
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
        <ExportedImage  src={"/imgs/effects/ui_cloud.webp"} loading="eager" unoptimized alt="" width={500} height={500} className="select-none grid-column-1 w-full h-20   -z-10" />
        <h2 className="text-3xl grid-column-1 py-4 content-center">Next Mode: Perk</h2>
      </div> : null}
    </div>
  );
}