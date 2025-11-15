import { incluirHtml, carregarTransparencia } from "./js/_uso_geral.js";
import { carregarHero, carregarTripe, carregarDepoimentos, carregarFAQ, carregarParceiros } from "./js/index.js";
import { carregarTimeline, initTimelineInteractions, fecharModal, abrirModalFromTemplate } from "./js/sobre.js";

document.addEventListener("DOMContentLoaded", async () => {

    // ------------- Funções de carregamento de dados

    // gerais, presentes em todas as páginas
    await incluirHtml("header", "menu.html");
    await incluirHtml("footer", "rodape.html");
    carregarTransparencia() //carrega o modal de transparencia

    // Index.html
    if (document.getElementById("testimonialsTrack")) carregarDepoimentos() // carrega os depoimentos do index.html
    if (document.getElementById("hero")) carregarHero() // carrega o hero do index.html
    if (document.getElementById("projectsGrid")) carregarTripe() // carrega o tripé do index.html
    if (document.getElementById("faqList")) carregarFAQ() // carrega o FAQ do index.html
    if (document.getElementById("partnersGrid")) carregarParceiros() // carrega os parceiros do index.html

    //sobre.html
    if (document.getElementById("timeline"))
    carregarTimeline().then(() => {
        initTimelineInteractions();
    });

    // ------------- Função que marca o link ativo no menu
    const links = document.querySelectorAll(".nav-menu > li > a");
    const currentPath = window.location.pathname.split("/").pop().split("#")[0].split("?")[0] || "index.html";

    links.forEach(link => {
        const href = link.getAttribute("href");
        const linkBase = href.split("/").pop().split("#")[0].split("?")[0];
        if (linkBase === currentPath) {
            link.classList.add("active");
        }
    });

    // ------------- Função que configura o menu mobile (quando a largura é menor que 1175px)
    if (window.innerWidth < 1175) {

        document.querySelectorAll(".nav-menu > li > a").forEach((link) => {
            let clickTimer = null;

            link.addEventListener("click", (e) => {
                const dropdown = link.nextElementSibling;

                // Verifica se existe submenu
                if (dropdown && dropdown.classList.contains("submenu")) {
                    e.preventDefault(); // Evita navegação imediata

                    if (clickTimer) {
                        // Duplo clique → abre o link do pai
                        clearTimeout(clickTimer);
                        clickTimer = null;
                        window.location.href = link.href;
                    } else {
                        // Clique simples → abre/fecha submenu
                        clickTimer = setTimeout(() => {
                            dropdown.classList.toggle("show");
                            clickTimer = null;
                        }, 250);
                    }
                }
            });
        });

        // Mobile Menu Toggle
        const menuToggle = document.getElementById("menuToggle")
        const navMenu = document.getElementById("navMenu")

        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active")
        })

        // Close menu when clicking on a link
        document.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active")
            })
        })
    }

    // Navbar scroll effect
    window.addEventListener("scroll", () => {
        const navbar = document.getElementById("navbar")
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled")
        } else {
            navbar.classList.remove("scrolled")
        }
    })

    // ------------- Funções do modal transparencia
    const openModal = document.getElementById('transparenciaOpenModal');
    const closeModal = document.getElementById('transparenciaCloseModal');
    const overlay = document.getElementById('transparenciaModalOverlay');
    const body = document.body;

    openModal.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.style.display = 'flex';
        body.classList.add('no-scroll'); // trava o body
    });

    const close = () => {
        overlay.style.display = 'none';
        body.classList.remove('no-scroll'); // destrava o body
    };

    closeModal.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
});

// ------------- Companhia de dança
document.addEventListener("DOMContentLoaded", () => {
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

            // Simular formulário de inscrição
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
            // Criar overlay para lightbox
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

            // Fechar ao clicar
            overlay.addEventListener("click", () => {
                document.body.removeChild(overlay)
            })
        })
    })

    // Smooth scroll para links internos
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

    // Animação de entrada para cards
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

    // Observar elementos para animação
    document.querySelectorAll(".evento-card, .repertorio-card, .horario-card, .nivel-card").forEach((el) => {
        observer.observe(el)
    })
})