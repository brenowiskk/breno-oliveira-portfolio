# Portfólio — Breno Oliveira

Site estático em HTML, CSS e JavaScript puro. Não precisa de build nem de dependências.

## Estrutura

```
index.html          conteúdo e estrutura das seções
css/style.css       visual (cores, fontes e medidas no topo, em :root)
js/main.js          interações + CONFIG (WhatsApp, e-mail, redes sociais)
js/projetos.js      projetos conceito e segmentos em curadoria
assets/favicon.svg  ícone da aba
assets/img/         imagens (screenshots, fotos)
```

## Tarefas comuns

**Publicar um projeto conceito**
Abra `js/projetos.js`, copie o modelo comentado para dentro de `CONCEPT_PROJECTS` e preencha
nome, nicho, imagem, descrição, ano, tecnologias e link. O card aparece com o selo
"Concept Project" e o segmento correspondente sai da lista de "Próximos estudos".
A área comporta até 6 itens.

**Trocar a ilustração do projeto Samantha Vitale por screenshots reais**
1. Salve `assets/img/samantha-desktop.webp` (captura a 1440×900) e `assets/img/samantha-mobile.webp` (390×844).
2. No `index.html`, preencha `data-image` nas duas telas do projeto:
   `data-image="assets/img/samantha-desktop.webp"` e `data-image="assets/img/samantha-mobile.webp"`.
A imagem só é carregada quando a seção se aproxima da tela.

**WhatsApp, e-mail e redes**
Tudo em `CONFIG`, no início de `js/main.js`: número, mensagem que já chega escrita,
e-mail e links de Instagram, LinkedIn, Behance e GitHub. Campos vazios ficam ocultos.
Cada botão pode ter uma mensagem própria com `data-wa="texto"` no HTML.

**Cores e fontes**
Variáveis no início de `css/style.css`. A posição da luz do topo é controlada por
`--fx` e `--fy` na regra `.hero`.

**SEO**
Com o domínio no ar, descomente `canonical` e `og:image` no `<head>` do `index.html`.

## Publicação

Vercel, Netlify, GitHub Pages ou qualquer hospedagem de arquivos: envie a pasta inteira,
com o `index.html` na raiz.

## Desempenho e acessibilidade

- A fita animada do topo é feita só com CSS (três camadas em roxo, azul royal e
  prata, com velocidades diferentes). Não usa canvas, WebGL, imagem nem biblioteca,
  então funciona em qualquer navegador e não depende da GPU.
- Cores, tamanho e inclinação ficam no bloco "Fundo animado do hero", em css/style.css
  (a variável --silk-rot controla a inclinação; há um valor próprio para o celular).
- Para quem ativa "reduzir movimento" no sistema, a fita aparece parada.
- Navegação por teclado, foco visível, menu com Esc e textos alternativos nas imagens.
