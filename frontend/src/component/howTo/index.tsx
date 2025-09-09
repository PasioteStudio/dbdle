"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'

interface howTo {

}

const HowTo: React.FC<howTo> = ({}) => {
    const [howTo,setHowTo] = useState(false)
    const [time,setTime] = useState<number>(0)
    const [page,setPage] = useState<string>("")
    const pathname = usePathname()
    useEffect(() => {
        // Set the base time to UTC+1 (or whatever NEXT_PUBLIC_TIMEZONE is)
        const timezoneOffset = Number(process.env.NEXT_PUBLIC_TIMEZONE) || 0;
        // Create a new date in UTC+timezoneOffset
        const utcNow = new Date()
        utcNow.setHours(utcNow.getUTCHours() +timezoneOffset)
        const tomorrow = new Date(utcNow);
        tomorrow.setDate(new Date(utcNow).getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        setTime(tomorrow.getTime() - new Date(utcNow).getTime());

        const interval = setInterval(() => {
            setTime(prevTime => prevTime - 1000);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    useEffect(()=>{
        setPage(pathname.split("/")[pathname.split("/").length - 1])
    },[pathname])
    const calc = (): string => {
        return (
            Math.floor(time / (1000 * 60 * 60)).toString().padStart(2,"0") + ":" + 
            Math.floor((time / (1000 * 60 )) % 60).toString().padStart(2,"0") + ":" +
            Math.floor((time / 1000) % 60).toString().padStart(2,"0")
        );
    }
    return (
    <li onClick={()=>{setHowTo(!howTo)}} className="border-yellow-400 cursor-pointer absolute py-1 right-0 -mr-30 border-2 rounded-lg flex items-center">
        <p className="text-3xl">📄</p>
        {howTo ? 
        [<div key={1} className='fixed left-0 z-20 top-0 w-full flex h-full items-center justify-center'>
            <div className='bg-gray-700 flex flex-col gap-2 text-white w-[50%] border border-black rounded p-4'>
                <h1 className='text-4xl'>How to play?</h1>
                <div className='w-full h-2 bg-white'></div>
                <p>Guess the random perk by icon from Behavior's game "Dead by Daylight". It changes every 24h.</p>
                <p className='text-center'>Next perk in</p>
                <h1 className='text-6xl text-center' key={time}>{calc()}</h1>
                <p className='text-center text-gray-400'><i>Time zone: Europe (Midnight at UTC+{process.env.NEXT_PUBLIC_TIMEZONE})</i></p>
                <h1 className='text-4xl'>{page.toUpperCase()[0] + page.slice(1)} mode</h1>
                <div className='w-full h-2 bg-white'></div>
                {
                    page === "perk" && (
                        <p>In perk mode, try to guess which perk has the image in the least number of tries. <br /> You can see its description once you found it!</p>
                    )
                }
                {
                    page === "splash" && (
                        <p>In splash mode, try to guess which character has the whole splash art as a skin image in the least number of tries. It can be cut from the original one. <br /> You can see it full once you guessed it correctly!</p>
                    )
                }
                {
                    page === "quote" && (
                        <p>In quote mode, try to guess which character says that quote in the least number of tries. The quote is always in a perk description!</p>
                    )
                }
                {
                    page === "killer" && <div>

                    </div>
                }
                <p>GL. HF</p>
            </div>
        </div>,
        <div key={2} className='fixed left-0 z-10 top-0 w-full h-full blur-2xl bg-[#00000033]'></div>
        ] : null}
    </li>
    );
};
export default HowTo;