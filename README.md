<div align="center">

![webtvframework logo: a media player icon in blue and white colors](./public/webtvframework.ico)

Interface web para streaming ao vivo com EPG, analytics, embed e painel administrativo.

</div>

[![Version](https://img.shields.io/badge/version-2.2.2-informational?style=for-the-badge)](https://github.com/asabino2/webtvframework)
[![Node.js](https://img.shields.io/badge/node.js-18%2B-339933?logo=nodedotjs&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white&style=for-the-badge)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/status-active-2ea44f?style=for-the-badge)](https://github.com/asabino2/webtvframework)

Versão atual: **2.2.1**

## 📺 Visão geral

O `webtvframework` fornece:

- Player HLS com restream via backend
- EPG em tempo real (programa atual e próximo)
- Painel admin para configurações, personalização e bloqueio regional
- Página de estatísticas com visitas, tempo assistido e painel de pesquisa/listagem com filtros
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
- `GET /estatisticas/pesquisa`

APIs de configuração:

- `GET /api/admin/general-settings`
- `POST /api/admin/general-settings`
- `GET /api/admin/home-customization`
- `POST /api/admin/home-customization`
- `GET /api/admin/embed-customization`
- `POST /api/admin/embed-customization`

APIs de analytics:

- `GET /api/analytics/summary`
- `GET /api/analytics/search`

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
  ├─ stats-search.html / stats-search.js
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
- Painel dedicado para listagem e pesquisa de visitas com filtros por data, país, estado, cidade, dispositivo, sistema operacional e navegador/app
- Embed com widgets configuráveis e ordenação visual
- Personalização de tema, fonte, cores e controles do player

## 📝 Changelog recente

### 2.2.2

- Estatísticas agora exibem dados filtrados por intervalo de datas definido pelo usuário no topo da página
- Filtro de data inicial e final (campos `datetime-local`) adicionado na página `/estatisticas` acima dos cards de métricas
- Atalhos de intervalo rápido: Últimas 24h, Últimos 7 dias, Últimos 30 dias, Últimos 90 dias, Últimos 365 dias
- Intervalo selecionado afeta: card de visitas, card de IPs únicos, gráfico por hora, rankings de navegadores/SO/países/cidades/ISPs/referrers, visitas recentes e programas mais vistos
- Rótulo do card de visitas exibe dinamicamente a unidade de tempo: horas (≤ 24h) ou dias (> 24h) conforme o intervalo
- Subtítulo do gráfico por hora reflete o mesmo período selecionado no filtro
- Padrão de carregamento inicial da página mantido em Últimas 24h

### 2.2.1

- Painel administrativo agora usa favicon fixo do framework (`/webtvframework.ico`), independente do favicon configurado para a home
- Bloqueio por atração e bloqueio de canal agora suportam regra adicional por **referrer** (domínios separados por vírgula)
- Nova API administrativa `GET /api/admin/block-autocomplete` para sugestões de autocomplete nos formulários de bloqueio
- Autocomplete adicionado nos campos de país, estado, cidade e referrer nas telas de bloqueio de atração e de canal
- Autocomplete de nome da atração adicionado na tela de bloqueio por atração, usando dados locais e títulos do EPG quando disponíveis

### 2.2.0

- Bloqueio regional por atração agora suporta modos de **lista negra** e **lista branca**, alinhado ao bloqueio de canal
- Nova opção de **URL de stream alternativo** no bloqueio por atração
- Quando a URL alternativa está configurada e a atração está bloqueada para a região do usuário, o sistema exibe o stream alternativo em vez de bloquear a reprodução
- Mensagem de programação alternativa adicionada na **página inicial** (abaixo do player) e no **embed** (abaixo da área do player), incluindo o motivo do bloqueio
- Verificação de acesso e respostas públicas ajustadas para informar quando a programação alternativa está ativa

### 2.1.5

- Opção de idioma movida para a seção de configurações gerais
- Suporte expandido de idiomas no painel administrativo: Espanhol, Russo, Mandarim, Polonês, Italiano e Alemão
- Novos temas pré-definidos adicionados na personalização da home: Forest, Neon, Retro e Minimal
- Ícone padrão do Webtv Framework adicionado no topo do painel administrativo (acima de "Painel administrativo") com melhor destaque visual

### 2.1.1

- Ajuste do ícone padrão quando `faviconUrl` não está definido em configurações gerais
- Fallback de favicon da aplicação principal atualizado para `/webtvframework.ico`
- Fallback do ícone ao lado do nome do canal na home atualizado para `/webtvframework.ico`
- Social image (Open Graph/Twitter) da home passa a usar o mesmo fallback `/webtvframework.ico`

### 2.1.0

- Nova página `/estatisticas/pesquisa` no painel administrativo para listagem completa de visitas com filtros
- Filtros disponíveis por data inicial/final, país, estado, cidade, tipo de dispositivo, sistema operacional e navegador/app
- Resultado da busca reutiliza o mesmo formato visual e os mesmos dados da tabela de "Últimos 25 acessos"
- Botão de detalhes por linha mantido na pesquisa, abrindo popup/modal com informações completas da visita
- Atalho "Pesquisar acessos" adicionado na seção de visitas recentes dentro de `/estatisticas`
- Período padrão da pesquisa configurado para os últimos 3 dias até a data atual
- Correção da consulta SQLite para buscas textuais com `LIKE ... ESCAPE`, evitando erro ao pesquisar por campos diferentes de data

### 2.0.0

- Novo sistema de bloqueio de canal independente de atração/programa (EPG)
- Suporte a lista negra e lista branca por país, estado e cidade
- Bloqueio configurável por alvo: site, stream HLS e/ou embed, em qualquer combinação
- Exibição da mensagem "Canal bloqueado para a sua região, motivo: {motivo}" ao usuário bloqueado
- Nova seção "Bloqueio de Canal" no painel administrativo com UI bilíngue (pt/en)
- Endpoint público `/api/access-check?target=site|stream|embed` para verificação de acesso
- Bloqueio de stream HLS aplicado no servidor antes do proxy, retornando playlist de aviso

### 1.1.9

- Correção de falso positivo em visitas `hls_stream` quando o acesso era iniciado pela própria aplicação (home/embed)
- Novo filtro no backend para registrar como stream direto apenas requisições sem referer interno do mesmo host

### 1.1.8

- Inclusão de detecção de VPN nas visitas com persistência dos campos de status e provedor no SQLite
- Migração automática do schema para adicionar os campos de VPN em bancos já existentes
- Exibição do tipo de acesso (página inicial, embed ou stream HLS) na tabela de visitas recentes
- Exibição de VPN (status e provedor) apenas no popup/modal de detalhes da visita

### 1.1.7

- Detecção heurística de aplicação para acessos diretos ao stream HLS no backend (via user-agent)
- Em acessos `hls_stream`, o campo de navegador nas visitas passa a refletir navegador/app detectado
- Ajuste de títulos na página de estatísticas de `Navegador` para `Navegador/App`:
  - card de percentuais
  - coluna da tabela de últimas visitas

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

## 📸 Screenshots

Exemplos de telas da aplicação:

![Home](https://github.com/user-attachments/assets/b59877e1-8ad1-4bea-9859-71337534274d)
![EPG](https://github.com/user-attachments/assets/db77ad32-acad-46c2-83f4-3f2bc567a11b)
![Painel administrativo](https://github.com/user-attachments/assets/45eaabbf-b664-4145-b4ea-4e2398223920)
![Estatísticas](https://github.com/user-attachments/assets/70fe91b2-ae54-4c6f-85b3-dfec5ef528aa)
![Estatísticas](https://github.com/user-attachments/assets/ddc6c308-fc5d-4370-a2be-b9a9b25aae56)

