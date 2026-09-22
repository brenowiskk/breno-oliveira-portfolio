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
    email: 'brenoosantos2002@gmail.com',
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
     Hero: fita roxa em movimento (WebGL)
     Renderiza em resolução reduzida, pausa fora da tela ou com a
     aba oculta, roda a 30 fps no celular e fica estática para
     quem prefere menos movimento. Sem WebGL, o gradiente em CSS
     (.hero__fallback) continua no lugar.
     ----------------------------------------------------------- */
  const HERO_FRAG = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    uniform vec2 u_res;
    uniform float u_time;
    uniform vec2 u_mouse;

    const vec3 PAPER = vec3(0.972, 0.969, 0.958);
    const vec3 DEEP  = vec3(0.337, 0.055, 0.796);
    const vec3 VIO   = vec3(0.435, 0.145, 0.980);
    const vec3 MAG   = vec3(0.910, 0.240, 0.620);
    const vec3 LIL   = vec3(0.785, 0.640, 1.000);
    const vec3 WHITE = vec3(1.000, 0.995, 1.000);

    float gauss(float x, float k) { return exp(-x * x * k); }

    void main() {
      vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
      float aspect = u_res.x / u_res.y;
      float t = u_time * 0.82;

      // Movimento global bem visível: rotação + deriva suave.
      float ang = radians(36.0 + 12.0 * sin(t * 0.72) + 5.0 * sin(t * 1.31));
      float ca = cos(ang), sa = sin(ang);
      vec2 drift = vec2(
        0.055 * sin(t * 0.53) + u_mouse.x * 0.025,
        0.038 * cos(t * 0.47) - u_mouse.y * 0.020
      );
      vec2 q = p - drift;
      float u = ca * q.x + sa * q.y;
      float v = -sa * q.x + ca * q.y;

      // Comprimento da fita. Fica contida no centro, como na referência.
      float halfLen = mix(0.74, 1.02, smoothstep(1.0, 1.8, aspect));
      float edge = 1.0 - smoothstep(halfLen * 0.78, halfLen, abs(u));

      // Linha central sinuosa que se transforma continuamente.
      float wave =
          0.075 * sin(u * 3.4 - t * 1.40)
        + 0.032 * sin(u * 7.2 + t * 1.05)
        + 0.015 * sin(u * 13.0 - t * 0.78);
      float center = wave * edge;
      float d = v - center;

      // Largura fina e variável: abre e fecha em seções diferentes.
      float pulse = 0.5 + 0.5 * sin(u * 4.2 + t * 1.32);
      float pulse2 = 0.5 + 0.5 * sin(u * 2.1 - t * 0.92 + 1.7);
      float baseW = mix(0.085, 0.165, pulse) * mix(0.72, 1.15, pulse2) * edge;

      // Twist: duas faces trocam de dominância e simulam dobra de tecido.
      float twist = sin(u * 4.9 - t * 1.58 + 0.9 * sin(t * 0.7));
      float side = step(0.0, d);
      float faceMul = mix(0.58 + 0.42 * smoothstep(-1.0, 0.7, twist),
                          0.58 + 0.42 * smoothstep(1.0, -0.7, twist), side);
      float width = max(0.005, baseW * faceMul);
      float x = abs(d) / width;

      float body = gauss(x, 3.6) * edge;
      float core = gauss(x, 16.0) * edge;
      float halo = gauss(abs(d) / (baseW * 2.1 + 0.02), 1.25) * edge;
      float haloWide = gauss(abs(d) / (baseW * 4.0 + 0.035), 1.0) * edge;

      // Manchas de cor deslocadas, também animadas.
      float blobA = gauss((d - 0.095 * sin(u * 2.3 + t * 0.95)) / (baseW * 2.4 + 0.03), 1.25) * edge;
      float blobB = gauss((d + 0.090 * cos(u * 1.9 - t * 0.82)) / (baseW * 2.8 + 0.03), 1.20) * edge;

      float along = clamp(0.5 + 0.5 * u / halfLen, 0.0, 1.0);
      vec3 cA = mix(MAG, VIO, smoothstep(0.10, 0.68, along));
      vec3 cB = mix(DEEP, LIL, smoothstep(0.20, 0.92, along));
      vec3 face = mix(cB, cA, side);

      // Luz no bordo e vinco central escuro deixam a fita mais tridimensional.
      face = mix(face, WHITE, smoothstep(0.35, 1.0, x) * 0.42);
      float fold = gauss(d / (0.008 + 0.010 * edge), 2.5) * edge;
      face = mix(face, DEEP, fold * (0.48 + 0.20 * sin(u * 6.0 - t * 1.1)));

      vec3 col = PAPER;
      col = mix(col, MAG, clamp(blobA * 0.18, 0.0, 0.18));
      col = mix(col, LIL, clamp(blobB * 0.20, 0.0, 0.20));
      col = mix(col, VIO, clamp(haloWide * 0.10, 0.0, 0.10));
      col = mix(col, mix(MAG, VIO, 0.55), clamp(halo * 0.24, 0.0, 0.24));
      col = mix(col, face, clamp(body * 0.97, 0.0, 0.97));
      col = mix(col, WHITE, clamp(core * 0.08, 0.0, 0.08));

      // Grão mínimo para evitar aparência chapada.
      float n = fract(sin(dot(gl_FragCoord.xy + t * 17.0, vec2(12.9898, 78.233))) * 43758.5453);
      col += (n - 0.5) * 0.006;

      gl_FragColor = vec4(col, 1.0);
    }
  `;
  function setupHeroLight() {
    const hero = $('[data-hero]');
    const canvas = $('[data-hero-canvas]');
    if (!hero || !canvas) return;

    let gl = null;
    try {
      gl = canvas.getContext('webgl', {
        alpha: false, antialias: false, depth: false, stencil: false,
        premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: 'low-power'
      });
    } catch (_) { gl = null; }
    if (!gl) return;

    const compile = (type, src) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('[portfolio] shader:', gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}');
    const fs = compile(gl.FRAGMENT_SHADER, HERO_FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, 'u_res'),
      time: gl.getUniformLocation(program, 'u_time'),
      mouse: gl.getUniformLocation(program, 'u_mouse')
    };

    const s = {
      w: 1, h: 1,
      t: 3, last: 0, raf: 0,
      running: false, visible: true, small: false,
      mx: 0, my: 0, tx: 0, ty: 0
    };

    const draw = () => {
      gl.uniform2f(u.res, s.w, s.h);
      gl.uniform1f(u.time, s.t);
      gl.uniform2f(u.mouse, s.mx, s.my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      s.small = cssW < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let scale = dpr * (s.small ? 0.58 : 0.72);
      const maxPixels = s.small ? 300000 : 1050000;
      if (cssW * cssH * scale * scale > maxPixels) scale = Math.sqrt(maxPixels / (cssW * cssH));
      const w = Math.max(1, Math.round(cssW * scale));
      const h = Math.max(1, Math.round(cssH * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      s.w = w; s.h = h;
      gl.viewport(0, 0, w, h);
      if (!s.running) draw();
    };

    const frame = (now) => {
      s.raf = requestAnimationFrame(frame);
      const dt = now - s.last;
      if (s.small && dt < 1000 / 31) return; // 30 fps no celular
      s.last = now;
      s.t += Math.min(dt, 64) / 1000;
      s.mx += (s.tx - s.mx) * 0.05;
      s.my += (s.ty - s.my) * 0.05;
      draw();
    };

    const play = () => {
      if (s.running || reduceMotion.matches || !s.visible || document.hidden) return;
      s.running = true;
      s.last = performance.now();
      s.raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      s.running = false;
      cancelAnimationFrame(s.raf);
    };

    resize();
    draw();
    requestAnimationFrame(() => canvas.classList.add('is-ready'));

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize', resize);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        s.visible = entry.isIntersecting;
        if (s.visible) play(); else pause();
      }).observe(hero);
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else play(); });
    onMedia(reduceMotion, () => { if (reduceMotion.matches) pause(); else play(); });

    if (finePointer.matches) {
      window.addEventListener('pointermove', (e) => {
        s.tx = e.clientX / window.innerWidth - 0.5;
        s.ty = e.clientY / window.innerHeight - 0.5;
      }, { passive: true });
    }

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      pause();
      canvas.classList.remove('is-ready');
    });

    play();
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
  run(setupHeroLight);
  run(setupHeroScroll);
  run(setupReveal);
  window.__siteReady = true;
  run(setupImageSlots);
  run(setupForm);
  run(setupChannels);
  run(setupFloat);
  run(setupYear);
})();
