const AREAS = [
  {
    id: "familiar",
    coluna: 0,
    titulo: "PROJETO DE VIDA NA ÁREA FAMILIAR",
    intro: "Sua família é o seu porto seguro e o seu primeiro ministério. Que limites têm impedido a harmonia, a união ou o crescimento nos seus relacionamentos familiares? Ore e escreva sobre como você pode romper essa barreira para construir um lar mais forte e cheio do amor de Deus.",
  },
  {
    id: "sentimental",
    coluna: 0,
    titulo: "PROJETO DE VIDA NA ÁREA SENTIMENTAL",
    intro: "Deus nos criou para o amor, seja no casamento, no noivado ou na busca por um relacionamento. Que padrões, medos ou desafios têm bloqueado sua vida sentimental? Declare a intenção de romper com o que impede um relacionamento saudável e abençoado por Ele.",
  },
  {
    id: "profissional",
    coluna: 0,
    titulo: "PROJETO DE VIDA NA ÁREA PROFISSIONAL",
    intro: "Seu trabalho e sua carreira são ferramentas para glorificar a Deus. Que obstáculos têm impedido seu crescimento profissional, novas habilidades ou uma nova direção? Escreva o limite que você irá romper para alcançar o que Ele planejou.",
  },
  {
    id: "financeira",
    coluna: 1,
    titulo: "PROJETO DE VIDA NA ÁREA FINANCEIRA",
    intro: "A fidelidade e a sabedoria nas finanças refletem a confiança em Deus. Que hábitos, dívidas ou falta de planejamento têm sido um limite? Anote o passo que você dará para conquistar liberdade financeira em 2027.",
  },
  {
    id: "ministerial",
    coluna: 1,
    titulo: "PROJETO DE VIDA NA ÁREA MINISTERIAL",
    intro: "O chamado de Deus em sua vida é único e essencial para o Reino. Que medo, timidez ou falta de oportunidade têm impedido você de servir com seu dom? Declare o limite que você irá romper para se dedicar ao ministério.",
  },
  {
    id: "espiritual",
    coluna: 1,
    titulo: "PROJETO DE VIDA NA ÁREA ESPIRITUAL",
    intro: "Sua caminhada com Cristo é a base de tudo. Que rotinas, distrações ou frieza espiritual têm afastado você do relacionamento com Deus? Registre o compromisso que você fará para se aproximar do Pai em 2027.",
  },
];

const TEMA_AREA = {
  "Crescer na minha comunhão com Deus": "espiritual",
  "Firmar uma rotina de oração e leitura da Bíblia": "espiritual",
  "Vencer tentações e viver em santidade": "espiritual",
  "Permanecer firme na fé em tempos difíceis": "espiritual",
  "Servir a Deus e à igreja com meus dons": "ministerial",
  "Compartilhar o Evangelho e discipular pessoas": "ministerial",
  "Encontrar paz para lidar com a ansiedade e as preocupações": "sentimental",
  "Superar feridas emocionais e aprender a perdoar": "sentimental",
  "Vencer o medo e a insegurança ao tomar decisões": "sentimental",
  "Recuperar a esperança e a alegria em meio ao luto ou ao desânimo": "sentimental",
  "Orar pela salvação dos meus familiares": "familiar",
  "Fortalecer meu casamento e renovar o diálogo": "familiar",
  "Buscar perdão, união e reconciliação na minha família": "familiar",
  "Ter sabedoria para cuidar dos meus filhos e ensiná-los na fé": "familiar",
  "Organizar minhas finanças e quitar minhas dívidas": "financeira",
  "Conseguir um emprego ou voltar ao mercado de trabalho": "profissional",
  "Crescer na minha profissão ou receber uma promoção": "profissional",
  "Abrir ou ampliar meu negócio": "profissional",
  "Construir uma reserva financeira para minha família": "financeira",
  "Começar ou concluir meus estudos": "profissional",
  "Casar-me em 2027": "sentimental",
  "Conquistar ou reformar minha casa": "familiar",
  "Comprar ou trocar meu veículo": "financeira",
  "Cuidar melhor da minha saúde": "sentimental",
  "Realizar uma viagem que venho planejando": "familiar",
};

function textoPdf(valor) {
  return String(valor || "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\u0000-\u00FF]/g, "");
}

function umaLinha(texto, fonte, tamanho, largura) {
  const linhas = quebrar(texto, fonte, tamanho, largura);
  if (linhas.length <= 1) return linhas[0] || "";
  let curto = linhas[0];
  while (curto.length > 1 && fonte.widthOfTextAtSize(curto + "...", tamanho) > largura) {
    curto = curto.slice(0, -1);
  }
  return curto.replace(/\s+\S*$/, "") + "...";
}

function quebrar(texto, fonte, tamanho, largura) {
  const linhas = [];
  let atual = "";
  textoPdf(texto).split(/\s+/).filter(Boolean).forEach((palavra) => {
    const tentativa = atual ? atual + " " + palavra : palavra;
    if (fonte.widthOfTextAtSize(tentativa, tamanho) <= largura) atual = tentativa;
    else {
      if (atual) linhas.push(atual);
      atual = palavra;
    }
  });
  if (atual) linhas.push(atual);
  return linhas;
}

function pedidosDoFormulario() {
  const porArea = Object.fromEntries(AREAS.map((area) => [area.id, []]));
  const soltos = [];
  document.querySelectorAll('input[name="tema"]:checked').forEach((campo) => {
    const area = TEMA_AREA[campo.value];
    if (area) porArea[area].push(campo.value);
    else soltos.push(campo.value);
  });
  const outros = document.getElementById("outros");
  const livre = document.getElementById("pedido").value.trim();
  if (outros.checked && livre) soltos.push(livre);
  return { porArea, soltos };
}

function desenharCartao(pagina, area, itens, fontes, caixa) {
  const { rgb } = PDFLib;
  const verde = rgb(0.11, 0.4, 0.27);
  const tinta = rgb(0.22, 0.27, 0.24);
  const linha = rgb(0.75, 0.8, 0.77);
  pagina.drawRectangle({ x: caixa.x, y: caixa.y, width: caixa.w, height: caixa.h, color: rgb(1, 1, 1) });
  let y = caixa.y + caixa.h - 16;
  const largura = caixa.w - 20;
  quebrar(area.titulo, fontes.negrito, 8, largura).forEach((trecho) => {
    pagina.drawText(trecho, { x: caixa.x + 10, y, size: 8, font: fontes.negrito, color: verde });
    y -= 11;
  });
  quebrar(area.intro, fontes.regular, 6.4, largura).slice(0, 4).forEach((trecho) => {
    pagina.drawText(trecho, { x: caixa.x + 10, y, size: 6.4, font: fontes.regular, color: tinta });
    y -= 8.2;
  });
  y -= 4;
  itens.slice(0, 4).forEach((item) => {
    quebrar("- " + item, fontes.regular, 7.2, largura).slice(0, 2).forEach((trecho) => {
      pagina.drawText(trecho, { x: caixa.x + 10, y, size: 7.2, font: fontes.regular, color: rgb(0.1, 0.16, 0.13) });
      y -= 9.4;
    });
  });
  while (y > caixa.y + 12) {
    pagina.drawLine({
      start: { x: caixa.x + 10, y },
      end: { x: caixa.x + caixa.w - 10, y },
      thickness: 0.4,
      color: linha,
    });
    y -= 11;
  }
}

async function baixarProjetoPdf() {
  const status = document.getElementById("status");
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const doc = await PDFDocument.create();
  const pagina = doc.addPage([841.89, 595.28]);
  const fontes = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    negrito: await doc.embedFont(StandardFonts.HelveticaBold),
  };
  pagina.drawRectangle({ x: 0, y: 0, width: 841.89, height: 595.28, color: rgb(0.07, 0.24, 0.18) });
  const nome = document.getElementById("nome").value.trim();
  const cabecalho = textoPdf(nome ? "IEQ Salvador  ·  " + nome : "IEQ Salvador  ·  Projeto de Vida 2027");
  pagina.drawText(cabecalho, { x: 28, y: 572, size: 9, font: fontes.negrito, color: rgb(0.98, 0.95, 0.88) });

  const { porArea, soltos } = pedidosDoFormulario();
  const margem = 22;
  const vao = 12;
  const folga = 8;
  const largura = (841.89 - margem * 2 - vao) / 2;
  const topo = 556;
  const base = soltos.length ? 58 : 34;
  const altura = (topo - base - folga * 2) / 3;
  AREAS.forEach((area, indice) => {
    const linha = indice % 3;
    const y = topo - (linha + 1) * altura - linha * folga;
    desenharCartao(pagina, area, porArea[area.id], fontes, {
      x: margem + area.coluna * (largura + vao),
      y,
      w: largura,
      h: altura,
    });
  });

  pagina.drawText("ANO DO CRESCIMENTO", {
    x: 28, y: 14, size: 11, font: fontes.negrito, color: rgb(0.98, 0.95, 0.88),
  });
  const assinatura = "Jeová Jireh    Aliança Eterna";
  const assinaturaLargura = fontes.regular.widthOfTextAtSize(assinatura, 8);
  pagina.drawText(assinatura, {
    x: 841.89 - 28 - assinaturaLargura,
    y: 15,
    size: 8,
    font: fontes.regular,
    color: rgb(0.93, 0.86, 0.55),
  });
  if (soltos.length) {
    pagina.drawText(umaLinha("Outros pedidos: " + soltos.join(" · "), fontes.regular, 8, 786), {
      x: 28,
      y: 32,
      size: 8,
      font: fontes.regular,
      color: rgb(0.93, 0.86, 0.55),
    });
  }

  const bytes = await doc.save();
  const arquivo = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(arquivo);
  const link = document.createElement("a");
  link.href = url;
  link.download = "projeto-de-vida-2027-ieq-salvador.pdf";
  link.click();
  URL.revokeObjectURL(url);
  status.textContent = "PDF baixado. Ele traz as seis áreas do caderno e os pedidos marcados.";
}

document.getElementById("baixar-pdf").addEventListener("click", () => {
  baixarProjetoPdf().catch(() => {
    document.getElementById("status").textContent = "Não foi possível gerar o PDF neste navegador. Tente de novo.";
  });
});
