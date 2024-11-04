import './bootstrap';
import {min} from "@popperjs/core/lib/utils/math.js";

const howto= document.getElementById("howto")
const howtobg= document.getElementById("howtobg")
const timer= document.getElementById("timer")
let items = [];
const AllperksEl = document.getElementById("Allperks");
const foundPerksEl = document.getElementById("foundPerks");
const inputEl = document.getElementById("guessInput")
const alreadyGuessedPerksEl = document.getElementById("alreadyGuessedPerks");
const description = document.getElementById("description")
const page = document.getElementById("page").content
let tries=0;//max:19
let page_id=-1
function isSameDay(date1,date2){
    if(date1.getFullYear() == date2.getFullYear() && date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth()){
        return true
    }
    return false
}
function addGuess(selected,result){
    let beforeChildren = alreadyGuessedPerksEl.innerHTML
    if(result === "NO"){
        alreadyGuessedPerksEl.innerHTML=`<button  class="foundPerk alreadyGuessed rounded">${selected}</button>`
        selected = selected.replace("&","&amp;")
        items.splice(items.indexOf(selected),1)
        tries+=1
    }else{
        alreadyGuessedPerksEl.innerHTML=`<button  class="foundPerk goodGuess rounded">${selected}</button>`
        let foundPerkName = document.createElement('h1');
        foundPerkName.innerHTML=selected
        inputEl.parentNode.replaceChild(foundPerkName, inputEl);
        description.innerText=result
        tries=93;
    }
    alreadyGuessedPerksEl.innerHTML+=beforeChildren
}
function updateTimer(){
    let now = new Date()
    let all = (24*60*60)-(now.getHours()*60*60 + now.getMinutes()*60 + now.getSeconds())
    let hours_left = Math.floor(all/60/60)
    all = all-(hours_left*60*60)
    let minutes_left = Math.floor(all/60)
    all = all-(minutes_left*60)
    let seconds_left = Math.floor(all)
    timer.innerText=`${hours_left.toString().padStart(2,"0")}:${minutes_left.toString().padStart(2,"0")}:${seconds_left.toString().padStart(2,"0")}`

}

document.addEventListener("DOMContentLoaded",()=>{
    //timer
    setInterval(()=>{
        updateTimer()
    },1000)


    if(AllperksEl==null){
        return
    }
    if(!isSameDay(new Date(localStorage.getItem("time")),new Date())){
        localStorage.setItem("time",new Date())
        localStorage.setItem("selecteds",JSON.stringify({"value":[]}))
    }
    if(items.length===0){
        for (let i=0; i<AllperksEl.children.length;i++){
            items.push(AllperksEl.children[i].innerHTML)
        }
    }
    let items2 = JSON.parse(localStorage.getItem("selecteds"))
    if(items2 == null){
        localStorage.setItem("selecteds",JSON.stringify({"value":[]}))
    }
    page_id=-1
    for(let i = 0;i<items2["value"].length;i++){
        if(items2["value"][i]["page"]===page){
            page_id=i;
            break
        }
    }
    if(page_id===-1){
        items2["value"].push( {"page":page,"value2":[]})
        page_id=items2["value"].length-1
        localStorage.setItem("selecteds",JSON.stringify(items2))
        return;
    }
    let theItem=items2["value"][page_id]
    for (let i = 0; i<theItem["value2"].length;i++){
        let selected=theItem["value2"][i]["name"]
        let result = theItem["value2"][i]["result"]
        addGuess(selected,result)
    }
    window.afterSelected(tries)
})

export function search(searchItem){

    foundPerksEl.innerHTML=""
    if(searchItem === ""){return}
    searchItem=searchItem.toUpperCase()

    let contains=[];
    for(let j =0; j<items.length;j++){
        //végig megy az összes perken
        if(items[j].toUpperCase().includes(searchItem)){
            contains.push(items[j])

        }

    }
    contains = [...new Set(contains)];
    for(let i=0; i<contains.length;i++){
        foundPerksEl.innerHTML+="<button onclick='isPerk(`"+contains[i] + "`)'  class='foundPerk '>"+contains[i]+"</button>"
    }
}
export function afterSelected(tries){

}
export async function isPerk(selected){
    await fetch(window.location+"/"+selected).then(response=>response.json()).then(result=>{
        addGuess(selected,result)
        let array= JSON.parse(localStorage.getItem("selecteds"))
        array["value"][page_id]["value2"].push({"result":result,"name":selected})

        localStorage.setItem("selecteds", JSON.stringify(array));
    })
    foundPerksEl.innerHTML=""
    inputEl.value=""


    window.afterSelected(tries)

}

export function showHowto(){
    console.log(howto.style.visibility.indexOf("hidden"))
    if(howto.classList.contains("visually-hidden")){
        howto.classList.remove("visually-hidden")
        howtobg.classList.remove("visually-hidden")
    }else{
        howto.classList.add("visually-hidden")
        howtobg.classList.add("visually-hidden")
    }

}
window.showHowto = showHowto;
window.search=search;
window.isPerk=isPerk;
window.afterSelected=afterSelected;
