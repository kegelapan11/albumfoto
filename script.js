async function loadGallery() {
  try {
    // anti cache biar selalu update dari GitHub
    const res = await fetch("https://kegelapan11.github.io/albumfoto/data.json?v=" + Date.now());
    const data = await res.json();

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <img src="images/${item.file}" loading="lazy">
        <div class="info">
          <p>${item.caption || ""}</p>
          <small>${item.date}</small>
        </div>
      `;

      gallery.appendChild(div);
    });

    initLightbox();

  } catch (err) {
    console.error("Gagal load data:", err);
  }
}

// ================= LIGHTBOX =================
function initLightbox() {
  const images = document.querySelectorAll(".card img");
  const lightbox = document.getElementById("lightbox");
  const imgBox = document.getElementById("lightbox-img");
  const downloadBtn = document.getElementById("downloadBtn");

  images.forEach(img => {
    img.onclick = () => {
      lightbox.style.display = "block";
      imgBox.src = img.src;
      downloadBtn.href = img.src;
    };
  });

  // tombol close
  document.getElementById("close").onclick = () => {
    lightbox.style.display = "none";
  };

  // klik background = close
  lightbox.onclick = (e) => {
    if (e.target.id === "lightbox") {
      lightbox.style.display = "none";
    }
  };

  // swipe down untuk close (mobile)
  let startY = 0;

  lightbox.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
  });

  lightbox.addEventListener("touchend", e => {
    let endY = e.changedTouches[0].clientY;
    if (endY - startY > 100) {
      lightbox.style.display = "none";
    }
  });

  // ESC key close (desktop)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      lightbox.style.display = "none";
    }
  });
}

// ================= INIT =================
loadGallery();
