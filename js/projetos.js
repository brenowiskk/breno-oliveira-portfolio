/* =============================================================
   PROJETOS CONCEITO — edite só este arquivo
   -------------------------------------------------------------
   Para publicar um projeto conceito, copie o modelo abaixo para
   dentro da lista CONCEPT_PROJECTS e preencha os campos.

   A área mostra até 6 itens. Os projetos publicados aparecem
   primeiro, com a imagem em destaque; os espaços restantes
   continuam como "Próximos estudos" (segmentos em curadoria).
   Quando um projeto tem o mesmo segmento de um estudo, esse
   estudo sai da lista automaticamente.

   Imagens: salve em assets/img/ (ideal 1600×1200, formato .webp).
   ============================================================= */

window.CONCEPT_PROJECTS = [
  /*
  {
    nome: 'Nome do projeto',
    nicho: 'Saúde e clínicas',
    imagem: 'assets/img/conceito-nome-do-projeto.webp',
    descricao: 'Breve descrição do conceito, em uma ou duas frases.',
    ano: '2026',
    tecnologias: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://...'
  },
  */
];

/* Segmentos exibidos como "Próximos estudos".
   A ordem da lista define a ordem na página.
   "chaves" são trechos usados para reconhecer o segmento no
   campo "nicho" de um projeto publicado (sem acento, minúsculo).
   "icone" usa um dos desenhos prontos: saude, advocacia,
   arquitetura, estetica, restaurantes, tecnologia, empresas,
   premium, liberais. */
window.CONCEPT_NICHES = [
  { icone: 'saude',        nome: 'Saúde e clínicas',       foco: 'Confiança e agendamento sem atrito',       chaves: ['saude', 'clinica', 'medic', 'odonto'] },
  { icone: 'advocacia',    nome: 'Advocacia',              foco: 'Autoridade com sobriedade',                chaves: ['advoca', 'juridic', 'direito'] },
  { icone: 'arquitetura',  nome: 'Arquitetura',            foco: 'Obras, processo e portfólio',              chaves: ['arquitet', 'interiores'] },
  { icone: 'estetica',     nome: 'Estética',               foco: 'Delicadeza e sofisticação',                chaves: ['estetic', 'beleza'] },
  { icone: 'restaurantes', nome: 'Restaurantes',           foco: 'Cardápio, ambiente e reservas',            chaves: ['restaurante', 'gastronom'] },
  { icone: 'tecnologia',   nome: 'Tecnologia',             foco: 'Produtos complexos explicados com clareza', chaves: ['tecnolog', 'software', 'saas', 'startup'] },
  { icone: 'empresas',     nome: 'Empresas',               foco: 'Institucional para equipes e serviços',    chaves: ['empresa', 'corporativ', 'industria'] },
  { icone: 'premium',      nome: 'Serviços premium',       foco: 'Exclusividade em cada detalhe',            chaves: ['premium', 'luxo', 'exclusiv'] },
  { icone: 'liberais',     nome: 'Profissionais liberais', foco: 'Presença pessoal e credibilidade',         chaves: ['liberal', 'consultor', 'autonom', 'psicolog', 'contab'] }
];
