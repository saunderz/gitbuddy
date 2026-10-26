import { findCommand, validateCommit } from "./logic.js";

const STORAGE_KEY = "gitbuddy:last-queries:v1";
const byId = (id) => document.getElementById(id);

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function saveLastQuery(kind, value) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    saved[kind] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Navegação privada ou armazenamento bloqueado: o app continua funcionando.
  }
}
function restoreLastQueries() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (typeof saved.command === "string") byId("command-query").value = saved.command;
    if (typeof saved.commit === "string") byId("commit-message").value = saved.commit;
  } catch { /* Estado inválido ou acesso bloqueado: ignorar. */ }
}

function showMessage(container, title, text, status = "error") {
  const card = createElement("div", `feedback-card feedback-${status}`);
  const heading = createElement("div", "feedback-title", title);
  const details = createElement("p", "feedback-description", text);
  card.append(heading, details);
  container.replaceChildren(card);
}

async function copyText(value, button) {
  try {
    // Clipboard API requer contexto seguro (localhost ou HTTPS).
    await navigator.clipboard.writeText(value);
    const old = button.textContent;
    button.textContent = "Copiado!";
    setTimeout(() => { button.textContent = old; }, 1600);
  } catch {
    button.textContent = "Copie manualmente";
    setTimeout(() => { button.textContent = "Copiar comando"; }, 2000);
  }
}

function renderCommand(command) {
  const container = byId("command-result");
  if (!command) {
    showMessage(container, "Não encontramos esse comando", "A consulta não corresponde a uma das operações cadastradas. Experimente 'criar uma branch', 'ver alterações' ou 'enviar commits'.", "notice");
    return;
  }
  const card = createElement("div", "result-card");
  const eyebrow = createElement("p", "result-eyebrow", `COMANDO ENCONTRADO  /  ${command.category.toUpperCase()}`);
  const title = createElement("h3", "result-title", command.title);
  const terminal = createElement("div", "result-terminal");
  const prompt = createElement("span", "terminal-prompt", "$ ");
  const code = createElement("code", "result-code", command.command);
  const copy = createElement("button", "copy-button", "Copiar comando");
  copy.type = "button";
  copy.setAttribute("aria-label", `Copiar comando: ${command.command}`);
  copy.addEventListener("click", () => copyText(command.command, copy));
  terminal.append(prompt, code, copy);
  const info = createElement("p", "result-description", command.description);
  const note = createElement("p", "result-note", command.explanation);
  card.append(eyebrow, title, terminal, info, note);
  container.replaceChildren(card);
}

function renderCommit(response) {
  const container = byId("commit-result");
  if (!response.valid) {
    showMessage(container, "Mensagem fora do padrão", response.error);
    return;
  }
  const card = createElement("div", "result-card");
  const heading = createElement("div", "valid-heading");
  heading.append(createElement("span", "valid-icon", "✓"), createElement("div", "feedback-title", "Commit válido"));
  const subtitle = createElement("p", "result-description", "A mensagem atende às regras simplificadas adotadas pelo GitBuddy.");
  const grid = createElement("div", "analysis-grid");
  for (const [label, value] of [
    ["TIPO", `${response.type} — ${response.typeLabel}`],
    ["ESCOPO", response.scope ?? "Não informado (opcional)"],
    ["DESCRIÇÃO", response.description],
    ["ALTERAÇÃO INCOMPATÍVEL", response.breaking ? "Indicada por !" : "Não indicada"]
  ]) {
    const cell = createElement("div", "analysis-cell");
    cell.append(createElement("span", "analysis-label", label), createElement("span", "analysis-value", value));
    grid.append(cell);
  }
  card.append(heading, subtitle, grid);
  if (response.tips.length) {
    const tips = createElement("div", "result-tips");
    for (const tip of response.tips) tips.append(createElement("p", "", `Dica: ${tip}`));
    card.append(tips);
  }
  container.replaceChildren(card);
}

function selectTab(kind, focus = false) {
  for (const mode of ["command", "commit"]) {
    const isActive = mode === kind;
    const tab = byId(`tab-${mode}`);
    const panel = byId(`panel-${mode}`);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    tab.classList.toggle("is-selected", isActive);
    panel.hidden = !isActive;
    if (isActive && focus) tab.focus();
  }
}

for (const tab of document.querySelectorAll("[data-tab]")) {
  tab.addEventListener("click", () => selectTab(tab.dataset.tab));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    selectTab(tab.dataset.tab === "command" ? "commit" : "command", true);
  });
}

byId("form-command").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = byId("command-query").value;
  if (!value.trim()) return showMessage(byId("command-result"), "Digite uma tarefa", "O campo está vazio. Informe a ação que deseja realizar no Git.");
  saveLastQuery("command", value);
  renderCommand(findCommand(value));
});
byId("form-commit").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = byId("commit-message").value;
  if (value.trim()) saveLastQuery("commit", value);
  renderCommit(validateCommit(value));
});
for (const [kind, field, form] of [
  ["command", "command-query", "form-command"],
  ["commit", "commit-message", "form-commit"]
]) {
  byId(`${kind}-examples`).addEventListener("click", (event) => {
    const button = event.target.closest("button[data-example]");
    if (!button) return;
    byId(field).value = button.dataset.example;
    byId(form).requestSubmit();
  });
}
restoreLastQueries();
