// carregarTimeline.js
import { carregarDados } from "./_uso_geral.js";

let dadosTimeline = [];

// Carregar dados JSON
carregarDados('sobre_timeline.json').then(resposta => {
    dadosTimeline = resposta;
});

// ----------------- Renderizar timeline -----------------
export async function carregarTimeline() {

    const timeline = document.getElementById("timeline");

    if (!dadosTimeline || !Array.isArray(dadosTimeline)) {
        timeline.innerHTML = '<p>Erro ao carregar os dados da timeline.</p>';
        return;
    }

    timeline.innerHTML = dadosTimeline.map((item, idx) => `
        <div class="timeline-year" data-id="${item.id}" data-idx="${idx}">
            <div class="year-dot" role="button" tabindex="0" aria-label="Ano ${item.ano}">
                ${item.ano}
            </div>
            <div class="timeline-card" tabindex="0" data-idx="${idx}">
                <img src="${item.capa}" alt="Imagem de ${item.ano}">
                <h3>${item.titulo}</h3>
                <p>${item.breveDescricao}</p>
            </div>
            <template class="timeline-detail-template">
                <h2>${item.titulo}</h2>
                <h4>${item.ano}</h4>
                <p>${item.texto || item.breveDescricao || ''}</p>
                <div class="gallery">
                    ${item.imagens.map(src => `
                        <div class="gallery-item"><img src="${src}" alt="${item.titulo}"></div>
                    `).join('')}
                </div>
            </template>
        </div>
    `).join("");
}

// ----------------- Variáveis Globais -----------------
let rafId = null;
let autoRunning = true;
let autoScrollSpeed = 0.6;
let isPointerDown = false;
let modalOpen = false;
let currentImageIndex = 0;
let galleryIntervalId = null;

const scrollContainer = document.querySelector('.timeline-scroll');
const timelineLine = document.querySelector('.timeline-line');
const tl_viewport = document.querySelector('.timeline-track');

// ----------------- Inicialização das Interações -----------------
export function initTimelineInteractions() {

    function updateTimelineLine() {
        if (!tl_viewport || !timelineLine) return;
        const trackWidth = tl_viewport.scrollWidth || 0;
        timelineLine.style.width = `${trackWidth}px`;
    }

    setTimeout(updateTimelineLine, 50);
    window.addEventListener('load', updateTimelineLine);
    window.addEventListener('resize', updateTimelineLine);

    // ---------- Drag/Swipe ----------
    let startX = 0;
    let scrollLeftStart = 0;
    let isDragging = false;
    const dragThreshold = 5;

    if (scrollContainer) {
        scrollContainer.addEventListener('pointerdown', e => {
            if (e.button && e.button !== 0) return;
            startX = e.clientX;
            scrollLeftStart = scrollContainer.scrollLeft;
            isDragging = false;
            scrollContainer.classList.add('grabbing');
        });

        scrollContainer.addEventListener('pointermove', e => {
            if (startX === null) return;
            const walk = (e.clientX - startX) * 1.5;
            if (Math.abs(walk) > dragThreshold) {
                isDragging = true;
                scrollContainer.scrollLeft = scrollLeftStart - walk;
            }
        });

        scrollContainer.addEventListener('pointerdown', e => {

            // Se clicou em algo clicável, NÃO iniciar drag
            if (e.target.closest('.guide-year-dot, .timeline-card, .timeline-year')) {
                isDragging = false;
                return;
            }

            startX = e.clientX;
            scrollLeftStart = scrollContainer.scrollLeft;
            isDragging = false;
            scrollContainer.classList.add('grabbing');
        });


        scrollContainer.addEventListener('pointerup', e => {
            scrollContainer.classList.remove('grabbing');
            startX = null;
        });

        scrollContainer.addEventListener('pointerleave', e => {
            scrollContainer.classList.remove('grabbing');
            startX = null;
        });

        scrollContainer.addEventListener('pointercancel', e => {
            scrollContainer.classList.remove('grabbing');
            startX = null;
        });

        scrollContainer.addEventListener('click', e => {
            if (isDragging) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        });

        scrollContainer.addEventListener('mouseenter', () => { if (!modalOpen) stopAutoScroll(); });
        scrollContainer.addEventListener('mouseleave', () => { if (!modalOpen) startAutoScroll(); });
    }

    // ---------- Centralizar no scroll ----------
    function centralizarNoScroll(el, instant = false) {
        if (!el || !scrollContainer) return;

        const containerWidth = scrollContainer.clientWidth;
        const elLeft = el.offsetLeft;
        const elWidth = el.offsetWidth;

        const target = elLeft - (containerWidth / 2) + (elWidth / 2);
        const maxScroll = scrollContainer.scrollWidth - containerWidth;
        const final = Math.max(0, Math.min(target, maxScroll));

        const prevBehavior = scrollContainer.style.scrollBehavior;
        scrollContainer.style.scrollBehavior = instant ? 'auto' : 'smooth';
        scrollContainer.scrollTo({ left: final });
        scrollContainer.style.scrollBehavior = prevBehavior;
    }

    // ---------- Bind Dots e Cards ----------
    function bindYearEvents() {
        if (typeof dadosTimeline === 'undefined' || !dadosTimeline.length) return;

        const years = dadosTimeline.map(el => document.querySelector(`.timeline-year[data-id="${el.id}"]`));
        years.forEach((yearEl, idx) => {
            if (!yearEl) return;
            const dot = yearEl.querySelector('.year-dot');
            const card = yearEl.querySelector('.timeline-card');

            const abrir = () => {
                centralizarNoScroll(yearEl);
                abrirModalFromTemplate(idx);
            };

            if (dot) {
                dot.removeEventListener('click', dot._tlClick);
                dot._tlClick = abrir;
                dot.addEventListener('click', dot._tlClick);
                dot.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });
            }

            if (card) {
                card.removeEventListener('click', card._tlClick);
                card._tlClick = abrir;
                card.addEventListener('click', card._tlClick);
                card.addEventListener('keydown', e => { if (e.key === 'Enter') abrir(); });
            }
        });
    }

    bindYearEvents();
    startAutoScroll();

    return { startAutoScroll, stopAutoScroll, bindYearEvents, centralizarNoScroll };
}

// ----------------- Modal e Carrossel -----------------
export function abrirModalFromTemplate(idxDoItem) {
    if (typeof dadosTimeline === 'undefined' || !dadosTimeline.length) return;

    modalOpen = true;
    const timeline_modal = document.querySelector('.tl-modal');
    if (!timeline_modal) return;

    timeline_modal.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const dadoAtual = dadosTimeline[idxDoItem];
    const m = timeline_modal;

    m.querySelector('.tl-title').textContent = dadoAtual.titulo;
    m.querySelector('.tl-subtitle').textContent = dadoAtual.breveDescricao;
    m.querySelector('.tl-body').innerHTML = dadoAtual.texto || 'Sem texto disponível';

    const track = m.querySelector('.tl-gallery-viewport');
    if (track) {
        atualizarGalleryUI(dadoAtual, 0);
    }

    const dotsContainer = m.querySelector('.tl-gallery-dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = dadoAtual.imagens.map((_, i) =>
            `<button class="tl-dot" data-index="${i}" aria-label="Ir para imagem ${i + 1}"></button>`
        ).join('');

        dotsContainer.querySelectorAll('.tl-dot').forEach(dot => {
            dot.onclick = (e) => {
                const index = parseInt(e.target.dataset.index, 10);
                if (index !== currentImageIndex) {
                    currentImageIndex = index;
                    atualizarGalleryUI(dadoAtual, currentImageIndex);
                }
            };
        });
    }

    // Limpa interval antigo
    if (galleryIntervalId) clearInterval(galleryIntervalId);
    galleryIntervalId = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % dadoAtual.imagens.length;
        atualizarGalleryUI(dadoAtual, currentImageIndex);
    }, 5000);

    // Botões prev/next
    const prevButton = m.querySelector('.tl-prev');
    const nextButton = m.querySelector('.tl-next');

    if (prevButton) prevButton.onclick = () => {
        currentImageIndex = Math.max(0, currentImageIndex - 1);
        atualizarGalleryUI(dadoAtual, currentImageIndex);
    };
    if (nextButton) nextButton.onclick = () => {
        currentImageIndex = Math.min(dadoAtual.imagens.length - 1, currentImageIndex + 1);
        atualizarGalleryUI(dadoAtual, currentImageIndex);
    };

    atualizarGalleryUI(dadoAtual, idxDoItem);
    stopAutoScroll();
}

export function fecharModal() {
    const modal = document.querySelector('.tl-modal');
    if (modal) modal.classList.remove('open');

    modalOpen = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // Limpa interval do carrossel
    if (galleryIntervalId) clearInterval(galleryIntervalId);
    galleryIntervalId = null;

    startAutoScroll();
}

function atualizarGalleryUI(dadoAtual, imagemIdx) {

    const m = document.querySelector('.tl-modal');
    if (!m) return;

    const track = m.querySelector('.tl-gallery-viewport');
    if (!track) return;

    const imagens = dadoAtual.imagens;
    const total = imagens.length;

    // Garantir que a imagem existe dentro do track
    let img = track.querySelector('img');
    if (!img) {
        img = document.createElement('img');
        track.appendChild(img);
    }

    // Troca somente o src
    img.src = imagens[imagemIdx];

    // Atualiza os dots
    const dots = m.querySelectorAll('.tl-dot');
    if (dots[imagemIdx]) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[imagemIdx].classList.add('active');
    }

    // Botões
    const prevButton = m.querySelector('.tl-prev');
    const nextButton = m.querySelector('.tl-next');

    if (prevButton) prevButton.style.display = imagemIdx === 0 ? 'none' : '';
    if (nextButton) nextButton.style.display = imagemIdx === total - 1 ? 'none' : '';
}

// ----------------- Auto Scroll Timeline -----------------
function autoStep() {
    if (!scrollContainer) {
        rafId = requestAnimationFrame(autoStep);
        return;
    }
    if (!autoRunning || isPointerDown || modalOpen) {
        rafId = requestAnimationFrame(autoStep);
        return;
    }

    scrollContainer.style.scrollBehavior = 'auto';
    scrollContainer.scrollLeft += autoScrollSpeed;

    if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 2) {
        scrollContainer.scrollLeft = 0;
    }

    rafId = requestAnimationFrame(autoStep);
}

function startAutoScroll() {
    if (!scrollContainer) return;
    if (autoRunning && rafId) return;
    autoRunning = true;
    if (!rafId) rafId = requestAnimationFrame(autoStep);
}

function stopAutoScroll() {
    autoRunning = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
}

// ----------------- Auto Init -----------------
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.tl-gallery-viewport') && document.querySelectorAll('.timeline-year').length) {
        try { initTimelineInteractions(); } catch (e) { console.error("Erro na inicialização:", e); }
    }
});

// ------------- Função que fecha o modal
const btn_fechar_modal = document.querySelector('.tl-modal .tl-close');
btn_fechar_modal.addEventListener('click', () => fecharModal());