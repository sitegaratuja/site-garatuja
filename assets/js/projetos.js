import { carregarDados, abrirGaleriaModal } from "_uso_geral.js";

let dadosProjetos = [];

// Carregar dados JSON
carregarDados('projetos.json').then(resposta => {
    dadosProjetos = resposta;
});

export async function carregarProjetos() {

    let icons = {
        "github": "<i class='bi bi-github'></i>",
        "instagram": "<i class='bi bi-instagram'></i>",
        "facebook": "<i class='bi bi-facebook'></i>",
        "youtube": "<i class='bi bi-youtube'></i>",
        "linkedin": "assets/imagens/midia/linkedin.png",
        "twitter": "assets/imagens/midia/twitter.png"
    }

    const projectsGrid = document.getElementById("projetos")
    carregarDados("projetos.json").then((resposta) => {
        projectsGrid.innerHTML = `
            ${resposta.map((project) => `
                <div class="projetos-card">
                    <img src="assets/imagens/projetos/${project.linkBase}/${project.tumb}" alt="${project.titulo}">
                    <div class="repertorio-content">
                        <h4>${project.titulo} <br>${project.redes.map((rede) => `<a href="${rede.link}" target="_blank"> ${icons[rede.icon]}</a> `).join('')}</h4>
                        <p class="repertorio-desc">${project.descricao}</p>
                        <button class="btn-repertorio" data-id="${project.id}">Ver ficha técnica</button>
                    </div>
                </div>
            `).join("")}
        `;

        let carouselInterval = null;
        let currentIndex = 0;

        // Abrir modal
        const projectCards = document.querySelectorAll(".btn-repertorio");
        projectCards.forEach((card) => {
            card.addEventListener("click", () => {
                console.log("Indo para o abrirGaleriaModal com o id " + card.dataset.id);
                abrirGaleriaModal("projetos", dadosProjetos, Number(card.dataset.id));
            });
        });

        // Fechar modal
        if (document.getElementById("projetosModal")) {

            document.querySelector(".projetos-close").addEventListener("click", () => {
                document.getElementById("projetosModal").classList.remove("active");
                clearInterval(carouselInterval);
                document.querySelector("body").classList.remove("no-scroll");
            });

            // Fechar clicando fora
            document.querySelector(".projetos-modal-backdrop").addEventListener("click", () => {
                document.getElementById("projetosModal").classList.remove("active");
                clearInterval(carouselInterval);
                document.querySelector("body").classList.remove("no-scroll");
            });
        }
    });
}