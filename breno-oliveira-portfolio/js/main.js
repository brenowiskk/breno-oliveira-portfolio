/* =============================================================
   Breno Oliveira — Portfólio | main.js
   JavaScript puro, sem dependências. Carregado com "defer".
   ============================================================= */
(() => {
  'use strict';

  /* -----------------------------------------------------------
     CONFIGURAÇÕES — edite aqui
     ----------------------------------------------------------- */
  const CONFIG = {
    whatsapp: {
      numero: '5511937007264',
      // Mensagem que já chega escrita no WhatsApp ('' abre a conversa sem texto)
      mensagem: 'Olá, Breno! Vi seu portfólio e quero conversar sobre um site.'
    },
    // Preencha para exibir no contato (deixe '' para ocultar)
    email: '',
    redes: {
      instagram: '', // ex.: 'https://www.instagram.com/seuperfil'
      linkedin: '',
      behance: '',
      github: ''
    }
  };

  /* -----------------------------------------------------------
     Utilidades
     ----------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const onMedia = (mq, fn) => (mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn));

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  const waUrl = (texto) => {
    const msg = typeof texto === 'string' ? texto : CONFIG.whatsapp.mensagem;
    return `https://wa.me/${CONFIG.whatsapp.numero}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
  };

  const run = (fn) => {
    try { return fn(); } catch (err) { console.warn('[portfolio]', err); return undefined; }
  };

  /* -----------------------------------------------------------
     Links de WhatsApp (data-wa="mensagem opcional")
     ----------------------------------------------------------- */
  function setupWhatsAppLinks() {
    $$('[data-wa]').forEach((link) => {
      const custom = link.getAttribute('data-wa');
      link.href = waUrl(custom || undefined);
      link.target = '_blank';
      link.rel = 'noopener';
    });
  }

  /* -----------------------------------------------------------
     Header: fundo ao rolar
     ----------------------------------------------------------- */
  function setupHeader() {
    const header = $('[data-header]');
    if (!header) return;
    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 16);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* -----------------------------------------------------------
     Menu do celular
     ----------------------------------------------------------- */
  function setupMenu() {
    const toggle = $('[data-menu-toggle]');
    const menu = $('[data-menu]');
    if (!toggle || !menu) return;
    const behind = [$('main'), $('footer'), $('[data-wa-float]')].filter(Boolean);
    const isOpen = () => root.classList.contains('menu-open');

    const setOpen = (open) => {
      root.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      menu.setAttribute('aria-hidden', String(!open));
      menu.inert = !open;
      behind.forEach((node) => { node.inert = open; });
    };

    setOpen(false);
    toggle.addEventListener('click', () => setOpen(!isOpen()));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) { setOpen(false); toggle.focus(); }
    });
    onMedia(window.matchMedia('(min-width: 961px)'), (e) => { if (e.matches) setOpen(false); });
  }

  /* -----------------------------------------------------------
     Menu ativo conforme a seção visível
     ----------------------------------------------------------- */
  function setupScrollSpy() {
    const links = $$('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;
    const sections = links
      .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
      .filter(Boolean);
    const setActive = (id) => links.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => io.observe(section));
  }

  /* -----------------------------------------------------------
     Revelação suave ao rolar
     ----------------------------------------------------------- */
  function setupReveal() {
    const hero = $('[data-hero]');
    // O hero entra em sequência logo no carregamento (os atrasos vêm do CSS)
    const items = $$('.reveal').filter((item) => {
      if (hero && hero.contains(item)) { requestAnimationFrame(() => item.classList.add('is-in')); return false; }
      return true;
    });
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    items.forEach((item) => io.observe(item));
  }

  /* -----------------------------------------------------------
     Título do hero: entrada palavra a palavra
     (preserva os trechos em serifa e sem serifa)
     ----------------------------------------------------------- */
  function setupTitle() {
    const title = $('[data-split]');
    if (!title) return null;
    let index = 0;

    const word = (text) => {
      const outer = el('span', 'w');
      const inner = el('span', 'w__i', text);
      inner.style.setProperty('--i', String(index++));
      outer.append(inner);
      return outer;
    };

    const split = (source, target) => {
      Array.from(source.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            target.append(/^\s+$/.test(part) ? document.createTextNode(' ') : word(part));
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const copy = node.cloneNode(false);
          split(node, copy);
          target.append(copy);
        }
      });
    };

    const frag = document.createDocumentFragment();
    split(title, frag);
    title.textContent = '';
    title.append(frag);

    title.classList.add('is-split');
    requestAnimationFrame(() => requestAnimationFrame(() => title.classList.add('is-in')));
    return title;
  }

  /* -----------------------------------------------------------
     Hero: leve parallax ao rolar
     ----------------------------------------------------------- */
  function setupHeroScroll() {
    const hero = $('[data-hero]');
    const inner = $('[data-hero-inner]');
    if (!hero || !inner || reduceMotion.matches) return;
    let ticking = false;
    let last = -1;
    const update = () => {
      ticking = false;
      const p = Math.min(Math.max(window.scrollY / (hero.offsetHeight || 1), 0), 1);
      if (p === last) return;
      last = p;
      inner.style.transform = p ? `translate3d(0, ${(p * 56).toFixed(1)}px, 0)` : '';
      inner.style.opacity = p ? Math.max(0, 1 - p * 1.3).toFixed(3) : '';
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  }

  /* -----------------------------------------------------------
     Projetos conceito (dados em js/projetos.js)
     ----------------------------------------------------------- */
  const EMBLEMS = {
    saude: '<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="9" opacity=".5"/><path d="M24 19v10M19 24h10"/><circle class="em-accent" cx="35" cy="13" r="2"/>',
    advocacia: '<path d="M10 17 24 9l14 8Z"/><path d="M14 21v14M20 21v14M28 21v14M34 21v14"/><path d="M9 38h30"/><circle class="em-accent" cx="24" cy="14" r="1.6"/>',
    arquitetura: '<path d="M12 38V24a12 12 0 0 1 24 0v14"/><path d="M18 38V25a6 6 0 0 1 12 0v13" opacity=".5"/><path d="M8 38h32"/><circle class="em-accent" cx="24" cy="8" r="1.6"/>',
    estetica: '<path d="M24 9c5 5 5 11 0 15-5-4-5-10 0-15Z"/><path d="M24 9c5 5 5 11 0 15-5-4-5-10 0-15Z" transform="rotate(120 24 25)"/><path d="M24 9c5 5 5 11 0 15-5-4-5-10 0-15Z" transform="rotate(240 24 25)"/><circle class="em-accent" cx="24" cy="25" r="2"/>',
    restaurantes: '<circle cx="24" cy="28" r="12"/><circle cx="24" cy="28" r="7" opacity=".5"/><path d="M19 8c0 2 2 2 2 4s-2 2-2 4M28 8c0 2 2 2 2 4s-2 2-2 4" opacity=".7"/><circle class="em-accent" cx="24" cy="28" r="1.6"/>',
    tecnologia: '<rect x="9" y="11" width="30" height="21" rx="3"/><path d="M18 38h12M24 32v6"/><path d="M16 19l3 3-3 3M22 25h8" opacity=".75"/><circle class="em-accent" cx="34" cy="16" r="1.4"/>',
    empresas: '<path d="M12 38V18h10v20M26 38V10h10v28"/><path d="M8 38h32"/><path d="M15 23h4M15 28h4M29 15h4M29 20h4M29 25h4" opacity=".6"/><circle class="em-accent" cx="31" cy="32" r="1.4"/>',
    premium: '<path d="M14 18l5-7h10l5 7-10 19Z"/><path d="M14 18h20M19 11l5 26 5-26" opacity=".55"/><circle class="em-accent" cx="37" cy="10" r="1.6"/>',
    liberais: '<circle cx="24" cy="17" r="6"/><path d="M12 38c0-7 5-12 12-12s12 5 12 12"/><circle class="em-accent" cx="35" cy="12" r="1.6"/>',
    padrao: '<circle cx="24" cy="24" r="10"/><path d="M24 8v32M8 24h32" opacity=".45"/><circle class="em-accent" cx="24" cy="24" r="2"/>'
  };
  const emblem = (key) => `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">${EMBLEMS[key] || EMBLEMS.padrao}</svg>`;

  const normalize = (str) => String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const joinPt = (list) => (list.length > 1 ? `${list.slice(0, -1).join(', ')} e ${list[list.length - 1]}` : list.join(''));

  function conceptCard(p, niches) {
    const card = el('article', 'concept-card reveal');
    const hasLink = Boolean(p.link);
    const media = el(hasLink ? 'a' : 'div', 'concept-card__media');
    if (hasLink) {
      media.href = p.link;
      media.target = '_blank';
      media.rel = 'noopener';
      media.setAttribute('aria-label', `${p.nome || 'Projeto conceito'} (abre em nova aba)`);
    }
    if (p.imagem) {
      const img = el('img');
      img.src = p.imagem;
      img.alt = p.nome ? `${p.nome}, projeto conceito${p.nicho ? ` para ${p.nicho}` : ''}` : '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 1600;
      img.height = 1200;
      media.append(img);
    } else {
      const match = niches.find((n) => (n.chaves || []).some((k) => normalize(p.nicho).includes(normalize(k))));
      media.classList.add('concept-card__media--art');
      media.insertAdjacentHTML('beforeend', emblem(match && match.icone));
    }
    if (hasLink) {
      const tag = el('span', 'view-tag', 'View Project ↗');
      tag.setAttribute('aria-hidden', 'true');
      media.append(tag);
    }

    const meta = el('p', 'concept-card__meta');
    meta.append(el('span', 'concept-card__badge', 'Concept Project'));
    if (p.nicho) meta.append(el('span', null, p.nicho));
    if (p.ano) meta.append(el('span', null, String(p.ano)));

    card.append(media, meta, el('h3', 'concept-card__title', p.nome || 'Projeto conceito'));
    if (p.descricao) card.append(el('p', 'concept-card__text', p.descricao));
    if (Array.isArray(p.tecnologias) && p.tecnologias.length) {
      const list = el('ul', 'concept-card__tech');
      list.setAttribute('aria-label', 'Tecnologias');
      p.tecnologias.forEach((tech) => list.append(el('li', null, tech)));
      card.append(list);
    }
    return card;
  }

  function studyItem(niche) {
    const item = el('li', 'study');
    const mark = el('span', 'study__mark');
    mark.setAttribute('aria-hidden', 'true');
    mark.innerHTML = emblem(niche.icone);
    const body = el('div');
    body.append(el('h4', 'study__name', niche.nome));
    if (niche.foco) body.append(el('p', 'study__focus', niche.foco));
    item.append(mark, body);
    return item;
  }

  function setupConcepts() {
    const grid = $('[data-concept-grid]');
    const list = $('[data-curation-list]');
    const curation = $('[data-curation]');
    const more = $('[data-curation-more]');
    if (!grid || !list) return;

    const LIMIT = 6;
    const projects = (Array.isArray(window.CONCEPT_PROJECTS) ? window.CONCEPT_PROJECTS : []).filter(Boolean).slice(0, LIMIT);
    const niches = Array.isArray(window.CONCEPT_NICHES) ? window.CONCEPT_NICHES : [];

    projects.forEach((p) => grid.append(conceptCard(p, niches)));

    const used = projects.map((p) => normalize(p.nicho));
    const open = niches.filter((n) => !used.some((u) => (n.chaves || []).some((k) => u.includes(normalize(k)))));
    const slots = LIMIT - projects.length;

    open.slice(0, slots).forEach((n) => list.append(studyItem(n)));
    const rest = open.slice(slots).map((n) => n.nome.toLowerCase());
    if (more) more.textContent = rest.length ? `Também em exploração: ${joinPt(rest)}.` : '';
    if (curation && !list.children.length) curation.hidden = true;
  }

  /* -----------------------------------------------------------
     Screenshots reais nas telas (data-image)
     ----------------------------------------------------------- */
  function setupImageSlots() {
    const slots = $$('[data-image]').filter((slot) => slot.getAttribute('data-image').trim());
    if (!slots.length) return;
    const load = (slot) => {
      const img = new Image();
      img.decoding = 'async';
      img.alt = slot.getAttribute('data-alt') || '';
      img.onload = () => { slot.append(img); slot.classList.add('has-image'); };
      img.src = slot.getAttribute('data-image').trim();
    };
    if (!('IntersectionObserver' in window)) { slots.forEach(load); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { load(entry.target); io.unobserve(entry.target); }
      });
    }, { rootMargin: '600px 0px' });
    slots.forEach((slot) => io.observe(slot));
  }

  /* -----------------------------------------------------------
     Formulário: monta a mensagem e abre no WhatsApp
     ----------------------------------------------------------- */
  function setupForm() {
    const form = $('[data-contact-form]');
    if (!form) return;
    const status = $('[data-form-status]', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = new FormData(form);
      const nome = String(data.get('nome') || '').trim();
      const email = String(data.get('email') || '').trim();
      const mensagem = String(data.get('mensagem') || '').trim();
      const texto = [`Olá, Breno! Meu nome é ${nome}.`, mensagem, email && `Meu e-mail: ${email}`]
        .filter(Boolean)
        .join('\n\n');
      const url = waUrl(texto);
      const win = window.open(url, '_blank');
      if (win) win.opener = null;
      else window.location.href = url;
      if (status) status.textContent = 'Mensagem pronta no WhatsApp. É só tocar em enviar.';
    });
  }

  /* -----------------------------------------------------------
     E-mail e redes sociais (CONFIG)
     ----------------------------------------------------------- */
  function setupChannels() {
    const emailItem = $('[data-email]');
    if (emailItem && CONFIG.email) {
      const link = $('a', emailItem);
      link.href = `mailto:${CONFIG.email}`;
      link.textContent = CONFIG.email;
      emailItem.hidden = false;
    }
    const social = $('[data-social]');
    if (!social) return;
    const nomes = { instagram: 'Instagram', linkedin: 'LinkedIn', behance: 'Behance', github: 'GitHub' };
    Object.entries(CONFIG.redes).forEach(([rede, url]) => {
      if (!url) return;
      const link = el('a', null, nomes[rede] || rede);
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      social.append(link);
    });
    social.hidden = !social.children.length;
  }

  /* -----------------------------------------------------------
     Botão fixo e ano no rodapé
     ----------------------------------------------------------- */
  function setupFloat() {
    const button = $('[data-wa-float]');
    if (!button) return;
    // Aparece depois de uma rolada curta, para não disputar com os botões do topo
    let shown = false;
    const check = () => {
      if (!shown && window.scrollY > window.innerHeight * 0.35) {
        shown = true;
        button.classList.add('is-visible');
        window.removeEventListener('scroll', check);
      }
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  function setupYear() {
    $$('[data-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });
  }

  /* -----------------------------------------------------------
     Início
     ----------------------------------------------------------- */
  run(setupWhatsAppLinks);
  run(setupConcepts);
  run(setupHeader);
  run(setupMenu);
  run(setupScrollSpy);
  run(setupTitle);
  run(setupHeroScroll);
  run(setupReveal);
  window.__siteReady = true;
  run(setupImageSlots);
  run(setupForm);
  run(setupChannels);
  run(setupFloat);
  run(setupYear);
})();
