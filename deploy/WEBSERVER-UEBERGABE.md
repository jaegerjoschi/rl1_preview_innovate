# Übergabe an den Betreiber von rl1.network

Diese Datei richtet sich an die Person, die den Webserver von `rl1.network`
konfiguriert — nicht an die Entwicklung. Sie enthält vier Einstellungen, die
sich **nicht** im Quellcode dieser Seite unterbringen lassen, weil die Seite
statisch ausgeliefert wird und dabei kein Anwendungsprozess läuft, der
HTTP-Header setzen könnte.

Der Aufwand liegt bei rund einer halben Stunde. Die erste Einstellung allein
spart bei jedem Erstaufruf etwa 400 KB.

---

## Was heute ausgeliefert wird

Gemessen am 13.09.2026:

```
$ curl -sI -H 'Accept-Encoding: gzip, br' https://rl1.network/_next/static/chunks/<hash>.js

HTTP/2 200
content-type: text/javascript
content-length: 5855
last-modified: Wed, 29 Jul 2026 17:33:07 GMT
server: HTTP Server
```

Was in dieser Antwort **fehlt**:

| Header | Stand heute | Folge |
|---|---|---|
| `content-encoding` | fehlt | Alles geht unkomprimiert raus — HTML wie JavaScript |
| `cache-control` | fehlt | Browser und Proxys raten, wie lange sie Dateien behalten |
| `strict-transport-security` | fehlt | Die Verbindung lässt sich auf HTTP herunterhandeln |
| `x-content-type-options` | fehlt | Der Browser rät MIME-Typen |
| `referrer-policy` | fehlt | Volle Herkunfts-URL geht an fremde Seiten mit |

Der Server meldet sich als `HTTP Server`, ist also **nicht** das nginx aus
`deploy/nginx.conf` in diesem Repository. Die dortige Konfiguration ist
deshalb heute eine Vorlage, keine laufende Einstellung. Unten stehen beide
Fassungen: nginx und Apache.

---

## 1. Kompression einschalten — die wichtigste Einstellung

**Wirkung:** Der Erstaufruf der Startseite fällt von rund 1,0 MB auf rund
490 KB. Für ein Publikum, das die Seite im Bankennetz hinter einem Proxy
oder auf Konferenz-WLAN öffnet, ist das der spürbarste Unterschied
überhaupt.

Der Export enthält bereits fertige `.gz`- und `.br`-Dateien neben jeder
Textdatei (erzeugt von `scripts/precompress.mjs`, läuft automatisch beim
Build). Der Server muss sie nur ausliefern, statt selbst zu komprimieren.

### nginx

```nginx
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_proxied any;
gzip_types
  text/plain text/css text/xml
  text/javascript application/javascript
  application/json application/xml
  application/manifest+json image/svg+xml;

gzip_static on;     # liefert die fertigen .gz aus
```

> **Die Falle:** `text/javascript` muss in der Liste stehen. Seit nginx
> 1.21.1 liefert die mitgelieferte `mime.types` Dateien mit der Endung
> `.js` als `text/javascript` aus — nicht mehr als
> `application/javascript`. Steht nur der alte Typ da, bleibt das
> JavaScript unkomprimiert, und zwar ohne jede Fehlermeldung. Das ist
> genau der Fehler, der in diesem Repository stand.

Für `.br` zusätzlich das Modul `ngx_brotli` und `brotli_static on;`. Im
offiziellen nginx-Image ist es nicht enthalten; ohne das Modul werden die
`.br`-Dateien einfach ignoriert.

### Apache

```apache
# Fertige Dateien ausliefern statt neu zu komprimieren
<IfModule mod_rewrite.c>
  RewriteEngine On

  RewriteCond %{HTTP:Accept-Encoding} br
  RewriteCond %{REQUEST_FILENAME}.br -f
  RewriteRule ^(.*)$ $1.br [QSA,L]

  RewriteCond %{HTTP:Accept-Encoding} gzip
  RewriteCond %{REQUEST_FILENAME}.gz -f
  RewriteRule ^(.*)$ $1.gz [QSA,L]
</IfModule>

# Damit die vorkomprimierten Dateien den richtigen Typ behalten
<FilesMatch "\.js\.(gz|br)$">
  ForceType text/javascript
</FilesMatch>
<FilesMatch "\.css\.(gz|br)$">
  ForceType text/css
</FilesMatch>
<FilesMatch "\.html\.(gz|br)$">
  ForceType text/html
</FilesMatch>
<FilesMatch "\.(gz)$">
  Header set Content-Encoding gzip
</FilesMatch>
<FilesMatch "\.(br)$">
  Header set Content-Encoding br
</FilesMatch>
Header append Vary Accept-Encoding

# Fällt der obige Weg aus, wenigstens live komprimieren
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml \
    text/javascript application/javascript application/json image/svg+xml
</IfModule>
```

### Prüfen

```bash
curl -sI -H 'Accept-Encoding: gzip' https://rl1.network/ | grep -i content-encoding
```

Erwartet: `content-encoding: gzip`. Kommt nichts, greift die Einstellung
nicht. Dasselbe für eine `.js`-Datei wiederholen — HTML funktioniert bei
nginx auch ohne korrekte `gzip_types`, JavaScript nicht.

---

## 2. Cache-Control setzen

Zwei Klassen von Dateien, zwei Regeln.

**Alles unter `/_next/static/`** trägt einen Inhalts-Hash im Dateinamen.
Ändert sich der Inhalt, ändert sich der Name. Diese Dateien dürfen dauerhaft
im Cache bleiben:

```
Cache-Control: public, max-age=31536000, immutable
```

**Die HTML-Seiten** müssen dagegen bei jedem Aufruf geprüft werden, sonst
sehen Besucher nach einem Deployment noch die alte Seite:

```
Cache-Control: public, max-age=0, must-revalidate
```

**Bilder und Schriften aus `/public`** tragen keinen Hash — eine Woche mit
Revalidierung:

```
Cache-Control: public, max-age=604800, stale-while-revalidate=86400
```

### nginx

Siehe `deploy/nginx.conf`. Zwei Dinge sind dort nicht offensichtlich:

- Der Block für `/_next/static/` muss `location ^~ /_next/static/` heißen,
  nicht `location /_next/static/`. nginx prüft Regex-Locations **vor**
  einfachen Prefix-Locations, unabhängig von der Reihenfolge in der Datei —
  ohne `^~` gewinnt die Datei-Endungs-Regel, und die gehashten Schriften
  bekommen eine Woche statt eines Jahres.
- Eine Regel `location ~* \.html$` greift **nie**. Geprüft wird die
  angefragte URI, nicht die Datei, die `try_files` daraus macht. Die URI
  lautet `/` oder `/about/` und hat keine Endung. Die HTML-Regel gehört an
  die `location /`.

### Apache

```apache
<IfModule mod_headers.c>
  <LocationMatch "^/_next/static/">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </LocationMatch>

  <FilesMatch "\.(jpe?g|png|gif|avif|webp|svg|ico|woff2?|pdf)$">
    Header set Cache-Control "public, max-age=604800, stale-while-revalidate=86400"
  </FilesMatch>

  <FilesMatch "\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>
```

---

## 3. Sicherheits-Header setzen

Die vollständige Liste mit Begründung steht in
`deploy/security-headers.conf`. Als Apache-Fassung:

```apache
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains"
  Header always set Content-Security-Policy "frame-ancestors 'none'"
  Header always set X-Frame-Options "DENY"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
</IfModule>
```

> **Die Falle bei nginx:** `add_header` in einem `location`-Block verwirft
> **sämtliche** geerbten `add_header` der übergeordneten Ebene. Jeder
> `location`, der ein eigenes `Cache-Control` setzt, wirft damit alle
> Sicherheits-Header weg — still, ohne Fehlermeldung. Deshalb bindet
> `deploy/nginx.conf` das Header-Snippet in **jedem** solchen Block
> zusätzlich ein. Apache vererbt `Header set` dagegen normal.

Die restliche Content-Security-Policy steht als Meta-Tag in der Seite selbst
und muss hier nicht gesetzt werden. Nur `frame-ancestors` wirkt
ausschließlich als echter HTTP-Header.

### Prüfen

```bash
curl -sI https://rl1.network/ | grep -iE 'strict-transport|x-content-type|referrer-policy|permissions-policy'
```

Erwartet: vier Zeilen. Danach dasselbe für eine Datei unter
`/_next/static/` und für ein Bild — dort fehlen die Header am ehesten.

---

## 4. Weiterleitungen der alten Adressen

Siehe `deploy/redirects.conf`. Diese Regeln sind **vor** dem ersten
Deployment der neuen Seite nötig, nicht danach: die alte Adresse
`https://rl1.network/news/rl1-launch/` steht in den Google-Ergebnissen und
in der Berichterstattung vom Juli 2026. Ohne die Weiterleitung antwortet sie
nach dem Deployment mit 404.

---

## Abnahme

Nach der Umstellung einmal von außen durchgehen:

```bash
# 1. Kompression — muss "gzip" oder "br" melden, für BEIDE Dateitypen
curl -sI -H 'Accept-Encoding: gzip, br' https://rl1.network/ | grep -i content-encoding
curl -sI -H 'Accept-Encoding: gzip, br' https://rl1.network/_next/static/chunks/<hash>.js | grep -i content-encoding

# 2. Caching — ein Jahr für gehashte Dateien, keine Zwischenspeicherung für HTML
curl -sI https://rl1.network/_next/static/chunks/<hash>.js | grep -i cache-control
curl -sI https://rl1.network/ | grep -i cache-control

# 3. Sicherheits-Header — auf HTML, auf JS und auf einem Bild
for u in / /_next/static/chunks/<hash>.js /hero/hero-rail.jpg; do
  echo "— $u"
  curl -sI "https://rl1.network$u" | grep -iE 'strict-transport|x-content-type|referrer|permissions'
done

# 4. Weiterleitung — muss 301 auf /resources/news/rl1-launch/ sein
curl -sI https://rl1.network/news/rl1-launch/ | grep -iE 'HTTP/|location'
```

Den `<hash>` liefert:

```bash
curl -s https://rl1.network/ | grep -o '/_next/static/chunks/[^"]*\.js' | head -1
```
