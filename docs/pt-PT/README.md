# OpenClaw 🦞

Um gateway multi-canal para agentes de IA que roda em qualquer sistema operacional.

## Características Principais

- **Multi-canal**: Conecta WhatsApp, Telegram, Discord, iMessage e mais
- **Auto-hospedado**: Controlo total sobre os seus dados e configuração
- **Extensível**: Sistema de plugins para canais adicionais
- **Interface Web**: Painel de controlo baseado em navegador
- **API REST**: Integração completa com serviços externos
- **Segurança**: Criptografia ponta a ponta e autenticação

## Início Rápido

### Instalação

```bash
# Usar npm
npm install -g openclaw

# Ou usar o script de instalação
curl -fsSL https://openclaw.ai/install.sh | sh
```

### Configuração Inicial

```bash
# Iniciar o assistente de configuração
openclaw onboard

# Iniciar o gateway
openclaw gateway run
```

### Aceder à Interface Web

Abra o seu navegador e navegue para `http://localhost:18789` para aceder ao painel de controlo.

## Canais Suportados

- **WhatsApp**: Conexão direta através do WhatsApp Web
- **Telegram**: Bot completo do Telegram
- **Discord**: Bot do Discord com slash commands
- **iMessage**: Integração nativa no macOS
- **Slack**: Bot empresarial do Slack
- **Signal**: Mensagens seguras
- **E mais**: Sistema de plugins extensível

## Documentação

- [Guia de Instalação](/start/getting-started)
- [Configuração de Canais](/channels)
- [Referência da API](/reference/api)
- [Guia de Plugins](/plugins)
- [Resolução de Problemas](/troubleshooting)

## Comunidade

- [Discord](https://discord.gg/openclaw)
- [GitHub](https://github.com/openclaw/openclaw)
- [Documentação Completa](https://docs.openclaw.ai)

## Licença

MIT License - veja o ficheiro [LICENSE](https://github.com/openclaw/openclaw/blob/main/LICENSE) para detalhes.
