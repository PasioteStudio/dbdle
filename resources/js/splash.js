const splash_imgEl=document.getElementById("splash_img")

export function afterSelected(tries){
    let already_tried=splash_imgEl.src.split("/")[splash_imgEl.src.split("/").length - 1]
    console.log(tries)
    splash_imgEl.src=splash_imgEl.src.slice(0,splash_imgEl.src.indexOf(already_tried,splash_imgEl.src.length-4))+tries
}
window.afterSelected=afterSelected
