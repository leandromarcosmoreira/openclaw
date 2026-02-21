import { formatCliCommand } from "../../../cli/command-format.js";
import type { ChannelAccountSnapshot, ChannelStatusIssue } from "../types.js";
import { asString, isRecord } from "./shared.js";

type WhatsAppAccountStatus = {
  accountId?: unknown;
  enabled?: unknown;
  linked?: unknown;
  connected?: unknown;
  running?: unknown;
  reconnectAttempts?: unknown;
  lastError?: unknown;
};

function readWhatsAppAccountStatus(value: ChannelAccountSnapshot): WhatsAppAccountStatus | null {
  if (!isRecord(value)) {
    return null;
  }
  return {
    accountId: value.accountId,
    enabled: value.enabled,
    linked: value.linked,
    connected: value.connected,
    running: value.running,
    reconnectAttempts: value.reconnectAttempts,
    lastError: value.lastError,
  };
}

export function collectWhatsAppStatusIssues(
  accounts: ChannelAccountSnapshot[],
): ChannelStatusIssue[] {
  const issues: ChannelStatusIssue[] = [];
  for (const entry of accounts) {
    const account = readWhatsAppAccountStatus(entry);
    if (!account) {
      continue;
    }
    const accountId = asString(account.accountId) ?? "default";
    const enabled = account.enabled !== false;
    if (!enabled) {
      continue;
    }
    const linked = account.linked === true;
    const running = account.running === true;
    const connected = account.connected === true;
    const reconnectAttempts =
      typeof account.reconnectAttempts === "number" ? account.reconnectAttempts : null;
    const lastError = asString(account.lastError);

    if (!linked) {
      issues.push({
        channel: "whatsapp",
        accountId,
        kind: "auth",
        message: "Não vinculado (sem sessão do WhatsApp Web).",
        fix: `Execute: ${formatCliCommand("openclaw channels login")} (escaneie o QR no host do gateway).`,
      });
      continue;
    }

    if (running && !connected) {
      issues.push({
        channel: "whatsapp",
        accountId,
        kind: "runtime",
        message: `Vinculado mas desconectado${reconnectAttempts != null ? ` (tentativasDeReconexao=${reconnectAttempts})` : ""}${lastError ? `: ${lastError}` : "."}`,
        fix: `Execute: ${formatCliCommand("openclaw doctor")} (ou reinicie o gateway). Se persistir, vincule novamente via channels login e verifique os logs.`,
      });
    }
  }
  return issues;
}
