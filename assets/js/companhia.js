import { carregarDados } from "./_uso_geral.js";

let dadosGaleria = [];
carregarDados("companhia_galeria.json")
    .then((resposta) => {
        dadosGaleria = resposta;
    });

export async function carregarCompanhia() {

    await carregarEspetaculos();
    await carregarGaleria();

    document.querySelectorAll(".galeria-card").forEach((card) => {
        card.addEventListener("click", () => {
            document.getElementById("companhiaGaleriaModal").classList.add("active");
            abrirGaleriaModal(Number(card.dataset.id));
        });
    });
}

export async function carregarEspetaculos() {

    const companhiaEspetaculos = document.getElementById("companhiaEspetaculos")

    let dados = carregarDados('companhia_espetaculos.json').then((resposta) => {
        companhiaEspetaculos.innerHTML = `
            ${resposta.map((espetaculo) => `
                <div class="evento-card">
                    <div class="evento-date">
                        <span class="date-day">${espetaculo.dia}</span>
                        <span class="date-month">${espetaculo.mes}</span>
                    </div>
                    <div class="evento-info">
                        <h4>${espetaculo.nome}</h4>
                        <p class="evento-local">${espetaculo.local}</p>
                        <p class="evento-horario">${espetaculo.horario}</p>
                        <button class="btn-evento">Mais informações</button>
                    </div>
                </div>
            `).join("")}
        `;
    });
}

export async function carregarGaleria() {
    const companhiaGaleria = document.getElementById("companhiaGaleria");

    companhiaGaleria.innerHTML = dadosGaleria.map((imagem) => `
        <div class="galeria-card" data-id="${imagem.id}">
            <img src="${imagem.fotos[0].src}" alt="${imagem.nome}, apresentada no dia ${imagem.dia} de ${imagem.mes} de ${imagem.ano}">
            <p class="galeria-descricao">${imagem.nome}</p>
        </div>
    `).join("");
}


let carouselInterval = null;
let currentIndex = 0;

export function abrirGaleriaModal(id) {
    const modal = document.getElementById("companhiaGaleriaModal");
    const titulo = modal.querySelector(".midia-titulo");
    const descricao = modal.querySelector(".midia-descricao");
    const thumbsBox = modal.querySelector(".midia-thumbs");

    const evento = dadosGaleria.find(item => item.id === id);
    if (!evento) return;

    // Preencher texto
    titulo.textContent = evento.nome;
    descricao.textContent = evento.descricao;

    // Limpar thumbs antigas
    thumbsBox.innerHTML = "";

    const fotos = evento.fotos;
    currentIndex = 0;

    // Criar thumbs
    fotos.forEach((foto, index) => {
        const div = document.createElement("div");
        div.classList.add("midia-thumb-item");
        div.dataset.index = index;

        div.innerHTML = `
            <img src="${foto.src}" alt="">
            <div class="midia-thumb-legenda">${foto.descricao}</div>
        `;

        // clique na thumb
        div.addEventListener("click", () => {
            currentIndex = index;
            atualizarImagemGrande(evento);
            reiniciarCarrossel(evento);
        });

        thumbsBox.appendChild(div);
    });

    // Mostrar primeira imagem
    atualizarImagemGrande(evento);

    // Iniciar carrossel
    iniciarCarrossel(evento);

    // Abrir modal e impede a scroll do html, exceto o modal
    document.querySelector("body").classList.add("no-scroll");
    modal.classList.add("active");

}

// Atualiza imagem grande + thumb ativa
function atualizarImagemGrande(evento) {
    const modal = document.getElementById("companhiaGaleriaModal");
    const grandeImg = modal.querySelector("#midiaMainImage");
    const grandeLegenda = modal.querySelector(".midia-imagem-legenda");
    const thumbs = modal.querySelectorAll(".midia-thumb-item");

    const foto = evento.fotos[currentIndex];

    grandeImg.src = foto.src;
    grandeLegenda.textContent = foto.descricao;

    thumbs.forEach(t => t.classList.remove("active"));
    thumbs[currentIndex].classList.add("active");
}

// Carrossel automático
function iniciarCarrossel(evento) {
    clearInterval(carouselInterval);

    carouselInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % evento.fotos.length;
        atualizarImagemGrande(evento);
    }, 5000);
}

function reiniciarCarrossel(evento) {
    clearInterval(carouselInterval);
    iniciarCarrossel(evento);
}

// Fechar modal
if (document.getElementById("companhiaGaleriaModal")) {
    document.querySelector(".midia-close").addEventListener("click", () => {
        document.getElementById("companhiaGaleriaModal").classList.remove("active");
        clearInterval(carouselInterval);
        document.querySelector("body").classList.remove("no-scroll");
    });

    // Fechar clicando fora
    document.querySelector(".midia-modal-backdrop").addEventListener("click", () => {
        document.getElementById("companhiaGaleriaModal").classList.remove("active");
        clearInterval(carouselInterval);
        document.querySelector("body").classList.remove("no-scroll");
    });
}