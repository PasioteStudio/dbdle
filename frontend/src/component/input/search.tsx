"use client"
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface SearchInput {
    from:string,
    onFound:Function,
    onMissed:Function,
    children?:React.ReactNode,
}
function sameDay(d1:Date, d2:Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
const SearchInput: React.FC<SearchInput> = ({from,onFound,onMissed,children}) => {
    const input = useRef<HTMLInputElement>(null)
    const [found,setFound] = useState<string>()
    const [options,setOptions] = useState<string[]>([])
    const [visibleOptions,setVisibleOptions] = useState<string[]>([])
    const [usedOptions,setUsedOptions] = useState<{name:string;found:boolean}[]>([])
    useEffect(()=>{
        if(!localStorage.getItem(from) || !sameDay(new Date(JSON.parse(localStorage.getItem(from)!).date),new Date())){
            axios.get(process.env.NEXT_PUBLIC_HOST + from).then(res=>{
                setOptions(res.data)
            })
            return
        }
        setUsedOptions(JSON.parse(localStorage.getItem(from)!).used)
        setOptions(JSON.parse(localStorage.getItem(from)!).options.filter((option:any) => !JSON.parse(localStorage.getItem(from)!).used.map((used:any)=>used.name).includes(option)))
        for(let i = 0; i<JSON.parse(localStorage.getItem(from)!).used.length; i++){
            if(JSON.parse(localStorage.getItem(from)!).used[i].found){
                axios.get(process.env.NEXT_PUBLIC_HOST + from + "/" + JSON.parse(localStorage.getItem(from)!).used[i].name).then(res=>{
                    if(res.status != 202){
                        localStorage.removeItem(from)
                        setUsedOptions([])
                        axios.get(process.env.NEXT_PUBLIC_HOST + from).then(res=>{
                            setOptions(res.data)
                        })
                    }else{
                        setFound(JSON.parse(localStorage.getItem(from)!).used[i].name)
                        onFound()
                        input.current?.classList.add("hidden")
                    }
                })
                
            }else{
                onMissed()
            }
        }
        
    },[])
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        if(e.currentTarget.value == ""){
            setVisibleOptions([])
            return
        }
        let newVisibleOptionsFirst = []
        let newVisibleOptions = []
        for(let i = 0; i < options.length;i++){
            if(options[i].toLowerCase().includes(e.currentTarget.value) && options[i].toLowerCase().startsWith(e.currentTarget.value)){
                newVisibleOptionsFirst.push(options[i])
                
            }else if(options[i].toLowerCase().includes(e.currentTarget.value)){
                newVisibleOptions.push(options[i])
            }
        }
        setVisibleOptions([...newVisibleOptionsFirst,...newVisibleOptions])
    }
    const handleClick = (selected:string) => {
        setVisibleOptions([])
        input.current!.value = ""
        setOptions(options.filter(option => option != selected))
        axios.get(process.env.NEXT_PUBLIC_HOST + from + "/" + selected).then(res=>{
            usedOptions.push({name:selected,found:res.status == 202})
            localStorage.setItem(from,JSON.stringify({date:new Date(),streak:0,hint:"",used:usedOptions,options:options}))
            setUsedOptions(JSON.parse(JSON.stringify(usedOptions)))
            if(res.status == 202){
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
        <input type="text" ref={input} onInput={handleInput} className='w-[40%] bg-gray-700 h-8 rounded-lg px-2' />
        {children}
        <ul className='rounded-lg bg-gray-600 w-[40%] absolute justify-self-anchor flex flex-col mt-4 overflow-x-hidden overflow-y-scroll max-h-64'>
            {visibleOptions.map((option,id) => [
                <li className='min-h-12 max-h-12 content-center hover:bg-blue-500 cursor-pointer' key={`${id}a`} onClick={()=>{handleClick(option)}}>
                    <h2 className='h-full content-center'>{option}</h2>
                </li>,
                id != visibleOptions.length -1 ? <div className={`bg-black w-full h-0.5`} key={`${id}b`}></div> : null
            ])}
        </ul>
        <ul className='bg-black w-[40%] mx-auto flex flex-col gap-2 mt-4 overflow-x-hidden'>
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