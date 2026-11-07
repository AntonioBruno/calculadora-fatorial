"use strict";

const LIMITE_MAXIMO = 1000;

const formulario = document.getElementById("formulario");
const campoNumero = document.getElementById("numero");
const mensagemErro = document.getElementById("mensagem-erro");
const areaResultado = document.getElementById("resultado");
const elExpressao = document.getElementById("expressao");
const elValor = document.getElementById("valor");
const elDetalhes = document.getElementById("detalhes");
const botaoCopiar = document.getElementById("copiar");

let ultimoResultado = "";

/** Calcula n! de forma exata usando BigInt. */
function fatorial(n) {
  let resultado = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    resultado *= i;
  }
  return resultado;
}

/** Monta a expressão: completa para n pequeno, resumida para n grande. */
function montarExpressao(n) {
  if (n <= 1) return `${n}! = 1`;
  if (n <= 12) {
    const termos = [];
    for (let i = n; i >= 1; i--) termos.push(i);
    return `${n}! = ${termos.join(" × ")}`;
  }
  return `${n}! = ${n} × ${n - 1} × ${n - 2} × … × 2 × 1`;
}

/** Notação científica aproximada para resultados muito grandes. */
function notacaoCientifica(digitos) {
  const mantissa = `${digitos[0]},${digitos.slice(1, 4)}`;
  return `${mantissa} × 10^${digitos.length - 1}`;
}

function mostrarErro(texto) {
  mensagemErro.textContent = texto;
  mensagemErro.hidden = false;
  campoNumero.setAttribute("aria-invalid", "true");
  areaResultado.hidden = true;
}

function limparErro() {
  mensagemErro.hidden = true;
  mensagemErro.textContent = "";
  campoNumero.removeAttribute("aria-invalid");
}

function calcular(entrada) {
  const texto = entrada.trim();
  limparErro();

  if (texto === "") {
    mostrarErro("Digite um número para calcular.");
    return;
  }
  if (!/^\d+$/.test(texto)) {
    mostrarErro("Use apenas números inteiros, sem sinais, vírgulas ou letras.");
    return;
  }

  const n = Number(texto);
  if (n > LIMITE_MAXIMO) {
    mostrarErro(`O limite é ${LIMITE_MAXIMO}. Digite um número menor ou igual a isso.`);
    return;
  }

  const resultado = fatorial(n);
  const digitos = resultado.toString();
  ultimoResultado = digitos;

  elExpressao.textContent = montarExpressao(n);
  elValor.textContent = resultado.toLocaleString("pt-BR");

  if (digitos.length > 15) {
    elDetalhes.textContent =
      `Esse número tem ${digitos.length} dígitos (≈ ${notacaoCientifica(digitos)}).`;
  } else {
    elDetalhes.textContent = `Esse número tem ${digitos.length} dígito${digitos.length > 1 ? "s" : ""}.`;
  }

  botaoCopiar.textContent = "Copiar resultado";
  areaResultado.hidden = false;
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  calcular(campoNumero.value);
});

// Atalhos de exemplo
document.querySelectorAll(".atalho").forEach((botao) => {
  botao.addEventListener("click", () => {
    campoNumero.value = botao.dataset.valor;
    calcular(campoNumero.value);
  });
});

// Limpa o erro assim que a pessoa volta a digitar
campoNumero.addEventListener("input", limparErro);

// Copiar resultado (apenas dígitos, sem separadores)
botaoCopiar.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(ultimoResultado);
    botaoCopiar.textContent = "Copiado!";
  } catch {
    botaoCopiar.textContent = "Não foi possível copiar";
  }
});
