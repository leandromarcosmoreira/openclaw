import { isGatewayCliClient, isWebchatClient } from "../../../utils/message-channel.js";
import type { ResolvedGatewayAuth } from "../../auth.js";
import { GATEWAY_CLIENT_IDS } from "../../protocol/client-info.js";

export type AuthProvidedKind = "token" | "password" | "none";

export function formatGatewayAuthFailureMessage(params: {
  authMode: ResolvedGatewayAuth["mode"];
  authProvided: AuthProvidedKind;
  reason?: string;
  client?: { id?: string | null; mode?: string | null };
}): string {
  const { authMode, authProvided, reason, client } = params;
  const isCli = isGatewayCliClient(client);
  const isControlUi = client?.id === GATEWAY_CLIENT_IDS.CONTROL_UI;
  const isWebchat = isWebchatClient(client);
  const uiHint = "abra a URL do painel e cole o token nas configurações da Control UI";
  const tokenHint = isCli
    ? "defina gateway.remote.token para corresponder a gateway.auth.token"
    : isControlUi || isWebchat
      ? uiHint
      : "forneça o token de autenticação do gateway";
  const passwordHint = isCli
    ? "defina gateway.remote.password para corresponder a gateway.auth.password"
    : isControlUi || isWebchat
      ? "insira a senha nas configurações da Control UI"
      : "forneça a senha de autenticação do gateway";
  switch (reason) {
    case "token_missing":
      return `não autorizado: token do gateway ausente (${tokenHint})`;
    case "token_mismatch":
      return `não autorizado: erro de correspondência do token do gateway (${tokenHint})`;
    case "token_missing_config":
      return "não autorizado: token do gateway não configurado no gateway (defina gateway.auth.token)";
    case "password_missing":
      return `não autorizado: senha do gateway ausente (${passwordHint})`;
    case "password_mismatch":
      return `não autorizado: erro de correspondência da senha do gateway (${passwordHint})`;
    case "password_missing_config":
      return "não autorizado: senha do gateway não configurada no gateway (defina gateway.auth.password)";
    case "tailscale_user_missing":
      return "não autorizado: identidade tailscale ausente (use a autenticação do Tailscale Serve ou o token/senha do gateway)";
    case "tailscale_proxy_missing":
      return "não autorizado: cabeçalhos de proxy tailscale ausentes (use o Tailscale Serve ou o token/senha do gateway)";
    case "tailscale_whois_failed":
      return "não autorizado: falha na verificação de identidade tailscale (use a autenticação do Tailscale Serve ou o token/senha do gateway)";
    case "tailscale_user_mismatch":
      return "não autorizado: erro de correspondência da identidade tailscale (use a autenticação do Tailscale Serve ou o token/senha do gateway)";
    case "rate_limited":
      return "não autorizado: muitas tentativas de autenticação falhadas (tente novamente mais tarde)";
    case "device_token_mismatch":
      return "não autorizado: erro de correspondência do token do dispositivo (gire/reemita o token do dispositivo)";
    default:
      break;
  }

  if (authMode === "token" && authProvided === "none") {
    return `não autorizado: token do gateway ausente (${tokenHint})`;
  }
  if (authMode === "password" && authProvided === "none") {
    return `não autorizado: senha do gateway ausente (${passwordHint})`;
  }
  return "não autorizado";
}
