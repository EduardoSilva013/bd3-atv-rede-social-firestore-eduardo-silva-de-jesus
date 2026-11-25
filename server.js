/***** BACK-END - REDE SOCIAL (Express + Socket.io + MongoDB) *****/
const path = require('path');
const http = require('http');
const express = require('express');
const ejs = require('ejs');
const { Server } = require('socket.io');

const { conectar, buscarPosts, salvarPost } = require('./database');

const PORT = process.env.PORT || 3000;
const LIMITE_TITULO = 100;
const LIMITE_TEXTO = 1000;

const app = express();

// Servidor autocontido (HTTP) criado a partir do express:
const server = http.createServer(app);

// Link do socket.io com o servidor autocontido:
const io = new Server(server);

// Arquivos estáticos (CSS e imagens):
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do "ejs" para abrir a página "front-end" (.html):
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// Rota raiz que exibe o arquivo HTML no navegador:
app.get('/', (req, res) => {
    res.render('index.html');
});

// Conexão com o socket.io ("connection"):
io.on('connection', async (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // previousMessage: envia ao cliente que acabou de entrar todos os posts já feitos
    try {
        const posts = await buscarPosts();
        socket.emit('previousMessage', posts);
    } catch (erro) {
        console.error('Erro ao buscar posts:', erro.message);
        socket.emit('erro', 'Não foi possível carregar os posts.');
    }

    // sendMessage: recebe um novo post do cliente, salva e avisa todo mundo
    socket.on('sendMessage', async (dados) => {
        const titulo = String(dados?.titulo ?? '').trim();
        const texto = String(dados?.texto ?? '').trim();

        if (!titulo || !texto) {
            socket.emit('erro', 'Preencha o título e o texto do post.');
            return;
        }
        if (titulo.length > LIMITE_TITULO || texto.length > LIMITE_TEXTO) {
            socket.emit('erro', 'Título ou texto grande demais.');
            return;
        }

        try {
            const post = await salvarPost({ titulo, texto });

            // receivedMessage: entrega o novo post para TODOS os clientes conectados
            io.emit('receivedMessage', post);
        } catch (erro) {
            console.error('Erro ao salvar post:', erro.message);
            socket.emit('erro', 'Não foi possível salvar o post.');
        }
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

// Conecta no MongoDB e, só depois, liga o servidor:
conectar()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((erro) => {
        console.error('Não foi possível conectar ao MongoDB:', erro.message);
        process.exit(1);
    });
