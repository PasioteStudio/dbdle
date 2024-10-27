import './bootstrap';

let items = [];
const AllperksEl = document.getElementById("Allperks");
const foundPerksEl = document.getElementById("foundPerks");
const inputEl = document.getElementById("guessInput")
const alreadyGuessedPerksEl = document.getElementById("alreadyGuessedPerks");

export function search(searchItem){

    foundPerksEl.innerHTML=""
    if(searchItem === ""){return}
    searchItem=searchItem.toUpperCase()
    if(items.length===0){
        for (let i=0; i<AllperksEl.children.length;i++){
            items.push(AllperksEl.children[i].innerHTML)
        }
    }

    let contains=[];
    for(let j =0; j<items.length;j++){
        //végig megy az összes perken
        if(items[j].toUpperCase().includes(searchItem)){
            contains.push(items[j])

        }

    }

    contains = [...new Set(contains)];
    for(let i=0; i<contains.length;i++){
        //TODO: insert before all children
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
    })



}
window.search=search;
window.isCharacter=isCharacter;
