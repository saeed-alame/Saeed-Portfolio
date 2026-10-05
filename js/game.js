let pencolor;
let selected = null;
let previewon = false;
let rows = 28;
let columns = 46;
let logo = [
    "00000111111100000",
    "00011111111111000",
    "00111111111111100",
    "01111111222211110",
    "01111122111122110",
    "11112211111112211",
    "11221111221111221",
    "11122111111112211",
    "11112211111221111",
    "11122111111122111",
    "11221111211112211",
    "11122111211122111",
    "01111221111221110",
    "00111122222211100",
    "00011111111111000",
    "00000111111100000"
];

let C = [
    "0333",
    "3000",
    "3000",
    "3000",
    "3000",
    "0333"
];
let o = [
    "0000",
    "0000",
    "0440",
    "4004",
    "4004",
    "0440"
];
let d = [
    "0005",
    "0005",
    "0555",
    "5005",
    "5005",
    "0555"
];
let e = [
    "0000",
    "0000",
    "0660",
    "6006",
    "6666",
    "0660"
];
let B = [
    "7770",
    "7007",
    "7770",
    "7007",
    "7007",
    "7770"
];
let r = [
    "000",
    "000",
    "088",
    "800",
    "800",
    "800"
];
let a = [
    "0000",
    "0000",
    "0990",
    "9009",
    "9009",
    "0999"
];
let v = [
    "00000",
    "00000",
    "A000A",
    "A000A",
    "0A0A0",
    "00A00"
];
let e2 = [
    "0000",
    "0000",
    "0BB0",
    "B00B",
    "BBBB",
    "0BB0"
];

let picture = [];
for(let r = 0; r < rows; r++){
    picture[r] = [];
    for(let c = 0; c < columns; c++){
        picture[r][c] = "0";
    }
}

let logoy = 2;
let logox = Math.floor((columns - logo[0].length) / 2);
for(let r = 0; r < logo.length; r++){
    for(let c = 0; c < logo[r].length; c++){
        picture[logoy + r][logox + c] = logo[r][c];
    }
}
let letters = [C,o,d,e,B,r,a,v,e2];
let textx = 1;
let texty = 20;
for(let letter of letters){
    for(let r = 0; r < letter.length; r++){
        for(let c = 0; c < letter[r].length; c++){
            if(letter[r][c] != "0"){
                picture[texty + r][textx + c] = letter[r][c];
            }
        }
    }
    textx = textx + letter[0].length + 1;
}
function getcolor(number){
    if(number == "1"){
        return "black";
    }
    if(number == "2"){
        return "white";
    }
    if(number == "3"){
        return "red";
    }
    if(number == "4"){
        return "orange";
    }
    if(number == "5"){
        return "yellow";
    }
    if(number == "6"){
        return "green";
    }
    if(number == "7"){
        return "cyan";
    }
    if(number == "8"){
        return "blue";
    }
    if(number == "9"){
        return "indigo";
    }
    if(number == "A"){
        return "violet";
    }
    if(number == "B"){
        return "pink";
    }
}
function start(){
    let art = document.getElementById("art");
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            let number = picture[r][c];
            let pixel = document.createElement("div");
            pixel.classList.add("pixel");
            if(number == "0"){
                pixel.classList.add("empty");
            }
            else{
                pixel.innerText = number;
                pixel.setAttribute("color",getcolor(number));
                pixel.onclick = function(){
                    change(this);
                };
            }
            art.appendChild(pixel);
        }
    }
}

function choose(color,el){
    if(previewon){
        return;
    }
    pencolor = color;
    if(selected){
        selected.classList.remove("selected");
    }
    el.classList.add("selected");
    selected = el;
}

function change(pixel){
    if(previewon){
        return;
    }
    if(!pencolor){
        return;
    }
    let color = pixel.getAttribute("color");
    if(color == pencolor){
        pixel.style.backgroundColor = pencolor;
        pixel.innerText = "";
        pixel.setAttribute("done","yes");
    }
}
function preview(){
    let button = document.querySelector("button");
    let pixels = document.querySelectorAll(".pixel");
    if(previewon == false){
        previewon = true;
        button.innerText = "Hide Preview";
        if(selected){
            selected.classList.remove("selected");
        }
        for(let pixel of pixels){
            let color = pixel.getAttribute("color");
            if(color){
                pixel.style.backgroundColor = color;
                pixel.innerText = "";
            }
        }
    }
    else{
        previewon = false;
        button.innerText = "Show Preview";
        for(let pixel of pixels){
            if(pixel.getAttribute("done") != "yes"){
                let color = pixel.getAttribute("color");
                if(color){
                    if(color == "black"){
                        pixel.innerText = "1";
                    }
                    if(color == "white"){
                        pixel.innerText = "2";
                    }
                    if(color == "red"){
                        pixel.innerText = "3";
                    }
                    if(color == "orange"){
                        pixel.innerText = "4";
                    }
                    if(color == "yellow"){
                        pixel.innerText = "5";
                    }
                    if(color == "green"){
                        pixel.innerText = "6";
                    }
                    if(color == "cyan"){
                        pixel.innerText = "7";
                    }
                    if(color == "blue"){
                        pixel.innerText = "8";
                    }
                    if(color == "indigo"){
                        pixel.innerText = "9";
                    }
                    if(color == "violet"){
                        pixel.innerText = "A";
                    }
                    if(color == "pink"){
                        pixel.innerText = "B";
                    }
                    pixel.style.backgroundColor = "white";
                }
            }
        }
    }
}
start();