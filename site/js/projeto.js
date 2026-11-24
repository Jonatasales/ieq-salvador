const igreja = {
  email: "ieqsalvador.eventos@gmail.com",
  pixChave: "62.955.505/0878-58",
  pixCodigo: "00020126360014br.gov.bcb.pix0114629555050878585204000053039865802BR5910----------6008SALVADOR62180514ieqvascodagama63044AA6",
};

const el = (id) => document.getElementById(id);
const form = el("form");
const outros = el("outros");
const pedido = el("pedido");

function pedidosSelecionados() {
  return Array.from(form.querySelectorAll('input[name="tema"]:checked'), (campo) => "• " + campo.value);
}

function mensagem() {
  const nome = el("nome").value.trim();
  const selecionados = pedidosSelecionados();
  const adicional = outros.checked && pedido.value.trim();
  if (!selecionados.length && !adicional) return "";
  return [
    "Projeto de Vida 2027 — IEQ Salvador",
    nome && "Nome: " + nome,
    selecionados.length && "Meus pedidos:\n" + selecionados.join("\n"),
    adicional && "Outros pedidos:\n" + adicional,
    "Paz, Pr. Erivelton e Pra. Jocelia. Segue meu Projeto de Vida 2027 da IEQ Salvador.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function atualizar() {
  el("campo-outros").hidden = !outros.checked;
  pedido.disabled = !outros.checked;
  pedido.required = outros.checked;
  pedido.setCustomValidity(
    outros.checked && pedido.value && !pedido.value.trim() ? "Escreva seus outros pedidos." : "",
  );
  el("contador").textContent = pedido.value.length + " / 1800";
  el("texto").textContent = mensagem() || "Marque um pedido para montar a mensagem.";
  el("status").textContent = "";
}

function mensagemPronta() {
  if (!form.reportValidity()) return "";
  const texto = mensagem();
  if (!texto) {
    el("status").textContent = "Selecione pelo menos um pedido ou marque Outros pedidos para escrever.";
    form.querySelector('input[name="tema"]').focus();
  }
  return texto;
}

async function copiar(texto, id, confirmacao) {
  try {
    await navigator.clipboard.writeText(texto);
    el(id).textContent = confirmacao;
  } catch {
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("aria-label", "Texto para copiar");
    el(id).replaceChildren(campo, document.createTextNode(" Copie o texto selecionado."));
    campo.focus();
    campo.select();
  }
}

form.addEventListener("input", atualizar);
outros.addEventListener("change", () => {
  atualizar();
  if (outros.checked) pedido.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const texto = mensagemPronta();
  if (!texto) return;
  const assunto = encodeURIComponent("Projeto de Vida 2027 — IEQ Salvador");
  const corpo = encodeURIComponent(texto);
  window.location.assign("mailto:" + igreja.email + "?subject=" + assunto + "&body=" + corpo);
});

el("copy").addEventListener("click", () => {
  const texto = mensagemPronta();
  if (texto) copiar(texto, "status", "Mensagem copiada.");
});

el("copy-key").addEventListener("click", () => {
  copiar(igreja.pixChave, "pix-status", "Chave Pix copiada.");
});

el("copy-pix").addEventListener("click", () => {
  copiar(igreja.pixCodigo, "pix-status", "Código Pix copiado.");
});

atualizar();

if (location.protocol === "https:" && "serviceWorker" in navigator && document.currentScript) {
  const sw = new URL("../sw.js", document.currentScript.src);
  navigator.serviceWorker.register(sw).catch(() => {});
}
