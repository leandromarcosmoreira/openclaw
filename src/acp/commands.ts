import type { AvailableCommand } from "@agentclientprotocol/sdk";

export function getAvailableCommands(): AvailableCommand[] {
  return [
    { name: "help", description: "Mostra ajuda e comandos comuns." },
    { name: "commands", description: "Lista os comandos disponíveis." },
    { name: "status", description: "Mostra o status atual." },
    {
      name: "context",
      description: "Explica o uso do contexto (list|detail|json).",
      input: { hint: "list | detail | json" },
    },
    { name: "whoami", description: "Mostra o ID do remetente (alias: /id)." },
    { name: "id", description: "Alias para /whoami." },
    { name: "subagents", description: "Lista ou gerencia sub-agentes." },
    { name: "config", description: "Lê ou escreve a configuração (apenas proprietário)." },
    {
      name: "debug",
      description: "Define substituições apenas de tempo de execução (apenas proprietário).",
    },
    { name: "usage", description: "Alterna o rodapé de uso (off|tokens|full)." },
    { name: "stop", description: "Encerra a execução atual." },
    { name: "restart", description: "Reinicia o gateway (se habilitado)." },
    { name: "dock-telegram", description: "Encaminha respostas para o Telegram." },
    { name: "dock-discord", description: "Encaminha respostas para o Discord." },
    { name: "dock-slack", description: "Encaminha respostas para o Slack." },
    { name: "activation", description: "Define a ativação do grupo (mention|always)." },
    { name: "send", description: "Define o modo de envio (on|off|inherit)." },
    { name: "reset", description: "Reseta a sessão (/new)." },
    { name: "new", description: "Reseta a sessão (/reset)." },
    {
      name: "think",
      description: "Define o nível de pensamento (off|minimal|low|medium|high|xhigh).",
    },
    { name: "verbose", description: "Define o modo detalhado (on|full|off)." },
    { name: "reasoning", description: "Alterna a saída de raciocínio (on|off|stream)." },
    { name: "elevated", description: "Alterna o modo elevado (on|off)." },
    { name: "model", description: "Seleciona um modelo (list|status|<name>)." },
    { name: "queue", description: "Ajusta o modo e as opções da fila." },
    { name: "bash", description: "Executa um comando no host (se habilitado)." },
    { name: "compact", description: "Compacta o histórico da sessão." },
  ];
}
