import { incluirHtml, carregarDados } from "./js/util.js";

document.addEventListener("DOMContentLoaded", async () => {

    await incluirHtml("header", "menu.html");
    await incluirHtml("footer", "rodape.html");

    // Newsletter Form
    document.getElementById("newsletterForm").addEventListener("submit", (e) => {
        e.preventDefault()
        const email = e.target.querySelector('input[type="email"]').value
        alert(`Obrigado por se inscrever, ${email}! Você receberá nossas novidades em breve.`)
        e.target.reset()
    })

    if (document.getElementById("projectsGrid")) loadProjects()

    // Testimonials
    if (document.getElementById("testimonialsTrack")) {

        loadTestimonials()

        document.getElementById("prevTestimonial").addEventListener("click", () => {
            currentTestimonial = (currentTestimonial - 1 + testimonialsData.length) % testimonialsData.length
            updateTestimonialCarousel()
        })

        document.getElementById("nextTestimonial").addEventListener("click", () => {
            currentTestimonial = (currentTestimonial + 1) % testimonialsData.length
            updateTestimonialCarousel()
        })

        // Auto-advance testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialsData.length
            updateTestimonialCarousel()
        }, 5000)

    }

    if (document.getElementById("doacoes")) {

        // Donation Amount Selection
        document.querySelectorAll(".amount-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                document.querySelectorAll(".amount-btn").forEach((b) => b.classList.remove("active"))
                e.target.classList.add("active")
                document.getElementById("customAmount").value = ""
            })
        })

        document.getElementById("customAmount").addEventListener("input", () => {
            document.querySelectorAll(".amount-btn").forEach((b) => b.classList.remove("active"))
        })

        document.getElementById("donateBtn").addEventListener("click", () => {
            const selectedAmount = document.querySelector(".amount-btn.active")
            const customAmount = document.getElementById("customAmount").value
            const amount = customAmount || (selectedAmount ? selectedAmount.dataset.amount : null)

            if (amount) {
                alert(`Obrigado por doar R$ ${amount}! Em breve você será redirecionado para a página de pagamento.`)
            } else {
                alert("Por favor, selecione ou insira um valor para doar.")
            }
        })

    }

    if (document.getElementById("faqList")) loadFAQ()

    if (document.getElementById("partnersGrid")) loadPartners()

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

    // Navbar scroll effect
    window.addEventListener("scroll", () => {
        const navbar = document.getElementById("navbar")
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled")
        } else {
            navbar.classList.remove("scrolled")
        }
    })

});

// Data
const projectsData = [
    {
        title: "Dança na Comunidade",
        description:
            "Aulas semanais de dança para crianças e jovens em comunidades carentes, promovendo inclusão social através da arte.",
        date: "Em andamento",
        image: "/assets/imagens/midia/children-learning-dance-in-community-center.jpg",
    },
    {
        title: "Festival Anual Garatuja",
        description:
            "Grande apresentação anual onde nossos alunos mostram todo o aprendizado do ano para a comunidade e familiares.",
        date: "Dezembro 2024",
        image: "/assets/imagens/midia/dance-festival-performance-on-stage.jpg",
    },
    {
        title: "Formação de Instrutores",
        description:
            "Programa de capacitação para jovens da comunidade se tornarem instrutores de dança, gerando oportunidades de trabalho.",
        date: "Início em 2025",
        image: "/assets/imagens/midia/dance-instructor-teaching-students.jpg",
    },
]

const testimonialsData = [
    {
        quote:
            "A Garatuja mudou minha vida. Através da dança, descobri meu talento e hoje sou instrutora, ajudando outras crianças como eu fui ajudada.",
        name: "Maria Silva",
        role: "Ex-aluna e Instrutora",
        avatar: "/assets/imagens/midia/young-woman-smiling-portrait.png",
    },
    {
        quote:
            "Meu filho era muito tímido. Depois que começou nas aulas da Garatuja, ele se transformou. Hoje é confiante e fez muitos amigos.",
        name: "João Santos",
        role: "Pai de aluno",
        avatar: "/assets/imagens/midia/smiling-middle-aged-man.png",
    },
    {
        quote:
            "Como voluntária, vejo diariamente o impacto positivo da dança na vida dessas crianças. É inspirador fazer parte dessa transformação.",
        name: "Ana Costa",
        role: "Voluntária",
        avatar: "/assets/imagens/midia/woman-volunteer-smiling-portrait.jpg",
    },
]

const faqData = [
    {
        question: "Como posso me tornar um aluno da Garatuja?",
        answer:
            "Para se tornar aluno, basta entrar em contato conosco através do e-mail contato@garatuja.org.br ou telefone (11) 1234-5678. Faremos uma entrevista inicial e você poderá começar nas próximas turmas disponíveis.",
    },
    {
        question: "As aulas são realmente gratuitas?",
        answer:
            "Sim! Todas as nossas aulas são 100% gratuitas. Além disso, fornecemos uniformes, materiais e, quando necessário, auxílio com transporte e alimentação.",
    },
    {
        question: "Qual a idade mínima para participar?",
        answer:
            "Aceitamos crianças a partir de 6 anos de idade. Temos turmas divididas por faixa etária para melhor aproveitamento das aulas.",
    },
    {
        question: "Como posso ajudar como voluntário?",
        answer:
            "Estamos sempre em busca de voluntários! Entre em contato conosco para conhecer as oportunidades disponíveis, desde instrutores de dança até apoio administrativo e eventos.",
    },
    {
        question: "Minha doação é dedutível do Imposto de Renda?",
        answer:
            "Sim! Somos uma organização certificada e suas doações podem ser deduzidas do Imposto de Renda conforme a legislação vigente. Fornecemos todos os comprovantes necessários.",
    },
    {
        question: "Onde ficam localizadas as aulas?",
        answer:
            "Temos pontos de aula em diversas comunidades de São Paulo. Entre em contato para saber qual o ponto mais próximo de você.",
    },
]

// Load Projects
function loadProjects() {
    const projectsGrid = document.getElementById("projectsGrid")
    projectsGrid.innerHTML = projectsData
        .map(
            (project) => `
        <div class="project-card">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <span class="project-date">${project.date}</span>
            </div>
        </div>
    `,
        )
        .join("")
}

// Testimonials Carousel
let currentTestimonial = 0

function loadTestimonials() {
    const track = document.getElementById("testimonialsTrack")
    const dotsContainer = document.getElementById("testimonialDots")

    track.innerHTML = testimonialsData
        .map(
            (testimonial) => `
        <div class="testimonial-card">
            <p class="testimonial-quote">"${testimonial.quote}"</p>
            <div class="testimonial-author">
                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
                <div>
                    <div class="testimonial-name">${testimonial.name}</div>
                    <div class="testimonial-role">${testimonial.role}</div>
                </div>
            </div>
        </div>
    `,
        )
        .join("")

    dotsContainer.innerHTML = testimonialsData
        .map(
            (_, index) => `
        <span class="dot ${index === 0 ? "active" : ""}" data-index="${index}"></span>
    `,
        )
        .join("")

    // Dot click handlers
    document.querySelectorAll(".dot").forEach((dot) => {
        dot.addEventListener("click", (e) => {
            currentTestimonial = Number.parseInt(e.target.dataset.index)
            updateTestimonialCarousel()
        })
    })
}

function updateTestimonialCarousel() {
    const track = document.getElementById("testimonialsTrack")
    track.style.transform = `translateX(-${currentTestimonial * 100}%)`

    document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentTestimonial)
    })
}

// Load FAQ
function loadFAQ() {
    const faqList = document.getElementById("faqList")
    faqList.innerHTML = faqData
        .map(
            (item, index) => `
        <div class="faq-item" data-index="${index}">
            <button class="faq-question">
                ${item.question}
                <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div class="faq-answer">
                <div class="faq-answer-content">${item.answer}</div>
            </div>
        </div>
    `,
        )
        .join("")

    // FAQ toggle handlers
    document.querySelectorAll(".faq-question").forEach((question) => {
        question.addEventListener("click", (e) => {
            const faqItem = e.target.closest(".faq-item")
            const isActive = faqItem.classList.contains("active")

            // Close all FAQ items
            document.querySelectorAll(".faq-item").forEach((item) => {
                item.classList.remove("active")
            })

            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add("active")
            }
        })
    })
}

// Load Partners
function loadPartners() {
    const partnersGrid = document.getElementById("partnersGrid")

    let dadosParceiros = carregarDados('parceiros.json').then((resposta) => {
        return resposta;
    });

    dadosParceiros.then((resposta) => {
        partnersGrid.innerHTML = `
            ${resposta.map((parceiro) => `
                <div class="partner-logo">
                    <img src="/assets/imagens/midia/${parceiro.logo}" alt="${parceiro.name}">
                </div>
            `).join("")}
        `;
    });
}

//////////////////////////////////////// Companhia de dança

// Companhia Page Scripts

// Modal para Ficha Técnica
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