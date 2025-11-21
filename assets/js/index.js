import { carregarDados } from "./_uso_geral.js";

export async function carregarHero() {
    try {
        const response = await fetch("assets/jsons/index_hero.json");
        const slides = await response.json();

        const hero = document.querySelector(".hero");
        const heroTitle = document.querySelector(".hero-title");
        const heroSubtitle = document.querySelector(".hero-subtitle");
        const heroButtons = document.querySelector(".hero-button");
        const heroImageContainer = document.querySelector(".hero-image");

        const prevBtn = document.querySelector(".hero-prev");
        const nextBtn = document.querySelector(".hero-next");

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
            heroButtons.innerHTML = `<a href="${slides[newIndex].button.link}" class="btn hero-btn">${slides[newIndex].button.text}</a>`;

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
        heroButtons.innerHTML = `<a href="${slides[0].button.link}" class="btn hero-btn">${slides[0].button.text}</a>`;

        // Autoplay a cada 8s
        setInterval(nextSlide, 5000);
    } catch (error) {
        console.error("Erro ao inicializar o hero carousel:", error);
    }
}

export async function carregarDepoimentos() {
    const container = document.getElementById("depoimentos");
    const depoimentosDiv = document.getElementById("depoimentosDiv");
    const dotsContainer = document.getElementById("depoimentosDots");
    const btnPrev = document.getElementById("prevDepoimento");
    const btnNext = document.getElementById("nextDepoimento");
    let depoimentosAtual = 0;

    // --- 1. Carrega dados do JSON base ---
    const dadosDepoimentos = await carregarDados("index_depoimentos.json");
    if (!dadosDepoimentos || !Array.isArray(dadosDepoimentos)) {
        console.error("Erro: dados de depoimentos inválidos.");
        return;
    }

    // --- 2. Monta os dots ---
    dotsContainer.innerHTML = dadosDepoimentos.map((_, index) => `
        <div class="depoimento-dot" data-index="${index}"></div>
    `).join("");

    const dots = document.querySelectorAll(".depoimento-dot");

    // --- 4. Atualiza o carrossel ---
    function atualizarCarrossel(indexParaIr = 0) {
    depoimentosAtual = indexParaIr;

    const card = document.querySelector(".depoimento-card");
    const quote = document.getElementById("depoimentoQuote");
    const name = document.getElementById("depoimentoName");
    const role = document.getElementById("depoimentoRole");

    // Remove animações antigas
    card.classList.remove("slide-in");
    card.classList.add("slide-out");

    // Espera a saída terminar antes de trocar o conteúdo
    setTimeout(() => {
        quote.textContent = dadosDepoimentos[indexParaIr].quote;
        name.textContent = dadosDepoimentos[indexParaIr].name;
        role.textContent = dadosDepoimentos[indexParaIr].role;

        container.style.backgroundImage = `url(${dadosDepoimentos[indexParaIr].imagemFundo})`;

        // Inicia animação de entrada
        card.classList.remove("slide-out");
        card.classList.add("slide-in");

        // Atualiza dots se existirem
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === depoimentosAtual);
        });

    }, 350); // mesmo tempo da animação de saída
}


    // --- 5. Eventos dos dots ---
    dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            atualizarCarrossel(index);
        });
    });

    // --- 6. Eventos dos botões ---
    btnPrev?.addEventListener("click", () => {
        depoimentosAtual = (depoimentosAtual - 1 + dadosDepoimentos.length) % dadosDepoimentos.length;
        atualizarCarrossel(depoimentosAtual);
    });

    btnNext?.addEventListener("click", () => {
        depoimentosAtual = (depoimentosAtual + 1) % dadosDepoimentos.length;
        atualizarCarrossel(depoimentosAtual);
    });

    // --- 7. Avanço automático ---
    setInterval(() => {
        depoimentosAtual = (depoimentosAtual + 1) % dadosDepoimentos.length;
        atualizarCarrossel(depoimentosAtual);
    }, 5000);

    // --- 8. Inicia o carrossel ---
    atualizarCarrossel(0);
}

export function carregarFAQ() {
    const faqList = document.getElementById("faqList");

    carregarDados("index_faq.json").then((resposta) => {
        // Monta o HTML
        faqList.innerHTML = resposta.map((item, index) => `
            <div class="faq-item" data-index="${index}">
                <button class="faq-question">
                    ${item.question}
                    <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                <div class="faq-answer">
                    <div class="faq-answer-content">${item.answer}</div>
                </div>
            </div>
        `).join("");

        // Só aqui os elementos existem no DOM
        document.querySelectorAll(".faq-question").forEach((question) => {
            question.addEventListener("click", (e) => {
                const faqItem = e.target.closest(".faq-item");
                const isActive = faqItem.classList.contains("active");

                // Fecha todos os outros
                document.querySelectorAll(".faq-item").forEach((item) => {
                    item.classList.remove("active");
                });

                // Abre o clicado (se ainda não estava aberto)
                if (!isActive) {
                    faqItem.classList.add("active");
                }
            });
        });
    });
}

export function carregarParceiros() {
    const partnersGrid = document.getElementById("partnersGrid")

    let dadosParceiros = carregarDados('index_parceiros.json').then((resposta) => {
        return resposta;
    });

    dadosParceiros.then((resposta) => {
        partnersGrid.innerHTML = `
            ${resposta.map((parceiro) => `
                <div class="partner-logo">
                    <img src="/assets/imagens/parceiros/${parceiro.logo}" alt="${parceiro.name}">
                </div>
            `).join("")}
        `;
    });
}