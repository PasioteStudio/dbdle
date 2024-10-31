const splash_imgEl=document.getElementById("splash_img")
let cache_Tried=0
let zoomIng = false
export function afterSelected(tries){
    if(zoomIng){
        zoomOut()
    }
    let already_tried=splash_imgEl.src.split("/")[splash_imgEl.src.split("/").length - 1]
    splash_imgEl.src=splash_imgEl.src.slice(0,splash_imgEl.src.indexOf(already_tried,splash_imgEl.src.length-4))+tries
}
window.afterSelected=afterSelected
export function zoomOut(){
    let already_tried=splash_imgEl.src.split("/")[splash_imgEl.src.split("/").length - 1]
    let will_be = "0"
    if(zoomIng){
        already_tried = cache_Tried
        will_be = already_tried
        zoomIng = false
    }else{
        cache_Tried = already_tried
        zoomIng = true
    }
    splash_imgEl.src=splash_imgEl.src.slice(0,splash_imgEl.src.indexOf(already_tried,splash_imgEl.src.length-4))+will_be
}
window.zoomOut=zoomOut
