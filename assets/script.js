import { incluirHtml, carregarTransparencia } from "./js/_uso_geral.js";
import { carregarCompanhia } from "./js/companhia.js";
import { carregarHero, carregarTripe, carregarDepoimentos, carregarFAQ, carregarParceiros } from "./js/index.js";
import { carregarTimeline, initTimelineInteractions, fecharModal } from "./js/sobre.js";
import { carregarProjetos } from "./js/projetos.js";

document.addEventListener("DOMContentLoaded", async () => {

    // ------------- 1. Funções que separam os dados BR dos EN

    // 1.1. Se o .html não é o en_index.html
    if (window.location.pathname !== "/en_index.html") {

        await incluirHtml("header", "menu.html");
        await incluirHtml("footer", "rodape.html");
        carregarTransparencia() //carrega o modal de transparencia

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
    }
    // 1.2. Se o .html é o en_index.html
    else {
        await incluirHtml("header", "en_menu.html");
        await incluirHtml("footer", "en_rodape.html");
    }

    // ------------- 2. Funções de carregamento de dados

    // 2.1. Index.html
    if (document.getElementById("hero")) carregarHero() // carrega o hero do index.html
    if (document.getElementById("tripeGrid")) carregarTripe() // carrega o tripé do index.html
    if (document.getElementById("depoimentosDiv")) carregarDepoimentos() // carrega os depoimentos do index.html
    if (document.getElementById("faqList")) carregarFAQ() // carrega o FAQ do index.html
    if (document.getElementById("partnersGrid")) carregarParceiros() // carrega os parceiros do index.html

    // 2.2. Sobre.html
    if (document.getElementById("timeline")) {
        carregarTimeline().then(() => {
            initTimelineInteractions();

            // ------------- Função que fecha o modal
            const btn_fechar_modal = document.querySelector('.tl-modal .tl-close');
            btn_fechar_modal.addEventListener('click', () => fecharModal());
        });
    }

    // 2.3. Companhia.html
    if (document.getElementById("espetaculos")) {
        await carregarCompanhia();
    }

    // 2.4. Projetos.html
    if (document.getElementById("projetos")) {
        await carregarProjetos();
    }

    // ------------- 3. Funções do modal transparencia
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

    // ------------- 4. Função que configura o menu mobile (quando a largura é menor que 1175px)
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
        const menuToggle = document.getElementById("navToggle")
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

    // ------------- 5. Navbar scroll effect
    window.addEventListener("scroll", () => {
        const navbar = document.getElementById("navbar")
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled")
        } else {
            navbar.classList.remove("scrolled")
        }
    })
});