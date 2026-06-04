/* i18n.js — translations for UI chrome (TX) + TRIP_PT data overlay
   t(key, lang, ...args) — UI string lookup
   localizeTrip(trip, lang) — returns localized copy of the trip data */

/* ========================================================================
   UI Chrome — TX
   Values can be:  string (same in both)  |  { en, pt }  |  function(lang, ...args)
   ======================================================================== */
const TX = {
  /* summary */
  duration:      { en: "Duration",     pt: "Duração" },
  travelers:     { en: "Travelers",    pt: "Viajantes" },
  hotelPaid:     { en: "Hotel paid",   pt: "Hotel pago" },
  estSpend:      { en: "Est. spend",   pt: "Gasto est." },
  daysNights:    { en: (d) => `${d} days · 2 nights`,   pt: (d) => `${d} dias · 2 noites` },

  /* day nav */
  day:           { en: "Day",          pt: "Dia" },
  stops:         { en: (n) => `${n} stop${n !== 1 ? 's' : ''}`, pt: (n) => `${n} parada${n !== 1 ? 's' : ''}` },

  /* card chrome */
  viewDetails:   { en: "View details", pt: "Ver detalhes" },
  hideDetails:   { en: "Hide details", pt: "Ocultar detalhes" },
  mandatory:     { en: "Mandatory",    pt: "Obrigatório" },

  /* section labels (expanded panel) */
  practicalInfo: { en: "Practical info",      pt: "Info prática" },
  bestTime:      { en: "Best time",           pt: "Melhor hora" },
  whatToBring:   { en: "What to bring",       pt: "O que levar" },
  notesLabel:    { en: "Notes",               pt: "Dicas" },
  whyItFits:     { en: "Why it fits here",    pt: "Por que agora" },
  whatToOrder:   { en: "What to order",       pt: "O que pedir" },
  locationLabel: { en: "Location",            pt: "Localização" },
  nearbyLabel:   { en: "Nearby",              pt: "Por perto" },

  /* detail keys */
  detHours:      { en: "Hours",               pt: "Horário" },
  detPrice:      { en: "Price",               pt: "Preço" },
  detParking:    { en: "Parking",             pt: "Estacionamento" },
  detAccess:     { en: "Access",              pt: "Acesso" },
  detBaby:       { en: "With a baby",         pt: "Com bebê" },

  /* map chip */
  directions:    { en: "Directions",          pt: "Rotas" },

  /* badge labels */
  badge_baby:         { en: "Baby friendly",  pt: "Baby friendly" },
  badge_parking:      { en: "Parking",        pt: "Estacionamento" },
  badge_restroom:     { en: "Restroom",       pt: "Banheiro" },
  badge_highchair:    { en: "High chair",     pt: "Cadeirão" },
  badge_wifi:         { en: "Wi-Fi",          pt: "Wi-Fi" },
  badge_accessible:   { en: "Accessible",     pt: "Acessível" },
  badge_stroller:     { en: "Stroller OK",    pt: "Carrinho OK" },
  "badge_stroller-no":{ en: "No stroller",   pt: "Sem carrinho" },
  badge_easy:         { en: "Easy access",    pt: "Fácil acesso" },
  badge_cold:         { en: "Cold / windy",   pt: "Frio / ventoso" },
  badge_strollerNo:   { en: "No stroller",    pt: "Sem carrinho" },

  /* category names */
  cat_Stay:      { en: "Stay",        pt: "Hospedagem" },
  cat_Nature:    { en: "Nature",      pt: "Natureza" },
  cat_Food:      { en: "Food",        pt: "Refeição" },
  "cat_Café":    { en: "Café",        pt: "Café" },
  cat_Viewpoint: { en: "Viewpoint",   pt: "Mirante" },
  cat_Leisure:   { en: "Leisure",     pt: "Lazer" },

  /* baby rhythm */
  babyRhythm:    { en: "Baby's daily rhythm",           pt: "Rotina diária do bebê" },
  babyRhythmSub: { en: "The backbone every day is built on", pt: "A espinha dorsal de cada dia" },

  /* budget */
  money:         { en: "Money",       pt: "Dinheiro" },
  tripBudget:    { en: "Trip budget", pt: "Orçamento da viagem" },
  budgetSub:     { en: "Estimated, end to end. Lodging is already paid; everything else is a range.", pt: "Estimativa completa. A hospedagem já está paga; o restante são faixas." },
  totalEstimate: { en: "Total estimate", pt: "Total estimado" },
  budgetNote:    { en: (cur, paid) => `Lodging ${cur} ${paid} already paid · ranges leave room for the day.`, pt: (cur, paid) => `Hospedagem ${cur} ${paid} já paga · as faixas deixam margem para o dia.` },
  paid:          { en: "Paid",        pt: "Pago" },

  /* tips */
  beforeYouGo:   { en: "Before you go",       pt: "Antes de ir" },
  knowBeforeYouGo:{ en: "Know before you go", pt: "Saiba antes de ir" },
  tipsSub:       { en: "The non-negotiables for a cold-weather trip with a baby.", pt: "O indispensável para uma viagem com frio e bebê." },

  /* skipped */
  honestCuts:    { en: "Honest cuts",          pt: "Cortes honestos" },
  notOnThisTrip: { en: "Not on this trip",     pt: "Não nessa viagem" },
  skippedSub:    { en: "Worthwhile places that don't fit a baby's pace this time.", pt: "Lugares incríveis que não cabem no ritmo de bebê desta vez." },
  showFewer:     { en: "Show fewer",           pt: "Mostrar menos" },
  showAll:       { en: (n) => `Show all ${n}`, pt: (n) => `Mostrar todos os ${n}` },

  /* footer */
  haveWonderful: { en: "Have a wonderful trip.", pt: "Boa viagem." },

  /* tweaks */
  tlLayout:      { en: "Timeline layout",      pt: "Estilo do timeline" },
  styleLabel:    { en: "Style",                pt: "Estilo" },
  themeLabel:    { en: "Theme",                pt: "Tema" },
  accentLabel:   { en: "Accent",               pt: "Cor de destaque" },
  darkMode:      { en: "Dark mode",            pt: "Modo escuro" },
  entranceAnim:  { en: "Entrance animation",   pt: "Animação de entrada" },
  languageLabel: { en: "Language",             pt: "Idioma" },
};

/* ========================================================================
   t() — look up a UI chrome key
   ======================================================================== */
function t(key, lang, ...args) {
  const entry = TX[key];
  if (!entry) return key;
  const val = (typeof entry === 'object' && !Array.isArray(entry) && ('en' in entry || 'pt' in entry))
    ? (entry[lang] || entry.en || key)
    : entry;
  if (typeof val === 'function') return val(...args);
  return val || key;
}

/* ========================================================================
   TRIP_PT — Portuguese data overlay (mirrors TRIP structure; only text fields)
   Merged on top of TRIP when lang === 'pt'
   ======================================================================== */
const TRIP_PT = {
  tagline: "Três dias na Serra Catarinense — coreografados em torno da rotina do bebê.",
  dates:     { label: "4 – 6 de jun de 2026" },
  travelers: { label: "2 adultos · 1 bebê" },
  weather:   { note: "Geada à noite · vento cortante nas alturas" },
  hero: { alt: "Pedra Furada · Morro da Igreja 1.827 m" },

  babyRoutine: {
    rule: "Ambos os adultos devem estar de volta ao hotel com 20–30 min de antecedência antes de cada soneca. Cada restaurante foi escolhido por estar a menos de 600 m do hotel. Leve sempre comida de emergência (bolacha, fruta, mamadeira extra) na bolsa. Nunca aposte numa única opção sem plano B.",
    blocks: [
      { label: "Acordar" },
      { label: "Janela ativa",  note: "Alimentação · contato · preparação" },
      { label: "Soneca 1",      note: "Dia 1: em casa. Dias 2 e 3: hotel." },
      { label: "Janela ativa",  note: "Passeios da manhã" },
      { label: "Soneca 2",      note: "Dia 2: hotel. Dias 1 e 3: carro em movimento." },
      { label: "Janela ativa",  note: "Passeios da tarde" },
      { label: "Hora de dormir",note: "Hotel — inegociável" },
    ]
  },

  days: [
    { label: "Viagem e chegada", activities: [
      { title: "Soneca 1 · em casa", note: "Bebê dorme em casa. Use essa janela para carregar o carro, instalar a cadeirinha e estar na porta às 9h. Não acorde — transfira com cuidado para a cadeirinha." },
      { title: "Partida · início da viagem", note: "O bebê pode terminar a soneca 1 no carro. Janela ativa começa ~9h30. Estimule de forma simples: conversa suave, música, brinquedos presos. Evite paradas longas." },
      { title: "Lanche na estrada", note: "Parada rápida — posto, padaria ou comida de casa. Máximo 15–20 min. Um adulto abastece e usa o banheiro; o outro alimenta o bebê no banco traseiro. Em movimento antes do meio-dia." },
      { title: "Soneca 2 · carro em movimento", note: "Mantenha o carro em movimento. A maioria dos bebês adormece com o balanço. Não pare — planeje abastecimento antes do meio-dia. Se o bebê ainda estiver dormindo às 14h, dê uma volta pela região ou estacione com aquecimento ligado." },
      { title: "Check-in no hotel", description: "Check-in a partir das 14h. Um adulto cuida da burocracia enquanto o outro fica com o bebê no carro (pode estar terminando a soneca). Peça que o berço já esteja montado — confirme antes de chegar.", details: { hours: "Check-in a partir das 14h · check-out 9h30", ticket: "R$ 1.200 — 2 diárias (já pago)", parking: "Estacionamento gratuito no local", accessibility: "Quarto no térreo disponível", babyFriendly: "Confirme o berço montado antes de chegar. Compatível com aquecedor de mamadeira e monitora de áudio.", bring: ["Agasalhos", "Lençol do berço", "Monitora de áudio"], tips: ["Peça a cabana mais próxima do lodge — menor caminhada com bebê e bagagem.", "Confirme a montagem do berço por telefone um dia antes."] }, costNote: "Pré-pago" },
      { title: "Bebê adapta ao quarto", note: "Deixe o bebê explorar o novo espaço no colo ou no chão com segurança. 15–20 min de adaptação antes de qualquer passeio reduzem a irritabilidade em ambiente desconhecido." },
      { title: "Gruta N. Sra. de Lourdes", description: "Uma gruta tranquila e abrigada, atrás de uma cortina d'água. Temperatura interna estável contra o vento de junho — um dos pontos mais confortáveis de Urubici para um bebê. Caminhada curta e plana.", whyHere: "O Dia 1 é dia de viagem — todos estão cansados. A Gruta tem o menor esforço e maior conforto: abrigada, calma, sem caminhada longa. Pule completamente se o bebê ou os adultos estiverem exaustos.", details: { hours: "Acesso diurno", ticket: "Gratuito", parking: "Estacionamento pequeno na entrada", accessibility: "Caminhada curta e plana · sem degraus", babyFriendly: "Abrigada do vento · temperatura estável · ambiente calmo", bring: ["Porta-bebê", "Manta leve"], bestTime: "Luz da tarde na cachoeira", tips: ["Opcional — pule se estiver cansado. Pode ser transferido para a tarde do Dia 2 sem impacto no roteiro."] } },
      { title: "Hora de dormir · rotina noturna", note: "Bebê dorme às 17h30. Após a rotina: um adulto vai à Artesabana (5 min a pé) enquanto o outro fica com a monitora de áudio. A comida chega em 15 min." },
      { title: "Jantar · Artesabana Urubici", description: "Após o bebê adormecer, um adulto caminha 5 min até a Artesabana e busca o jantar. Serviço rápido — pedido e retirada em 10–15 min. Perfeito para a primeira noite após um longo dia de viagem.", whyHere: "Com bedtime às 17h30, jantar em restaurante é inviável. A Artesabana é a resposta: rápida, perto e a comida viaja bem. O ambiente turquesa é acolhedor e os caldos são exatamente o que você precisa numa noite de junho.", whatToOrder: ["Caldos quentes", "Arepa de Pernil com Banana da Terra", "Hambúrguer Tradicional"], logistics: "Bebê dormindo às 17h30. Um adulto sai ~18h–18h15. Pede na chegada, retira em 10–15 min. De volta ao hotel às 18h30 com o jantar pronto.", costNote: "R$ 40–80 / casal · para viagem", distance: "~300–600 m · 5 min a pé", details: { hours: "Confirme horário antes de ir", ticket: "R$ 20–40 por pessoa", parking: "Estacionamento na rua", accessibility: "Sem degraus, fácil de entrar e sair", babyFriendly: "Para viagem — bebê fica dormindo no hotel", bring: ["Sacola para os recipientes"], tips: ["Os caldos esquentam bem mesmo com a caminhada de volta.", "Confirme pedido para viagem ao ligar."] } }
    ]},
    { label: "O dia principal", activities: [
      { title: "Café Colonial · no hotel", description: "Um café farto — pães artesanais, geleias de frutas serranas (pinhão, amora, goiabada), embutidos, queijos, cucas, chá de ervas e chocolate quente. Servido à mesa, sem sair do hotel.", whyHere: "O Dia 2 é o mais puxado fisicamente. Um café calórico abastece os dois adultos sem parada extra. Confirme o upgrade com a pousada na noite anterior e peça o horário das 6h.", logistics: "Confirme com a pousada: 'Café colonial às 6h, para dois adultos.' Termine antes das 7h30 para a soneca 1 às 8h.", whatToOrder: ["Mesa farta de pães e cucas", "Geleias serranas (pinhão, amora)", "Chocolate quente"], costNote: "R$ 100 / casal", details: { hours: "Servido das 6h às 7h30, mediante solicitação", ticket: "R$ 100 / casal — upgrade na diária", parking: "No próprio hotel", accessibility: "Sem degraus, no hotel", babyFriendly: "Bebê se alimenta normalmente; cadeirão disponível", bring: [], tips: ["Confirme o horário antecipado com a pousada na noite anterior."] } },
      { title: "Soneca 1 · hotel", note: "Prepare a bolsa enquanto o bebê dorme: porta-bebê, manta extra, casaco impermeável, mamadeira de emergência, fraldas para 3h e documento com foto para o checkpoint do Morro da Igreja." },
      { title: "Morro da Igreja · Pedra Furada", description: "Mirante panorâmico a 1.827 m com o icônico arco da Pedra Furada. Acesso por estrada pavimentada. Porta-bebê frontal com cobertura de vento — sem carrinho nesse terreno.", whyHere: "A vista síntese de toda a região. Limite a exposição do bebê ao vento aberto a no máximo 10–15 min com cobertura total. A subida de carro já é metade da experiência — mar de nuvens abaixo, geada na grama.", logistics: "Saída do hotel às 9h30. Carro ~20–25 min pela SC-438. Chegar às 9h50–9h55. Iniciar retorno às 11h10–11h15 para chegar ao Bodegão às 11h30.", whatToOrder: [], costNote: "Autorização + entrada", distance: "~15 km do hotel · 20–25 min", details: { hours: "08h–16h · autorização antecipada obrigatória", ticket: "Autorização prévia (limite diário de visitantes) · documento com foto no checkpoint", parking: "Estacionamento na entrada · caminhada curta até o mirante", accessibility: "Terreno irregular e rochoso — apenas porta-bebê", babyFriendly: "Bodysuit térmico + cobertura de vento essenciais. Nunca exponha ao vento aberto por mais de 10–15 min.", bestTime: "7h–10h para nuvens abaixo do pico", bring: ["Bodysuit térmico", "Cobertura de vento para o porta-bebê", "Luvas e touca", "Documento com foto", "Mamadeira de emergência"], tips: ["Reserve a autorização dias antes — a cota diária esgota.", "Verifique condições da estrada (geada possível) antes de sair."] } },
      { title: "Almoço · Bodegão", description: "O restaurante mais avaliado de Urubici — cardápio serrano completo, qualidade consistente. O lugar certo para o almoço principal da viagem.", whyHere: "1.984 avaliações indicam consistência real. Peça assim que sentar — sem entrada, sem sobremesa. Se a espera ultrapassar 5 min ou o local estiver lotado, acione o Plano B imediatamente: Artesabana (~500 m, serviço em menos de 10 min).", whatToOrder: ["Truta às Natas", "Filé Mignon ao Molho Ferrugem", "Lasanha de Truta"], logistics: "Chegue às 11h30–11h35. Peça ao sentar. Saia até as 12h. Caminhada de volta ao hotel: 3–10 min. Bebê no berço às 12h em ponto para a Soneca 2.", costNote: "R$ 100–140 / casal", distance: "~200–700 m do hotel", details: { hours: "Almoço a partir das 11h30", ticket: "R$ 100–140 para dois · Plano B: Artesabana", parking: "Praça e rua próximas", accessibility: "Sem degraus, peça mesa ao fundo", babyFriendly: "Ambiente aquecido, atendimento experiente · bebê no colo tranquilo", bring: ["Lanche de emergência"], tips: ["Peça assim que sentar — a soneca das 12h é inegociável.", "Acione o Plano B sem hesitar se houver qualquer espera."] } },
      { title: "Soneca 2 · hotel", note: "O bloco de descanso mais longo do roteiro. Adultos descansam junto à lareira. O Morro da Igreja é frio e cansativo — aproveitem bem esse tempo." },
      { title: "Cascata Véu de Noiva", description: "Uma cortina d'água em trilha curta e quase plana — uma das cachoeiras mais acessíveis da região para famílias com criança pequena. Passarela de madeira até a plataforma inferior, boa para porta-bebê.", whyHere: "Alta recompensa visual, baixo esforço físico — o equilíbrio certo para um bebê e adultos cansados na tarde após a grande manhã. Combine com o restaurante na estrada de acesso.", costNote: "R$ 15 / adulto", distance: "~8–12 km · 15–20 min", details: { hours: "08h–18h", ticket: "R$ 15 / adulto · menores de 6 anos grátis", parking: "Estacionamento de cascalho na trilha", accessibility: "Passarela até a plataforma inferior; porta-bebê depois", babyFriendly: "Envolva o porta-bebê — a névoa chega à plataforma inferior", bring: ["Capa de chuva", "Calçado com aderência", "Porta-bebê"], tips: ["Combine com o Restaurante Véu de Noiva na estrada de acesso — sem desvio necessário."] } },
      { title: "Lanche · Restaurante Véu de Noiva", description: "Comida caseira rústica bem na estrada de acesso. Famoso por uma coisa: farofa de pinhão — o prato típico da serra catarinense que vale provar ao menos uma vez.", whyHere: "Você almoçou ao meio-dia. Após a caminhada, um lanche quente cobre o tempo até o retorno. Coma às 15h30–16h, saia às 16h30.", whatToOrder: ["Farofa de pinhão", "Caldo quente"], logistics: "Coma no local após a cachoeira. Saia às 16h30 — o hotel fica 15–20 min. A rotina noturna começa às 17h30.", costNote: "R$ 40–80 / casal", distance: "Na atração · sem desvio", details: { hours: "Diurno, junto com a atração", ticket: "R$ 20–50 por pessoa", parking: "Compartilhado com a cachoeira", accessibility: "Rural, simples, fácil com porta-bebê", babyFriendly: "Ambiente rural tranquilo · sem protocolo", bring: [], tips: ["A farofa de pinhão é o motivo da parada — não pule."] } },
      { title: "Rotina noturna + jantar no hotel", note: "Chegue ao hotel às 17h com 30 min de margem. Bebê dorme às 17h30. Jantar dos adultos: room service, restaurante interno ou para viagem buscado após o bebê dormir." }
    ]},
    { label: "Natureza leve e partida", activities: [
      { title: "Café da manhã no hotel · incluso", note: "Café da manhã incluso. Use essa janela para fazer as malas, carregar o carro e ter tudo pronto antes da soneca 1 às 8h. O carro deve estar carregado até as 8h — não há tempo depois." },
      { title: "Soneca 1 · hotel", note: "Última soneca no hotel. Adultos fazem a conferência final do quarto, devolvem as chaves, finalizam o check-out. Check-out às 9h30 — bebê vai direto do berço para a cadeirinha." },
      { title: "Check-out · 9h30", note: "Check-out obrigatório antes das 11h — feito às 9h30 para preservar a janela da manhã. Carro já carregado. Bebê direto do berço para a cadeirinha. Carro ~8–10 min até a Cascata do Avencal." },
      { title: "Cascata do Avencal · mirantes superiores", description: "Fique exclusivamente nos decks e mirantes superiores. A trilha inferior tem degraus íngremes e úmidos — não leve bebê. A vista da queda d'água de ~100 m a partir do topo é completamente acessível e impactante.", whyHere: "Uma vista de alto impacto e curta duração na saída — apenas 3–5 km do hotel e na mesma estrada do Guardião. 25–30 min e segue.", costNote: "R$ 15 / adulto", distance: "~3–5 km do hotel · 8–10 min", details: { hours: "08h30–17h30", ticket: "R$ 15 / adulto", parking: "Estacionamento na fazenda do topo", accessibility: "Mirantes superiores apenas — pule a trilha inferior com bebê", babyFriendly: "Porta-bebê; fique atrás das grades nas plataformas superiores", bring: ["Porta-bebê", "Calçado com aderência"], tips: ["Combine imediatamente com o Guardião do Avencal — apenas 1–2 km mais adiante na mesma estrada."] } },
      { title: "Última parada · Guardião do Avencal", description: "Propriedade particular que combina café colonial com pinturas rupestres ancestrais, mirante com vista para o vale e fazendinha com animais. A experiência mais completa e única de Urubici — no mesmo trecho da Cascata.", whyHere: "Última saída da viagem. Atração + comida em um lugar, sem deslocamento extra, ritmo compatível com bebê. Arte rupestre + fazendinha é mais estimulante para o bebê do que qualquer restaurante.", whatToOrder: ["Mesa completa de café colonial", "Pães, cucas e bolos serranos", "Petiscos de pinhão"], logistics: "Chegue às 10h15. Mirantes + arte rupestre ~30–35 min. Café colonial ~20–25 min. Parta às 11h–11h10. Carro até a rodovia ~12–15 min. Em movimento às 11h30.", costNote: "R$ 40–80 / casal", distance: "~1–2 km do Avencal · 5 min", details: { hours: "A partir das 9h", ticket: "Café ≈ R$ 40–80 / casal", parking: "Estacionamento da fazenda", accessibility: "Terreno aberto · suave · café coberto", babyFriendly: "Ritmo lento · animais · esforço mínimo · café tranquilo", bring: ["Porta-bebê", "Câmera"], tips: ["Os painéis de arte rupestre são cercados mas legíveis — aponte para o bebê.", "Reserve mesa se for em fim de semana."] } },
      { title: "Partir de Urubici · viagem de volta", note: "Saída antes das 11h30 com conforto. Bebê ainda na janela ativa — música suave, brinquedos. Em movimento até as 11h30." },
      { title: "Soneca 2 · carro em movimento", note: "Mantenha o carro em movimento. O bebê adormece naturalmente. Não pare — planeje abastecimento ou banheiro antes do meio-dia." },
      { title: "Bebê acorda · trecho final", note: "Parada rápida se necessário (fralda, mamadeira). Retome o movimento para casa — viagem encerrada, bebê descansado, roteiro cumprido." }
    ]}
  ],

  alerts: [
    { title: "Faz frio de verdade", body: "Junho em Urubici registra 0–10°C com geada à noite e vento cortante em altitude. O bebê precisa de bodysuit térmico, macacão de lã, casaco impermeável e manta de emergência. Nunca exponha ao vento aberto por mais de 10–15 min em locais como o Morro da Igreja." },
    { title: "Jantar fora: inviável", body: "Com bedtime às 17h30, não há espaço para jantar em restaurante. Todos os jantares acontecem no hotel — room service, restaurante interno ou comida buscada por um adulto após o bebê dormir (com monitora de áudio ligada)." },
    { title: "Almoço — estratégia", body: "O mais prático: um adulto busca comida enquanto o outro fica com o bebê dormindo. Se o restaurante ficar a menos de 600 m, os dois podem ir juntos se o bebê estiver profundamente adormecido com a monitora ligada. Adapte ao dia." },
    { title: "Reserve com antecedência", body: "Bodegão e Guardião do Avencal têm alta demanda nos fins de semana. Ligue ou reserve online antes de sair de casa. Confirme também o horário do café colonial com a pousada na véspera do Dia 2." }
  ],

  budgetLines: [
    { label: "Hospedagem",   note: "2 diárias" },
    { label: "Combustível",  note: "ida + volta" },
    { label: "Café Colonial · hotel",   note: "café Dia 2" },
    { label: "Artesabana",              note: "jantar Dia 1 · para viagem" },
    { label: "Bodegão",                 note: "almoço Dia 2" },
    { label: "Rest. Véu de Noiva",      note: "lanche Dia 2" },
    { label: "Guardião do Avencal",     note: "café Dia 3" },
    { label: "Jantares no hotel",       note: "2 noites" },
    { label: "Ingressos",               note: "Morro da Igreja · Guardião" },
    { label: "Reserva para imprevistos" }
  ],

  skipped: [
    { reason: "Trilha de 13,5 km ida e volta — inviável com bebê" },
    { reason: "Exige 4×4 e caminhada longa" },
    { reason: "14 km de trilha, 50 km do centro" },
    { reason: "Atividades radicais — incompatíveis" },
    { reason: "52 km, frio extremo, sem estrutura para bebê" },
    { reason: "Incompatíveis com o bedtime às 17h30 do bebê" },
    { reason: "Ótimos para outra viagem — sem bebê" }
  ]
};

/* ========================================================================
   Deep merge utility
   ======================================================================== */
function mergeDeep(base, overlay) {
  if (overlay === null || overlay === undefined) return base;
  if (typeof base !== 'object' || typeof overlay !== 'object') return overlay;
  if (Array.isArray(base) && Array.isArray(overlay)) {
    return base.map((item, i) =>
      overlay[i] !== undefined && overlay[i] !== null ? mergeDeep(item, overlay[i]) : item
    );
  }
  const result = { ...base };
  for (const key of Object.keys(overlay)) {
    if (overlay[key] !== null && overlay[key] !== undefined) {
      result[key] = mergeDeep(base[key], overlay[key]);
    }
  }
  return result;
}

/* ========================================================================
   localizeTrip — returns a trip object in the requested language
   ======================================================================== */
function localizeTrip(trip, lang) {
  if (!trip) return trip;
  if (lang === 'en') return trip;
  return mergeDeep(trip, TRIP_PT);
}

/* ---- detect browser language ---- */
const DEFAULT_LANG = (typeof navigator !== 'undefined' && (navigator.language || '').toLowerCase().startsWith('pt')) ? 'pt' : 'en';

Object.assign(window, { t, TX, TRIP_PT, localizeTrip, DEFAULT_LANG });
