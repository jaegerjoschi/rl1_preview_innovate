# ══════════════════════════════════════════════════════════════════════════
# Statische Auslieferung von rl1.network
#
# Vorher stand hier ein Node-Server (`node server.js` aus .next/standalone),
# während next.config.ts einen statischen Export erzeugt. Beides zusammen
# konnte nie funktionieren — der COPY-Schritt wäre ins Leere gelaufen, weil
# `output: "export"` gar kein standalone-Verzeichnis anlegt.
#
# Jetzt passend zum tatsächlichen Betrieb: bauen, und das Ergebnis mit einem
# schlanken Webserver ausliefern. Kein Node zur Laufzeit, keine
# Angriffsfläche durch einen Anwendungsprozess.
# ══════════════════════════════════════════════════════════════════════════

# ── Build ─────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ── Auslieferung ──────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Sicherheits-Header als Snippet (siehe Datei für die Begründungen).
#
# NICHT nach conf.d/ kopieren: das offizielle nginx-Image bindet alles
# darunter automatisch im http-Kontext ein. Das Snippet wird stattdessen
# aus nginx.conf ausdrücklich eingebunden — im server-Block und in jedem
# location-Block, der ein eigenes add_header setzt.
COPY deploy/security-headers.conf /etc/nginx/snippets/security-headers.conf

# Weiterleitungen der alten /news/-Adressen (siehe Datei). Gleiche Regel wie
# oben: als Snippet, nicht nach conf.d/ — die Datei enthält location-Blöcke.
COPY deploy/redirects.conf /etc/nginx/snippets/redirects.conf

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Bricht den Build ab, wenn die Konfiguration nicht lädt — statt erst beim
# Start des Containers aufzufallen.
RUN nginx -t

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1
