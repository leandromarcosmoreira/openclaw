import { RefreshingAuthProvider, StaticAuthProvider } from "@twurple/auth";
import { ChatClient, LogLevel } from "@twurple/chat";
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { resolveTwitchToken } from "./token.js";
import type { ChannelLogSink, TwitchAccountConfig, TwitchChatMessage } from "./types.js";
import { normalizeToken } from "./utils/twitch.js";

/**
 * Manages Twitch chat client connections
 */
export class TwitchClientManager {
  private clients = new Map<string, ChatClient>();
  private messageHandlers = new Map<string, (message: TwitchChatMessage) => void>();

  constructor(private logger: ChannelLogSink) {}

  /**
   * Create an auth provider for the account.
   */
  private async createAuthProvider(
    account: TwitchAccountConfig,
    normalizedToken: string,
  ): Promise<StaticAuthProvider | RefreshingAuthProvider> {
    if (!account.clientId) {
      throw new Error("ID do cliente Twitch ausente");
    }

    if (account.clientSecret) {
      const authProvider = new RefreshingAuthProvider({
        clientId: account.clientId,
        clientSecret: account.clientSecret,
      });

      await authProvider
        .addUserForToken({
          accessToken: normalizedToken,
          refreshToken: account.refreshToken ?? null,
          expiresIn: account.expiresIn ?? null,
          obtainmentTimestamp: account.obtainmentTimestamp ?? Date.now(),
        })
        .then((userId) => {
          this.logger.info(
            `Usuário ${userId} adicionado ao RefreshingAuthProvider para ${account.username}`,
          );
        })
        .catch((err) => {
          this.logger.error(
            `Falha ao adicionar usuário ao RefreshingAuthProvider: ${err instanceof Error ? err.message : String(err)}`,
          );
        });

      authProvider.onRefresh((userId, token) => {
        this.logger.info(
          `Token de acesso atualizado para o usuário ${userId} (expira em ${token.expiresIn ? `${token.expiresIn}s` : "desconhecido"})`,
        );
      });

      authProvider.onRefreshFailure((userId, error) => {
        this.logger.error(
          `Falha ao atualizar o token de acesso para o usuário ${userId}: ${error.message}`,
        );
      });

      const refreshStatus = account.refreshToken
        ? "atualização automática de token habilitada"
        : "atualização de token desabilitada (sem refresh token)";
      this.logger.info(`Using RefreshingAuthProvider for ${account.username} (${refreshStatus})`);

      return authProvider;
    }

    this.logger.info(`Using StaticAuthProvider for ${account.username} (no clientSecret provided)`);
    return new StaticAuthProvider(account.clientId, normalizedToken);
  }

  /**
   * Get or create a chat client for an account
   */
  async getClient(
    account: TwitchAccountConfig,
    cfg?: OpenClawConfig,
    accountId?: string,
  ): Promise<ChatClient> {
    const key = this.getAccountKey(account);

    const existing = this.clients.get(key);
    if (existing) {
      return existing;
    }

    const tokenResolution = resolveTwitchToken(cfg, {
      accountId,
    });

    if (!tokenResolution.token) {
      this.logger.error(
        `Token do Twitch ausente para a conta ${account.username} (configure channels.twitch.accounts.${account.username}.token ou OPENCLAW_TWITCH_ACCESS_TOKEN para o padrão)`,
      );
      throw new Error("Token do Twitch ausente");
    }

    this.logger.debug?.(`Using ${tokenResolution.source} token source for ${account.username}`);

    if (!account.clientId) {
      this.logger.error(`ID do cliente Twitch ausente para a conta ${account.username}`);
      throw new Error("ID do cliente Twitch ausente");
    }

    const normalizedToken = normalizeToken(tokenResolution.token);

    const authProvider = await this.createAuthProvider(account, normalizedToken);

    const client = new ChatClient({
      authProvider,
      channels: [account.channel],
      rejoinChannelsOnReconnect: true,
      requestMembershipEvents: true,
      logger: {
        minLevel: LogLevel.WARNING,
        custom: {
          log: (level, message) => {
            switch (level) {
              case LogLevel.CRITICAL:
                this.logger.error(message);
                break;
              case LogLevel.ERROR:
                this.logger.error(message);
                break;
              case LogLevel.WARNING:
                this.logger.warn(message);
                break;
              case LogLevel.INFO:
                this.logger.info(message);
                break;
              case LogLevel.DEBUG:
                this.logger.debug?.(message);
                break;
              case LogLevel.TRACE:
                this.logger.debug?.(message);
                break;
            }
          },
        },
      },
    });

    this.setupClientHandlers(client, account);

    client.connect();

    this.clients.set(key, client);
    this.logger.info(`Conectado ao Twitch como ${account.username}`);

    return client;
  }

  /**
   * Set up message and event handlers for a client
   */
  private setupClientHandlers(client: ChatClient, account: TwitchAccountConfig): void {
    const key = this.getAccountKey(account);

    // Handle incoming messages
    client.onMessage((channelName, _user, messageText, msg) => {
      const handler = this.messageHandlers.get(key);
      if (handler) {
        const normalizedChannel = channelName.startsWith("#") ? channelName.slice(1) : channelName;
        const from = `twitch:${msg.userInfo.userName}`;
        const preview = messageText.slice(0, 100).replace(/\n/g, "\\n");
        this.logger.debug?.(
          `twitch inbound: channel=${normalizedChannel} from=${from} len=${messageText.length} preview="${preview}"`,
        );

        handler({
          username: msg.userInfo.userName,
          displayName: msg.userInfo.displayName,
          userId: msg.userInfo.userId,
          message: messageText,
          channel: normalizedChannel,
          id: msg.id,
          timestamp: new Date(),
          isMod: msg.userInfo.isMod,
          isOwner: msg.userInfo.isBroadcaster,
          isVip: msg.userInfo.isVip,
          isSub: msg.userInfo.isSubscriber,
          chatType: "group",
        });
      }
    });

    this.logger.info(`Manipuladores configurados para ${key}`);
  }

  /**
   * Set a message handler for an account
   * @returns A function that removes the handler when called
   */
  onMessage(
    account: TwitchAccountConfig,
    handler: (message: TwitchChatMessage) => void,
  ): () => void {
    const key = this.getAccountKey(account);
    this.messageHandlers.set(key, handler);
    return () => {
      this.messageHandlers.delete(key);
    };
  }

  /**
   * Disconnect a client
   */
  async disconnect(account: TwitchAccountConfig): Promise<void> {
    const key = this.getAccountKey(account);
    const client = this.clients.get(key);

    if (client) {
      client.quit();
      this.clients.delete(key);
      this.messageHandlers.delete(key);
      this.logger.info(`Desconectado ${key}`);
    }
  }

  /**
   * Disconnect all clients
   */
  async disconnectAll(): Promise<void> {
    this.clients.forEach((client) => client.quit());
    this.clients.clear();
    this.messageHandlers.clear();
    this.logger.info(" Todos os clientes desconectados");
  }

  /**
   * Send a message to a channel
   */
  async sendMessage(
    account: TwitchAccountConfig,
    channel: string,
    message: string,
    cfg?: OpenClawConfig,
    accountId?: string,
  ): Promise<{ ok: boolean; error?: string; messageId?: string }> {
    try {
      const client = await this.getClient(account, cfg, accountId);

      // Generate a message ID (Twurple's say() doesn't return the message ID, so we generate one)
      const messageId = crypto.randomUUID();

      // Send message (Twurple handles rate limiting)
      await client.say(channel, message);

      return { ok: true, messageId };
    } catch (error) {
      this.logger.error(
        `Falha ao enviar mensagem: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Generate a unique key for an account
   */
  public getAccountKey(account: TwitchAccountConfig): string {
    return `${account.username}:${account.channel}`;
  }

  /**
   * Clear all clients and handlers (for testing)
   */
  _clearForTest(): void {
    this.clients.clear();
    this.messageHandlers.clear();
  }
}
