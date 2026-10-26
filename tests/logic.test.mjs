import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeQuery, findCommand, validateCommit } from '../js/logic.js';

test('normaliza acentos, caixa e espaços', () => {
  assert.equal(normalizeQuery('  VER   ALTERAÇÕES  '), 'ver alteracoes');
});

test('busca comando de branch', () => {
  assert.equal(findCommand('criar uma branch')?.command, 'git switch -c minha-branch');
  assert.equal(findCommand('trocar de branch')?.command, 'git switch nome-da-branch');
});

test('encontra ações comuns de Git', () => {
  assert.equal(findCommand('ver alterações')?.command, 'git status');
  assert.equal(findCommand('consultar histórico')?.command, 'git log --oneline');
  assert.equal(findCommand('enviar commits')?.command, 'git push');
  assert.equal(findCommand('atualizar repositório')?.command, 'git pull');
  assert.equal(findCommand('clonar repositório')?.command, 'git clone URL_DO_REPOSITORIO');
});

test('não inventa comandos se entrada for desconhecida/vazia', () => {
  assert.equal(findCommand(''), null);
  assert.equal(findCommand('apague tudo e reescreva o histórico'), null);
});

test('aceita Conventional Commit com escopo', () => {
  assert.deepEqual(validateCommit('feat(auth): adiciona login'), {
    valid: true, type: 'feat', typeLabel: 'Nova funcionalidade', scope: 'auth',
    breaking: false, description: 'adiciona login', tips: []
  });
});

test('aceita Conventional Commit sem escopo', () => {
  assert.equal(validateCommit('fix: corrige bug').valid, true);
});

test('aceita indicação de breaking change via !', () => {
  assert.equal(validateCommit('feat(api)!: altera resposta').breaking, true);
});

test('rejeita entrada vazia', () => {
  assert.equal(validateCommit('   ').valid, false);
});

test('rejeita mensagem sem estrutura', () => {
  assert.equal(validateCommit('corrigi o bug').valid, false);
});

test('rejeita tipo não permitido na versão acadêmica', () => {
  assert.equal(validateCommit('build: atualiza dependências').valid, false);
});

test('rejeita descrição vazia e ausência de espaço', () => {
  assert.equal(validateCommit('feat: ').valid, false);
  assert.equal(validateCommit('feat:adiciona login').valid, false);
});

test('rejeita múltiplas linhas (não analisa corpo/rodapés)', () => {
  assert.equal(validateCommit('feat: adiciona tela\n\ndetalhes').valid, false);
});

test('inclui dicas não bloqueantes para cabeçalho longo', () => {
  const result = validateCommit('feat: ' + 'a'.repeat(75));
  assert.equal(result.valid, true);
  assert.ok(result.tips.some(t => t.includes('72')));
});

test('entrada que parece HTML é tratada como descrição literal', () => {
  const result = validateCommit('feat: <img src=x onerror=alert(1)>');
  assert.equal(result.valid, true);
  assert.equal(result.description, '<img src=x onerror=alert(1)>');
});
