"use client"
import React, { useEffect, useState } from 'react';

const StreakIcon = () => {
    const [streak,setStreak] = useState<number>(0)
    //get the current path
    useEffect(()=>{
        const from = "/" + window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]
        setStreak(localStorage.getItem(from) ? JSON.parse(localStorage.getItem(from)!).streak : 0)
    },[window.location.pathname])
    return (
    <li className="border-red-700 absolute grid py-1 left-0 s:-ml-12 sm:-ml-30 border-2 rounded-lg items-center">
        <p className="text-3xl grid-column-1">🔥</p>
        <p className="px-1 grid-column-1 text-center mt-auto font-bold my-outline">{streak}</p>
    </li>
    );
};
export default StreakIcon;