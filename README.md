<p align="center">
  <img src="https://docs.openclaw.ai/images/og/brand.png" width="400" alt="OpenClaw Logo">
</p>

# OpenClaw

**OpenClaw** é um assistente de IA de nível profissional que funciona no seu computador, usa suas ferramentas e segue suas regras. Ele não é apenas um chatbot; é um ambiente de execução de agentes projetado para fazer o trabalho real por você.

- **🤖 Agentes Poderosos**: Capazes de ler e escrever arquivos, executar códigos, pesquisar na web e gerenciar projetos complexos.
- **🛠️ Habilidades Extensíveis**: Adicione novas capacidades facilmente através de [Habilidades (Skills)](https://docs.openclaw.ai/skills/introduction) ou [MCP](https://docs.openclaw.ai/skills/mcp).
- **📱 Multicanal**: Fale com seu assistente via Terminal, Discord, Telegram, WhatsApp, Slack, iMessage, Signal e muito mais.
- **🔐 Segurança Primeiro**: Modelo de confiança pessoal com sandboxing de Docker, aprovações de execução e auditorias de segurança integradas.
- **🌎 Independência de Modelo**: Suporta Anthropic, OpenAI, Google Gemini, Mistral, Ollama e mais de 50 outros provedores.
- **🖥️ Apps de Companhia**: Disponível para macOS, iOS, Android, Windows e Linux.

---

## 🚀 Início Rápido

### Instalação em um Passo (macOS/Linux)

```bash
curl -fsSL https://openclaw.ai/install.sh | sh
```

### Usando pnpm (Recomendado para Desenvolvedores)

```bash
pnpm add -g openclaw
openclaw onboard
```

### Executando em Docker

```bash
docker run -it -v ~/.openclaw:/app/data openclaw/openclaw
```

---

## 📖 Documentação

Documentação completa disponível em: **[docs.openclaw.ai](https://docs.openclaw.ai)**

- [Configuração de Canais](https://docs.openclaw.ai/channels/overview)
- [Guia de Habilidades](https://docs.openclaw.ai/skills/introduction)
- [Auditoria de Segurança](https://docs.openclaw.ai/gateway/security)
- [MCP (Model Context Protocol)](https://docs.openclaw.ai/skills/mcp)
- [Implantação em Servidor (Gateway)](https://docs.openclaw.ai/gateway/overview)

---

## 🦞 Por que OpenClaw?

A maioria dos assistentes de IA está presa em uma aba do navegador ou isolada da sua realidade. O OpenClaw rompe essas barreiras:

1. **Contexto**: Ele vive onde você vive. Ele pode ler seu código, acessar seus arquivos de log e entender seus projetos.
2. **Ação**: Ele não apenas "diz" como fazer algo; ele pode realmente executá-lo, testá-lo e fazer o commit.
3. **Liberdade**: Troque de modelo em segundos se um provedor estiver fora do ar ou se um modelo novo e melhor for lançado.
4. **Privacidade**: Seus dados permanecem nos seus dispositivos. Você controla o que é compartilhado e com quem.

---

## 🤝 Contribuindo

Adoramos contribuições! Se você é um desenvolvedor querendo ajudar a construir o futuro da assistência de IA:

1. Leia nosso **[VISION.md](VISION.md)** para entender para onde estamos indo.
2. Confira nosso **[CONTRIBUTING.md](CONTRIBUTING.md)** para diretrizes de desenvolvimento.
3. Junte-se ao nosso **[Discord](https://discord.gg/qkhbAGHRBT)** para conversar com a equipe e outros usuários.

---

## 🏛️ Filosofia e Governança

O OpenClaw é mantido como um projeto de código aberto [BFL (Benevolent Fork for Life)](VISION.md#philosophy). Somos focados na comunidade, pragmáticos e priorizamos a utilidade em vez do hype.

---

## 📄 Licenças

O OpenClaw é licenciado sob as licenças MIT e Apache 2.0. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

(c) 2024-2026 OpenClaw Contributors.
