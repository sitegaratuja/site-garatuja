export async function carregarHero() {
  try {
    const response = await fetch("assets/jsons/index_hero.json");
    const slides = await response.json();

    const hero = document.querySelector(".hero");
    const heroTitle = document.querySelector(".hero-title");
    const heroSubtitle = document.querySelector(".hero-subtitle");
    const heroButtons = document.querySelector(".hero-buttons");
    const heroImageContainer = document.querySelector(".hero-image");

    const prevBtn = document.querySelector(".hero-prev");
    const nextBtn = document.querySelector(".hero-next");

    if (!heroImageContainer) {
      console.warn("⚠️ Elemento .hero-image não encontrado.");
      return;
    }

    let index = 0;
    let isAnimating = false;

    function renderSlide(newIndex, direction = 1) {
      if (isAnimating) return;
      isAnimating = true;

      // Cria nova imagem
      const newImage = document.createElement("div");
      newImage.classList.add("hero-image");
      newImage.style.backgroundImage = `url('/assets/imagens/midia/${slides[newIndex].image}')`;

      // Define direção de entrada
      newImage.classList.add(direction === 1 ? "slide-in-right" : "slide-in-left");
      hero.appendChild(newImage);

      // Força reflow pra aplicar transição
      void newImage.offsetWidth;

      // Move imagem atual
      const currentImage = hero.querySelector(".hero-image.active");
      if (currentImage) {
        currentImage.classList.remove("active");
        currentImage.classList.add(direction === 1 ? "slide-in-left" : "slide-in-right");
      }

      // Anima entrada da nova imagem
      newImage.classList.remove("slide-in-right", "slide-in-left");
      newImage.classList.add("active");

      // Atualiza textos
      heroTitle.textContent = slides[newIndex].title;
      heroSubtitle.textContent = slides[newIndex].subtitle;
      heroButtons.innerHTML = `<a href="${slides[newIndex].button.link}" class="btn btn-secondary">${slides[newIndex].button.text}</a>`;

      // Remove a imagem anterior após a animação
      setTimeout(() => {
        if (currentImage) currentImage.remove();
        isAnimating = false;
      }, 1000);
    }

    function nextSlide() {
      const next = (index + 1) % slides.length;
      renderSlide(next, 1);
      index = next;
    }

    function prevSlide() {
      const prev = (index - 1 + slides.length) % slides.length;
      renderSlide(prev, -1);
      index = prev;
    }

    prevBtn?.addEventListener("click", prevSlide);
    nextBtn?.addEventListener("click", nextSlide);

    // Inicializa o primeiro slide
    heroImageContainer.style.backgroundImage = `url('/assets/imagens/midia/${slides[0].image}')`;
    heroImageContainer.classList.add("active");
    heroTitle.textContent = slides[0].title;
    heroSubtitle.textContent = slides[0].subtitle;
    heroButtons.innerHTML = `<a href="${slides[0].button.link}" class="btn btn-secondary">${slides[0].button.text}</a>`;

    // Autoplay a cada 8s
    setInterval(nextSlide, 8000);
  } catch (error) {
    console.error("Erro ao inicializar o hero carousel:", error);
  }
}