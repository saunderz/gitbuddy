# GitBuddy — Assistente de Git

Aplicação web didática que reúne **um explorador de comandos Git** e **um validador simplificado de mensagens de commit**. Projeto individual da disciplina Desenvolvimento de Sistemas Web (EECP0036), UFMA, 2026.2.

**Trilha C — sem API.** Implementado com HTML semântico, CSS responsivo e JavaScript puro, sem frameworks, sem backend e sem serviços externos.

## Funcionalidades

1. **Comandos Git:** o usuário descreve uma tarefa em português (por exemplo, `criar uma branch`), clica em **Encontrar comando** e recebe um comando cadastrado, com explicação e botão para copiar. O catálogo possui 10 operações.
2. **Validador de commits:** o usuário escreve `feat(auth): adiciona login` e clica em **Validar mensagem**. O resultado identifica tipo, escopo e descrição; mensagens fora do padrão recebem orientações.
3. **Persistência local:** a última entrada utilizada em cada ferramenta é guardada no `localStorage` e reaparece após recarregar a página.
4. **Tratamento de erros:** campos vazios, consultas não reconhecidas e mensagens de commit inválidas geram avisos sem interromper o aplicativo.

O GitBuddy **não executa comandos Git**, **não acessa repositórios**, **não consulta APIs** e **não compreende qualquer instrução em linguagem natural**. Ele usa apenas uma lista previamente cadastrada de padrões. O validador cobre **uma linha de cabeçalho** e apenas os seis tipos `feat`, `fix`, `docs`, `refactor`, `test` e `chore`. Outros tipos válidos pela especificação completa não são aceitos nesta versão didática; também não são verificados corpo ou rodapés de commits.

## Como rodar

É necessário somente um navegador moderno e um servidor local HTTP.

### Opção 1 — Python

```bash
cd gitbuddy
python -m http.server 8000
```

Abra **http://localhost:8000** no navegador.

### Opção 2 — VS Code

Abra a pasta do projeto no VS Code e utilize a extensão **Live Server** para abrir `index.html`.

> Não abra o `index.html` diretamente por `file://`: o aplicativo utiliza módulos JavaScript (`type="module"`), que devem ser servidos por HTTP.

## Como usar

**Encontrar comando:** escreva `criar uma branch` e clique em **Encontrar comando**. Resultado esperado: `git switch -c minha-branch`, com explicação e opção para copiar.

**Validar commit:** selecione a aba **Validar commit**, escreva `feat(auth): adiciona login` e clique em **Validar mensagem**. Resultado esperado: **Commit válido**; tipo `feat`, escopo `auth` e descrição `adiciona login`.

**Casos de erro:** experimente deixar o campo vazio ou inserir `corrigi o bug` como mensagem de commit. O GitBuddy deve mostrar o problema e informar o formato esperado.

## Estrutura do projeto

```text
gitbuddy/
├── index.html           # Estrutura e conteúdo HTML semântico
├── css/
│   └── styles.css       # Estilos e layout responsivo
├── js/
│   ├── app.js           # Eventos, abas, renderização e localStorage
│   ├── commands.js      # Catálogo didático de comandos Git
│   └── logic.js         # Regras de consulta e validação
├── assets/
│   └── favicon.svg
├── tests/
│   └── logic.test.mjs   # Testes automatizados (Node.js)
├── docs/                # Adicionar aqui o print da aba Rede
├── package.json         # Executa testes (não instala dependências)
└── README.md
```

## Testes automatizados (opcionais)

Com Node.js instalado, execute na pasta do projeto:

```bash
npm test
```

São cobertos: normalização de consultas, comandos conhecidos, consulta desconhecida, commits válidos/inválidos, campos vazios, múltiplas linhas, comprimento longo e texto que parece HTML. Não é necessário instalar pacotes externos.

## Aba Rede (Network) — evidência obrigatória

**PENDENTE DE CAPTURA NO NAVEGADOR DO ESTUDANTE.** Para concluir a entrega, siga os passos:

1. Rode a página usando Live Server ou `python -m http.server 8000`.
2. Pressione **F12**, escolha **Rede (Network)** e recarregue a página com **Ctrl+R**.
3. Clique na requisição principal (`localhost` ou `index.html`, do tipo *document*) e abra **Cabeçalhos (Headers)**.
4. Capture uma imagem na qual apareçam **Request Method: GET**, **Request URL** e **Status Code: 200**. Salve o arquivo como `docs/rede-network.png`.
5. Substitua a linha abaixo pelo Markdown indicado quando a imagem existir no projeto:

`![Captura da aba Rede com GET, URL e status 200](docs/rede-network.png)`

**Explicação para o print (2–3 linhas):** A aba Rede mostra a requisição HTTP feita pelo navegador ao servidor local para carregar o documento principal da aplicação. O método `GET` solicita a página no endereço exibido em **Request URL**, e o status `200 OK` confirma que o servidor respondeu com sucesso. Como o GitBuddy é da Trilha C, não existem chamadas a APIs externas.

> A captura é feita no computador do aluno para mostrar uma requisição real, como exige a atividade; não foi gerada uma imagem simulada.

## Segurança e cuidados

- O aplicativo usa `textContent` para inserir dados vindos dos campos e do catálogo, **nunca `innerHTML` para dados dinâmicos**.
- Campos vazios mostram avisos; consultas não reconhecidas não geram comandos inventados.
- Acesso ao `localStorage` é protegido por `try/catch` para que falhas no armazenamento não interrompam o aplicativo.
- Não utiliza senhas, chaves de API, cookies ou envio de informações para servidores externos.
- Evite digitar dados sensíveis, pois a última entrada fica salva no navegador utilizado.
- Comandos exibidos são exemplos. Confira o contexto do repositório antes de executá-los manualmente.

## Uso de inteligência artificial (declaração)

**Ferramenta:** ChatGPT (OpenAI).

**Para quê foi utilizada:** planejamento da aplicação a partir da proposta GitBuddy, sugestão de interface, geração inicial do HTML/CSS/JavaScript, revisão da lógica, sugestões de testes e elaboração do README.

**O que foi definido/alterado durante o planejamento:** o estudante selecionou a combinação de dois aplicativos originalmente discutidos separadamente (assistente de comandos e validador de commits), com escopo limitado à Trilha C, sem API. **Antes da entrega, registrar aqui as revisões e modificações pessoais que forem efetivamente realizadas no código.** Não declare alterações inexistentes.

O aluno deve conseguir explicar a lógica das funções `findCommand`, `validateCommit`, dos eventos de formulário e do armazenamento local.

## Referências

- [Git — documentação oficial](https://git-scm.com/docs)
- [Git switch — documentação oficial](https://git-scm.com/docs/git-switch)
- [Conventional Commits 1.0.0 — especificação em português](https://www.conventionalcommits.org/pt-br/v1.0.0/)

## Publicação no GitHub e entrega

Crie um repositório **público** chamado `gitbuddy`, publique todos os arquivos, inclua o print de Rede antes da entrega e faça commits descritivos ao longo do desenvolvimento.

A tarefa no SIGAA solicita o **link público do repositório**, não o envio de um ZIP. Prazo informado: **28/10/2026, 23h59**.

Caso o repositório ainda não tenha sido inicializado:

```bash
git init
git add .
git commit -m "feat: implementa ferramentas GitBuddy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gitbuddy.git
git push -u origin main
```

Substitua `SEU_USUARIO` por seu usuário real no GitHub. Se já existir um histórico Git local, não execute novamente `git init`/`git commit`: basta configurar o remoto e publicar o histórico existente.
