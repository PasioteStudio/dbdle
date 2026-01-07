"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'

const HowTo = () => {
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
            Math.floor(time / (1000 * 60 * 60)).toString().padStart(2,"0") + "​:​" + 
            Math.floor((time / (1000 * 60 )) % 60).toString().padStart(2,"0") + "​:​" +
            Math.floor((time / 1000) % 60).toString().padStart(2,"0")
        );
    }
    return (
    <li onClick={()=>{setHowTo(!howTo)}} className="border-red-700 cursor-pointer absolute py-1 right-0 s:-mr-12 sm:-mr-30 border-2 rounded-lg flex items-center">
        <p className="text-3xl select-none">📄</p>
        {howTo ? 
        [<div key={1} className='fixed left-0 z-20 top-0 w-full flex h-full items-center justify-center'>
            <div className='bg-gray-700 relative flex flex-col gap-2 text-white w-[80%] md:w-[50%] border border-black rounded p-4'>
                <h2 className='select-none text-red-500 font-bold absolute text-4xl border-t border-r border-black -right-3 md:-right-8 -top-5 md:-top-10 rounded-full p-2 md:p-5 bg-gray-700'>X</h2>
                <h2 className='text-4xl'>How to play?</h2>
                <div className='w-full h-1 bg-white'></div>
                <p>Guess in four modes by aspects from Behavior&apos;s game &quot;Dead by Daylight&quot;. It changes every 24h.</p>
                <p className='text-sm'><i>These data are from the Dead by Daylight&quot; Wiki page.</i></p>
                <p className='text-center'>Next perk in</p>
                <h2 className='text-4xl md:text-6xl text-center break-words' key={time}>{calc()}</h2>
                <p className='text-center text-gray-400'><i>Time zone: Europe (Midnight at UTC+{process.env.NEXT_PUBLIC_TIMEZONE})</i></p>
                <h2 className='text-4xl'>{page.toUpperCase()[0] + page.slice(1)} mode</h2>
                <div className='w-full h-1 bg-white'></div>
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
                    page === "killer" && <div className='flex flex-col overflow-y-scroll h-80 gap-2'>
                        <p>In killer mode, try to guess which character is it in the least number of tries and it will reveal its properties...</p>
                        <p>The color of the tiles will change to show how close your guess was to the champion to find.</p>
                        <p><span className='text-green-700'>Green</span> indicates the property is an exact match.</p>
                        <p><span className='text-orange-500'>Orange</span> indicates partial match.</p> 
                        <p><span className='text-red-700'>Red</span> indicates there is no overlap between your guess and the property.</p>
                        <p>⬇️ ⬆️ With arrows, it also indicates if the answer property is above or below your guess.</p>
                        <h2 className='text-xl md:text-3xl'>Properties</h2>
                        <p>Here is the details of each of the properties columns:</p>
                        <div className='grid grid-cols-2 gap-2'>
                            <div>
                                <h3 className='text-xl md:text-2xl'><strong>Gender:</strong></h3>
                                <p>Possible values: Woman, Man, None, Not applicable</p>
                            </div>
                            <div>
                                <h3 className='text-xl md:text-2xl'><strong>Origin:</strong></h3>
                                <p>Possible values: any nationality (like Brazilian, American)</p>
                            </div>
                            <div>
                                <h3 className='text-xl md:text-2xl'><strong>Gender:</strong></h3>
                                <p>Possible values: Woman, Man, None, Not applicable</p>
                            </div>
                            <div>
                                <h3 className='text-xl md:text-2xl'><strong>Height:</strong></h3>
                                <p>Possible values: Tall, Avarage, Short</p>
                            </div>
                            <div>
                                <h3 className='text-xl md:text-2xl'><strong>Movement Speed:</strong></h3>
                                <p>Possible values: 4.6m/s, 4 m/s, 3.85m/s, 4.4m/s</p>
                            </div>
                            <div>
                                <h3 className='text-xl md:text-2xl'><strong>Power attack type:</strong></h3>
                                <p>Possible values: Special Attack, None or Basic Attack</p>
                            </div>
                            <div>
                                <h3 className='text-xl md:text-2xl'><strong>Release date:</strong></h3>
                                <p>Possible values: Any year between 2016 and today</p>
                            </div>
                        </div>
                    </div>
                }
                <p>GL. HF</p>
            </div>
        </div>,
        <div key={2} className='fixed left-0 z-10 top-0 w-full h-full blur-2xl bg-[#00000099]'></div>
        ] : null}
    </li>
    );
};
export default HowTo;