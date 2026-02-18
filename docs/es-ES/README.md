# OpenClaw 🦞

Una puerta de enlace multi-canal para agentes de IA que se ejecuta en cualquier sistema operativo.

## Características Principales

- **Multi-canal**: Conecta WhatsApp, Telegram, Discord, iMessage y más
- **Autohospedado**: Control total sobre tus datos y configuración
- **Extensible**: Sistema de complementos para canales adicionales
- **Interfaz Web**: Panel de control basado en navegador
- **API REST**: Integración completa con servicios externos
- **Seguridad**: Cifrado de extremo a extremo y autenticación

## Comienzo Rápido

### Instalación

```bash
# Usar npm
npm install -g openclaw

# O usar el script de instalación
curl -fsSL https://openclaw.ai/install.sh | sh
```

### Configuración Inicial

```bash
# Iniciar el asistente de configuración
openclaw onboard

# Iniciar la gateway
openclaw gateway run
```

### Acceder a la Interfaz Web

Abre tu navegador y navega a `http://localhost:18789` para acceder al panel de control.

## Canales Soportados

- **WhatsApp**: Conexión directa a través de WhatsApp Web
- **Telegram**: Bot de Telegram completo
- **Discord**: Bot de Discord con slash commands
- **iMessage**: Integración nativa en macOS
- **Slack**: Bot de Slack empresarial
- **Signal**: Mensajería segura
- **Y más**: Sistema de complementos extensible

## Documentación

- [Guía de Instalación](/start/getting-started)
- [Configuración de Canales](/channels)
- [Referencia de API](/reference/api)
- [Guía de Complementos](/plugins)
- [Solución de Problemas](/troubleshooting)

## Comunidad

- [Discord](https://discord.gg/openclaw)
- [GitHub](https://github.com/openclaw/openclaw)
- [Documentación Completa](https://docs.openclaw.ai)

## Licencia

MIT License - ver el archivo [LICENSE](https://github.com/openclaw/openclaw/blob/main/LICENSE) para detalles.
