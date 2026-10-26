/**
 * Catálogo educativo de comandos Git seguros de consultar.
 * Expressões testadas contra texto normalizado (sem acentos, minúsculas).
 * Não são executadas instruções nem acessados repositórios.
 */
export const COMMANDS = [
  {
    id: "create-branch", title: "Criar uma nova branch", category: "Branches",
    command: "git switch -c minha-branch",
    description: "Cria a branch 'minha-branch' e muda para ela no mesmo comando.",
    explanation: "A opção -c cria a branch. Troque 'minha-branch' pelo nome desejado.",
    example: "criar uma branch",
    patterns: [/(criar|abrir|nova|novo).*(branch|ramificacao)/, /^(branch nova)$/]
  },
  {
    id: "switch-branch", title: "Trocar de branch", category: "Branches",
    command: "git switch nome-da-branch",
    description: "Muda para uma branch local já existente.",
    explanation: "Substitua 'nome-da-branch' pelo nome real da branch.",
    example: "trocar de branch",
    patterns: [/(trocar|mudar|alternar|entrar|acessar).*(branch|ramificacao)/]
  },
  {
    id: "status", title: "Verificar alterações", category: "Arquivos",
    command: "git status",
    description: "Mostra alterações preparadas, não preparadas e arquivos não rastreados.",
    explanation: "É um bom primeiro passo antes de adicionar arquivos ou criar commits.",
    example: "ver alterações",
    patterns: [/(ver|mostrar|consultar|checar|conferir|listar).*(status|alteracoes|arquivos modificados)/, /^status$/, /^git status$/]
  },
  {
    id: "add", title: "Preparar alterações", category: "Arquivos",
    command: "git add .",
    description: "Adiciona as mudanças da pasta atual à área de preparação (staging).",
    explanation: "Confira 'git status' antes: este comando pode incluir arquivos indesejados. Para um arquivo, use 'git add caminho/arquivo'.",
    example: "adicionar alterações",
    patterns: [/(adicionar|preparar|colocar).*(arquivos|arquivo|alteracoes|stage|staging)/, /^git add( \.)?$/, /^add$/]
  },
  {
    id: "commit", title: "Registrar um commit", category: "Histórico",
    command: 'git commit -m "feat: adiciona funcionalidade"',
    description: "Cria um commit usando os arquivos já preparados na área de staging.",
    explanation: "Personalize a mensagem. Use a aba 'Validar commit' para revisar o formato antes.",
    example: "criar um commit",
    patterns: [/(fazer|criar|registrar|salvar|gravar).*(commit|versao)/, /^git commit$/, /^commit$/]
  },
  {
    id: "log", title: "Consultar histórico de commits", category: "Histórico",
    command: "git log --oneline",
    description: "Exibe uma lista resumida dos commits registrados.",
    explanation: "Cada linha apresenta um identificador curto e a mensagem do commit.",
    example: "consultar histórico",
    patterns: [/(ver|mostrar|consultar|listar).*(historico|commits|log)/, /^git log$/, /^historico$/, /^log$/]
  },
  {
    id: "diff", title: "Comparar mudanças", category: "Arquivos",
    command: "git diff",
    description: "Mostra as diferenças ainda não preparadas nos arquivos rastreados.",
    explanation: "Para revisar mudanças já preparadas, use 'git diff --staged'.",
    example: "ver diferenças",
    patterns: [/(ver|mostrar|comparar|revisar).*(diferencas|diff|mudancas|o que mudou)/, /^git diff$/, /^diff$/]
  },
  {
    id: "clone", title: "Clonar repositório", category: "Remoto",
    command: "git clone URL_DO_REPOSITORIO",
    description: "Cria uma cópia local de um repositório remoto.",
    explanation: "Substitua 'URL_DO_REPOSITORIO' pelo endereço HTTPS ou SSH do repositório.",
    example: "clonar repositório",
    patterns: [/(clonar|copiar).*(repositorio|projeto)/, /^git clone$/, /^clone$/]
  },
  {
    id: "push", title: "Enviar commits ao remoto", category: "Remoto",
    command: "git push",
    description: "Envia commits locais ao remoto associado à branch atual.",
    explanation: "Pode ser necessário configurar a branch remota inicialmente com 'git push -u origin nome-da-branch'.",
    example: "enviar commits",
    patterns: [/(enviar|subir|publicar).*(commits|alteracoes|mudancas|remoto|git)/, /^git push$/, /^push$/]
  },
  {
    id: "pull", title: "Atualizar branch local", category: "Remoto",
    command: "git pull",
    description: "Busca alterações remotas e tenta integrá-las à branch atual.",
    explanation: "Dependendo das mudanças, pode haver conflitos que exigem resolução manual.",
    example: "atualizar repositório",
    patterns: [/(baixar|atualizar|puxar|sincronizar).*(repositorio|alteracoes|branch|remoto)/, /^git pull$/, /^pull$/]
  },
];
