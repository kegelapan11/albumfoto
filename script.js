async function loadGallery(){
const res=await fetch("data.json");
const data=await res.json();
const g=document.querySelector(".gallery");g.innerHTML="";
data.forEach(i=>{
const d=document.createElement("div");d.className="card";
d.innerHTML=`<img src="images/${i.file}"><div class="info"><p>${i.caption||""}</p><small>${i.date}</small></div>`;
g.appendChild(d);
});
initLightbox();
}
function initLightbox(){
const imgs=document.querySelectorAll(".card img");
const lb=document.getElementById("lightbox");
const im=document.getElementById("lightbox-img");
const dl=document.getElementById("downloadBtn");
imgs.forEach(img=>{
img.onclick=()=>{
lb.style.display="block";
im.src=img.src;
dl.href=img.src;
};
});
document.getElementById("close").onclick=()=>lb.style.display="none";
}
loadGallery();
