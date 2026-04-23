# Webtv framework — Interface Web

Interface web para exibição do canal ao vivo com grade EPG.

Versão atual: **1.1.1**

## Estrutura

```
tvsabinos_web/
├── server.js          # Backend Express (proxy stream + endpoints EPG/XMLTV)
├── package.json
└── public/
    ├── index.html     # Frontend
    ├── style.css      # Estilos
    └── app.js         # Lógica do player e EPG
```

## Instalação

```bash
npm install
```

## Execução

```bash
# Produção
npm start

# Desenvolvimento (com hot-reload)
npm run dev
```

A aplicação ficará disponível em **http://localhost:3000**

## Execução com Docker

A imagem Docker agora baixa o código diretamente do repositório GitHub:

- Repositório: `https://github.com/asabino2/webtvframework`
- Branch padrão: `main`

Build e execução:

```bash
docker compose up --build -d
```

Parâmetros opcionais de build (caso queira mudar repositório/branch):

```bash
docker compose build \
    --build-arg APP_REPO_URL=https://github.com/asabino2/webtvframework.git \
    --build-arg APP_REPO_REF=main
```

## Configuração

Use variáveis de ambiente para configurar a aplicação:

```bash
UPSTREAM_BASE=http://192.168.1.186:8409
M3U8_URL=http://192.168.1.186:8409/iptv/channel/2.m3u8?mode=segmenter
EPG_URL=http://192.168.1.186:8409/iptv/xmltv.xml
FAVICON_URL=
CHANNEL_NAME=Webtv framework
PASSWORD=
PORT=3000
```

- `CHANNEL_NAME`: nome público do canal exibido nas páginas.
- `FAVICON_URL`: favicon padrão do site principal (usado quando não houver valor salvo na personalização da home).
- `PASSWORD`: senha da área administrativa em `/admin`.
    - Se estiver vazia, a administração abre sem login.
    - Se estiver preenchida, o login passa a ser obrigatório.

### Configurações gerais (prioridade sobre env)

No painel administrativo existe a seção **Configurações Gerais** (rota `/configuracoes-gerais`) com os campos:

- URL do stream original (equivalente a `M3U8_URL`)
- URL do EPG original (equivalente a `EPG_URL`)

Se a URL do EPG ficar vazia, a tela inicial oculta automaticamente:

- Botão de grade de programação
- Cartões de atração atual e próxima

No painel administrativo também existe a seção **Personalização da Home** (rota `/personalizacao`) para configurar:

- Tema pré-definido (incluindo tema padrão atual)
- Cores da home (fundo, superfície, borda, destaque e texto)
- Fonte principal
- Controles do player (Google Cast, tela cheia, volume e mudo)
- URL do favicon (também usada como ícone ao lado do nome do canal)

Ao salvar, os dados são gravados em:

- `/app/data/general-settings.json`

Prioridade de leitura para stream/epg/favicon:

1. Valor salvo em `/app/data/general-settings.json`
2. Variável de ambiente correspondente (`M3U8_URL`, `EPG_URL`, `FAVICON_URL`)

Após salvar as configurações, a aplicação agenda restart automático para aplicar as mudanças.

Exemplo de `general-settings.json`:

```json
{
    "streamUrl": "https://origem.exemplo/live/playlist.m3u8",
    "epgUrl": "https://origem.exemplo/epg/xmltv.xml",
    "homeCustomization": {
        "theme": "default",
        "faviconUrl": "https://origem.exemplo/favicon.ico",
        "fontFamily": "Segoe UI, system-ui, -apple-system, sans-serif",
        "colors": {
            "bg": "#0d0f14",
            "surface": "#161b24",
            "border": "#2a3347",
            "accent": "#e8a020",
            "text": "#e8ecf0"
        },
        "playerControls": {
            "googleCast": true,
            "fullscreen": true,
            "volume": true,
            "mute": true
        }
    }
}
```

### Endpoints administrativos de configuração

- `GET /api/admin/general-settings`: retorna valores salvos e valores efetivos (com fallback para env)
- `POST /api/admin/general-settings`: salva configurações e agenda restart da aplicação
- `GET /api/admin/home-customization`: retorna personalização da home, temas e fontes permitidas
- `POST /api/admin/home-customization`: salva personalização da home e agenda restart da aplicação

### Embed do player

Você pode incorporar o player em outros sites usando a rota pública:

- `GET /embed`

No painel administrativo, existe a opção **Embed** (rota `/embed-opcao`) para copiar automaticamente a URL e o snippet de iframe.

Exemplo de iframe:

```html
<iframe
    src="https://SEU_DOMINIO/embed"
    width="100%"
    height="560"
    style="border:0;"
    allow="autoplay; fullscreen"
    allowfullscreen
    loading="lazy"
></iframe>
```

O embed mantém os mesmos recursos do player principal, incluindo:

- Google Cast
- Bloqueio regional
- Restream HLS via backend

Analytics no embed:

- Conta como audiência em tempo real
- Conta para visitas e estatísticas gerais
- Registra `referrer` (site de origem), quando disponível

Para alterar a porta do servidor:

```bash
PORT=8080 npm start
```

## Funcionalidades

- **Restream HLS**: o m3u8 e os segmentos são proxiados pelo backend, nunca expostos diretamente
- **Respostas do stream**: `/stream/playlist.m3u8` retorna uma playlist HLS de aviso (offline/bloqueio regional) com segmento MPEG-TS válido, compatível com apps IPTV e ffmpeg
- **EPG em tempo real**: programa atual + próximo na sidebar, com barra de progresso
- **Endpoint XMLTV**: proxy do XML bruto em `/epg/xmltv.xml`, no mesmo padrão do stream
- **Administração**: painel em `/admin` com menu lateral para Bloqueio de Região e Estatísticas
- **Configurações Gerais**: painel admin com stream URL e EPG URL persistidos em `/app/data/general-settings.json`
- **Personalização da Home**: painel admin com tema, cores, fonte, controles de player e favicon/ícone do canal
- **Embed**: player incorporável em `/embed` com opção de cópia no admin em `/embed-opcao`
- **Atualização no painel**: botão **Atualizar** aparece somente quando existir nova versão, com aviso de versão disponível
- **Analytics por origem**: estatísticas exibem `referrer` (quando aplicável), incluindo acessos via embed
- **Bloqueio regional por atração**: cadastro em `/bloqueios`; quando o programa atual estiver bloqueado para a região, o stream retorna mensagem de bloqueio
- **Grade completa**: exibe 24h de programação num modal elegante com destaque para o programa ao vivo
- **Player**: play/pause, controle de volume, mudo e tela cheia (duplo clique também ativa)
- **Cache EPG**: o XML é cacheado por 5 minutos para evitar requisições excessivas
