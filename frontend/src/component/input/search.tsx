"use client"
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ExportedImage from "next-image-export-optimizer";

declare global {
  interface Window {
    fullres?: { events: {key:string,mode:string}[] };
  }
}

interface SearchInput {
    from:string,
    onFound:()=>void,
    onMissed:()=>void,
    children?:React.ReactNode,
    splashVisible?:boolean
}
function sameDay(d1:Date, d2:Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
const SearchInput: React.FC<SearchInput> = ({from,onFound,onMissed,children,splashVisible=true}) => {
    const input = useRef<HTMLInputElement>(null)
    const [found,setFound] = useState<string>()
    const [options,setOptions] = useState<string[]>([])
    const [search,setSearch] = useState<string>("-")
    const [usedOptions,setUsedOptions] = useState<{name:string;found:boolean}[]>([])
    useEffect(()=>{
        setTimeout(()=>{
            localStorage.removeItem("splashFirst")
        },50)
        if(localStorage.getItem("splashFirst") && from == "/splash")return
        localStorage.setItem("splashFirst","a")
        setTimeout(()=>{
            localStorage.removeItem("splashFirst")
        },50)
        if(!localStorage.getItem(from) || !sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),new Date())){
            axios.get(process.env.NEXT_PUBLIC_HOST + from).then(res=>{
                setOptions(res.data)
            })
            return
        }
        setUsedOptions(JSON.parse(localStorage.getItem(from)!).used)
        setOptions(JSON.parse(localStorage.getItem(from)!).options.filter((option:string) => !JSON.parse(localStorage.getItem(from)!).used.map((used:{name:string})=>used.name).includes(option)))

        for(let i = 0; i<JSON.parse(localStorage.getItem(from)!).used.length; i++){
            if(JSON.parse(localStorage.getItem(from)!).used[i].found){
                axios.get(process.env.NEXT_PUBLIC_HOST + from + "/" + JSON.parse(localStorage.getItem(from)!).used[i].name.replaceAll(" ","_").replace("Élodie","Elodie").replaceAll("ryō","ryo").replaceAll("Déjà vu","Deja Vu").replaceAll("Coup de Grâce","Coup de Grace")).then(res=>{
                    if(res.status != 202){
                        localStorage.removeItem(from)
                        setUsedOptions([])
                        axios.get(process.env.NEXT_PUBLIC_HOST + from).then(res=>{
                            setOptions(res.data)
                        })
                    }else{
                        //FOUND
                        setFound(JSON.parse(localStorage.getItem(from)!).used[i].name)
                        onFound()
                        input.current?.classList.add("hidden")
                    }
                })
                
            }else{
                onMissed()
            }
        }
    },[from])
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value.toLowerCase() == "" ? "-" : e.currentTarget.value.toLowerCase())
    }
    const handleClick = (selected:string) => {
        setSearch("-")
        input.current!.value = ""
        input.current!.focus()
        setOptions(options.filter(option => option != selected))
        window.fullres ||= {events: []};
        window.fullres.events.push({ key: 'guess', mode: from.slice(1) });
        axios.get(process.env.NEXT_PUBLIC_HOST + from + "/" + selected.replaceAll(" ","_").replace("Élodie","Elodie").replaceAll("ryō","ryo").replaceAll("Déjà vu","Deja Vu").replaceAll("Coup de Grâce","Coup de Grace")).then(res=>{
            usedOptions.push({name:selected,found:res.status == 202})
            let streak = localStorage.getItem(from) ? JSON.parse(localStorage.getItem(from)!).streak : 0
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1);
            if(localStorage.getItem(from)){
                if(!sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),new Date()) && !sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),yesterday)){
                    streak=0
                }
            }
            
            if(res.status == 202){
                streak++
            }
            localStorage.setItem(from,JSON.stringify({date:new Date(),streak:streak,used:usedOptions,options:options}))
            setUsedOptions(JSON.parse(JSON.stringify(usedOptions)))
            if(res.status == 202){
                //FOUND
                input.current?.classList.add("hidden")
                setFound(selected)
                onFound()

            }else{
                onMissed()
            }
        })
    }
    return (
    <div className='relative'>
        <h1 className={`w-[70%] mx-auto text-4xl ${found ? "" : "hidden"}`}>{found}</h1>
        <input id='input' autoComplete='off' type="text" ref={input} onInput={handleInput} className='min-w-[200px] s:w-[60%] sm:w-[50%] md:w-[40%] bg-gray-700 h-8 rounded-lg px-2' />
        {children}
        <ul className='rounded-lg bg-black min-w-[200px] s:w-[60%] sm:w-[50%] md:w-[40%] absolute justify-self-anchor flex flex-col gap-0.5 mt-4 overflow-x-hidden overflow-y-scroll max-h-64'>
            {options.map((option,id) => (
                <li key={id} className={`${option.toLowerCase().startsWith(search) ? "flex" : "hidden"} bg-gray-600 min-h-12 max-h-12 ${splashVisible ? "" : "justify-center"} items-center content-center hover:bg-blue-500 cursor-pointer`} onClick={()=>{handleClick(option)}}>
                    {splashVisible && <ExportedImage src={"/imgs/splashes/" + option.replace('William "Bill" Overbeck',"William Bill Overbeck") + ".png"} className='select-none aspect-square h-full p-2' alt={option} width={64} height={64} />}
                    <h2 className='h-full content-center'>{option}</h2>
                </li>
            ))}
        </ul>
        <ul className='min-w-[200px] s:w-[60%] sm:w-[50%] md:w-[40%] mx-auto flex flex-col gap-2 mt-4 overflow-x-hidden'>
            {usedOptions.toReversed().map(option => (
                <li className={`h-12 hover:bg-blue-500 cursor-pointer rounded-lg ${option.found ? "bg-green-700" : "bg-red-700"}`} key={option.name} >
                    <h2 className='h-full content-center'>{option.name}</h2>
                </li>
            ))}
        </ul>
    </div>
    );
};
export default SearchInput;