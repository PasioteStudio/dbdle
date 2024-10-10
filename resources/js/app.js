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
        foundPerksEl.innerHTML+="<button onclick='isPerk(`"+contains[i] + "`)'  class='foundPerk '>"+contains[i]+"</button>"
    }
}
export async function isPerk(selected){
    await fetch(window.location+"/"+selected).then(response=>response.json()).then(result=>{
        let beforeChildren = alreadyGuessedPerksEl.innerHTML
        if(result === "NO"){
            alreadyGuessedPerksEl.innerHTML=`<button  class="foundPerk alreadyGuessed rounded">${selected}</button>`
            items.splice(items.indexOf(selected),1)
        }else if(result === "YES"){
            alreadyGuessedPerksEl.innerHTML=`<button  class="foundPerk goodGuess rounded">${selected}</button>`
            let foundPerkName = document.createElement('h1');
            foundPerkName.innerHTML=selected
            inputEl.parentNode.replaceChild(foundPerkName, inputEl);
        }
        alreadyGuessedPerksEl.innerHTML+=beforeChildren
    })
    foundPerksEl.innerHTML=""
    inputEl.value=""

}
window.search=search;
window.isPerk=isPerk;
