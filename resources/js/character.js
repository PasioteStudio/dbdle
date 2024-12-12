import './bootstrap';

let items = [];
const AllperksEl = document.getElementById("Allperks");
const foundPerksEl = document.getElementById("foundPerks");
const inputEl = document.getElementById("guessInput")
const alreadyGuessedPerksEl = document.getElementById("alreadyGuessedPerks");
const page = document.getElementById("page").content
let page_id=-1
function isSameDay(date1,date2){
    return date1.getFullYear() === date2.getFullYear() && date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();

}
function addGuess(selected,result){
    let beforeChildren = alreadyGuessedPerksEl.innerHTML
    let building=`<div  class="foundPerk bg-black rounded d-flex gap-4 " >`
    let classes=""

    building+=getElement("bg-black",selected)

    if(result['gender']==="YES"){
        classes="bg-green"
    }else if(result['gender']==="MAYBE"){
        classes="bg-yellow"
    }
    else{
        classes="alreadyGuessed"
    }
    building+=getElement(classes,result["selected_killer"]["gender"])
    if(result['origin']==="YES"){
        classes="bg-green"
    }else if(result['origin']==="MAYBE"){
        classes="bg-yellow"
    }
    else{
        classes="alreadyGuessed"
    }
    building+=getElement(classes,result["selected_killer"]["origin"])
    if(result['height']==="YES"){
        classes="bg-green"

    }else{
        classes="alreadyGuessed"
    }
    building+=getElement(classes,result["selected_killer"]["height"])
    if(result['movement_speed']==="YES"){
        classes="bg-green"
    }else{
        classes="alreadyGuessed"
    }
    building+=getElement(classes,result["selected_killer"]["movement_speed"])
    if(result['power_attack_type']==="YES"){
        classes="bg-green"
    }else{
        classes="alreadyGuessed"
    }
    building+=getElement(classes,result["selected_killer"]["power_attack_type"])
    let year = ""
    if(result['year']==="YES"){
        classes="bg-green"
    }else if(result['year']==="HIGHER"){
        classes="alreadyGuessed"
        year=" ⬆️"
    }else if(result['year']==="LOWER"){
        classes="alreadyGuessed"
        year=" ⬇️"
    }else{
        classes="alreadyGuessed"
    }
    building+=getElement(classes,result["selected_killer"]["year"] + year)
    building+=`</div>`
    alreadyGuessedPerksEl.innerHTML=building
    if(result['name']==="NO"){
        items.splice(items.indexOf(selected),1)
    }else{
        let foundPerkName = document.createElement('h1');
        foundPerkName.innerHTML=selected
        inputEl.parentNode.replaceChild(foundPerkName, inputEl);
    }

    alreadyGuessedPerksEl.innerHTML+=beforeChildren
}
document.addEventListener("DOMContentLoaded",()=>{
    if(!isSameDay(new Date(localStorage.getItem("time")),new Date())){
        localStorage.clear()
        localStorage.setItem("time",new Date().toString())
        localStorage.setItem("killer",JSON.stringify({"value":[]}))
    }
    if(items.length===0){
        for (let i=0; i<AllperksEl.children.length;i++){
            items.push(AllperksEl.children[i].innerHTML)
        }
    }
    if(localStorage.getItem("killer")==null){
        localStorage.setItem("killer",JSON.stringify({"value":[]}))
    }
    let items2 = JSON.parse(localStorage.getItem("killer"))

    for (let i = 0; i<items2["value"].length;i++){
        let selected=items2["value"][i]["name"]
        let result = items2["value"][i]["result"]
        addGuess(selected,result)
    }
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
        foundPerksEl.innerHTML+="<button onclick='isCharacter(`"+contains[i] + "`)'  class='foundPerk '>"+contains[i]+"</button>"
    }
}
function getElement(classes, name){
    return `<div  class="foundPerk ${classes} rounded h-100 flex-basis">${name}</div>`
}
export async function isCharacter(selected){
    inputEl.value=""
    foundPerksEl.innerHTML=""
    await fetch(window.location+"/"+selected).then(response=>response.json()).then(result=>{
        if(typeof(result) != "object"){
            //error
            return
        }
        addGuess(selected,result)

        let array= JSON.parse(localStorage.getItem("killer"))
        array["value"].push({"result":result,"name":selected})

        localStorage.setItem("killer", JSON.stringify(array));
    })



}
window.search=search;
window.isCharacter=isCharacter;
