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
export async function isCharacter(selected){
    inputEl.value=""
    foundPerksEl.innerHTML=""
    await fetch(window.location+"/"+selected).then(response=>response.json()).then(result=>{
        let beforeChildren = alreadyGuessedPerksEl.innerHTML
        let building=`<div  class="foundPerk bg-black rounded d-flex gap-4 " >`

        building+=`<div  class="foundPerk foundPerk bg-black rounded flex-basis">${selected}</div>`
        if(result['gender']==="YES"){
            building+=`<div  class="foundPerk foundPerk bg-green rounded flex-basis">${result["selected_killer"]["gender"]}</div>`
        }else if(result['gender']==="MAYBE"){
            building+=`<div  class="foundPerk foundPerk bg-yellow rounded flex-basis">${result["selected_killer"]["gender"]}</div>`
        }
        else{
            building+=`<div  class="foundPerk alreadyGuessed rounded flex-basis">${result["selected_killer"]["gender"]}</div>`
        }if(result['origin']==="YES"){
            building+=`<div  class="foundPerk foundPerk rounded  bg-green flex-basis">${result["selected_killer"]["origin"]}</div>`
        }else if(result['origin']==="MAYBE"){
            building+=`<div  class="foundPerk foundPerk rounded  bg-yellow flex-basis">${result["selected_killer"]["origin"]}</div>`
        }
        else{
            building+=`<div  class="foundPerk alreadyGuessed rounded flex-basis">${result["selected_killer"]["origin"]}</div>`
        }if(result['height']==="YES"){
            building+=`<div  class="foundPerk foundPerk rounded bg-green flex-basis">${result["selected_killer"]["height"]}</div>`
        }else{
            building+=`<div  class="foundPerk alreadyGuessed rounded flex-basis">${result["selected_killer"]["height"]}</div>`
        }if(result['movement_speed']==="YES"){
            building+=`<div  class="foundPerk foundPerk rounded bg-green flex-basis">${result["selected_killer"]["movement_speed"]}</div>`
        }else{
            building+=`<div  class="foundPerk alreadyGuessed rounded flex-basis">${result["selected_killer"]["movement_speed"]}</div>`
        }if(result['power_attack_type']==="YES"){
            building+=`<div  class="foundPerk foundPerk rounded bg-green flex-basis">${result["selected_killer"]["power_attack_type"]}</div>`
        }else{
            building+=`<div  class="foundPerk alreadyGuessed rounded flex-basis">${result["selected_killer"]["power_attack_type"]}</div>`
        }if(result['year']==="YES"){
            building+=`<div  class="foundPerk foundPerk rounded bg-green flex-basis">${result["selected_killer"]["year"]}</div>`
        }else if(result['year']==="HIGHER"){
            building+=`<div  class="foundPerk alreadyGuessed rounded flex-basis">${result["selected_killer"]["year"]} ⬆️</div>`
        }else if(result['year']==="LOWER"){
            building+=`<div  class="foundPerk alreadyGuessed rounded flex-basis">${result["selected_killer"]["year"]} ⬇️</div>`
        }else{
            building+=`<div  class="foundPerk alreadyGuessed rounded flex-basis ">${result["selected_killer"]["year"]}</div>`
        }
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
