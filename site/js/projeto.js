const igreja = {
  whatsapp: "",
  pixChave: "",
  pixCodigo: "",
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
    "Paz. Segue meu Projeto de Vida 2027 da IEQ Salvador.",
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
  if (!igreja.whatsapp) {
    copiar(texto, "status", "Mensagem copiada. O WhatsApp da IEQ Salvador ainda não está publicado nesta página.");
    return;
  }
  window.location.assign("https://wa.me/" + igreja.whatsapp + "?text=" + encodeURIComponent(texto));
});

el("copy").addEventListener("click", () => {
  const texto = mensagemPronta();
  if (texto) copiar(texto, "status", "Mensagem copiada.");
});

el("copy-key").addEventListener("click", () => {
  if (!igreja.pixChave) {
    el("pix-status").textContent = "A chave Pix da IEQ Salvador ainda não foi publicada.";
    return;
  }
  copiar(igreja.pixChave, "pix-status", "Chave Pix copiada.");
});

el("copy-pix").addEventListener("click", () => {
  if (!igreja.pixCodigo) {
    el("pix-status").textContent = "O código Pix Copia e Cola ainda não foi publicado.";
    return;
  }
  copiar(igreja.pixCodigo, "pix-status", "Código Pix copiado.");
});

atualizar();

if (location.protocol === "https:" && "serviceWorker" in navigator && document.currentScript) {
  const sw = new URL("../sw.js", document.currentScript.src);
  navigator.serviceWorker.register(sw).catch(() => {});
}
