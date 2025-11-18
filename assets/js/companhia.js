import { carregarDados } from "./_uso_geral.js";

export function carregarCompanhia() {
    // Botões de repertório
    const btnRepertorio = document.querySelectorAll(".btn-repertorio")

    btnRepertorio.forEach((btn) => {
        btn.addEventListener("click", function () {
            const card = this.closest(".repertorio-card")
            const titulo = card.querySelector("h4").textContent
            alert(
                `Ficha técnica de "${titulo}" será exibida em breve.\n\nEm desenvolvimento: modal com informações completas sobre direção, elenco, equipe técnica, duração, classificação e sinopse.`,
            )
        })
    })

    // Botões de eventos
    const btnEvento = document.querySelectorAll(".btn-evento")

    btnEvento.forEach((btn) => {
        btn.addEventListener("click", function () {
            const card = this.closest(".evento-card")
            const titulo = card.querySelector("h4").textContent
            const local = card.querySelector(".evento-local").textContent
            const horario = card.querySelector(".evento-horario").textContent

            alert(
                `Informações do evento:\n\n${titulo}\n${local}\n${horario}\n\nEm breve: sistema de reserva de ingressos online.`,
            )
        })
    })

    // Botões de inscrição
    const btnInscricao = document.querySelectorAll(".btn-inscricao")

    btnInscricao.forEach((btn) => {
        btn.addEventListener("click", function () {
            const card = this.closest(".horario-card")
            const nivel = card.querySelector("h5").textContent
            const horario = card.querySelectorAll("p")[0].textContent + " - " + card.querySelectorAll("p")[1].textContent

            const nome = prompt(`Inscrição para ${nivel}\n${horario}\n\nPor favor, digite seu nome completo:`)

            if (nome) {
                const email = prompt("Digite seu e-mail:")
                if (email) {
                    const telefone = prompt("Digite seu telefone:")
                    if (telefone) {
                        alert(
                            `Obrigado, ${nome}!\n\nSua pré-inscrição foi registrada.\n\nEm breve entraremos em contato através do e-mail ${email} ou telefone ${telefone} para finalizar sua matrícula.\n\nAguarde nosso contato!`,
                        )
                    }
                }
            }
        })
    })

    // Galeria de fotos - lightbox simples
    const galeriaImgs = document.querySelectorAll(".galeria-img")

    galeriaImgs.forEach((img) => {
        img.addEventListener("click", function () {
            const overlay = document.createElement("div")
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
            `

            const imgClone = this.cloneNode()
            imgClone.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 8px;
            `

            overlay.appendChild(imgClone)
            document.body.appendChild(overlay)

            overlay.addEventListener("click", () => {
                document.body.removeChild(overlay)
            })
        })
    })

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href")
            if (href !== "#" && href !== "#doar") {
                e.preventDefault()
                const target = document.querySelector(href)
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    })
                }
            }
        })
    })

    // Animação de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "0"
                entry.target.style.transform = "translateY(20px)"

                setTimeout(() => {
                    entry.target.style.transition = "opacity 0.6s ease, transform 0.6s ease"
                    entry.target.style.opacity = "1"
                    entry.target.style.transform = "translateY(0)"
                }, 100)

                observer.unobserve(entry.target)
            }
        })
    }, observerOptions)

    document.querySelectorAll(".evento-card, .repertorio-card, .horario-card, .nivel-card").forEach((el) => {
        observer.observe(el)
    })
}