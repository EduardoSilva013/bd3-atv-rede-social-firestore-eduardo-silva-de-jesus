# BD3 - Atividade Rede Social (MongoDB)

Protótipo de rede social (posts em tempo real) – Curso Técnico em Desenvolvimento de Sistemas, ETEC de Embu – Banco de Dados 3.

**Aluno:** Eduardo Silva de Jesus

## Tecnologias
Node.js, Express, EJS, Socket.io, MongoDB (mongoose), jQuery (via CDN), nodemon.

## Estrutura
```
├── server.js        # servidor, rota raiz e eventos do socket.io
├── database.js      # conexão com o MongoDB e model de Post
├── views/index.html # front-end (aberto pelo EJS)
├── public/          # styles.css e imagens
├── .env.example     # modelo da string de conexão
└── package.json
```

## Como rodar
1. Tenha um cluster no MongoDB Atlas (ou um MongoDB local).
2. Copie `.env.example` para `.env` e preencha `MONGODB_URI` com a string de conexão. `MONGODB_DB` define o banco usado (padrão: `BD3-NoSQL-RedeSocial`).
3. No terminal, dentro da pasta do projeto:
   ```
   npm install
   npm run dev     # com nodemon  (ou: npm start)
   ```
4. Abra http://localhost:3000

Os posts ficam na coleção `posts` (campos `titulo`, `texto`, `data`); banco e coleção são criados sozinhos no primeiro post.

## Eventos do Socket.io
| Evento | Direção | O que faz |
|---|---|---|
| `previousMessage` | servidor → cliente | envia todos os posts já salvos ao conectar |
| `sendMessage` | cliente → servidor | envia um novo post (título + texto) |
| `receivedMessage` | servidor → todos | entrega o post salvo a todos os conectados |
