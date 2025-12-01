import { carregarDados, abrirGaleriaModal } from "./_uso_geral.js";

let dadosGaleria = [];
carregarDados("companhia_galeria.json")
    .then((resposta) => {
        dadosGaleria = resposta;
    });

let carouselInterval = null;
let currentIndex = 0;

export async function carregarCompanhia() {

    await carregarEspetaculos();
    await carregarGaleria();

    document.querySelectorAll(".galeria-card").forEach((card) => {
        card.addEventListener("click", () => {
            document.getElementById("companhiaGaleriaModal").classList.add("active");
            abrirGaleriaModal("companhia", dadosGaleria, Number(card.dataset.id));
        });
    });
}

export async function carregarEspetaculos() {

    const companhiaEspetaculos = document.getElementById("companhiaEspetaculos")

    carregarDados('companhia_espetaculos.json').then((resposta) => {
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

    const urlBase = "assets/imagens/companhia/";

    companhiaGaleria.innerHTML = dadosGaleria.map(
        (imagem) => `
            <div class="galeria-card" data-id="${imagem.id}">
                <img src="${urlBase + imagem.fotos[0].src}" alt="${imagem.titulo}, apresentada no dia ${imagem.dia} de ${imagem.mes} de ${imagem.ano}">
                <p class="galeria-descricao">${imagem.titulo}</p>
            </div>
    `).join("");
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