import { carregarDados } from "./_uso_geral.js";

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
        "linkedin": "/assets/imagens/midia/linkedin.png",
        "twitter": "/assets/imagens/midia/twitter.png"
    }

    const projectsGrid = document.getElementById("projetos")
    carregarDados("projetos.json").then((resposta) => {
        projectsGrid.innerHTML = `
            ${resposta.map((project) => `
                <div class="projetos-card">
                    <img src="/assets/imagens/projetos/${project.tumb}" alt="${project.titulo}">
                    <div class="repertorio-content">
                        <h4>${project.titulo} &nbsp; ${project.redes.map((rede) => `<a href="${rede.link}" target="_blank"> ${icons[rede.icon]}</a> `).join('')}</h4>
                        <p class="repertorio-duracao">${project.periodo}</p>
                        <p class="repertorio-desc">${project.descricao}</p>
                        <button class="btn-repertorio" data-id="${project.id}">Ver ficha técnica</button>
                    </div>
                </div>
            `).join("")}
        `;

        // Evento de clique para abrir o modal de transparencia
        const projectCards = document.querySelectorAll(".btn-repertorio");
        projectCards.forEach((card) => {
            card.addEventListener("click", () => {
                //abrirGaleriaModal(card.dataset.id);
                window.alert(card.dataset.id);
            });
        });
    });
}