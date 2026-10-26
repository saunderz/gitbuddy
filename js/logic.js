import { COMMANDS } from "./commands.js";

export const ALLOWED_TYPES = Object.freeze({
  feat: "Nova funcionalidade",
  fix: "Correção de erro",
  docs: "Documentação",
  refactor: "Refatoração",
  test: "Testes",
  chore: "Manutenção"
});

/** Normalização usada apenas na consulta (não altera o texto original exibido). */
export function normalizeQuery(input) {
  return String(input ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9.\s-]/g, " ").replace(/\s+/g, " ").trim();
}

/** Retorna null se a tarefa não for reconhecida: não inventa comandos. */
export function findCommand(input) {
  const query = normalizeQuery(input);
  if (!query) return null;
  return COMMANDS.find((item) => item.patterns.some((pattern) => pattern.test(query))) ?? null;
}

/**
 * Valida SOMENTE uma linha do cabeçalho do Conventional Commits, com seis
 * tipos permitidos. A ferramenta não verifica o conteúdo efetivo do código.
 */
export function validateCommit(input) {
  const value = String(input ?? "").trim();
  if (!value) return { valid: false, error: "Digite uma mensagem antes de validar." };
  if (value.includes("\n") || value.includes("\r")) return { valid: false, error: "Digite apenas a primeira linha do commit. Esta versão não analisa corpo ou rodapés." };

  const match = value.match(/^([a-z]+)(?:\(([a-z0-9][a-z0-9._/-]*)\))?(!)?: (.+)$/);
  if (!match) {
    return {
      valid: false,
      error: "Use o formato 'tipo(escopo): descrição'. O escopo é opcional e deve haver um espaço após os dois-pontos."
    };
  }

  const [, type, scope, bang, rawDescription] = match;
  if (!Object.hasOwn(ALLOWED_TYPES, type)) {
    return { valid: false, error: `Tipo '${type}' não está entre os seis tipos aceitos nesta versão: ${Object.keys(ALLOWED_TYPES).join(", ")}.` };
  }
  const description = rawDescription.trim();
  if (!description) return { valid: false, error: "A descrição do commit não pode ficar vazia." };

  const tips = [];
  if (value.length > 72) tips.push("A primeira linha tem mais de 72 caracteres; considere encurtá-la para facilitar a leitura.");
  if (description.endsWith(".")) tips.push("Em equipes, costuma-se evitar ponto final no resumo do commit.");
  return { valid: true, type, typeLabel: ALLOWED_TYPES[type], scope: scope ?? null, breaking: Boolean(bang), description, tips };
}
