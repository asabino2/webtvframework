# Webtv framework — Interface Web

Interface web para exibição do canal ao vivo com grade EPG.

Versão atual: **0.0.1**

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
CHANNEL_NAME=Webtv framework
PASSWORD=
PORT=3000
```

- `CHANNEL_NAME`: nome público do canal exibido nas páginas.
- `PASSWORD`: senha da área administrativa em `/admin`.
    - Se estiver vazia, a administração abre sem login.
    - Se estiver preenchida, o login passa a ser obrigatório.

Para alterar a porta do servidor:

```bash
PORT=8080 npm start
```

## Funcionalidades

- **Restream HLS**: o m3u8 e os segmentos são proxiados pelo backend, nunca expostos diretamente
- **Respostas do stream**: `/stream/playlist.m3u8` retorna uma playlist HLS de aviso (offline/bloqueio regional), permitindo uso direto em apps IPTV
- **EPG em tempo real**: programa atual + próximo na sidebar, com barra de progresso
- **Endpoint XMLTV**: proxy do XML bruto em `/epg/xmltv.xml`, no mesmo padrão do stream
- **Administração**: painel em `/admin` com menu lateral para Bloqueio de Região e Estatísticas
- **Bloqueio regional por atração**: cadastro em `/bloqueios`; quando o programa atual estiver bloqueado para a região, o stream retorna mensagem de bloqueio
- **Grade completa**: exibe 24h de programação num modal elegante com destaque para o programa ao vivo
- **Player**: play/pause, controle de volume, mudo e tela cheia (duplo clique também ativa)
- **Cache EPG**: o XML é cacheado por 5 minutos para evitar requisições excessivas
