let modais = ["modalDoacoesDoacoes", "modalDoacoesProfissionais", "modalDoacoesVoluntariado"];
let botoes = ["btnDoacoes", "btnProfissionais", "btnVoluntariado"];

export function abrirModalDoacoes() {

    // 🔹 Garante que todos começam fechados
    /*modais.forEach(id => {
        document.getElementById(id).classList.add("close");
    });*/

    // 🔹 Adiciona eventos
    botoes.forEach((botaoId, i) => {
        const botao = document.getElementById(botaoId);

        botao.addEventListener("click", () => {
            const modalAtual = document.getElementById(modais[i]);
            const estavaAberto = !modalAtual.classList.contains("close");

            // Fecha todos
            modais.forEach(id => {
                document.getElementById(id).classList.add("close");
            });

            // Se não estava aberto → abre
            if (!estavaAberto) {
                modalAtual.classList.remove("close");
            }
        });
    });
}