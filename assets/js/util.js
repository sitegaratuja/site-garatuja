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
}