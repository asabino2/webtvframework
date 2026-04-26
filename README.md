# webtvframework

Interface web para streaming ao vivo com EPG, analytics, embed e painel administrativo.

[![Version](https://img.shields.io/badge/version-1.1.6-informational?style=for-the-badge)](https://github.com/asabino2/webtvframework)
[![Node.js](https://img.shields.io/badge/node.js-18%2B-339933?logo=nodedotjs&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white&style=for-the-badge)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/status-active-2ea44f?style=for-the-badge)](https://github.com/asabino2/webtvframework)

Versão atual: **1.1.6**

## 📺 Visão geral

O `webtvframework` fornece:

- Player HLS com restream via backend
- EPG em tempo real (programa atual e próximo)
- Painel admin para configurações, personalização e bloqueio regional
- Página de estatísticas com visitas e tempo assistido
- Embed configurável para uso em sites externos

## ⚙️ Instalação

```bash
npm install
```

## ▶️ Execução

```bash
# Produção
npm start

# Desenvolvimento
npm run dev
```

Aplicação padrão: `http://localhost:3000`

## 🐳 Docker

```bash
# Build + execução
docker compose up --build -d

# Imagem pública
docker run -d -p 3000:3000 asabino2/webtvframework
```

Build com repositório/branch customizados:

```bash
docker compose build \
  --build-arg APP_REPO_URL=https://github.com/asabino2/webtvframework.git \
  --build-arg APP_REPO_REF=main
```

## 🧩 Configuração

Variáveis de ambiente principais:

```bash
UPSTREAM_BASE=http://192.168.1.186:8409
M3U8_URL=http://192.168.1.186:8409/iptv/channel/2.m3u8?mode=segmenter
EPG_URL=http://192.168.1.186:8409/iptv/xmltv.xml
CHANNEL_NAME=Webtv framework
FAVICON_URL=
PASSWORD=
PORT=3000
```

Notas:

- `PASSWORD` vazio: acesso ao `/admin` sem login
- `PASSWORD` definido: login obrigatório no `/admin`
- Configurações salvas em `data/general-settings.json` têm prioridade sobre variáveis de ambiente

## 🛣️ Rotas principais

Públicas:

- `GET /` home
- `GET /embed` player incorporável
- `GET /stream/playlist.m3u8` playlist HLS (proxy)
- `GET /epg/xmltv.xml` XMLTV (proxy)

Admin:

- `GET /admin`
- `GET /configuracoes-gerais`
- `GET /personalizacao`
- `GET /bloqueios`
- `GET /embed-opcao`
- `GET /estatisticas`

APIs de configuração:

- `GET /api/admin/general-settings`
- `POST /api/admin/general-settings`
- `GET /api/admin/home-customization`
- `POST /api/admin/home-customization`
- `GET /api/admin/embed-customization`
- `POST /api/admin/embed-customization`

## 🗂️ Estrutura do projeto

```text
webtvframework/
├─ server.js
├─ package.json
├─ Dockerfile
├─ docker-compose.yml
├─ data/
│  ├─ general-settings.json
│  ├─ region-blocks.json
│  ├─ visits.db
│  └─ visits.json
└─ public/
   ├─ index.html / app.js / style.css
   ├─ admin.html / admin.js / admin.css
   ├─ stats.html / stats.js / stats.css
   ├─ embed.html / embed.js
   ├─ embed-options.html / embed-options.js
   ├─ settings.html / settings.js
   ├─ personalization.html / personalization.js
   └─ blocks.html / blocks.js
```

## ✨ Funcionalidades

- Restream HLS sem expor URLs de origem
- Fallback de aviso (offline/bloqueio) compatível com players IPTV/ffmpeg
- EPG com cache e exibição de programa atual/próximo
- Bloqueio regional por atração
- Analytics com audiência atual, visitas totais, referrer e tempo assistido
- Embed com widgets configuráveis e ordenação visual
- Personalização de tema, fonte, cores e controles do player

## 📝 Changelog recente

### 1.1.6

- Inclusão de ISPs na página de estatísticas com distribuição percentual
- Opções de compartilhamento adicionadas abaixo do player na página inicial
- Novo controle no painel de personalização para exibir ou ocultar o bloco de compartilhamento na home
- Opções de compartilhamento adicionadas também ao embed via widget configurável
- Links de compartilhamento com ícones visuais e texto de postagem mais amigável para redes sociais
- Geração de metadados sociais dinâmicos na home com nome do canal, link da transmissão e ícone do canal para melhorar previews de compartilhamento

### 1.1.5

- Persistência de visitas migrada para SQLite com `data/visits.db`
- Inicialização automática do banco e criação da estrutura necessária ao subir o servidor
- Migração automática de registros legados de `visits.json` para `visits.db` no startup, com limpeza do JSON
- Enriquecimento de dados de visita com:
  - navegador e versão
  - sistema operacional e versão
  - user-agent
  - ISP
  - localização detalhada (bairro, cidade, estado e país)
  - tipo de acesso (página inicial, embed ou stream HLS)
- Registro de acesso direto ao stream HLS nas estatísticas
- Popup de detalhes da visita na tela de estatísticas com ícone de informação por linha
- Correção do popup de detalhes para iniciar fechado e permitir fechamento consistente
- Inclusão da atração/programa assistido no popup de detalhes
- Ajuste de estatísticas percentuais de navegador para considerar apenas o nome do navegador (sem versão)

### 1.1.4

- Top 5 programas mais vistos na página de estatísticas
- Tempo assistido por sessão na tabela de visitas
- Cálculo de tempo assistido no backend com atualização segura de `visits.json`

### 1.1.3

- Suporte aprimorado a controle remoto em smart TVs e TV boxes

### 1.1.2

- Embed configurável via painel admin (widgets e ordenação)
