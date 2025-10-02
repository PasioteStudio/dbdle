"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";

function sameDay(d1:Date, d2:Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

const StreakIcon = () => {
    const [streak,setStreak] = useState<number>(0)
    const pathname = usePathname();
    //get the current path
    useEffect(()=>{
        if (typeof window == "undefined")return
        const from = "/" + window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]
        let newStreak = localStorage.getItem(from) ? JSON.parse(localStorage.getItem(from)!).streak : 0
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1);
        if(localStorage.getItem(from)){
            if(!sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),new Date()) && !sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),yesterday)){
                newStreak=0
            }
        }
        
        setStreak(newStreak)
    },[pathname])
    return (
    <li className="border-red-700 absolute grid py-1 left-0 s:-ml-12 sm:-ml-30 border-2 rounded-lg items-center">
        <p className="text-3xl grid-column-1 select-none">🔥</p>
        <p className="px-1 grid-column-1 text-center mt-auto font-bold my-outline select-none">{streak}</p>
    </li>
    );
};
export default StreakIcon;