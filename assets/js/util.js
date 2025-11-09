// Essa função insere dentro de uma tag (ex: <header>, <footer>, etc.)
// o conteúdo de um arquivo HTML localizado em /assets/htmls/
export async function incluirHtml(tag, html) {
    try {
        const elemento = document.querySelector(tag);
        if (!elemento) throw new Error(`Tag <${tag}> não encontrada no documento.`);

        const resposta = await fetch(`/assets/htmls/${html}`);
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
} export function carregarTransparencia() {
    const transparenciaList = document.getElementById("transparenciaList");

    carregarDados("transparencia.json").then((resposta) => {
        transparenciaList.innerHTML = resposta
            .map(
                (item, index) => `
                    <div class="transparencia-item" data-index="${index}">
                    <button class="transparencia-question">
                        ${item.titulo}
                        <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div class="transparencia-answer">
                        <p>${item.descricao}</p>
                        <ul>
                        ${item.listaDeRelatorios
            .map(
                (relatorio) =>
                    `<li><a href="${relatorio.link}" target="_blank">${relatorio.nome}</a></li>`
            )
            .join("")}
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
    });
}