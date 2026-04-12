async function loadGallery(){
const res=await fetch("data.json?v="+Date.now());
const data=await res.json();
const g=document.querySelector(".gallery");
g.innerHTML="";
data.forEach((i,idx)=>{
const d=document.createElement("div");
d.className="card";
d.innerHTML=`<img src="images/${i.file}"><div class="info"><p>${i.caption||""}</p></div>`;
d.onclick=()=>open(idx);
g.appendChild(d);
});
initLightbox();
}

let images=[];

function initLightbox(){
images=document.querySelectorAll(".card img");
}

function open(i){
const lb=document.getElementById("lightbox");
const img=document.getElementById("lightbox-img");
img.src=images[i].src;
lb.style.display="block";
}

document.getElementById("close").onclick=()=>{
document.getElementById("lightbox").style.display="none";
};

loadGallery();

// music
const music=document.getElementById("bg-music");
const btn=document.getElementById("musicToggle");
let play=false;
btn.onclick=()=>{
if(!play){music.play();btn.innerHTML="⏸️";}
else{music.pause();btn.innerHTML="▶️";}
play=!play;
};

// love
const c=document.getElementById("loveCanvas");
const ctx=c.getContext("2d");
c.width=innerWidth;c.height=innerHeight;
let hearts=[];
function h(x,y){hearts.push({x,y,v:1})}
document.onclick=e=>{for(let i=0;i<5;i++)h(e.clientX,e.clientY)}
function loop(){
ctx.clearRect(0,0,c.width,c.height);
hearts.forEach((o,i)=>{o.y+=o.v;ctx.fillText("❤️",o.x,o.y);if(o.y>c.height)hearts.splice(i,1)});
requestAnimationFrame(loop);
}
loop();
