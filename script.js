async function loadGallery(){
  const res = await fetch("data.json?v=" + Date.now());
  const data = await res.json();

  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  data.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="images/${item.file}">
      <div class="info">
        <p>${item.caption || ""}</p>
      </div>
    `;

    div.onclick = () => openLightbox(index);
    gallery.appendChild(div);
  });

  images = document.querySelectorAll(".card img");
}

let images = [];
let currentIndex = 0;

/* ================= LIGHTBOX ================= */
function openLightbox(index){
  currentIndex = index;

  const lightbox = document.getElementById("lightbox");
  const imgBox = document.getElementById("lightbox-img");
  const downloadBtn = document.getElementById("downloadBtn");

  imgBox.src = images[index].src;
  downloadBtn.href = images[index].src;

  lightbox.classList.add("show");
}

function closeLightbox(){
  document.getElementById("lightbox").classList.remove("show");
}

document.getElementById("close").onclick = closeLightbox;

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeLightbox();
});

/* ================= MUSIC ================= */
const music = document.getElementById("bg-music");
const btn = document.getElementById("musicToggle");

let isPlaying = false;

btn.onclick = () => {
  if(!isPlaying){
    music.play();
    btn.innerHTML = "⏸️";
  } else {
    music.pause();
    btn.innerHTML = "▶️";
  }
  isPlaying = !isPlaying;
};

document.body.addEventListener("click", () => {
  if(!isPlaying){
    music.play();
    btn.innerHTML = "⏸️";
    isPlaying = true;
  }
}, { once: true });

/* ================= LOVE EFFECT ================= */
const canvas = document.getElementById("loveCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];

function createHeart(x, y){
  hearts.push({
    x,
    y,
    size: Math.random()*10+10,
    speed: Math.random()*2+1,
    color: ["#ff4d6d","#ff85a1","#ffc2d1"][Math.floor(Math.random()*3)]
  });
}

document.addEventListener("click", (e)=>{
  for(let i=0;i<5;i++){
    createHeart(e.clientX, e.clientY);
  }
});

function drawHeart(x,y,size,color){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.bezierCurveTo(x-size,y-size,x-size*2,y+size,x,y+size*2);
  ctx.bezierCurveTo(x+size*2,y+size,x+size,y-size,x,y);
  ctx.fill();
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  hearts.forEach((h,i)=>{
    h.y += h.speed;
    drawHeart(h.x,h.y,h.size,h.color);

    if(h.y > canvas.height){
      hearts.splice(i,1);
    }
  });

  requestAnimationFrame(animate);
}

animate();

/* ================= INIT ================= */
loadGallery();
