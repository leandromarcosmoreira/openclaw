> **⚠️ FORK** — Este repositório é um fork de [openclaw/openclaw](https://github.com/openclaw/openclaw).
> Repositório deste fork: [leandromarcosmoreira/openclaw](https://github.com/leandromarcosmoreira/openclaw)

---

# 🦞 OpenClaw — Assistente Pessoal de IA

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.png">
        <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.png" alt="OpenClaw" width="500">
    </picture>
</p>

<p align="center">
  <strong>EXFOLIATE! EXFOLIATE!</strong>
</p>

<p align="center">
    <a href="https://github.com/openclaw/openclaw/releases/latest"><img src="https://img.shields.io/github/v/release/openclaw/openclaw" alt="Versão mais recente"></a>
    <a href="https://github.com/openclaw/openclaw/blob/main/LICENSE"><img src="https://img.shields.io/github/license/openclaw/openclaw" alt="Licença"></a>
    <a href="https://discord.gg/openclaw"><img src="https://img.shields.io/discord/1234567890?label=Discord" alt="Discord"></a>
</p>

---

## O que é o OpenClaw?

O OpenClaw é um assistente pessoal de IA que roda no seu computador. Ele se conecta aos seus aplicativos, arquivos e serviços para ajudá-lo a realizar tarefas usando linguagem natural.

Diferente de assistentes baseados em nuvem, o OpenClaw é executado localmente — seus dados ficam no seu computador.

## Índice

- [Instalação](#instalação)
- [Início Rápido](#início-rápido)
- [Canais](#canais)
- [Arquitetura](#arquitetura)
- [Segurança](#segurança)
- [Aplicativos Complementares](#aplicativos-complementares)
- [Integrações](#integrações)
- [Comunidade](#comunidade)

---

## Instalação

### macOS e Linux

```bash
curl -fsSL https://openclaw.ai/install.sh | sh
```

### Windows

```powershell
irm https://openclaw.ai/install.ps1 | iex
```

### Via pip

```bash
pip install openclaw
```

### A partir do código-fonte

```bash
git clone git@github.com:leandromarcosmoreira/openclaw.git
cd openclaw
pip install -e .
```

---

## Início Rápido

Após a instalação, inicie o OpenClaw:

```bash
openclaw
```

Na primeira execução, o OpenClaw irá:
1. Criar um diretório de configuração em `~/.openclaw/`
2. Solicitar que você configure um modelo de IA (Ollama, Claude, OpenAI, etc.)
3. Iniciar o servidor local

### Configuração Básica

Edite `~/.openclaw/config.yaml`:

```yaml
model:
  provider: ollama
  name: llama3.2

channels:
  - type: terminal
    enabled: true
```

---

## Canais

O OpenClaw se comunica através de múltiplos canais:

### Terminal

Interaja diretamente pelo terminal:

```bash
openclaw chat "Qual é o tamanho da minha pasta de downloads?"
```

### WhatsApp

Configure o canal WhatsApp em `~/.openclaw/config.yaml`:

```yaml
channels:
  - type: whatsapp
    enabled: true
    phone_number: "+55 11 99999-9999"
```

### Telegram

```yaml
channels:
  - type: telegram
    enabled: true
    bot_token: "SEU_TOKEN_BOT"
```

### Discord

```yaml
channels:
  - type: discord
    enabled: true
    bot_token: "SEU_TOKEN_BOT"
    guild_id: "SEU_ID_SERVIDOR"
```

### Slack

```yaml
channels:
  - type: slack
    enabled: true
    bot_token: "xoxb-SEU-TOKEN"
```

### E-mail

```yaml
channels:
  - type: email
    enabled: true
    imap_server: "imap.gmail.com"
    smtp_server: "smtp.gmail.com"
    address: "seu@email.com"
    password: "sua_senha_de_app"
```

---

## Arquitetura

```
~/.openclaw/
├── config.yaml          # Configuração principal
├── agents/              # Agentes configurados
│   └── meu-agente/
│       ├── SOUL.md      # Personalidade e instruções
│       └── TOOLS.md     # Ferramentas disponíveis
├── sessions/            # Histórico de sessões
└── data/                # Dados locais
```

### Agentes

O OpenClaw suporta múltiplos agentes, cada um com sua própria personalidade e conjunto de ferramentas.

**Criando um Agente:**

```bash
mkdir -p ~/.openclaw/agents/meu-agente
```

**SOUL.md** — Define a personalidade:
```markdown
# Meu Agente

Você é um assistente especializado em análise de dados.
Sempre responda em português do Brasil.
Seja conciso e objetivo.
```

**TOOLS.md** — Define as ferramentas disponíveis:
```markdown
# Ferramentas Disponíveis

- Leitura e escrita de arquivos
- Execução de comandos shell
- Acesso à internet
- Integração com ClawController
```

---

## Segurança

O OpenClaw foi projetado com segurança em mente:

- **Execução local**: Seus dados nunca saem do seu computador (exceto quando você explicitamente usa serviços externos)
- **Permissões explícitas**: Cada ferramenta requer permissão explícita para ser ativada
- **Auditoria**: Todas as ações são registradas em `~/.openclaw/sessions/`
- **Isolamento**: Cada agente opera em seu próprio contexto

### Configuração de Permissões

```yaml
security:
  require_confirmation:
    - file_write
    - shell_execute
    - network_request
  allowed_directories:
    - ~/Documentos
    - ~/Projetos
```

---

## Aplicativos Complementares

### ClawController

O [ClawController](https://github.com/leandromarcosmoreira/ClawController) é um painel de controle para gerenciar múltiplos agentes OpenClaw:

- Visualize o status de todos os agentes
- Atribua tarefas estruturadas
- Acompanhe o progresso em tempo real
- Quadro Kanban integrado

```bash
# Instalar ClawController
git clone git@github.com:leandromarcosmoreira/ClawController.git
cd ClawController && ./start.sh
```

---

## Integrações

### Modelos de IA

| Provedor | Configuração |
|----------|-------------|
| **Ollama** (local) | `provider: ollama` |
| **Claude** (Anthropic) | `provider: anthropic` |
| **GPT-4** (OpenAI) | `provider: openai` |
| **Gemini** (Google) | `provider: google` |
| **Mistral** | `provider: mistral` |
| **Groq** | `provider: groq` |

### Ferramentas e Serviços

#### Produtividade
- Google Calendar, Google Drive, Google Docs
- Notion, Obsidian, Roam Research
- Todoist, Linear, Jira
- Slack, Discord, Telegram

#### Desenvolvimento
- GitHub, GitLab, Bitbucket
- VS Code, JetBrains IDEs
- Docker, Kubernetes
- AWS, GCP, Azure

#### Dados e Análise
- PostgreSQL, MySQL, SQLite
- MongoDB, Redis
- Pandas, NumPy (via Python)
- Excel, Google Sheets

#### Comunicação
- Gmail, Outlook
- WhatsApp, Signal
- Zoom, Google Meet

### Frameworks de IA

- **LangChain** — Orquestração de LLMs
- **LlamaIndex** — Indexação e busca em documentos
- **CrewAI** — Sistemas multi-agente
- **AutoGPT** — Agentes autônomos

---

## Comunidade

- **Discord:** [discord.gg/openclaw](https://discord.gg/openclaw)
- **GitHub Discussions:** [github.com/openclaw/openclaw/discussions](https://github.com/openclaw/openclaw/discussions)
- **Reddit:** [r/openclaw](https://reddit.com/r/openclaw)
- **𝕏 (Twitter):** [@openclaw_ai](https://x.com/openclaw_ai)

---

## Contribuindo

Contribuições são bem-vindas! Por favor, abra issues e pull requests no repositório deste fork:
[leandromarcosmoreira/openclaw](https://github.com/leandromarcosmoreira/openclaw)

Para contribuir com o projeto original, acesse: [openclaw/openclaw](https://github.com/openclaw/openclaw)

---

## Licença

MIT — veja [LICENSE](LICENSE) para detalhes.
