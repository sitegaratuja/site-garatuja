// Essa função escreve trechos de HTML em tags no HTML "original"
export async function incluirHtml(tag, html) {
    try {
        const elemento = document.querySelector(tag);
        if (!elemento) throw new Error(`Tag <${tag}> não encontrada no documento.`);

        let linkBase = "/assets/htmls/";

        if (tag == "header") linkBase += "menus/";
        else if (tag == "footer") linkBase += "rodapes/";

        const resposta = await fetch(linkBase + html);

        if (!resposta.ok) throw new Error(`Erro ao carregar ${html}: ${resposta.status}`);

        const conteudo = await resposta.text();
        elemento.innerHTML = conteudo;
    } catch (erro) {
        console.error("Erro ao incluir HTML:", erro);
    }
}

// Essa função carrega dados de um arquivo JSON localizado em /assets/jsons/
export async function carregarDados(arquivo) {

    const url = `/assets/jsons/${arquivo}`;

    return fetch(url).then((resposta) => {
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar dados: ${resposta.status}`);
        }
        return resposta.json();
    });
}

// Essa função carrega o modal de transparencia
export async function carregarTransparencia() {

    let relatorios = [];

    const transparenciaList = document.getElementById("transparenciaList");

    let location = (window.location.pathname == "/en_index.html") ? "en" : window.location.pathname == "/es_index.html" ? "es" : "br";

    await carregarDados("transparencia.json").then((resposta) => {
        relatorios = resposta;
    });

    transparenciaList.innerHTML = relatorios.map(
        (item, index) => `
                    <div class="transparencia-item" data-index="${index}">
                        <button class="transparencia-question">
                            ${location == "en" ? item.en_titulo : location == "es" ? item.es_titulo : item.titulo}
                            <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>
                        <div class="transparencia-answer">
                            <p>
                                ${location == "en" ? item.en_descricao : location == "es" ? item.es_descricao : item.descricao}
                            </p>
                            <ul>
                            ${item.listaDeRelatorios
                .map(
                    (relatorio) =>
                        `<li><a href="/assets/transparencia/${relatorio.link}" target="_blank">${relatorio.nome}</a></li>`
                )
                .join("")
            }
                            </ul>
                        </div>
                    </div>
                `
    )
        .join("");

    document.querySelectorAll(".transparencia-question").forEach((question) => {
        question.addEventListener("click", (e) => {
            const faqItem = e.target.closest(".transparencia-item");
            const isActive = faqItem.classList.contains("active");

            // Fecha todos
            document.querySelectorAll(".transparencia-item").forEach((item) => {
                item.classList.remove("active");
            });

            // Abre o clicado (se não estava ativo)
            if (!isActive) {
                faqItem.classList.add("active");
            }
        });
    });
}

let carouselInterval = null;
let currentIndex = 0;

export function abrirGaleriaModal(idModal, dados, id) {

    let modal = null;
    let titulo = null;
    let descricao = null;
    let thumbsBox = null;
    let fotos = null;

    const evento = dados.find(item => item.id === id);
    if (!evento) return;

    if (idModal == "companhia") {
        modal = document.getElementById("companhiaGaleriaModal");
        titulo = modal.querySelector(".midia-titulo");
        descricao = modal.querySelector(".midia-descricao");
        thumbsBox = modal.querySelector(".midia-thumbs");
        fotos = evento.fotos;
    }
    else if (idModal == "projetos") {
        modal = document.getElementById("projetosModal");
        titulo = document.getElementById("projetosTitulo");
        descricao = modal.querySelector(".projetos-descricao");
        thumbsBox = modal.querySelector(".projetos-thumbs");
        fotos = evento.imagens;
        incluirHtml(".projetos-texto", ("textos/projetos/" + evento.linkBase + ".html"));
    }

    // Preencher texto
    titulo.textContent = evento.titulo;
    descricao.textContent = evento.descricao;
    if (idModal == "projetos")

        // Limpar thumbs antigas
        thumbsBox.innerHTML = "";

    let baseurl = "";
    if (idModal == "projetos") baseurl = "/" + evento.linkBase + "/";

    currentIndex = 0;

    // Criar thumbs
    fotos.forEach((foto, index) => {
        const div = document.createElement("div");
        div.classList.add(((idModal == "companhia") ? "midia" : idModal) + "-thumb-item");
        div.dataset.index = index;

        if (foto.link) div.innerHTML = `
            <a href="${(foto.link ? foto.link : "#")}" target="_blank"><img src="/assets/imagens/${idModal}/${baseurl + foto.src}" alt=""></a>
            <div class="${((idModal == "companhia") ? "midia" : idModal)}-thumb-legenda">${foto.descricao}</div>
        `;
        else div.innerHTML = `
            <img src="/assets/imagens/${idModal}/${baseurl + foto.src}" alt="">
            <div class="${((idModal == "companhia") ? "midia" : idModal)}-thumb-legenda">${foto.descricao}</div>
        `;

        // clique na thumb
        div.addEventListener("click", () => {
            currentIndex = index;
            atualizarImagemGrande(idModal, evento);
            reiniciarCarrossel(idModal, evento);
        });

        thumbsBox.appendChild(div);
    });

    // Mostrar primeira imagem
    atualizarImagemGrande(idModal, evento);

    // Iniciar carrossel
    iniciarCarrossel(idModal, evento);

    // Abrir modal e impede a scroll do html, exceto o modal
    document.querySelector("body").classList.add("no-scroll");
    modal.classList.add("active");

}

// Atualiza imagem grande + thumb ativa
function atualizarImagemGrande(idModal, evento) {

    let modal = null;
    let grandeImg = null;
    let grandeLegenda = null;
    let thumbs = null;
    let foto = null;
    let baseURL = "";

    if (idModal == "companhia") {
        modal = document.getElementById("companhiaGaleriaModal");
        grandeImg = document.getElementById("midiaMainImage");
        grandeLegenda = modal.querySelector(".midia-imagem-legenda");
        thumbs = modal.querySelectorAll(".midia-thumb-item");
        foto = evento.fotos[currentIndex];
    }
    else if (idModal == "projetos") {
        modal = document.getElementById("projetosModal");
        grandeImg = document.getElementById("projetosMainImage");
        grandeLegenda = modal.querySelector(".projetos-imagem-legenda");
        thumbs = modal.querySelectorAll(".projetos-thumb-item");
        foto = evento.imagens[currentIndex];
        baseURL = evento.linkBase;
    }

    /*
        const modal = document.getElementById("companhiaGaleriaModal");
        const grandeImg = modal.querySelector("#midiaMainImage");
        const grandeLegenda = modal.querySelector(".midia-imagem-legenda");
        const thumbs = modal.querySelectorAll(".midia-thumb-item");

        const foto = evento.fotos[currentIndex];

        grandeImg.src = foto.src;
        grandeLegenda.textContent = foto.descricao;

        thumbs.forEach(t => t.classList.remove("active"));
        thumbs[currentIndex].classList.add("active");
    */

    grandeImg.src = "/assets/imagens/" + idModal + "/" + baseURL + "/" + foto["src"];
    grandeLegenda.textContent = foto.descricao;

    thumbs.forEach(t => t.classList.remove("active"));
    thumbs[currentIndex].classList.add("active");
}

// Carrossel automático
function iniciarCarrossel(idModal, evento) {
    clearInterval(carouselInterval);

    carouselInterval = setInterval(() => {
        if (idModal == "projetos") currentIndex = (currentIndex + 1) % evento.imagens.length;
        else currentIndex = (currentIndex + 1) % evento.fotos.length;
        atualizarImagemGrande(idModal, evento);
    }, 5000);
}

function reiniciarCarrossel(idModal, evento) {
    clearInterval(carouselInterval);
    iniciarCarrossel(idModal, evento);
}