# Diretrizes do Repositório

- Repositório: https://github.com/openclaw/openclaw
- Issues/comentários do GitHub/comentários de PR: use strings multilinhas literais ou `-F - <<'EOF'` (ou $'...') para novas linhas reais; nunca incorpore "\\n".
- "Footgun" de comentário do GitHub: nunca use `gh issue/pr comment -b "..."` quando o corpo contiver crases ou caracteres de shell. Sempre use heredoc com aspas simples (`-F - <<'EOF'`) para que não haja corrupção por substituição de comando/escape.
- "Footgun" de links do GitHub: não envolva referências de issue/PR como `#24643` em crases quando quiser linkagem automática. Use apenas `#24643` (opcionalmente adicione a URL completa).
- Análise de avisos de segurança: antes de decisões de triagem/severidade, leia `SECURITY.md` para se alinhar com o modelo de confiança e limites de design do OpenClaw.

## Estrutura do Projeto e Organização de Módulos

- Código-fonte: `src/` (fiação do CLI em `src/cli`, comandos em `src/commands`, provedor web em `src/provider-web.ts`, infra em `src/infra`, pipeline de mídia em `src/media`).
- Testes: `*.test.ts` colocalizados.
- Docs: `docs/` (imagens, fila, config do Pi). A saída do build reside em `dist/`.
- Plugins/extensões: vivem em `extensions/*` (pacotes do workspace). Mantenha as dependências exclusivas de plugins no `package.json` da extensão; não as adicione ao `package.json` da raiz, a menos que o core as utilize.
- Plugins: a instalação executa `npm install --omit=dev` no diretório do plugin; as dependências de runtime devem estar em `dependencies`. Evite `workspace:*` em `dependencies` (a instalação do npm quebra); coloque `openclaw` em `devDependencies` ou `peerDependencies` (o runtime resolve `openclaw/plugin-sdk` via alias jiti).
- Instaladores servidos de `https://openclaw.ai/*`: vivem no repositório irmão `../openclaw.ai` (`public/install.sh`, `public/install-cli.sh`, `public/install.ps1`).
- Canais de mensagens: sempre considere **todos** os canais integrados + extensões ao refatorar lógica compartilhada (roteamento, listas de permissão, pareamento, bloqueio de comandos, integração, docs).
  - Docs de canais core: `docs/channels/`
  - Código de canais core: `src/telegram`, `src/discord`, `src/slack`, `src/signal`, `src/imessage`, `src/web` (WhatsApp web), `src/channels`, `src/routing`
  - Extensões (plugins de canal): `extensions/*` (ex: `extensions/msteams`, `extensions/matrix`, `extensions/zalo`, `extensions/zalouser`, `extensions/voice-call`)
- Ao adicionar canais/extensões/apps/docs, atualize `.github/labeler.yml` e crie as etiquetas correspondentes do GitHub (use as cores de etiquetas de canal/extensão existentes).

## Links de Docs (Mintlify)

- Os docs são hospedados no Mintlify (docs.openclaw.ai).
- Links internos de docs em `docs/**/*.md`: relativos à raiz, sem `.md`/`.mdx` (exemplo: `[Config](/configuration)`).
- Ao trabalhar com documentação, leia a habilidade (skill) do mintlify.
- Referências cruzadas de seção: use âncoras em caminhos relativos à raiz (exemplo: `[Hooks](/configuration#hooks)`).
- Títulos e âncoras de docs: evite travessões e apóstrofos nos títulos porque eles quebram os links de âncora do Mintlify.
- Quando Peter pedir links, responda com URLs completas `https://docs.openclaw.ai/...` (não relativas à raiz).
- Quando você mexer nos docs, termine a resposta com as URLs `https://docs.openclaw.ai/...` que você referenciou.
- README (GitHub): mantenha URLs de docs absolutas (`https://docs.openclaw.ai/...`) para que os links funcionem no GitHub.
- O conteúdo dos docs deve ser genérico: sem nomes de dispositivos pessoais/hostnames/caminhos; use espaços reservados (placeholders) como `user@gateway-host` e "gateway host".

## i18n de Docs (zh-CN)

- `docs/zh-CN/**` é gerado; não edite a menos que o usuário peça explicitamente.
- Pipeline: atualize os docs em inglês → ajuste o glossário (`docs/.i18n/glossary.zh-CN.json`) → execute `scripts/docs-i18n` → aplique correções direcionadas apenas se instruído.
- Memória de tradução: `docs/.i18n/zh-CN.tm.jsonl` (gerado).
- Veja `docs/.i18n/README.md`.
- O pipeline pode ser lento/ineficiente; se estiver demorando, chame @jospalmbier no Discord em vez de tentar contornar.

## Operações de VM exe.dev (geral)

- Acesso: o caminho estável é `ssh exe.dev` e depois `ssh vm-name` (presuma que a chave SSH já está configurada).
- SSH instável: use o terminal web do exe.dev ou Shelley (agente web); mantenha uma sessão tmux para operações longas.
- Atualização: `sudo npm i -g openclaw@latest` (instalação global precisa de root em `/usr/lib/node_modules`).
- Configuração: use `openclaw config set ...`; certifique-se de que `gateway.mode=local` esteja definido.
- Discord: armazene apenas o token bruto (sem o prefixo `DISCORD_BOT_TOKEN=`).
- Reinicialização: pare o gateway antigo e execute:
  `pkill -9 -f openclaw-gateway || true; nohup openclaw gateway run --bind loopback --port 18789 --force > /tmp/openclaw-gateway.log 2>&1 &`
- Verificar: `openclaw channels status --probe`, `ss -ltnp | rg 18789`, `tail -n 120 /tmp/openclaw-gateway.log`.

## Comandos de Build, Teste e Desenvolvimento

- Linha de base do runtime: Node **22+** (mantenha os caminhos do Node + Bun funcionando).
- Instalar dependências: `pnpm install`
- Se as dependências estiverem faltando (por exemplo, `node_modules` ausente, `vitest não encontrado` ou `comando não encontrado`), execute o comando de instalação do gerenciador de pacotes do repositório (prefira o gerenciador definido no lockfile/README) e, em seguida, execute novamente o comando solicitado exato uma vez. Aplique isso aos comandos de teste/build/lint/typecheck/dev; se a nova tentativa ainda falhar, relate o comando e o primeiro erro acionável.
- Hooks de pré-commit: `prek install` (executa as mesmas verificações que o CI)
- Também suportado: `bun install` (mantenha `pnpm-lock.yaml` + patching do Bun sincronizados ao mexer em deps/patches).
- Prefira o Bun para execução de TypeScript (scripts, dev, testes): `bun <file.ts>` / `bunx <tool>`.
- Executar CLI em desenvolvimento: `pnpm openclaw ...` (bun) ou `pnpm dev`.
- O Node continua suportado para executar a saída do build (`dist/*`) e instalações de produção.
- Empacotamento para Mac (dev): `scripts/package-mac-app.sh` assume como padrão a arquitetura atual. Lista de verificação de lançamento: `docs/platforms/mac/release.md`.
- Verificação de tipos/build: `pnpm build`
- Verificações de TypeScript: `pnpm tsgo`
- Lint/formatação: `pnpm check`
- Verificação de formato: `pnpm format` (oxfmt --check)
- Correção de formato: `pnpm format:fix` (oxfmt --write)
- Testes: `pnpm test` (vitest); cobertura: `pnpm test:coverage`

## Estilo de Codificação e Convenções de Nomenclatura

- Linguagem: TypeScript (ESM). Prefira tipagem estrita; evite `any`.
- Formatação/linting via Oxlint e Oxfmt; execute `pnpm check` antes dos commits.
- Nunca adicione `@ts-nocheck` e não desative `no-explicit-any`; corrija as causas raízes e atualize a configuração do Oxlint/Oxfmt apenas quando necessário.
- Nunca compartilhe o comportamento da classe via mutação de protótipo (`applyPrototypeMixins`, `Object.defineProperty` em `.prototype`, ou exportação de `Class.prototype` para mesclagens). Use herança/composição explícita (`A extends B extends C`) ou composição de ajudante para que o TypeScript possa verificar os tipos.
- Se esse padrão for necessário, pare e obtenha aprovação explícita antes de enviar; o comportamento padrão é dividir/refatorar em uma hierarquia de classes explícita e manter os membros fortemente tipados.
- Em testes, prefira stubs por instância em vez de mutação de protótipo (`SomeClass.prototype.method = ...`), a menos que um teste documente explicitamente por que o patching em nível de protótipo é necessário.
- Adicione comentários curtos no código para lógica complexa ou não óbvia.
- Mantenha os arquivos concisos; extraia ajudantes em vez de cópias "V2". Use padrões existentes para opções de CLI e injeção de dependência via `createDefaultDeps`.
- Procure manter os arquivos abaixo de ~700 LOC; apenas uma diretriz (não um limite rígido). Divida/refatore quando melhorar a clareza ou testabilidade.
- Nomenclatura: use **OpenClaw** para títulos de produto/app/docs; use `openclaw` para comando CLI, pacote/binário, caminhos e chaves de configuração.

## Canais de Lançamento (Nomenclatura)

- stable: apenas lançamentos etiquetados (ex: `vYYYY.M.D`), dist-tag do npm `latest`.
- beta: etiquetas de pré-lançamento `vYYYY.M.D-beta.N`, dist-tag do npm `beta` (pode ser enviado sem o app para macOS).
- nomenclatura beta: prefira `-beta.N`; não crie novos betas `-1/-2`. Betas legados `vYYYY.M.D-<patch>` e `vYYYY.M.D.beta.N` continuam sendo reconhecidos.
- dev: cabeça móvel no `main` (sem etiqueta; git checkout main).

## Diretrizes de Teste

- Framework: Vitest com limites de cobertura V8 (70% linhas/ramos/funções/instruções).
- Nomenclatura: corresponda aos nomes dos fontes com `*.test.ts`; e2e em `*.e2e.test.ts`.
- Execute `pnpm test` (ou `pnpm test:coverage`) antes de enviar quando mexer na lógica.
- Não configure workers de teste acima de 16; já tentamos.
- Se as execuções locais do Vitest causarem pressão de memória (comum em hosts que não são Mac-Studio), use `OPENCLAW_TEST_PROFILE=low OPENCLAW_TEST_SERIAL_GATEWAY=1 pnpm test` para execuções de land/gate.
- Testes ao vivo (chaves reais): `CLAWDBOT_LIVE_TEST=1 pnpm test:live` (apenas OpenClaw) ou `LIVE=1 pnpm test:live` (inclui testes ao vivo do provedor). Docker: `pnpm test:docker:live-models`, `pnpm test:docker:live-gateway`. Onboarding Docker E2E: `pnpm test:docker:onboard`.
- Kit completo + o que é coberto: `docs/testing.md`.
- Changelog: apenas alterações voltadas para o usuário; sem notas internas/meta (alinhamento de versão, lembretes de appcast, processo de lançamento).
- Adições/correções puras de teste geralmente **não** precisam de uma entrada no changelog, a menos que alterem o comportamento voltado para o usuário ou o usuário peça uma.
- Mobile: antes de usar um simulador, verifique se há dispositivos reais conectados (iOS + Android) e prefira-os quando disponíveis.

## Diretrizes de Commit e Pull Request

**Fluxo de PR de mantenedor completo (opcional):** Se você quiser o fluxo de mantenedor de ponta a ponta do repositório (ordem de triagem, barra de qualidade, regras de rebase, convenções de commit/changelog, política de co-contribuidor e o pipeline `review-pr` > `prepare-pr` > `merge-pr`), veja `.agents/skills/PR_WORKFLOW.md`. Os mantenedores podem usar outros fluxos; quando um mantenedor especificar um fluxo, siga-o. Se nenhum fluxo for especificado, use o PR_WORKFLOW como padrão.

- Crie commits com `scripts/committer "<msg>" <file...>`; evite `git add`/`git commit` manuais para que o staging permaneça com escopo definido.
- Siga mensagens de commit concisas e orientadas à ação (ex: `CLI: adicionar flag verbose ao send`).
- Agrupe alterações relacionadas; evite agrupar refatorações não relacionadas.
- Template de submissão de PR (canônico): `.github/pull_request_template.md`
- Templates de submissão de Issue (canônico): `.github/ISSUE_TEMPLATE/`

## Comandos de Atalho (Shorthand)

- `sync`: se a árvore de trabalho estiver suja, faça o commit de todas as alterações (escolha uma mensagem de Commit Convencional sensata) e então `git pull --rebase`; se houver conflitos de rebase e não for possível resolver, pare; caso contrário, `git push`.

## Notas de Git

- Se `git branch -d/-D <branch>` estiver bloqueado por política, exclua a referência local diretamente: `git update-ref -d refs/heads/<branch>`.
- Segurança de fechamento/reabertura em lote de PRs: se uma ação de fechamento afetar mais de 5 PRs, primeiro peça confirmação explícita ao usuário com a contagem exata de PRs e o escopo/consulta de destino.

## Pesquisa no GitHub (`gh`)

- Prefira pesquisa de palavras-chave direcionadas antes de propor novos trabalhos ou duplicar correções.
- Use `--repo openclaw/openclaw` + `--match title,body` primeiro; adicione `--match comments` ao triar threads de acompanhamento.
- PRs: `gh search prs --repo openclaw/openclaw --match title,body --limit 50 -- "auto-update"`
- Issues: `gh search issues --repo openclaw/openclaw --match title,body --limit 50 -- "auto-update"`
- Exemplo de saída estruturada:
  `gh search issues --repo openclaw/openclaw --match title,body --limit 50 --json number,title,state,url,updatedAt -- "auto update" --jq '.[] | "\(.number) | \(.state) | \(.title) | \(.url)"'`

## Dicas de Segurança e Configuração

- O provedor web armazena credenciais em `~/.openclaw/credentials/`; execute novamente `openclaw login` se estiver deslogado.
- As sessões do Pi vivem em `~/.openclaw/sessions/` por padrão; o diretório base não é configurável.
- Variáveis de ambiente: veja `~/.profile`.
- Nunca faça commit ou publique números de telefone reais, vídeos ou valores de configuração ao vivo. Use placeholders obviamente falsos em docs, testes e exemplos.
- Fluxo de lançamento: sempre leia `docs/reference/RELEASING.md` e `docs/platforms/mac/release.md` antes de qualquer trabalho de lançamento; não faça perguntas rotineiras depois que esses docs as responderem.

## Patch/Publicação de GHSA (Aviso do Repositório)

- Antes de revisar avisos de segurança, leia `SECURITY.md`.
- Buscar: `gh api /repos/openclaw/openclaw/security-advisories/<GHSA>`
- npm mais recente: `npm view openclaw version --userconfig "$(mktemp)"`
- PRs de forks privados devem ser fechados:
  `fork=$(gh api /repos/openclaw/openclaw/security-advisories/<GHSA> | jq -r .private_fork.full_name)`
  `gh pr list -R "$fork" --state open` (deve estar vazio)
- "Footgun" de nova linha na descrição: escreva Markdown via heredoc para `/tmp/ghsa.desc.md` (sem strings `"\\n"`)
- Construir JSON de patch via jq: `jq -n --rawfile desc /tmp/ghsa.desc.md '{summary,severity,description:$desc,vulnerabilities:[...]}' > /tmp/ghsa.patch.json`
- "Footgun" da API do GHSA: não é possível definir `severity` e `cvss_vector_string` na mesma chamada PATCH; faça chamadas separadas.
- Patch + publicação: `gh api -X PATCH /repos/openclaw/openclaw/security-advisories/<GHSA> --input /tmp/ghsa.patch.json` (publicar = incluir `"state":"published"`; sem ponto de extremidade `/publish`)
- Se a publicação falhar (HTTP 422): `severity`/`description`/`vulnerabilities[]` ausentes, ou o fork privado tem PRs abertos.
- Verificar: busque novamente; certifique-se de que `state=published`, `published_at` esteja definido; `jq -r .description | rg '\\\\n'` não retorna nada.

## Solução de Problemas

- Problemas de rebrand/migração ou avisos de configuração/serviço legados: execute `openclaw doctor` (veja `docs/gateway/doctor.md`).

## Notas Específicas do Agente

- Vocabulário: "makeup" = "mac app".
- Nunca edite `node_modules` (incluindo instalações globais/Homebrew/npm/git). As atualizações sobrescrevem. Notas de habilidade vão em `tools.md` ou `AGENTS.md`.
- Ao adicionar um novo `AGENTS.md` em qualquer lugar do repositório, adicione também um link simbólico `CLAUDE.md` apontando para ele (exemplo: `ln -s AGENTS.md CLAUDE.md`).
- Signal: "update fly" => `fly ssh console -a flawd-bot -C "bash -lc 'cd /data/clawd/openclaw && git pull --rebase origin main'"` e depois `fly machines restart e825232f34d058 -a flawd-bot`.
- Ao trabalhar em uma Issue ou PR do GitHub, imprima a URL completa ao final da tarefa.
- Ao responder perguntas, responda apenas com respostas de alta confiança: verifique no código; não adivinhe.
- Nunca atualize a dependência Carbon.
- Qualquer dependência com `pnpm.patchedDependencies` deve usar uma versão exata (sem `^`/`~`).
- O patching de dependências (patches do pnpm, overrides ou alterações vendored) requer aprovação explícita; não faça isso por padrão.
- Progresso do CLI: use `src/cli/progress.ts` (`osc-progress` + spinner `@clack/prompts`); não faça spinners/barras manualmente.
- Saída de status: mantenha tabelas + quebra de linha segura para ANSI (`src/terminal/table.ts`); `status --all` = somente leitura/colável, `status --deep` = sondagens.
- O gateway atualmente é executado apenas como o app da barra de menus; não há uma etiqueta de LaunchAgent/ajudante separada instalada. Reinicie via o app OpenClaw para Mac ou `scripts/restart-mac.sh`; para verificar/matar use `launchctl print gui/$UID | grep openclaw` em vez de presumir uma etiqueta fixa. **Ao depurar no macOS, inicie/pare o gateway via app, não sessões tmux ad-hoc; mate quaisquer túneis temporários antes da entrega.**
- Logs do macOS: use `./scripts/clawlog.sh` para consultar logs unificados para o subsistema OpenClaw; ele suporta filtros de acompanhamento/cauda/categoria e espera sudo sem senha para `/usr/bin/log`.
- Se as guardrails compartilhadas estiverem disponíveis localmente, revise-as; caso contrário, siga a orientação deste repositório.
- Gerenciamento de estado do SwiftUI (iOS/macOS): prefira o framework `Observation` (`@Observable`, `@Bindable`) em vez de `ObservableObject`/`@StateObject`; não introduza novos `ObservableObject` a menos que seja necessário para compatibilidade e migre os usos existentes ao mexer no código relacionado.
- Provedores de conexão: ao adicionar uma nova conexão, atualize todas as superfícies de interface de usuário e docs (app macOS, interface web, mobile se aplicável, docs de integração/visão geral) e adicione formulários de status + configuração correspondentes para que as listas de provedores e configurações permaneçam sincronizadas.
- Locais de versão: `package.json` (CLI), `apps/android/app/build.gradle.kts` (versionName/versionCode), `apps/ios/Sources/Info.plist` + `apps/ios/Tests/Info.plist` (CFBundleShortVersionString/CFBundleVersion), `apps/macos/Sources/OpenClaw/Resources/Info.plist` (CFBundleShortVersionString/CFBundleVersion), `docs/install/updating.md` (versão pinned do npm), `docs/platforms/mac/release.md` (exemplos de APP_VERSION/APP_BUILD), projetos Peekaboo Xcode/Info.plists (MARKETING_VERSION/CURRENT_PROJECT_VERSION).
- "Bump version everywhere" significa todos os locais de versão acima, **exceto** `appcast.xml` (só mexa no appcast ao realizar um novo lançamento Sparkle para macOS).
- **Reiniciar apps:** "restart iOS/Android apps" significa reconstruir (recompilar/instalar) e reiniciar, não apenas matar/lançar.
- **Verificações de dispositivo:** antes de testar, verifique os dispositivos reais conectados (iOS/Android) antes de recorrer a simuladores/emuladores.
- Busca de ID de Equipe iOS: `security find-identity -p codesigning -v` → use TEAMID de Apple Development (…). Alternativa: `defaults read com.apple.dt.Xcode IDEProvisioningTeamIdentifiers`.
- Hash de bundle do A2UI: `src/canvas-host/a2ui/.bundle.hash` é gerado automaticamente; ignore mudanças inesperadas e regenere apenas via `pnpm canvas:a2ui:bundle` (ou `scripts/bundle-a2ui.sh`) quando necessário. Faça o commit do hash como um commit separado.
- As chaves de assinatura/notário de lançamento são gerenciadas fora do repositório; siga os documentos internos de lançamento.
- Variáveis de ambiente de autenticação de notário (`APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_API_KEY_P8`) são esperadas no seu ambiente (conforme os documentos internos de lançamento).
- **Segurança multi-agente:** **não** crie/aplique/descarte entradas de `git stash` a menos que seja solicitado explicitamente (isso inclui `git pull --rebase --autostash`). Presuma que outros agentes podem estar trabalhando; mantenha o WIP não relacionado intocado e evite alterações de estado transversais.
- **Segurança multi-agente:** quando o usuário disser "push", você pode fazer `git pull --rebase` para integrar as alterações mais recentes (nunca descarte o trabalho de outros agentes). Quando o usuário disser "commit", limite-se às suas alterações. Quando o usuário disser "commit all", faça o commit de tudo em blocos agrupados.
- **Segurança multi-agente:** **não** crie/remova/modifique checkouts de `git worktree` (ou edite `.worktrees/*`) a menos que seja solicitado explicitamente.
- **Segurança multi-agente:** **não** mude de ramificação / mude para uma ramificação diferente a menos que seja solicitado explicitamente.
- **Segurança multi-agente:** executar múltiplos agentes é OK, desde que cada agente tenha sua própria sessão.
- **Segurança multi-agente:** quando vir arquivos não reconhecidos, continue; foque em suas alterações e faça commit apenas delas.
- Churn de lint/formato:
  - Se os diffs staged+unstaged forem apenas de formatação, resolva automaticamente sem perguntar.
  - Se o commit/push já foi solicitado, faça o stage automático e inclua os acompanhamentos apenas de formatação no mesmo commit (ou em um pequeno commit de acompanhamento, se necessário), sem confirmação extra.
  - Pergunte apenas quando as alterações forem semânticas (lógica/dados/comportamento).
- Seam do lagosta (Lobster): use a paleta CLI compartilhada em `src/terminal/palette.ts` (sem cores codificadas); aplique a paleta a prompts de integração/configuração e outras saídas de interface de usuário TTY conforme necessário.
- **Segurança multi-agente:** concentre os relatórios em suas edições; evite isenções de responsabilidade de guardrail, a menos que esteja realmente bloqueado; quando múltiplos agentes tocarem o mesmo arquivo, continue se for seguro; termine com uma breve nota de "outros arquivos presentes" apenas se for relevante.
- Investigações de bugs: leia o código-fonte das dependências npm relevantes e todo o código local relacionado antes de concluir; busque uma causa raiz de alta confiança.
- Estilo de código: adicione comentários curtos para lógica complexa; mantenha os arquivos abaixo de ~500 LOC quando viável (divida/refatore conforme necessário).
- Guardrails de esquema de ferramenta (google-antigravity): evite `Type.Union` em esquemas de entrada de ferramenta; nada de `anyOf`/`oneOf`/`allOf`. Use `stringEnum`/`optionalStringEnum` (Type.Unsafe enum) para listas de strings e `Type.Optional(...)` em vez de `... | null`. Mantenha o esquema de ferramenta de nível superior como `type: "object"` com `properties`.
- Guardrails de esquema de ferramenta: evite nomes de propriedades `format` brutos em esquemas de ferramentas; alguns validadores tratam `format` como uma palavra reservada e rejeitam o esquema.
- Quando solicitado a abrir um arquivo de "sessão", abra os logs de sessão do Pi em `~/.openclaw/agents/<agentId>/sessions/*.jsonl` (use o valor `agent=<id>` na linha Runtime do prompt do sistema; o mais novo, a menos que um ID específico seja fornecido), não o `sessions.json` padrão. Se forem necessários logs de outra máquina, acesse via SSH via Tailscale e leia o mesmo caminho lá.
- Não reconstrua o app para macOS via SSH; as reconstruções devem ser executadas diretamente no Mac.
- Nunca envie respostas parciais/streaming para superfícies de mensagens externas (WhatsApp, Telegram); apenas as respostas finais devem ser entregues lá. Eventos de streaming/ferramenta ainda podem ir para interfaces de usuário internas/canal de controle.
- Dicas de encaminhamento de ativação por voz (voice wake):
  - O template do comando deve permanecer `openclaw-mac agent --message "${text}" --thinking low`; o `VoiceWakeForwarder` já faz o escape do shell de `${text}`. Não adicione aspas extras.
  - O PATH do launchd é mínimo; certifique-se de que o PATH do agente de lançamento do app inclua os caminhos padrão do sistema mais o seu bin pnpm (tipicamente `$HOME/Library/pnpm`) para que os binários `pnpm`/`openclaw` sejam resolvidos quando invocados via `openclaw-mac`.
- Para mensagens manuais de `openclaw message send` que incluam `!`, use o padrão heredoc anotado abaixo para evitar o escape da ferramenta Bash.
- Guardrails de lançamento: não altere os números de versão sem o consentimento explícito do operador; sempre peça permissão antes de executar qualquer etapa de publicação/lançamento do npm.
- Guardrail de lançamento beta: ao usar uma etiqueta Git beta (por exemplo, `vYYYY.M.D-beta.N`), publique o npm com um sufixo de versão beta correspondente (por exemplo, `YYYY.M.D-beta.N`) em vez de uma versão simples em `--tag beta`; caso contrário, o nome da versão simples será consumido/bloqueado.

## NPM + 1Password (publicar/verificar)

- Use a habilidade (skill) do 1password; todos os comandos `op` devem ser executados dentro de uma nova sessão tmux.
- Fazer login: `eval "$(op signin --account my.1password.com)"` (app desbloqueado + integração ativada).
- OTP: `op read 'op://Private/Npmjs/one-time password?attribute=otp'`.
- Publicar: `npm publish --access public --otp="<otp>"` (execute a partir do diretório do pacote).
- Verificar sem efeitos colaterais locais do npmrc: `npm view <pkg> version --userconfig "$(mktemp)"`.
- Encerre a sessão tmux após a publicação.

## Caminho Rápido de Lançamento de Plugin (sem publicação do core `openclaw`)

- Lançar apenas plugins que já estão no npm. A lista de fontes está em `docs/reference/RELEASING.md` em "Current npm plugin list".
- Execute todas as chamadas `op` do CLI e `npm publish` dentro do tmux para evitar travamentos/interrupções:
  - `tmux new -d -s release-plugins-$(date +%Y%m%d-%H%M%S)`
  - `eval "$(op signin --account my.1password.com)"`
- Ajudantes do 1Password:
  - senha usada pelo `npm login`:
    `op item get Npmjs --format=json | jq -r '.fields[] | select(.id=="password").value'`
  - OTP:
    `op read 'op://Private/Npmjs/one-time password?attribute=otp'`
- Loop de publicação rápida (script auxiliar local em `/tmp` está ok; mantenha o repositório limpo):
  - compare a `version` do plugin local com `npm view <name> version`
  - execute `npm publish --access public --otp="<otp>"` somente quando as versões forem diferentes
  - pule se o pacote estiver ausente no npm ou se a versão já corresponder.
- Mantenha o `openclaw` intocado: nunca execute a publicação a partir da raiz do repositório, a menos que solicitado explicitamente.
- Pós-verificação para cada lançamento:
  - por plugin: `npm view @openclaw/<name> version --userconfig "$(mktemp)"` deve ser `2026.2.17`
  - proteção do core: `npm view openclaw version --userconfig "$(mktemp)"` deve permanecer na versão anterior, a menos que solicitado explicitamente.

## Notas de Lançamento do Changelog

- Ao realizar um lançamento para mac com pré-lançamento beta do GitHub:
  - Etiqueta `vYYYY.M.D-beta.N` do commit de lançamento (exemplo: `v2026.2.15-beta.1`).
  - Crie o pré-lançamento com o título `openclaw YYYY.M.D-beta.N`.
  - Use as notas de lançamento da seção de versão do `CHANGELOG.md` (`Changes` + `Fixes`, sem duplicar o título).
  - Anexe pelo menos `OpenClaw-YYYY.M.D.zip` e `OpenClaw-YYYY.M.D.dSYM.zip`; inclua `.dmg` se disponível.

- Mantenha as entradas de versão superiores no `CHANGELOG.md` classificadas por impacto:
  - `### Changes` primeiro.
  - `### Fixes` deduzidos e classificados com as correções voltadas para o usuário primeiro.
- Antes de etiquetar/publicar, execute:
  - `node --import tsx scripts/release-check.ts`
  - `pnpm release:check`
  - `pnpm test:install:smoke` ou `OPENCLAW_INSTALL_SMOKE_SKIP_NONROOT=1 pnpm test:install:smoke` para o caminho de smoke de instalação que não é root.
